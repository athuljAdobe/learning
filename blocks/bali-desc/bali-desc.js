export default function decorate(block) {

  const rows = [...block.children];

  const tabs = document.createElement('div');
  tabs.className = 'tabs';

  const panels = document.createElement('div');
  panels.className = 'tab-panels';

  rows.forEach((row, i) => {

    const tabTitle = row.children[0].textContent.trim();
    const content = row.children[1].cloneNode(true);

    const button = document.createElement('button');
    button.className = 'tab-btn';
    button.textContent = tabTitle;

    const panel = document.createElement('div');
    panel.className = 'tab-panel';
    panel.append(content);

    if (i === 0) {
      button.classList.add('active');
      panel.classList.add('active');
    }

    button.addEventListener('click', () => {

      tabs.querySelectorAll('.tab-btn')
        .forEach(btn => btn.classList.remove('active'));

      panels.querySelectorAll('.tab-panel')
        .forEach(p => p.classList.remove('active'));

      button.classList.add('active');
      panel.classList.add('active');

    });

    tabs.append(button);
    panels.append(panel);

  });

  block.innerHTML = '';
  block.append(tabs, panels);

}