import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { createPortal } from "react-dom";
import chatCSS from "./assets/tailwind-embedded.css";
import { ChatUI } from "./components/chatUI";

interface MountWidgetOptions {
  apiKey: string;
  containerId?: string;
}



export function mountWidget({ apiKey, containerId = "hostie-chat-root" }: MountWidgetOptions) {
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

// function ShadowWrapper({ children }: { children: React.ReactNode }) {
//   const hostRef = useRef<HTMLDivElement>(null);
//   const [shadow, setShadow] = useState<ShadowRoot | null>(null);

//   useEffect(() => {
//     if (!hostRef.current) return;
//     if (shadow) return;

//     const sr = hostRef.current.attachShadow({ mode: "open" });

//     const style = document.createElement("style");
//     style.textContent = chatCSS;
//     sr.appendChild(style);

//     setShadow(sr);
//   }, []);

//   return (
//     <div ref={hostRef}>
//       {shadow && createPortal(children, shadow)}
//     </div>
//   );
// }

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

    // 🌙 DARK MODE LOGIC
    const setTheme = (theme: "dark" | "light") => {
      hostRef.current!.setAttribute("data-theme", theme);
    };

    // Set initial theme
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");

    // Listen for changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "dark" : "light");
    };
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return <div ref={hostRef}>{shadow && createPortal(children, shadow)}</div>;
}


interface MountWidgetOptions {
  apiKey: string;
  containerId?: string;
}


