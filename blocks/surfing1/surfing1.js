export default function decorate(block) {

  const rows = [...block.children];

  const track = document.createElement('div');
  track.className = 'surfing1-track';

  rows.forEach((row) => {

    const slide = document.createElement('div');
    slide.className = 'surfing1-slide';

    slide.append(...row.children);

    track.append(slide);

  });

  block.textContent = '';
  block.append(track);

  let index = 0;

  /* arrows */

  const prev = document.createElement('button');
  prev.className = 'surfing1-prev';
  prev.innerHTML = '←';

  const next = document.createElement('button');
  next.className = 'surfing1-next';
  next.innerHTML = '→';

  block.append(prev, next);

  /* dots */

  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'surfing1-dots';

  const dots = rows.map((_, i) => {

    const dot = document.createElement('span');
    dot.className = 'surfing1-dot';

    if (i === 0) dot.classList.add('active');

    dot.addEventListener('click', () => {
      index = i;
      update();
    });

    dotsContainer.append(dot);

    return dot;

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