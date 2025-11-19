// import React, { useEffect, useRef, useState } from "react";
// import ReactDOM from "react-dom/client";
// import { createPortal } from "react-dom";
// import chatCSS from "./assets/tailwind-embedded.css";
// import { ChatUI } from "./components/chatUI";
// import { ThemeProvider } from "next-themes";

// interface MountWidgetOptions {
//   apiKey: string;
//   containerId?: string;
//    shadowContainer?: React.RefObject<HTMLDivElement>;
// }

// export function mountWidget({ apiKey, containerId = "hostie-chat-root" }: MountWidgetOptions) {
//   let host = document.getElementById(containerId);
//   if (!host) {
//     host = document.createElement("div");
//     host.id = containerId;
//     document.body.appendChild(host);
//   }

//   ReactDOM.createRoot(host).render(
//     <ThemeProvider attribute="data-theme" enableSystem={true} defaultTheme="light">
//       <ShadowWrapper>
//         <ChatUI apiKey={apiKey}  />
//       </ShadowWrapper>
//     </ThemeProvider>
//   );
// }

// // function ShadowWrapper({ children }: { children: React.ReactNode }) {
// //   const hostRef = useRef<HTMLDivElement>(null);
// //   const [shadow, setShadow] = useState<ShadowRoot | null>(null);

// //   useEffect(() => {
// //     if (!hostRef.current || shadow) return;

// //     const sr = hostRef.current.attachShadow({ mode: "open" });

// //     const wrapper = document.createElement("div");
// //     sr.appendChild(wrapper);

// //     // Inject Tailwind CSS
// //     const style = document.createElement("style");
// //     style.textContent = chatCSS;
// //     sr.appendChild(style);

// //     // ------------- FIX FOR FILE UPLOAD ------------- //
// //     const fileInput = document.createElement("input");
// //     fileInput.type = "file";
// //     fileInput.id = "hostie-file-input";
// //     fileInput.style.display = "none";
// //     sr.appendChild(fileInput);

// //     // Listen for global event from ChatUI
// //     const openFileHandler = () => fileInput.click();
// //     window.addEventListener("hostie-open-file", openFileHandler);
// //     // ------------------------------------------------ //

// //     // Save shadow root
// //     setShadow(sr);

// //     // Sync website dark mode → Shadow DOM
// //     const syncTheme = () => {
// //       const isDark = document.documentElement.classList.contains("dark");
// //       if (isDark) wrapper.classList.add("dark");
// //       else wrapper.classList.remove("dark");
// //     };

// //     syncTheme();

// //     const observer = new MutationObserver(syncTheme);
// //     observer.observe(document.documentElement, {
// //       attributes: true,
// //       attributeFilter: ["class"],
// //     });

// //     return () => {
// //       window.removeEventListener("hostie-open-file", openFileHandler);
// //       observer.disconnect();
// //     };
// //   }, []);

// //   return (
// //     <div ref={hostRef}>
// //       {shadow && createPortal(children, shadow.querySelector("div")!)}
// //     </div>
// //   );
// // }

// function ShadowWrapper({ children }: { children: React.ReactElement<{ shadowContainer?: React.RefObject<HTMLDivElement> }> }) {
//   const hostRef = useRef<HTMLDivElement>(null);
//   const wrapperRef = useRef<HTMLDivElement>(null);
//   const [shadow, setShadow] = useState<ShadowRoot | null>(null);

//   useEffect(() => {
//     if (!hostRef.current || shadow) return;

//     const sr = hostRef.current.attachShadow({ mode: "open" });

//     const wrapper = document.createElement("div");
//     wrapperRef.current = wrapper;
//     sr.appendChild(wrapper);

//     const style = document.createElement("style");
//     style.textContent = chatCSS;
//     sr.appendChild(style);

//     setShadow(sr);
//   }, []);

//   return (
//     <div ref={hostRef}>
//    {shadow &&
//   createPortal(
//     React.cloneElement(children, { shadowContainer: wrapperRef }),
//     wrapperRef.current!
//   )}

//     </div>
//   );
// }




// interface MountWidgetOptions {
//   apiKey: string;
 
// }


import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { createPortal } from "react-dom";
import chatCSS from "./assets/tailwind-embedded.css";
import { ChatUI } from "./components/chatUI";
import { ThemeProvider } from "next-themes";

// Single MountWidgetOptions interface
interface MountWidgetOptions {
  apiKey: string;
  containerId?: string;
}

// Mount the chat widget into the DOM
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

// ShadowWrapper component for Shadow DOM + Tailwind//not working fro dark theme
// function ShadowWrapper({ children }: { children: React.ReactElement<{ shadowContainer?: React.RefObject<HTMLDivElement | null> }> }) {
//   const hostRef = useRef<HTMLDivElement>(null);
//   const wrapperRef = useRef<HTMLDivElement>(null);
//   const [shadow, setShadow] = useState<ShadowRoot | null>(null);

//   useEffect(() => {
//     if (!hostRef.current || shadow) return;

//     // Attach Shadow DOM
//     const sr = hostRef.current.attachShadow({ mode: "open" });

//     // Create wrapper div inside Shadow DOM
//     const wrapper = document.createElement("div");
//     wrapperRef.current = wrapper;
//     sr.appendChild(wrapper);

//     // Inject Tailwind CSS into Shadow DOM
//     const style = document.createElement("style");
//     style.textContent = chatCSS;
//     sr.appendChild(style);

//     setShadow(sr);
//   }, [shadow]);

//   // Render children into Shadow DOM using createPortal
//   return (
//     <div ref={hostRef}>
//       {shadow &&
//         createPortal(
//           React.cloneElement(children, { shadowContainer: wrapperRef }),
//           wrapperRef.current!
//         )}
//     </div>
//   );
// }

function ShadowWrapper({
  children,
}: {
  children: React.ReactElement<{ shadowContainer?: React.RefObject<HTMLDivElement | null> }>;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [shadow, setShadow] = useState<ShadowRoot | null>(null);

  useEffect(() => {
    if (!hostRef.current || shadow) return;

    // Attach Shadow DOM
    const sr = hostRef.current.attachShadow({ mode: "open" });

    // Create wrapper div inside Shadow DOM
    const wrapper = document.createElement("div");
    wrapperRef.current = wrapper;
    sr.appendChild(wrapper);

    // Inject Tailwind CSS
    const style = document.createElement("style");
    style.textContent = chatCSS;
    sr.appendChild(style);

    // ----- DARK MODE SYNC -----
    const syncTheme = () => {
      const isDark =
        document.documentElement.classList.contains("dark") ||
        document.body.dataset.theme === "dark";
      if (isDark) wrapper.classList.add("dark");
      else wrapper.classList.remove("dark");
    };

    syncTheme(); // initial sync
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    setShadow(sr);

    return () => observer.disconnect();
  }, [shadow]);

  // Render children into Shadow DOM using createPortal
  return (
    <div ref={hostRef}>
      {shadow &&
        createPortal(
          React.cloneElement(children, { shadowContainer: wrapperRef }),
          wrapperRef.current!
        )}
    </div>
  );
}


