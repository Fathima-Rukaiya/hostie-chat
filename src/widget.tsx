// import React from "react";
// import ReactDOM from "react-dom/client";
// import css from "./assets/tailwind-embedded.css?raw";
// import { ChatUI } from "./components/chatUI";

// export function mountWidget(config: { apiKey: string; openAi?: string }) {
//   // Prevent double loading
//   if (document.getElementById("hostie-chat-widget")) return;

//   // Host element (not visible)
//   const host = document.createElement("div");
//   host.id = "hostie-chat-widget";
//   document.body.appendChild(host);

//   // Create shadow root
//   const shadow = host.attachShadow({ mode: "open" });

//   // Inject Tailwind CSS inside Shadow DOM
//   const style = document.createElement("style");
//   style.textContent = css;
//   shadow.appendChild(style);

//   // Create UI container inside shadow
//   const app = document.createElement("div");
//   shadow.appendChild(app);

//   // Mount React chat widget inside Shadow DOM
//   ReactDOM.createRoot(app).render(
//     <ChatUI apiKey={config.apiKey} openAi={config.openAi} />
//   );
// }
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { createPortal } from "react-dom";
import chatCSS from "./assets/tailwind-embedded.css";
import { ChatUI } from "./components/chatUI";

interface MountWidgetOptions {
  apiKey: string;
  containerId?: string;
}



export function mountWidget({ apiKey, containerId = "hostie-chat-root" }:MountWidgetOptions) {
  let host = document.getElementById(containerId);

  if (!host) {
    host = document.createElement("div");
    host.id = containerId;
    document.body.appendChild(host);
  }

  ReactDOM.createRoot(host).render(
    <ShadowWrapper>
      <ChatUI apiKey={apiKey} />
    </ShadowWrapper>
  );
}

function ShadowWrapper({ children }: { children: React.ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [shadow, setShadow] = useState<ShadowRoot | null>(null);

  useEffect(() => {
    if (!hostRef.current) return;
    if (shadow) return;

    const sr = hostRef.current.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = chatCSS;
    sr.appendChild(style);

    setShadow(sr);
  }, []);

  return (
    <div ref={hostRef}>
      {shadow && createPortal(children, shadow)}
    </div>
  );
}
