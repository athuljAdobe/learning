export default function decorate(block) {

  const rows = [...block.children];

  rows.forEach((row) => {
    const text = row.textContent.trim().split('\n');

    const title = text[0];
    const date = text[1];

    row.innerHTML = `
      <div class="story-card">
        <span class="story-title">${title}</span>
        <span class="story-date">${date}</span>
      </div>
    `;
  });

}