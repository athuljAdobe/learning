export default function decorate(block) {

  const items = block.querySelectorAll(':scope > div');

  items.forEach((item) => {

    const title = item.children[0];
    const content = item.children[1];

    // add classes
    title.classList.add('accordion-title');
    content.classList.add('accordion-content');

    // hide content initially
    content.style.display = 'none';

    title.addEventListener('click', () => {

      const isOpen = item.classList.contains('active');

      // close all items
      items.forEach((i) => {
        i.classList.remove('active');
        i.children[1].style.display = 'none';
      });

      // open clicked item
      if (!isOpen) {
        item.classList.add('active');
        content.style.display = 'block';
      }

    });

  });

}