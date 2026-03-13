export default function decorate(block) {
  const rows = [...block.children];
  const columns = rows[0].children.length;

  const container = document.createElement('div');
  container.className = 'teams-container';

  for (let i = 0; i < columns; i += 1) {
    const card = document.createElement('div');
    card.className = 'team-card';

    rows.forEach((row, index) => {
      const cell = row.children[i];

      if (index === 0) {
        const img = cell.querySelector('img');
        if (img) {
          const imgWrapper = document.createElement('div');
          imgWrapper.className = 'team-image';
          imgWrapper.append(img.cloneNode(true));
          card.append(imgWrapper);
        }
      }

      if (index === 1) {
        const name = document.createElement('h3');
        name.textContent = cell.textContent;
        card.append(name);
      }

      if (index === 2) {
        const role = document.createElement('p');
        role.className = 'team-role';
        role.textContent = cell.textContent;
        card.append(role);
      }

      if (index === 3) {
        const social = document.createElement('div');
        social.className = 'team-social';

        social.innerHTML = `
<a href="https://main--learning--athuljadobe.aem.page/western-australia" class="social-icon">
<svg width="18" height="18" viewBox="0 0 24 24" fill="white">
<path d="M22 12a10 10 0 10-11.5 9.9v-7H7v-3h3.5V9.5c0-3.4 2-5.3 5-5.3 1.4 0 2.9.2 2.9.2v3.2h-1.6c-1.6 0-2 1-2 2v2.3h3.4l-.5 3h-2.9v7A10 10 0 0022 12z"/>
</svg>
</a>

<a href="https://main--learning--athuljadobe.aem.page/western-australia" class="social-icon">
<svg width="18" height="18" viewBox="0 0 24 24" fill="white">
<path d="M22 5.9c-.8.4-1.6.6-2.4.8.9-.5 1.5-1.3 1.8-2.3-.8.5-1.8.9-2.7 1.1A4.2 4.2 0 0015.5 4c-2.3 0-4.2 2-4.2 4.3 0 .3 0 .7.1 1A12 12 0 013 5.1a4.3 4.3 0 001.3 5.7c-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.7 3.2 4.1-.3.1-.7.1-1 .1-.2 0-.5 0-.7-.1.5 1.7 2 3 3.8 3A8.5 8.5 0 012 19.5a12 12 0 006.5 2c7.8 0 12-6.6 12-12.3v-.6c.8-.6 1.5-1.3 2-2.1z"/>
</svg>
</a>

<a href="https://main--learning--athuljadobe.aem.page/western-australia" class="social-icon">
<svg width="18" height="18" viewBox="0 0 24 24" fill="white">
<path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm5 5a5 5 0 110 10 5 5 0 010-10zm6.5-.9a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2zM12 9a3 3 0 100 6 3 3 0 000-6z"/>
</svg>
</a>
`;

        card.append(social);
      }
    });

    container.append(card);
  }

  block.innerHTML = '';
  block.append(container);
}
