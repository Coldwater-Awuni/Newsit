import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAhk68M0-XkTUFtQhNxq2Ly3Aqk8IlpoFY",
  authDomain: "inkling-insights-jp8pe.firebaseapp.com",
  projectId: "inkling-insights-jp8pe",
  storageBucket: "inkling-insights-jp8pe.firebasestorage.app",
  messagingSenderId: "842290771113",
  appId: "1:842290771113:web:54dbb1930394d86baa25b8"
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { app, auth };
