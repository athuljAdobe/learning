import { decorateIcons, getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import decorateSignin from '../SignIn/SignIn.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

/* =========================
   TOGGLE MOBILE MENU
========================= */

function toggleMenu(nav) {
  const expanded = nav.getAttribute('aria-expanded') === 'true';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
}

/* =========================
   BUILD NAV LINKS
========================= */

function buildNavSections(navBar1Block) {

  const rows = navBar1Block.querySelectorAll(':scope > div');

  if (!rows || rows.length === 0) return null;

  const linksCell = rows[0].children[1];

  const ul = document.createElement('ul');

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
   BUILD BRAND (LOGO)
========================= */

function buildBrand(navBar1Block) {

  const rows = navBar1Block.querySelectorAll(':scope > div');

  return rows[0].children[0];
}

/* =========================
   BUILD SEARCH
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
   SIGNIN MODAL
========================= */

function createSigninModal(signBtn) {

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

/* =========================
   MAIN HEADER DECORATOR
========================= */

export default async function decorate(block) {

  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';

  const fragment = await loadFragment(navPath);

  const signinBlock = fragment.querySelector('.signin.block');
  if (signinBlock) decorateSignin(signinBlock);

  const navBar1Block = fragment.querySelector('.navigation-bar1');

  block.textContent = '';

  const nav = document.createElement('nav');
  nav.id = 'nav';

  /* ---------------- HAMBURGER ---------------- */

  const hamburger = document.createElement('div');
  hamburger.className = 'nav-hamburger';

  hamburger.innerHTML = `
    <button type="button" aria-controls="nav">
      <span class="nav-hamburger-icon"></span>
    </button>
  `;

  hamburger.addEventListener('click', () => toggleMenu(nav));

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
  navBrand.appendChild(navBar1Block);
}

  /* ---------------- ASSEMBLE NAV ---------------- */

  nav.prepend(hamburger);

  if (signinBar) nav.appendChild(signinBar);

  nav.appendChild(navBrand);

  nav.setAttribute('aria-expanded', 'false');

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';

  navWrapper.append(nav);

  block.append(navWrapper);

  /* ---------------- SIGNIN MODAL ---------------- */

  const signBtn = nav.querySelector('.signin-btn');

  if (signBtn) createSigninModal(signBtn);

  decorateIcons(block);
}