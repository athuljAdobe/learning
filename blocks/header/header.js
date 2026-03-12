import { decorateIcons } from '../../scripts/aem.js';
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

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
  const isNavDrop = focused.className === 'nav-drop';
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

  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * Builds nav sections (links) from the navigation-bar1 block content
 */
function buildNavSections(navBar1Block) {
  const rows = navBar1Block.querySelectorAll(':scope > div > div');
  if (!rows || rows.length < 2) return null;

  // second cell contains nav links (MAGAZINE, ADVENTURES, etc.)
  const linksCell = rows[1];
  const ul = document.createElement('ul');

  linksCell.querySelectorAll('p').forEach((p) => {
    const li = document.createElement('li');
    const text = p.textContent.trim();
    if (!text) return;

    // Convert to anchor if not already
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

/**
 * Builds brand/logo from navigation-bar1 block
 */
function buildBrand(navBar1Block) {
  const firstCell = navBar1Block.querySelector(':scope > div > div:first-child');
  if (!firstCell) return null;
  return firstCell;
}

/**
 * Builds search from navigation-bar1 block
 */
function buildSearch(navBar1Block) {
  const rows = navBar1Block.querySelectorAll(':scope > div > div');
  if (!rows || rows.length < 3) return null;
  return rows[2]; // third cell = search
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';

  // ── Find signin block ──────────────────────────────────────
  const signinSection = fragment.querySelector('.signin-container, [data-section-status]');
  const signinBlock = fragment.querySelector('.signin.block, .signin');

  // ── Find navigation-bar1 block ────────────────────────────
  const navBar1Block = fragment.querySelector('.navigation-bar1.block, .navigation-bar1');

  // ── Build hamburger ───────────────────────────────────────
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
    <span class="nav-hamburger-icon"></span>
  </button>`;

  // ── Build signin bar (above nav) ──────────────────────────
  let signinBar = null;
  if (signinBlock) {
    signinBar = document.createElement('div');
    signinBar.className = 'nav-signin';
    signinBar.appendChild(signinBlock.closest('.signin-wrapper') || signinBlock);
  }

  // ── Build brand ───────────────────────────────────────────
  const navBrand = document.createElement('div');
  navBrand.className = 'nav-brand';
  if (navBar1Block) {
    const brandContent = buildBrand(navBar1Block);
    if (brandContent) navBrand.appendChild(brandContent);
  }

  // ── Build nav sections ────────────────────────────────────
  const navSections = document.createElement('div');
  navSections.className = 'nav-sections';
  if (navBar1Block) {
    const sectionsContent = buildNavSections(navBar1Block);
    if (sectionsContent) {
      navSections.appendChild(sectionsContent);

      // Add nav-drop + click for dropdowns
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

  // ── Build tools (search) ──────────────────────────────────
  const navTools = document.createElement('div');
  navTools.className = 'nav-tools';
  if (navBar1Block) {
    const searchContent = buildSearch(navBar1Block);
    if (searchContent) navTools.appendChild(searchContent);
  }

  // ── Assemble nav ──────────────────────────────────────────
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
  decorateIcons(block);
}