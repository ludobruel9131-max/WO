import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

function registerSW() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/service-worker.js");
    });
  }
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
registerSW();
