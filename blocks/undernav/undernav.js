export default function decorate(block) {
  const rows = [...block.children];

  const logo = rows[0].textContent.trim();

  const navLinks = [...rows[1].querySelectorAll('a')]
    .map((a) => `<a href="${a.href}">${a.textContent}</a>`)
    .join('');

  const socialLinks = [...rows[2].querySelectorAll('a')]
    .map((a) => `<a href="${a.href}" class="social-link">${a.textContent}</a>`)
    .join('');

  block.innerHTML = `
  
  <div class="undernav-container">

    <div class="undernav-logo">
      ${logo}
    </div>

    <div class="undernav-links">
      ${navLinks}
    </div>

    <div class="undernav-social">
      <span>FOLLOW US</span>
      <div class="social-icons">
        ${socialLinks}
      </div>
    </div>

  </div>

  `;
}
