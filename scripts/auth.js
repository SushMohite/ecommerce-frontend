import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDorOTe-EKI4sAArHifgZoCSc92oWKjsOk",
  authDomain: "ecommerce-frontend-a3090.firebaseapp.com",
  projectId: "ecommerce-frontend-a3090",
  storageBucket: "ecommerce-frontend-a3090.firebasestorage.app",
  messagingSenderId: "480415168654",
  appId: "1:480415168654:web:248a524b149a3857e671df",
  measurementId: "G-0BW98QBXPJ",
};
const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);

// UI TOGGLE (unchanged)
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

loginBtn.onclick = () => {
  loginForm.classList.add("active");
  signupForm.classList.remove("active");
  loginBtn.classList.add("active");
  signupBtn.classList.remove("active");
};

signupBtn.onclick = () => {
  signupForm.classList.add("active");
  loginForm.classList.remove("active");
  signupBtn.classList.add("active");
  loginBtn.classList.remove("active");
};

function togglePassword(id) {
  const input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
}

function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

function validatePassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

// PASSWORD STRENGTH (unchanged)
const passwordInput = document.getElementById("signupPassword");
const strengthText = document.getElementById("passwordStrength");

passwordInput.oninput = () => {
  const value = passwordInput.value;

  if (value.length < 8) {
    strengthText.textContent = "Weak";
    strengthText.style.color = "red";
  } else if (validatePassword(value)) {
    strengthText.textContent = "Strong";
    strengthText.style.color = "green";
  } else {
    strengthText.textContent = "Medium";
    strengthText.style.color = "orange";
  }
};

// ✅ LOGIN WITH FIREBASE
loginForm.onsubmit = async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const error = document.getElementById("loginError");

  if (!validateEmail(email)) {
    error.textContent = "Invalid email";
    return;
  }

  if (password.length < 8) {
    error.textContent = "Password must be at least 8 characters";
    return;
  }

  try {
    await signInWithEmailAndPassword(firebaseAuth, email, password);
    error.textContent = "";
    alert("Login successful");
    window.location.href = "index.html";
  } catch (err) {
    error.textContent = err.message;
  }
};

// ✅ SIGNUP WITH FIREBASE
signupForm.onsubmit = async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("confirmPassword").value;
  const error = document.getElementById("signupError");

  if (!name) {
    error.textContent = "Name required";
    return;
  }

  if (!validateEmail(email)) {
    error.textContent = "Invalid email";
    return;
  }

  if (!validatePassword(password)) {
    error.textContent = "Weak password";
    return;
  }

  if (password !== confirm) {
    error.textContent = "Passwords do not match";
    return;
  }

  try {
    await createUserWithEmailAndPassword(firebaseAuth, email, password);
    error.textContent = "";
    alert("Signup successful");
    window.location.href = "index.html";
  } catch (err) {
    error.textContent = err.message;
  }
};
