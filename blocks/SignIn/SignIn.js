export default function decorate(block) {
  const signInText = block.querySelector('p');

  if (signInText) {
    // make it look clickable
    signInText.style.cursor = 'pointer';

    // redirect on click
    signInText.addEventListener('click', () => {
      window.location.href = '/login';
    });
  }
}
