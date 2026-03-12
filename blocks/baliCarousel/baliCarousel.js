export default function decorate(block) {

  const slides = [...block.children];

  const track = document.createElement('div');
  track.className = 'balicarousel-track';

  slides.forEach((slide) => {
    const s = document.createElement('div');
    s.className = 'balicarousel-slide';
    s.appendChild(slide);
    track.appendChild(s);
  });

  block.innerHTML = '';
  block.append(track);

  let index = 0;

  /* arrows */

  const prev = document.createElement('button');
  prev.className = 'balicarousel-prev';
  prev.textContent = '←';

  const next = document.createElement('button');
  next.className = 'balicarousel-next';
  next.textContent = '→';

  block.append(prev, next);

  /* dots */

  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'balicarousel-dots';

  const dots = slides.map((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'balicarousel-dot';
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

    dots.forEach((dot) => dot.classList.remove('active'));
    dots[index].classList.add('active');

  }

  next.addEventListener('click', () => {
    index = (index + 1) % slides.length;
    update();
  });

  prev.addEventListener('click', () => {
    index = (index - 1 + slides.length) % slides.length;
    update();
  });

}