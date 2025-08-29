import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeFirestore, setLogLevel } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBe7upiP78RIe1o7E5oZvUJ_vdyeaa4VFg",
  authDomain: "urbanliving-c335c.firebaseapp.com",
  projectId: "urbanliving-c335c",
  storageBucket: "urbanliving-c335c.appspot.com", // ✅ FIXED
  messagingSenderId: "755316508289",
  appId: "1:755316508289:web:00223beda652cd7309ef80",
  measurementId: "G-W2EMSSLHME"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true, // ✅ more reliable for localhost
  useFetchStreams: false,
});

// Debug logging only in dev
if (typeof window !== "undefined" &&
    (location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
  try {
    setLogLevel("debug");
    console.info("[Firebase] Debug logging enabled. Online:", navigator.onLine, "UA:", navigator.userAgent);
    window.addEventListener("online", () => console.info("[Firebase] Browser is online"));
    window.addEventListener("offline", () => console.warn("[Firebase] Browser is offline"));
  } catch (_) {}
}
