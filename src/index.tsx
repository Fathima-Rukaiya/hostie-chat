// import React from "react";
// import ReactDOM from "react-dom/client";
// import chatCSS from "./assets/tailwind-embedded.css"; // normal import handled by TSUP
// import { ChatUI } from "./components/chatUI";

// // Inject CSS globally (or into shadow root later)
// if (typeof document !== "undefined") {
//   const style = document.createElement("style");
//   style.textContent = chatCSS;
//   document.head.appendChild(style);
// }

// interface HostieChatOptions {
//   apiKey: string;
//   containerId?: string;
// }

// export function init({ apiKey, containerId = "hostie-chat-root" }: HostieChatOptions) {
//   let container = document.getElementById(containerId);
//   if (!container) {
//     container = document.createElement("div");
//     container.id = containerId;
//     document.body.appendChild(container);
//   }

//   ReactDOM.createRoot(container).render(<ChatUI apiKey={apiKey} />);
// }

// // Auto-init if script tag is present
// if (typeof document !== "undefined") {
//   const script = document.currentScript as HTMLScriptElement | null;
//   if (script) {
//     const apiKey = script.getAttribute("data-api-key");
//     const containerId = script.getAttribute("data-id") || "hostie-chat-root";
//     if (apiKey) init({ apiKey, containerId });
//   }

//   (window as any).HostieChat = { init };
// }

import { mountWidget } from "./widget";
export { mountWidget };