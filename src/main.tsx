import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";

// Intercept native fetch requests to bypass ngrok's free tier browser warning page
const originalFetch = window.fetch;
window.fetch = async (input, init) => {
  let url = "";
  if (typeof input === "string") {
    url = input;
  } else if (input instanceof URL) {
    url = input.toString();
  } else if (input && typeof input === "object" && "url" in input) {
    url = (input as Request).url;
  }

  if (url.includes("ngrok-free.dev")) {
    if (input instanceof Request) {
      const newHeaders = new Headers(input.headers);
      newHeaders.set("ngrok-skip-browser-warning", "true");
      const newRequest = new Request(input, { headers: newHeaders });
      return originalFetch(newRequest, init);
    } else {
      const newInit = { ...init };
      const headers = new Headers(newInit.headers || {});
      headers.set("ngrok-skip-browser-warning", "true");
      newInit.headers = headers;
      return originalFetch(input, newInit);
    }
  }

  return originalFetch(input, init);
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
