import { decorateIcons, getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import decorateSignin from '../SignIn/SignIn.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

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

  if (button) {
    button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  }
}

/* =========================
   BUILD NAV LINKS
========================= */

function buildNavSections(navBar1Block) {
  const rows = navBar1Block.querySelectorAll(':scope > div > div');
  if (!rows || rows.length < 2) return null;

  const linksCell = rows[1];
  const ul = document.createElement('ul');

  /* FIX: read <a> instead of <p> */
  linksCell.querySelectorAll('a').forEach((link) => {
    const li = document.createElement('li');
    li.appendChild(link.cloneNode(true));
    ul.appendChild(li);
  });

  const wrapper = document.createElement('div');
  wrapper.className = 'default-content-wrapper';
  wrapper.appendChild(ul);

  return wrapper;
}

/* =========================
   BUILD BRAND
========================= */

function buildBrand(navBar1Block) {
  return navBar1Block.querySelector(':scope > div > div:first-child') || null;
}

/* =========================
   BUILD SEARCH FORM
========================= */

function buildSearch() {

  const form = document.createElement('form');
  form.className = 'nav-search';

  form.innerHTML = `
    <input type="text" placeholder="Search">
  `;

  return form;
}

/* =========================
   MAIN DECORATE FUNCTION
========================= */

export default async function decorate(block) {

  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  const signinBlock = fragment.querySelector('.signin.block');
  if (signinBlock) decorateSignin(signinBlock);

  const navBar1Block = fragment.querySelector('.navigation-bar1.block, .navigation-bar1');

  block.textContent = '';

  const nav = document.createElement('nav');
  nav.id = 'nav';

  /* ---------------- HAMBURGER ---------------- */

  const hamburger = document.createElement('div');
  hamburger.className = 'nav-hamburger';

  hamburger.innerHTML = `
    <button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>
  `;

  /* ---------------- SIGNIN BAR ---------------- */

  let signinBar = null;

  if (signinBlock) {
    signinBar = document.createElement('div');
    signinBar.className = 'nav-signin';
    signinBar.appendChild(signinBlock);
  }

  /* ---------------- BRAND ---------------- */

  const navBrand = document.createElement('div');
  navBrand.className = 'nav-brand';

  if (navBar1Block) {
    const brandContent = buildBrand(navBar1Block);
    if (brandContent) navBrand.appendChild(brandContent);
  }

  /* ---------------- NAV LINKS ---------------- */

  const navSections = document.createElement('div');
  navSections.className = 'nav-sections';

  if (navBar1Block) {
    const sectionsContent = buildNavSections(navBar1Block);
    if (sectionsContent) navSections.appendChild(sectionsContent);
  }

  /* ---------------- SEARCH ---------------- */

  const navTools = document.createElement('div');
  navTools.className = 'nav-tools';
  navTools.appendChild(buildSearch());

  /* ---------------- ASSEMBLE ---------------- */

  nav.prepend(hamburger);

  if (signinBar) nav.appendChild(signinBar);

  nav.appendChild(navBrand);
  nav.appendChild(navSections);
  nav.appendChild(navTools);

  nav.setAttribute('aria-expanded', 'false');

  toggleMenu(nav, navSections, isDesktop.matches);

  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';

  navWrapper.append(nav);

  block.append(navWrapper);

  /* =========================
     SIGNIN MODAL
  ========================= */

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

    signBtn.addEventListener('click', () => modal.classList.add('active'));

    closeBtn.addEventListener('click', () => modal.classList.remove('active'));

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  decorateIcons(block);
}