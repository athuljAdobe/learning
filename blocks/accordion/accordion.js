export default function decorate(block) {
  const items = block.querySelectorAll(':scope > div');

  items.forEach((item) => {
    const title = item.children[0];
    const content = item.children[1];

    title.classList.add('accordion-title');
    content.classList.add('accordion-content');

    title.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // close all
      items.forEach((i) => {
        i.classList.remove('active');
      });

      // open clicked
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
}