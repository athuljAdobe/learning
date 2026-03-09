export default function decorate(block) {

  const rows = [...block.children];
  const grid = document.createElement('div');
  grid.className = 'articles-grid';

  rows.forEach((row) => {

    const image = row.children[0];
    const title = row.children[1];
    const desc = row.children[2];

    const card = document.createElement('div');
    card.className = 'article-card';

    card.append(image);
    card.append(title);
    card.append(desc);

    grid.append(card);
  });

  block.innerHTML = '';
  block.append(grid);

}