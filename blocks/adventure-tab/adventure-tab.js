export default function decorate(block) {
  const rows = [...block.children];

  const tabsWrapper = document.createElement('div');
  tabsWrapper.className = 'adventure-tab-tabs';

  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'adventure-tab-content';

  rows.forEach((row, index) => {
    const tabName = row.children[0].textContent.trim();

    /* CREATE TAB BUTTON */

    const button = document.createElement('button');
    button.textContent = tabName;

    if (index === 0) button.classList.add('active');

    tabsWrapper.append(button);

    /* CREATE CARD CONTAINER */

    const cardsWrapper = document.createElement('div');
    cardsWrapper.className = 'adventure-row';

    if (index === 0) cardsWrapper.classList.add('active');

    [...row.children].slice(1).forEach((cell) => {
      const card = document.createElement('div');
      card.className = 'adventure-card';

      card.innerHTML = cell.innerHTML;

      cardsWrapper.append(card);
    });

    contentWrapper.append(cardsWrapper);

    /* TAB CLICK */

    button.addEventListener('click', () => {
      tabsWrapper.querySelectorAll('button').forEach((btn) => btn.classList.remove('active'));

      contentWrapper.querySelectorAll('.adventure-row').forEach((r) => r.classList.remove('active'));

      button.classList.add('active');
      cardsWrapper.classList.add('active');
    });
  });

  block.innerHTML = '';
  block.append(tabsWrapper, contentWrapper);
}
