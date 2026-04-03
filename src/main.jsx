

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ReactGA from "react-ga4";
import OneSignal from "react-onesignal";

ReactGA.initialize("G-FPLVT7TZ2L");

async function initOneSignal() {
  await OneSignal.init({
    appId: "94be9ed7-5b37-41b7-bcf3-0903cce5cf2c",
    notifyButton: {
      enable: true,
    },
  });
}

if (window.location.hostname === "www.ovikaliving.com" || window.location.hostname === "ovikaliving.com") {
  initOneSignal();
} else {
  console.log("OneSignal skipped: Not on production domain (" + window.location.hostname + ")");
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);