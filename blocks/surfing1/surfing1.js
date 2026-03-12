export default function decorate(block) {

  const prev = document.createElement('button');
  prev.className = 'surfing1-prev';
  prev.textContent = '←';

  const next = document.createElement('button');
  next.className = 'surfing1-next';
  next.textContent = '→';

  block.append(prev, next);

  const dots = document.createElement('div');
  dots.className = 'surfing1-dots';

  const dot = document.createElement('span');
  dot.className = 'surfing1-dot active';

  dots.append(dot);
  block.append(dots);

}