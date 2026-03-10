export default function decorate(block) {
  const items = block.querySelectorAll('p');

  items.forEach((item) => {
    const text = item.textContent.trim();
    const url = `/${text.toLowerCase().replace(/\s+/g, '-')}`;

    const link = document.createElement('a');
    link.href = url;
    link.textContent = text;

    item.replaceWith(link);
  });
}
