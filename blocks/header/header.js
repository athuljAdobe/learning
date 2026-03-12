import { decorateIcons, getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import decorateSignin from '../SignIn/SignIn.js';// ← FIXED PATH

const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.classList.contains('nav-drop');
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.nav-drop').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  if (button) button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');

  if (navSections && isDesktop.matches) {
    navSections.querySelectorAll('.nav-drop').forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  }

  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

function buildNavSections(navBar1Block) {
  const rows = navBar1Block.querySelectorAll(':scope > div > div');
  if (!rows || rows.length < 2) return null;

  const linksCell = rows[1];
  const ul = document.createElement('ul');

  linksCell.querySelectorAll('p').forEach((p) => {
    const text = p.textContent.trim();
    if (!text) return;

    const li = document.createElement('li');
    const existing = p.querySelector('a');
    if (existing) {
      li.appendChild(existing.cloneNode(true));
    } else {
      const a = document.createElement('a');
      a.href = `/${text.toLowerCase().replace(/\s+/g, '-')}`;
      a.textContent = text;
      li.appendChild(a);
    }
    ul.appendChild(li);
  });

  const wrapper = document.createElement('div');
  wrapper.className = 'default-content-wrapper';
  wrapper.appendChild(ul);
  return wrapper;
}

function buildBrand(navBar1Block) {
  return navBar1Block.querySelector(':scope > div > div:first-child') || null;
}

function buildSearch(navBar1Block) {
  const rows = navBar1Block.querySelectorAll(':scope > div > div');
  return rows.length >= 3 ? rows[2] : null;
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // Load signin CSS manually since block lives inside a fragment
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/blocks/signin/signin.css';
  document.head.appendChild(link);

  // Find and decorate signin block before moving it into nav
  const signinBlock = fragment.querySelector('.signin.block');
  if (signinBlock) {
    decorateSignin(signinBlock);
  }

  // Find navigation-bar1 block
  const navBar1Block = fragment.querySelector('.navigation-bar1.block, .navigation-bar1');

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';

  // Build hamburger
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
    <span class="nav-hamburger-icon"></span>
  </button>`;

  // Build signin bar (full width top row)
  let signinBar = null;
  if (signinBlock) {
    signinBar = document.createElement('div');
    signinBar.className = 'nav-signin';
    signinBar.appendChild(signinBlock.closest('.signin-wrapper') || signinBlock);
  }

  // Build brand (logo)
  const navBrand = document.createElement('div');
  navBrand.className = 'nav-brand';
  if (navBar1Block) {
    const brandContent = buildBrand(navBar1Block);
    if (brandContent) navBrand.appendChild(brandContent);
  }

  // Build nav sections (links)
  const navSections = document.createElement('div');
  navSections.className = 'nav-sections';
  if (navBar1Block) {
    const sectionsContent = buildNavSections(navBar1Block);
    if (sectionsContent) {
      navSections.appendChild(sectionsContent);
      navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
        if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
        navSection.addEventListener('click', () => {
          if (isDesktop.matches) {
            const expanded = navSection.getAttribute('aria-expanded') === 'true';
            toggleAllNavSections(navSections);
            navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
          }
        });
      });
    }
  }

  // Build tools (search)
  const navTools = document.createElement('div');
  navTools.className = 'nav-tools';
  if (navBar1Block) {
    const searchContent = buildSearch(navBar1Block);
    if (searchContent) navTools.appendChild(searchContent);
  }

  // Assemble: hamburger | signin bar | brand | sections | tools
  nav.prepend(hamburger);
  if (signinBar) nav.appendChild(signinBar);
  nav.appendChild(navBrand);
  nav.appendChild(navSections);
  nav.appendChild(navTools);

  nav.setAttribute('aria-expanded', 'false');
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);

  block.append(navWrapper);
  /* ====================================
   SIGNIN MODAL
==================================== */

const signBtn = nav.querySelector('.signin-btn');

if (signBtn) {

  const modal = document.createElement('div');
  modal.className = 'signin-modal';

  modal.innerHTML = `
    <div class="signin-modal-content">
      <span class="signin-close">&times;</span>
      <h2>Sign In</h2>
      <p>Welcome Back</p>
      <input type="text" placeholder="USERNAME">
      <input type="password" placeholder="PASSWORD">
      <p>FORGOT YOUR PASSWORD?</p>
      <button class="signin-submit">SIGN IN</button>
    </div>
  `;

  document.body.appendChild(modal);

  const closeBtn = modal.querySelector('.signin-close');

  signBtn.addEventListener('click', () => {
    modal.classList.add('active');
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

  decorateIcons(block);
}