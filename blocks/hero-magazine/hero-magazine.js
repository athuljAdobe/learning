export default function decorate(block) {

  const imageRow = block.children[0];
  const textRow = block.children[1];

  const image = imageRow.querySelector('img');

  const category = textRow.children[0].textContent.trim();
  const title = textRow.children[1].textContent.trim();

  const wrapper = document.createElement('div');
  wrapper.className = "hero-magazine-wrapper";

  wrapper.innerHTML = `
    <div class="hero-magazine-image">
      <img src="${image.src}" alt="">
    </div>

    <div class="hero-magazine-label">
      <span class="hero-category">${category}</span>
      <span class="hero-triangle"></span>
      <span class="hero-title">${title}</span>
    </div>
  `;

  block.innerHTML = "";
  block.append(wrapper);
}