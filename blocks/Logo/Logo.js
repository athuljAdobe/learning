export default function decorate(block) {
  const img = block.querySelector('img');

  if (img) {
    const link = document.createElement('a');
    link.href = '/';
    img.parentElement.append(link);
    link.append(img);
  }
}
