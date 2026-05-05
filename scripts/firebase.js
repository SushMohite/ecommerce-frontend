import * as firebaseApp from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import * as firebaseAuth from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDorOTe-EKI4sAArHifgZoCSc92oWKjsOk",
  authDomain: "ecommerce-frontend-a3090.firebaseapp.com",
  projectId: "ecommerce-frontend-a3090",
  storageBucket: "ecommerce-frontend-a3090.firebasestorage.app",
  messagingSenderId: "480415168654",
  appId: "1:480415168654:web:248a524b149a3857e671df",
  measurementId: "G-0BW98QBXPJ"
};


const app = firebaseApp.initializeApp(firebaseConfig);

const auth = firebaseAuth.getAuth(app);

export { app, auth, firebaseAuth };