const form = document.getElementById("login-form");
const erro = document.getElementById("login-error");

auth.onAuthStateChanged(user => {
  if (user && location.pathname.endsWith("login.html")) {
    window.location.href = "admin.html";
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  erro.textContent = "Entrando...";
  const email = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value;
  try {
    await auth.signInWithEmailAndPassword(email, senha);
    window.location.href = "admin.html";
  } catch (e) {
    console.error(e);
    erro.textContent = "E-mail ou senha incorretos.";
  }
});
