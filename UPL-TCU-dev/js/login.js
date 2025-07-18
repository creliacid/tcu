import { auth } from './firebase-init.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const message = document.getElementById("loginMessage");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      message.style.color = "green";
      message.textContent = "¡Inicio de sesión exitoso!";
      setTimeout(() => {
        window.location.href = "adminEventos.html";
      }, 1000);
    } catch (error) {
      message.style.color = "red";
      message.textContent = "No se pudo iniciar sesión. Verifica tus credenciales y vuelve a intentarlo.";
    }
  });
});
