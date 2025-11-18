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

// import React, { useEffect, useRef, useState } from "react";
// import ReactDOM from "react-dom/client";
// import { createPortal } from "react-dom";
// import chatCSS from "./assets/tailwind-embedded.css";
// import { ChatUI } from "./components/chatUI";

// interface MountWidgetOptions {
//   apiKey: string;
//   containerId?: string;
// }

// export function mountWidget({ apiKey, containerId = "hostie-chat-root" }: MountWidgetOptions) {
//   let host = document.getElementById(containerId);

//   if (!host) {
//     host = document.createElement("div");
//     host.id = containerId;
//     document.body.appendChild(host);
//   }

//   ReactDOM.createRoot(host).render(
//     <ShadowWrapper>
//       <ChatUI apiKey={apiKey} />
//     </ShadowWrapper>
//   );
// }

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

//     // 🌙 DARK MODE LOGIC
//     const setTheme = (theme: "dark" | "light") => {
//       hostRef.current!.setAttribute("data-theme", theme);
//     };

//     // Set initial theme
//     const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
//     setTheme(prefersDark ? "dark" : "light");

//     // Listen for changes
//     const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
//     const handleChange = (e: MediaQueryListEvent) => {
//       setTheme(e.matches ? "dark" : "light");
//     };
//     mediaQuery.addEventListener("change", handleChange);

//     return () => mediaQuery.removeEventListener("change", handleChange);
//   }, []);

//   return <div ref={hostRef}>{shadow && createPortal(children, shadow)}</div>;
// }
// interface MountWidgetOptions {
//   apiKey: string;
//   containerId?: string;
// }



import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { createPortal } from "react-dom";
import chatCSS from "./assets/tailwind-embedded.css";
import { ChatUI } from "./components/chatUI";
import { ThemeProvider } from "next-themes";

import { useTheme } from "next-themes";

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
function ShadowWrapper({ children }: { children: React.ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [shadow, setShadow] = useState<ShadowRoot | null>(null);

  // useEffect(() => {
  //   if (!hostRef.current || shadow) return;

  //   const sr = hostRef.current.attachShadow({ mode: "open" });

  //   const wrapper = document.createElement("div");
  //   sr.appendChild(wrapper);

  //   // inject CSS
  //   const style = document.createElement("style");
  //   style.textContent = chatCSS;
  //   sr.appendChild(style);

  //   setShadow(sr);

  //   // auto detect website theme
  //   const setTheme = () => {
  //     const isDark = document.documentElement.classList.contains("dark");
  //     // wrapper.setAttribute("data-theme", isDark ? "dark" : "light");
  //     if (isDark) {
  //       wrapper.classList.add("dark");
  //     } else {
  //       wrapper.classList.remove("dark");
  //     }

  //   };

  //   setTheme(); // initial

  //   const observer = new MutationObserver(setTheme);
  //   observer.observe(document.documentElement, {
  //     attributes: true,
  //     attributeFilter: ["class"]
  //   });

  //   return () => observer.disconnect();
  // }, []);
useEffect(() => {
  if (!hostRef.current || shadow) return;

  const sr = hostRef.current.attachShadow({ mode: "open" });

  const wrapper = document.createElement("div");
  sr.appendChild(wrapper);

  const style = document.createElement("style");
  style.textContent = chatCSS;
  sr.appendChild(style);

  setShadow(sr);

  // auto detect website theme
  const syncTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");

    // FIX: Apply Tailwind dark class inside Shadow DOM
    if (isDark) {
      wrapper.classList.add("dark");
    } else {
      wrapper.classList.remove("dark");
    }
  };

  syncTheme(); // initial

  const observer = new MutationObserver(syncTheme);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  return () => observer.disconnect();
}, []);

  return <div ref={hostRef}>{shadow && createPortal(children, shadow.querySelector("div")!)}</div>;
}

// function ShadowWrapper({ children }: { children: React.ReactNode }) {
//   const hostRef = useRef<HTMLDivElement>(null);
//   const [shadow, setShadow] = useState<ShadowRoot | null>(null);
//   const { theme } = useTheme();

//   useEffect(() => {
//     if (!hostRef.current || shadow) return;

//     const sr = hostRef.current.attachShadow({ mode: "open" });

//     const style = document.createElement("style");
//     style.textContent = chatCSS; // Tailwind compiled CSS
//     sr.appendChild(style);

//     setShadow(sr);
//   }, [shadow]);

//   // Apply theme to Shadow DOM whenever it changes
//   useEffect(() => {
//     if (!hostRef.current) return;
//     hostRef.current.setAttribute("data-theme", theme || "light");
//   }, [theme]);

//   return <div ref={hostRef}>{shadow && createPortal(children, shadow)}</div>;
// }
// function ShadowWrapper({ children }: { children: React.ReactNode }) {
//   const hostRef = useRef<HTMLDivElement>(null);
//   const [shadow, setShadow] = useState<ShadowRoot | null>(null);
//   const { theme } = useTheme();

//   useEffect(() => {
//     if (!hostRef.current || shadow) return;

//     const sr = hostRef.current.attachShadow({ mode: "open" });

//     // Create a wrapper inside Shadow DOM to hold children + theme
//     const wrapper = document.createElement("div");
//     wrapper.setAttribute("data-theme", theme || "light"); // ✅ critical
//     sr.appendChild(wrapper);

//     // Inject Tailwind CSS
//     const style = document.createElement("style");
//     style.textContent = chatCSS;
//     sr.appendChild(style);

//     setShadow(sr);

//   }, [shadow]);

//   // Update theme inside Shadow DOM when it changes
//   useEffect(() => {
//     if (!shadow) return;
//     const wrapper = shadow.querySelector("div");
//     if (wrapper) wrapper.setAttribute("data-theme", theme || "light");
//   }, [theme, shadow]);

//   return <div ref={hostRef}>{shadow && createPortal(children, shadow.querySelector("div")!)}</div>;
// }


interface MountWidgetOptions {
  apiKey: string;
  containerId?: string;
}



