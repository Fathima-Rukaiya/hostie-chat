import React from "react";
import ReactDOM from "react-dom/client";
import { ChatUI } from "./components/chatUI";
import chatCSS from "./assets/tailwind-embedded.css";

interface HostieChatOptions {
  apiKey: string;
  openAi?: string;
  containerId?: string;
}

// Inject CSS dynamically
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = chatCSS;
  document.head.appendChild(style);
}

// Main init function
export function init({
  apiKey,
  openAi,
  containerId = "hostie-chat-root",
}: HostieChatOptions) {
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    document.body.appendChild(container);
  }

  const root = ReactDOM.createRoot(container);
  root.render(<ChatUI apiKey={apiKey} openAi={openAi} />);
}

// Auto-init from script attributes
if (typeof window !== "undefined") {
  const script = document.currentScript as HTMLScriptElement | null;
  if (script) {
    const apiKey = script.getAttribute("data-api-key");
    const openAi = script.getAttribute("data-openai");
    const containerId = script.getAttribute("data-id") || "hostie-chat-root";
    if (apiKey) {
      init({ apiKey, openAi: openAi || undefined, containerId });
    }
  }

  // Expose globally
  (window as any).HostieChat = { init };
}

export { ChatUI };


// import React from "react";
// import ReactDOM from "react-dom/client";
// import { ChatUI } from "./components/chatUI";
// import "./styles/tailwind.css";

// interface HostieChatOptions {
//   apiKey: string;
//   openAi?: string;
//   containerId?: string;
// }

// export function init({
//   apiKey,
//   openAi,
//   containerId = "hostie-chat-root",
// }: HostieChatOptions) {
//   let container = document.getElementById(containerId);
//   if (!container) {
//     container = document.createElement("div");
//     container.id = containerId;
//     document.body.appendChild(container);
//   }

//   const root = ReactDOM.createRoot(container);
//   root.render(<ChatUI apiKey={apiKey} openAi={openAi} />);
// }

// export { ChatUI };

// // Expose globally for CDN usage
// if (typeof window !== "undefined") {
//   (window as any).HostieChat = { init };
// }


// import React from "react";
// import ReactDOM from "react-dom/client";
// import { ChatUI } from "./components/chatUI";
// // import "./styles/tailwind.css";
// // import './assets/tailwind-embedded.css'
// import chatCSS from './assets/tailwind-embedded.css';

// interface HostieChatOptions {
//   apiKey: string;
//   openAi?: string;
//   containerId?: string;
// }

// // ------------------------------
// // MAIN INIT FUNCTION
// // ------------------------------
// export function init({
//   apiKey,
//   openAi,
//   containerId = "hostie-chat-root",
// }: HostieChatOptions) {
//   let container = document.getElementById(containerId);
//   if (!container) {
//     container = document.createElement("div");
//     container.id = containerId;
//     document.body.appendChild(container);
//   }

//   const root = ReactDOM.createRoot(container);
//   root.render(<ChatUI apiKey={apiKey} openAi={openAi} />);
// }
// if (typeof document !== "undefined") {
//   const style = document.createElement("style");
//   style.textContent = chatCSS;
//   document.head.appendChild(style);
// }
// // ------------------------------
// // AUTO-READ <script> ATTRIBUTES
// // ------------------------------
// if (typeof window !== "undefined") {
//   const script = document.currentScript as HTMLScriptElement | null;

//   if (script) {
//     const apiKey = script.getAttribute("data-api-key");
//     const openAi = script.getAttribute("data-openai");
//     const containerId =
//       script.getAttribute("data-id") || "hostie-chat-root";

//     // Auto-init only if apiKey exists
//     if (apiKey) {
//       init({
//         apiKey,
//         openAi: openAi || undefined,
//         containerId,
//       });
//     }
//   }

//   // Expose globally
//   (window as any).HostieChat = { init };
// }

// export { ChatUI };
