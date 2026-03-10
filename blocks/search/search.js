export default function decorate(block) {
  block.textContent = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'search-input';

  const icon = document.createElement('span');
  icon.className = 'search-icon';
  icon.textContent = '🔍';

  const text = document.createElement('span');
  text.textContent = 'SEARCH';

  wrapper.append(icon);
  wrapper.append(text);

  block.append(wrapper);
}
