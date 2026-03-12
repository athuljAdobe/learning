export default function decorate(block) {

  const row = block.querySelector(':scope > div');
  if (!row) return;

  const signIn = row.children[0];
  const lang = row.children[1];

  /* ---------------- SIGN IN BUTTON ---------------- */

  const signBtn = document.createElement('button');
  signBtn.className = 'signin-btn';
  signBtn.textContent = signIn.textContent.trim();

  signIn.innerHTML = '';
  signIn.appendChild(signBtn);

  /* ---------------- LANGUAGE DROPDOWN ---------------- */

  const button = document.createElement('button');
  button.textContent = lang.textContent.trim();
  button.className = "lang-btn";

  const menu = document.createElement('ul');
  menu.className = "lang-menu";

  const languages = ["EN-US", "FR", "DE"];

  languages.forEach((l) => {
    const li = document.createElement("li");
    li.textContent = l;
    menu.appendChild(li);
  });

  const wrapper = document.createElement("div");
  wrapper.className = "lang-dropdown";

  wrapper.appendChild(button);
  wrapper.appendChild(menu);

  lang.innerHTML = "";
  lang.appendChild(wrapper);

  button.addEventListener("click", () => {
    menu.style.display =
      menu.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) {
      menu.style.display = "none";
    }
  });

  /* ---------------- SIGNIN MODAL ---------------- */

  const modal = document.createElement("div");
  modal.className = "signin-modal";

  modal.innerHTML = `
    <div class="signin-modal-content">
      <span class="signin-close">&times;</span>
      <h2>Sign In</h2>
      <p>Welcome Back</p>
      <input type="text" placeholder="USERNAME">
      <input type="password" placeholder="PASSWORD">
      <p class="forgot">FORGOT YOUR PASSWORD?</p>
      <button class="signin-submit">SIGN IN</button>
    </div>
  `;

  document.body.appendChild(modal);

  const closeBtn = modal.querySelector(".signin-close");

  /* OPEN MODAL */
  signBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  /* CLOSE MODAL */
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

}