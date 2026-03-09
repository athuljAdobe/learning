export default function decorate(block) {

  const row = block.querySelector(':scope > div');

  const image = row.children[0];
  const title = row.children[1];
  const desc = row.children[2];
  const link = row.children[3];

  const imageCol = document.createElement('div');
  imageCol.className = 'camping-image';

  const contentCol = document.createElement('div');
  contentCol.className = 'camping-content';

  imageCol.append(image);

  contentCol.innerHTML = `
      <span class="camping-label">Featured Article</span>
  `;

  contentCol.append(title);
  contentCol.append(desc);
  contentCol.append(link);

  block.innerHTML = '';
  block.append(imageCol, contentCol);
}