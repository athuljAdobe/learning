export default function decorate(block) {
  block.textContent = '';

  const form = document.createElement('form');
  form.className = 'search-form';
  form.setAttribute('role', 'search');

  const wrapper = document.createElement('div');
  wrapper.className = 'search-input';

  const icon = document.createElement('span');
  icon.className = 'search-icon';

  /* ADD SVG HERE */
  icon.innerHTML = `
  <svg width="14" height="14" viewBox="0 0 24 24">
  <path fill="#777" d="M21 20l-5.6-5.6a7 7 0 10-1.4 1.4L20 21zM5 11a6 6 0 1112 0A6 6 0 015 11z"/>
  </svg>`;

  const input = document.createElement('input');
  input.type = 'search';
  input.placeholder = 'SEARCH';
  input.className = 'search-control';

  wrapper.append(icon);
  wrapper.append(input);

  form.append(wrapper);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = input.value.trim();

    if (query) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  });

  block.append(form);
}
