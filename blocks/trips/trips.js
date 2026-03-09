export default function decorate(block) {

  [...block.children].forEach((row) => {

    const image = row.children[0];
    const title = row.children[1];
    const desc = row.children[2];

    const card = document.createElement('div');
    card.className = 'trip-card';

    card.append(image, title, desc);

    row.replaceWith(card);
  });

}