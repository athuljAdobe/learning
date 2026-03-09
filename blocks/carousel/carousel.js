export default function decorate(block) {

  const rows = [...block.children];
  let current = 0;

  const track = document.createElement('div');
  track.className = 'carousel-track';

  rows.forEach((row) => {

    const slide = document.createElement('div');
    slide.className = 'carousel-slide';

    const image = row.children[0];
    const title = row.children[1];
    const description = row.children[2];
    const link = row.children[3];

    const content = document.createElement('div');
    content.className = 'carousel-content';

    content.append(title);
    content.append(description);
    content.append(link);

    slide.append(image);
    slide.append(content);

    track.append(slide);
  });

  block.textContent = '';
  block.append(track);

  const slides = [...track.children];

  /* arrows */

  const prev = document.createElement('button');
  prev.className = 'carousel-prev';
  prev.innerHTML = '←';

  const next = document.createElement('button');
  next.className = 'carousel-next';
  next.innerHTML = '→';

  block.append(prev);
  block.append(next);

  /* dots */

  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'carousel-dots';

  slides.forEach((_, i) => {

    const dot = document.createElement('span');
    dot.className = 'dot';

    if (i === 0) dot.classList.add('active');

    dot.addEventListener('click', () => {
      current = i;
      update();
    });

    dotsContainer.append(dot);

  });

  block.append(dotsContainer);

  const dots = dotsContainer.querySelectorAll('.dot');

  function update() {

    track.style.transform = `translateX(-${current * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });

  }

  prev.addEventListener('click', () => {
    current = (current - 1 + slides.length) % slides.length;
    update();
  });

  next.addEventListener('click', () => {
    current = (current + 1) % slides.length;
    update();
  });

  /* auto slide */

  setInterval(() => {
    current = (current + 1) % slides.length;
    update();
  }, 10000);

}