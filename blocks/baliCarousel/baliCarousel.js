export default function decorate(block) {

  const rows = [...block.children];

  const track = document.createElement('div');
  track.className = 'balicarousel-track';

  rows.forEach((row) => {

    const slide = document.createElement('div');
    slide.className = 'balicarousel-slide';

    const image = row.querySelector('picture');

    if (image) {
      slide.append(image);
    }

    track.append(slide);
  });

  block.textContent = '';
  block.append(track);

  let index = 0;

  /* arrows */

  const prev = document.createElement('button');
  prev.className = 'balicarousel-prev';
  prev.innerHTML = '←';

  const next = document.createElement('button');
  next.className = 'balicarousel-next';
  next.innerHTML = '→';

  block.append(prev, next);

  /* dots */

  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'balicarousel-dots';

  const dots = [];

  rows.forEach((_, i) => {

    const dot = document.createElement('span');
    dot.className = 'balicarousel-dot';

    if (i === 0) dot.classList.add('active');

    dot.addEventListener('click', () => {
      index = i;
      update();
    });

    dots.push(dot);
    dotsContainer.append(dot);
  });

  block.append(dotsContainer);

  function update() {

    track.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach(d => d.classList.remove('active'));
    dots[index].classList.add('active');
  }

  next.addEventListener('click', () => {
    index = (index + 1) % rows.length;
    update();
  });

  prev.addEventListener('click', () => {
    index = (index - 1 + rows.length) % rows.length;
    update();
  });

}