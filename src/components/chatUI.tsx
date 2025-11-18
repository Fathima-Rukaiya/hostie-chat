// "use client";
// import React, { useState, useRef, useEffect } from "react";
// import { Wanchain1 } from "iconsax-react";
// import { StandardUI } from "./StandardUI";
// import rawTailwindCSS from '../assets/tailwind-embedded.css?raw'


// function useShadowRoot(ref: React.RefObject<HTMLDivElement | null>, css: string) {
//     useEffect(() => {
//         if (ref.current) {
//             const shadowRoot = ref.current.attachShadow({ mode: 'open' });

//             // 1. Inject Tailwind CSS
//             const style = document.createElement('style');
//             style.textContent = css; // CSS content as string
//             shadowRoot.appendChild(style);

//             // 2. Move the content element into the Shadow Root
//             const content = ref.current.querySelector('#chat-ui-content');
//             if (content) {
//                 shadowRoot.appendChild(content);
//             }
//         }
//     }, [css, ref]);
// }
// export function ChatUI({
//     apiKey, openAi, }: {
//         apiKey: string;
//         openAi?: string;
//     }) {


//     const [isOpen, setIsOpen] = useState(false);
//     const popoverRef = useRef<HTMLDivElement>(null);
//     const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
//    // const API_BASE_URL = "https://hostingate-client.vercel.app/api/clientCustomerChatBox";


//   const API_BASE_URL = "https://hostie-dashboard.vercel.app/api/clientCustomerChatBox";
//     useEffect(() => {
//         const verifyDomain = async () => {
//             try {
//                 const res = await fetch(`${API_BASE_URL}/verifyDomain`, {
//                     method: "POST",
//                     mode: "cors",
//                     headers: {
//                         "Content-Type": "application/json",
//                         "x-api-key": apiKey,
//                     },
//                     body: JSON.stringify({ api_key: apiKey }),
//                 });
//                 if (!res.ok) {
//                     setIsAllowed(false);
//                     return;
//                 }
//                 const data = await res.json();
//                 setIsAllowed(data.allowed ?? false);
//             } catch (err) {
//                 console.error("Domain verification failed:", err);
//                 setIsAllowed(false);
//             }
//         };

//         verifyDomain();
//     }, [apiKey]);

//     // Close popover when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
//                 setIsOpen(false);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);


//     // Replace the style prop with the ref for Shadow DOM
//     const rootRef = useRef<HTMLDivElement>(null);

//     // Placeholder for the actual CSS content
//     const compiledCssContent = rawTailwindCSS as string;
//     useShadowRoot(rootRef, compiledCssContent);

//     // const buttonClasses = "rounded-full shadow-xl flex items-center gap-2 px-4 py-2 " +  "bg-gradient-to-r from-purple-700 to-purple-500 text-white " +"hover:from-purple-800 hover:to-purple-600 transition-all duration-200";

//     if (isAllowed === null) return null;
//     if (isAllowed === false)
//         return (
//             <div className="fixed bottom-6 right-6 z-[9999] text-sm text-red-600 bg-white p-3 rounded-xl shadow">
//                 <p className="text-gray-600 text-sm">
//                     This chat widget is not authorized for this domain.
//                 </p>
//                 <p className="text-gray-400 text-xs mt-2">
//                     Please contact your site administrator to enable access.
//                 </p>
//             </div>
//         );


//     return (

//         <div
//             ref={rootRef}
//             // Use minimal inline style here, as this is the Shadow Host element
//             style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 9999 }}
//         >
//             {/* The element below this will be moved into the Shadow Root */}
//             <div id="chat-ui-content">
//                 <div ref={popoverRef} >
//                     <button onClick={() => setIsOpen(!isOpen)}
//                         className="rounded-full shadow-xl flex items-center gap-2 px-4 py-2 bg-purple-600 bg-gradient-to-r from-purple-700 to-purple-500 text-white 
//            hover:from-purple-800 hover:to-purple-600 "
//                     // className="rounded-full shadow-xl flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-700 to-purple-500 text-white hover:from-purple-800 hover:to-purple-600 "
//                     // style={{
//                     //     borderRadius: "9999px",
//                     //     background: "linear-gradient(to right, #6b21a8, #9333ea)",
//                     //     color: "white",
//                     //     padding: "0.5rem 1rem",
//                     //     display: "flex",
//                     //     alignItems: "center",
//                     //     gap: "0.5rem",
//                     //     boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
//                     //     transition: "all 0.3s",
//                     // }}
//                     // onMouseEnter={(e) =>
//                     // (e.currentTarget.style.background =
//                     //     "linear-gradient(to right, #581c87, #7e22ce)")
//                     // }
//                     // onMouseLeave={(e) =>
//                     // (e.currentTarget.style.background =
//                     //     "linear-gradient(to right, #6b21a8, #9333ea)")
//                     // }
//                     >
//                         <Wanchain1 size="22" />
//                         <span className="font-semibold text-sm">Ask Hostie!</span>
//                     </button>

//                     {isOpen && (
//                         // <div className="absolute  bottom-full mb-3 right-0 w-85 p-0 shadow-2xl border border-gray-200 rounded-xl bg-white">
//                         //     {/* Place your chat content here */}
//                         //     <StandardUI apiKey={apiKey} openAi={openAi}/>
//                         // </div>

//                         // <div className="absolute fixed top-20  right-20 w-80 p-0 shadow-2xl border border-gray-200 rounded-xl bg-white">
//                         //     <StandardUI apiKey={apiKey} openAi={openAi} />
//                         // </div>



//                         <div
//                             className="absolute bottom-full mb-3 right-0 w-80 p-0 shadow-2xl border border-gray-200 transition-all duration-200 rounded-xl bg-white"
//                         // style={{
//                         //     position: "absolute",
//                         //     bottom: "100%",
//                         //     right: 0,
//                         //     marginBottom: "0.75rem",
//                         //     width: "320px",
//                         //     padding: 0,
//                         //     boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
//                         //     border: "1px solid #e5e7eb",
//                         //     borderRadius: "1rem",
//                         //     backgroundColor: "white",
//                         //     transition: "all 0.2s",
//                         //     zIndex: 1000,
//                         // }}
//                         //  className = {`
//                         //     absolute bottom-full mb-3 right-0 w-80 p-0 shadow-2xl border border-gray-200 rounded-xl bg-white

//                         //     // CORE TRANSITION CLASSES
//                         //     transition-all duration-300 ease-in-out transform origin-bottom-right

//                         //     // VISIBILITY CONTROL
//                         //     ${isOpen
//                         //         ? 'opacity-100 scale-100 translate-y-0 visible' // OPEN STATE
//                         //         : 'opacity-0 scale-95 translate-y-2 invisible' // CLOSED STATE (use invisible, not hidden)
//                         //     }
//                         // `}
//                         >
//                             <StandardUI apiKey={apiKey} openAi={openAi} />
//                         </div>




//                     )}
//                 </div>
//             </div>
//         </div >
//     )
// }

"use client";
import React, { useState, useRef, useEffect } from "react";
import { Wanchain1 } from "iconsax-react";
import { StandardUI } from "./StandardUI";
import { Bot } from "lucide-react";
import { ThemeProvider, useTheme } from "next-themes";



export function ChatUI({ apiKey, openAi }: { apiKey: string; openAi?: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
   

    const API_BASE_URL = "https://hostie-dashboard.vercel.app/api/clientCustomerChatBox";

    useEffect(() => {
        const verifyDomain = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/verifyDomain`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": apiKey,
                    },
                    body: JSON.stringify({ api_key: apiKey }),
                });

                if (!res.ok) return setIsAllowed(false);

                const data = await res.json();
                setIsAllowed(data.allowed ?? false);
            } catch {
                setIsAllowed(false);
            }
        };

        verifyDomain();
    }, [apiKey]);

    if (isAllowed === null) return null;

    if (isAllowed === false)
        return (
            <div className="fixed bottom-6 right-6 z-[9999] text-sm text-red-600 bg-white p-3 rounded-xl shadow">
                <p className="text-gray-600 text-sm">This chat widget is not authorized for this domain.</p>
                <p className="text-gray-400 text-xs mt-2">Please contact the admin.</p>
            </div>
        );

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            <div ref={popoverRef}>
                <button

                    onClick={() => setIsOpen(!isOpen)}
                    className="rounded-full shadow-xl flex items-center gap-2 px-4 py-2 bg-purple-600 bg-gradient-to-r from-purple-700 to-purple-500 text-white hover:from-purple-800 hover:to-purple-600"
                >
                    <Bot strokeWidth={1.75} size={22} />
                    <span className="font-semibold text-sm">Ask Hostie15</span>
                </button>

                {isOpen && (
                    <div
                        className="absolute bottom-full mb-3 right-0 w-80 p-0 shadow-2xl rounded-xl transition-all duration-200">
                        <StandardUI apiKey={apiKey}  />
                    </div>
                )}
            </div>

        </div>
    );
}
