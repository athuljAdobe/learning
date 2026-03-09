export default function decorate(block) {

  const row = block.querySelector(':scope > div');

  const image = row.children[0];
  const title = row.children[1];
  const desc = row.children[2];
  const link = row.children[3];

  const imageWrap = document.createElement('div');
  imageWrap.className = 'adventure-image';

  const content = document.createElement('div');
  content.className = 'adventure-content';

  imageWrap.append(image);

  content.append(title);
  content.append(desc);
  content.append(link);

  block.innerHTML = '';
  block.append(imageWrap, content);
}