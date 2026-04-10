import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_TwNVOb_C9BYV_FlJqw84AGLA3yB0hWM",
  authDomain: "virtualprode-8f201.firebaseapp.com",
  projectId: "virtualprode-8f201",
  storageBucket: "virtualprode-8f201.firebasestorage.app",
  messagingSenderId: "92350467236",
  appId: "1:92350467236:web:52e48d306330b583066a31"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);