import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { createPortal } from "react-dom";
import chatCSS from "./assets/tailwind-embedded.css";
import { ChatUI } from "./components/chatUI";
import { ThemeProvider } from "next-themes";

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
    <ThemeProvider attribute="data-theme" enableSystem={true} defaultTheme="light">
      <ShadowWrapper>
        <ChatUI apiKey={apiKey} />
      </ShadowWrapper>
    </ThemeProvider>
  );
}
// function ShadowWrapper({ children }: { children: React.ReactNode }) {
//   const hostRef = useRef<HTMLDivElement>(null);
//   const [shadow, setShadow] = useState<ShadowRoot | null>(null);

//   // useEffect(() => {
//   //   if (!hostRef.current || shadow) return;

//   //   const sr = hostRef.current.attachShadow({ mode: "open" });

//   //   const wrapper = document.createElement("div");
//   //   sr.appendChild(wrapper);

//   //   // inject CSS
//   //   const style = document.createElement("style");
//   //   style.textContent = chatCSS;
//   //   sr.appendChild(style);

//   //   setShadow(sr);

//   //   // auto detect website theme
//   //   const setTheme = () => {
//   //     const isDark = document.documentElement.classList.contains("dark");
//   //     // wrapper.setAttribute("data-theme", isDark ? "dark" : "light");
//   //     if (isDark) {
//   //       wrapper.classList.add("dark");
//   //     } else {
//   //       wrapper.classList.remove("dark");
//   //     }

//   //   };

//   //   setTheme(); // initial

//   //   const observer = new MutationObserver(setTheme);
//   //   observer.observe(document.documentElement, {
//   //     attributes: true,
//   //     attributeFilter: ["class"]
//   //   });

//   //   return () => observer.disconnect();
//   // }, []);
// useEffect(() => {
//   if (!hostRef.current || shadow) return;

//   const sr = hostRef.current.attachShadow({ mode: "open" });

//   const wrapper = document.createElement("div");
//   sr.appendChild(wrapper);

//   const style = document.createElement("style");
//   style.textContent = chatCSS;
//   sr.appendChild(style);

//   setShadow(sr);

//   // auto detect website theme
//   const syncTheme = () => {
//     const isDark = document.documentElement.classList.contains("dark");

//     // FIX: Apply Tailwind dark class inside Shadow DOM
//     if (isDark) {
//       wrapper.classList.add("dark");
//     } else {
//       wrapper.classList.remove("dark");
//     }
//   };

//   syncTheme(); // initial

//   const observer = new MutationObserver(syncTheme);
//   observer.observe(document.documentElement, {
//     attributes: true,
//     attributeFilter: ["class"],
//   });

//   return () => observer.disconnect();
// }, []);

//   return <div ref={hostRef}>{shadow && createPortal(children, shadow.querySelector("div")!)}</div>;
// }
function ShadowWrapper({ children }: { children: React.ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [shadow, setShadow] = useState<ShadowRoot | null>(null);

  useEffect(() => {
    if (!hostRef.current || shadow) return;

    const sr = hostRef.current.attachShadow({ mode: "open" });

    const wrapper = document.createElement("div");
    sr.appendChild(wrapper);

    // Inject Tailwind CSS
    const style = document.createElement("style");
    style.textContent = chatCSS;
    sr.appendChild(style);

    // ------------- FIX FOR FILE UPLOAD ------------- //
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.id = "hostie-file-input";
    fileInput.style.display = "none";
    sr.appendChild(fileInput);

    // Listen for global event from ChatUI
    const openFileHandler = () => fileInput.click();
    window.addEventListener("hostie-open-file", openFileHandler);
    // ------------------------------------------------ //

    // Save shadow root
    setShadow(sr);

    // Sync website dark mode → Shadow DOM
    const syncTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      if (isDark) wrapper.classList.add("dark");
      else wrapper.classList.remove("dark");
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.removeEventListener("hostie-open-file", openFileHandler);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={hostRef}>
      {shadow && createPortal(children, shadow.querySelector("div")!)}
    </div>
  );
}

interface MountWidgetOptions {
  apiKey: string;
  containerId?: string;
}



