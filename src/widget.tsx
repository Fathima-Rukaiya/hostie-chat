import React from "react";
import ReactDOM from "react-dom/client";
import css from "./assets/tailwind-embedded.css?raw";
import { ChatUI } from "./components/chatUI";

export function mountWidget(config: { apiKey: string; openAi?: string }) {
  // Prevent double loading
  if (document.getElementById("hostie-chat-widget")) return;

  // Host element (not visible)
  const host = document.createElement("div");
  host.id = "hostie-chat-widget";
  document.body.appendChild(host);

  // Create shadow root
  const shadow = host.attachShadow({ mode: "open" });

  // Inject Tailwind CSS inside Shadow DOM
  const style = document.createElement("style");
  style.textContent = css;
  shadow.appendChild(style);

  // Create UI container inside shadow
  const app = document.createElement("div");
  shadow.appendChild(app);

  // Mount React chat widget inside Shadow DOM
  ReactDOM.createRoot(app).render(
    <ChatUI apiKey={config.apiKey} openAi={config.openAi} />
  );
}
