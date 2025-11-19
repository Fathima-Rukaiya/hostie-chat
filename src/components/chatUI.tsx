"use client";
import React, { useState, useRef, useEffect } from "react";
import { Wanchain1 } from "iconsax-react";
import { StandardUI } from "./StandardUI";
import { Bot } from "lucide-react";
import { ThemeProvider, useTheme } from "next-themes";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";



export function ChatUI({ apiKey,
    shadowContainer,
}: {
    apiKey: string;
    shadowContainer?: React.RefObject<HTMLDivElement | null>;
}) {
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
        // <ThemeProvider
        //     attribute="class"
        //     defaultTheme="system"
        //     enableSystem
        // >
        <div className="fixed bottom-6 right-6 z-[9999]">
            {/* <div ref={popoverRef}> */}

            <div ref={popoverRef} className="relative">

                <button

                    onClick={() => setIsOpen(!isOpen)}
                    className="rounded-full shadow-xl flex items-center gap-2 px-4 py-2 bg-purple-600 bg-gradient-to-r from-purple-700 to-purple-500 text-white hover:from-purple-800 hover:to-purple-600"
                >
                    <Bot strokeWidth={1.75} size={22} />
                    <span className="font-semibold text-sm">Ask Hostie14</span>
                </button>

                {isOpen && (
                    <div
                        className="absolute bottom-full mb-3 right-0 w-80 p-0 shadow-2xl rounded-xl transition-all duration-200">
                        <StandardUI apiKey={apiKey} shadowContainer={shadowContainer} />
                    </div>
                )}
            </div>

        
            {/* </ThemeProvider> */}
        </div>

    );
}
