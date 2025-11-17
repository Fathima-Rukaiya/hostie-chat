import React from "react";
import ReactDOM from "react-dom/client";
import css from "./assets/tailwind-embedded.css?raw";
import { ChatUI } from "./components/chatUI";

export function mountWidget(config: any) {
  if (document.getElementById("hostie-chat-widget")) return;

  const host = document.createElement("div");
  host.id = "hostie-chat-widget";
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = css;
  shadow.appendChild(style);

  const app = document.createElement("div");
  shadow.appendChild(app);

  ReactDOM.createRoot(app).render(<ChatUI apiKey={config.apiKey} openAi={config.openAi} />);
}
