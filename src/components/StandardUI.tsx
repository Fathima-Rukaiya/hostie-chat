"use client";

import { useState, useEffect, useRef } from "react";
import { Bot, FileText, Plus, SendHorizonal, UserRound } from "lucide-react";
import { ThemeProvider, useTheme } from "next-themes";
//import {  Wanchain } from "iconsax-react";

type ChatMessage = {
  sender: "user" | "bot";
  text: string;
  status?: "sent" | "delivered" | "read";
  timestamps?: {
    sent?: string;
    delivered?: string;
    read?: string;
    received?: string;
  };
  isTyping?: boolean;
  uploaded_documents?: any;
};
export function ChatUIWrapper({ apiKey }: { apiKey: string }) {
  return (
    <ThemeProvider 
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      >
      <StandardUI apiKey={apiKey} />
    </ThemeProvider>
  );
}
//export function StandardUI({ apiKey }: { apiKey: string }) {
export function StandardUI({
  apiKey }: {
    apiKey: string;

  }) {



  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [guestId, setGuestId] = useState("");
  const [senderId, setSenderId] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [roomName, setRoomName] = useState<string | null>(null);
  //const [aiPaused, setAiPaused] = useState(false)

  const [aiPaused, setAiPaused] = useState(() => {
    const saved = sessionStorage.getItem("aiPaused");
    return saved === "true"; // restore previous state
  });


  const [userInfo, setUserInfo] = useState<{ name?: string; email?: string } | null>(null);
  const [askedForInfo, setAskedForInfo] = useState(false);
  const [showChat, setShowChat] = useState(true);

  useEffect(() => {
    sessionStorage.setItem("aiPaused", aiPaused.toString());
  }, [aiPaused]);

  const { theme } = useTheme();
  useEffect(() => {
    console.log(theme);
  }, [theme]);
  //
  //https://hostingate-client.vercel.app/sign-in
  const API_BASE_URL = "https://hostie-dashboard.vercel.app/api/clientCustomerChatBox";

  //const API_BASE_URL = "http://localhost:3000/api/clientCustomerChatBox";
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  useEffect(() => {
    const setupRoom = async () => {
      try {
        const guestContactId = sessionStorage.getItem("guestContactId");

        const savedRoom = sessionStorage.getItem("room");
        const savedGuestId = sessionStorage.getItem("guestContactId");

        //  console.log("storage data room :", savedRoom, " guestID ", savedGuestId)
        if (guestContactId) {
          // Existing guest → fetch their permanent room from DB
          setGuestId(guestContactId);
          setSenderId(guestContactId);

          const res = await fetch(`${API_BASE_URL}/getGuestRoom?guest_id=${guestContactId}`, {
            headers: { "x-api-key": apiKey },
          })
          const data = await res.json();
          setRoomName(data.room_id); // set room from DB
        } else {
          // New guest → create temporary room until they provide info
          const newRoomId = crypto.randomUUID();
          setRoomName(newRoomId);
          setIsGuest(true);
          setSenderId(null); // unknown guest until info provided
        }
      } catch (err) {
        console.error("Error setting up room:", err);
      }
    };

    setupRoom();
  }, []);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!roomName) return;
      if (!guestId) return;

      try {
        const res = await fetch(`${API_BASE_URL}/getChatHistory?room_id=${roomName}`, {
          headers: { "x-api-key": apiKey },
        });
        const result = await res.json();


        if (!res.ok) {
          console.error("Failed to fetch chat history:", result.error);
          return;
        }

        const data = result.data || [];
        const formattedHistory: ChatMessage[] = data
          .filter((msg: any) => !msg.resolved && !msg.deleted)
          .map((msg: any) => ({
            sender: msg.sender_id || msg.guest_sender_id ? "user" : "bot",
            // sender:
            //   msg.sender_id || msg.guest_sender_id
            //     ? "user"
            //     : msg.is_admin
            //       ? "bot"
            //       : "bot",

            text: msg.message,

            uploaded_documents: msg.uploaded_documents || null,
            timestamps: {
              sent: msg.sender_id || msg.guest_sender_id
                ? new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : undefined,
              received: !msg.sender_id && !msg.guest_sender_id
                ? new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : undefined,
            },
          }));

        setChatHistory(formattedHistory);
      } catch (err) {
        console.error("Unexpected error fetching chat history:", err);
      }
    };

    fetchChatHistory();
  }, [roomName]);

  // useEffect(() => {
  //   const checkResolved = async () => {
  //     if (!roomName) return;

  //     const res = await fetch(`${API_BASE_URL}/checkResolved`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ room_id: roomName }),
  //     });

  //     const data = await res.json();

  //     if (data.resolved) {
  //       setAiPaused(true);

  //     } else {
  //       setAiPaused(false);

  //     }
  //   };

  //   checkResolved();
  // }, [roomName]);




  //ssseee

  useEffect(() => {
    if (!roomName) return;

    const eventSource = new EventSource(`${API_BASE_URL}/stream?room=${roomName}&api_key=${apiKey}`);

    eventSource.onmessage = (event) => {
      //  Ignore keep-alive or connection messages
      if (event.data === "ping" || event.data === "connected") return;

      try {
        const newMsg = JSON.parse(event.data);

        // Ignore invalid payloads
        if (!newMsg || !newMsg.message) return;

        if (newMsg.deleted) return;
        const msgText = newMsg.message.trim();

        //1 System: Pause AI
        if (msgText === "You are now connected to a live agent. AI responses are paused.") {
          setAiPaused(true);
          addBotMessage(msgText);
          return; // admin message already sent, don’t add again
        }

        // 2 System: Resume AI
        if (msgText === "AI responses resumed.") {
          setAiPaused(false);
          addBotMessage(msgText);
          return;
        }

        // 3 Normal message
        setChatHistory((prev) => [
          ...prev,
          {
            sender:
              newMsg.sender_id || newMsg.guest_sender_id
                ? "user"
                : "bot",
            //sender: newMsg.sender as "user" | "bot",
            text: newMsg.message,

            timestamps: {
              received: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              //new Date().toISOString() 
            },
          },
        ]);
      } catch (err) {
        console.error("SSE parse error:", err);
      }
    };


    eventSource.onerror = (err) => {
      console.error("SSE connection error:", err);
      eventSource.close();
    };

    return () => eventSource.close();
  }, [roomName]);





  const saveGuestContact = async (guestData: { name?: string; email?: string, room_id: string }) => {
    const res = await fetch(`${API_BASE_URL}/saveContact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey
      },
      body: JSON.stringify(guestData),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to save contact: ${res.status} ${text}`);
    }

    const data = await res.json();
    //  console.log("Contact saved:", data);
    return data;
  };

  //save normal msg 
  const saveUserMessage = async (messageText: string, skipAI: boolean) => {
    const res = await fetch(`${API_BASE_URL}/saveMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        prompt: messageText,
        room_id: roomName,
        sender_id: senderId,
        receiver_id: aiPaused ? "live_agent" : "ai",
        skipAI: skipAI,
      }),
    });
    return res.json(); // { reply: "AI response" }
  };

  //to save contactinfo as a message done
  const saveUserMessageWithSender = async (messageText: string, skipAI: boolean, sender: string) => {
    const res = await fetch(`${API_BASE_URL}/saveMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        prompt: messageText,
        room_id: roomName,
        sender_id: sender,
        receiver_id: aiPaused ? "live_agent" : "ai",
        skipAI,
      }),
    });

    return res.json();
  };

  const saveBotMessage = async (text: string, receiverId: string | null, api_key: string) => {
    await fetch(`${API_BASE_URL}/saveAiMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": api_key,
      },
      body: JSON.stringify({ room_id: roomName, message: text, receiver_id: receiverId }),
    });
  };

  const addBotMessage = (text: string) => {
    setChatHistory((prev) => [
      ...prev,
      {
        sender: "bot",
        text,
        timestamps: {
          received: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          //new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          ,
        },
      },
    ]);
  };

  const addUserMessage = (text: string) => {
    setChatHistory((prev) => [
      ...prev,
      {
        sender: "user",
        text,
        timestamps: { sent: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
        //new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
      },
    ]);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const messageText = message.trim();
    setMessage("");

    // Add user's message immediately to UI
    //addUserMessage(messageText);

    //  Guest without info → ask info only
    if (isGuest && !userInfo && !askedForInfo) {
      addUserMessage(messageText);
      setAskedForInfo(true);
      const askMsg = "Before we continue, could you please share your name or email?";
      //addBotMessage(askMsg);
      await saveBotMessage(askMsg, senderId, apiKey,);
      return; // Don't save user message yet
    }

    // Guest just gave info → save contact & thank
    if (askedForInfo && !userInfo) {
      if (roomName) {
        const guestData = message.includes("@")
          ? { email: message, room_id: roomName }
          : { name: message, room_id: roomName };
        try {
          const savedGuest = await saveGuestContact(guestData);
          sessionStorage.setItem("guestContactId", savedGuest.id);
          setGuestId(savedGuest.id);
          setSenderId(savedGuest.id);
          setUserInfo({ name: savedGuest.name, email: savedGuest.email });

          sessionStorage.setItem("room", savedGuest.room_id);
          setRoomName(savedGuest.room_id);
          sessionStorage.setItem("guestContactId", savedGuest.id)

          //  await saveUserMessage(message, true);
          await saveUserMessageWithSender(message, true, savedGuest.id);


          const thankMsg = `Thanks ${savedGuest.name || savedGuest.email}! You can continue chatting now..!`;
          // addBotMessage(thankMsg);
          await saveBotMessage(thankMsg, savedGuest.id, apiKey);


        } catch (err) {
          console.error("Error saving guest info:", err);
        }
        return;
      } else {
        console.log("no room name there....")
      }


    }

    //  Guest/user already has info → save user message & get AI reply
    if (!aiPaused) {
      try {
        const aiResp = await saveUserMessage(messageText, false);
        const reply = aiResp.reply || "Sorry, I couldn't generate a reply.";

      } catch (err) {
        console.error("AI call failed:", err);

      }
    } else {
      console.log("AI response paused due to live agent assignment.");

      const aiResp = await saveUserMessage(messageText, true);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!roomName || !senderId) {
      alert("provide your details First..!")
      return;

    }
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
      // "video/mp4",
    ];

    if (!allowedTypes.includes(file.type)) {
      const detectedType = file.type || file.name.split(".").pop();
      alert(`❌ Unsupported file type: ${detectedType}`);
      return;
    }

    // Step 2: Validate file size
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      alert(`❌ File too large! (${(file.size / 1024 / 1024).toFixed(1)} MB > 50 MB limit)`);
      return;
    }


    const formData = new FormData();
    formData.append("file", file);
    formData.append("room_id", roomName);
    formData.append("sender_id", senderId);

    try {
      const res = await fetch(`${API_BASE_URL}/uploadFile`, {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        //  Show backend error message to user
        alert("File upload failed. Please try again.");
        console.error("Upload error:", data.error);
        return;
      }
      //if (!data.fileUrl) throw new Error("Upload failed");
      if (!data.fileUrl) {
        alert("Unexpected error: no file URL returned.");
        return;
      }
      // Add file message to chat UI immediately
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "user",
          text: file.name,
          uploaded_documents: data.fileUrl,
          timestamps: { sent: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
        },
      ]);
    } catch (err) {
      console.error("File upload failed:", err);

      alert("Something went wrong while uploading. Please try again.");
    }
  };

  if (!showChat) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${theme}`}>
      <div
        id="hostie-chat-box"
        className={`flex flex-col w-[340px] h-[85vh] rounded-2xl shadow-xl border border-zinc-200  overflow-hidden  transition-colors duration-300 ${theme === "dark" ? "bg-gray-900 border-neutral-700" : "bg-white border-zinc-200"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-zinc-200 dark:border-neutral-700 ">
          <div className="flex items-center gap-2">
            <Bot strokeWidth={1.75} className="text-purple-600" />
            <span className="font-semibold text-sm">Hostie</span>
            <span className="ml-1 h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs text-green-500">Online</span>
          </div>
          <div className="flex items-center px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-800">
            <Bot size={12} className="text-zinc-600 dark:text-zinc-200" />
            <span className="ml-1 text-xs font-medium">AI</span>
          </div>
          <div className="flex items-center px-1 py-0.5 rounded-md bg-purple-50 dark:bg-purple-800">

            <span className="ml-1 text-xs font-medium"><button
              onClick={() => setShowChat(false)}
              className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-300 dark:hover:text-white"
            >
              ✕
            </button>
            </span>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 ">
          {chatHistory.length === 0 && (
            <div className="mt-10 flex flex-col items-center justify-center text-center">
              <Bot strokeWidth={1.75}
                size={60}
                className="text-purple-600 dark:text-purple-600 mb-2"

              />
              <div className="text-lg font-bold text-purple-600">
                Hello, there...! 👋
              </div>
              <div className="mt-1 font-semibold text-gray-500 dark:text-gray-400 text-sm">
                How can I help you today?
              </div>
            </div>
          )}

          {chatHistory.map((msg, i) => (
            <div
              key={i}
              className={`flex items-end gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
            >
              {msg.sender === "bot" && (
                <div className="flex items-end relative">
                  <Bot strokeWidth={1.75}
                    className="h-[31px] w-[31px] text-purple-600 dark:text-purple-600 border border-purple-600 rounded-full p-1"

                  />
                </div>
              )}

              <div
                className={`px-3 py-2 rounded-2xl max-w-[75%] text-sm shadow-sm break-words ${msg.sender === "user"
                  ? "bg-purple-600 text-white rounded-br-none"
                  : "bg-gray-200 dark:bg-neutral-600 text-gray-800 dark:text-white rounded-bl-none"
                  }`}
              >
                {msg.isTyping ? (
                  <div className="flex gap-1 px-1.5">
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce delay-200" />
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce delay-400" />
                  </div>
                ) : (
                  // <span>{msg.text}</span>
                  <div>
                    {msg.text && <span>{msg.text}</span>}

                    {msg.uploaded_documents && (
                      <div className="mt-2">
                        {/\.(jpg|jpeg|png|gif)$/i.test(msg.uploaded_documents) ? (
                          <a
                            href={msg.uploaded_documents}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-200 text-xs"
                          >
                            <img
                              src={msg.uploaded_documents}
                              alt="Uploaded"
                              width={180}
                              height={120}
                              className="rounded-lg border border-zinc-200 dark:border-neutral-700"
                            />
                          </a>
                        ) :
                          /\.(mp3|wav|ogg)$/i.test(msg.uploaded_documents) || msg.uploaded_documents.includes("audio") ? (

                            <audio controls className="mt-1 w-full">
                              <source src={msg.uploaded_documents} />

                            </audio>
                          ) : (
                            <a
                              href={msg.uploaded_documents}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-200"
                            >
                              <div className="flex gap-2"> <FileText size={20} />View Document</div>

                            </a>
                          )}
                      </div>
                    )}


                  </div>


                )}
                {/* time stamp */}

                {msg.sender === "user" && (
                  <span className="ml-1 text-[10px] opacity-70 bottom-1 right-2 whitespace-nowrap">
                    {msg.timestamps?.sent || msg.timestamps?.received || "Just now"}
                  </span>
                )}
                {msg.sender === "bot" && msg.timestamps?.received && (
                  <span className="ml-1 text-[10px] opacity-70 bottom-1 right-2 whitespace-nowrap">
                    {msg.timestamps.received}
                  </span>
                )}




              </div>

              {msg.sender === "user" && (
                // <div className="flex-shrink-0 relative">
                //   <img
                //     src="../chat.jpg"
                //     alt="user"
                //     className="h-[30px] w-[30px] rounded-full object-cover"
                //   />
                // </div>
                <div className="flex-shrink-0 relative flex items-center justify-center bg-purple-600  rounded-full h-[30px] w-[30px]">
                  <UserRound size="18" className="text-gray-200" />
                </div>
              )}
            </div>
          ))}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="flex items-center border-t border-zinc-200 dark:border-neutral-700 p-3 ">
          <input
            type="file"
            id="hostieFileInput"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />

          <button
            onClick={() => document.getElementById("hostieFileInput")?.click()}
            className="flex items-center justify-center h-9 w-9 rounded-full border border-zinc-200 dark:border-neutral-700 text-zinc-500 dark:text-zinc-400 mr-2"
          >
            <Plus className="w-4 h-4" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask your question"
            className="flex-1 outline-none border border-zinc-200 dark:border-neutral-700 rounded-full px-3 py-2 text-sm focus:ring-1 focus:ring-purple-600"
          />
          <button
            onClick={sendMessage}
            className="flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white ml-2"
          >
            <SendHorizonal className="w-4 h-4" />
          </button>
        </div>

        <div className="text-center text-xs text-zinc-400 py-2">
          Hostie may produce inaccurate information
        </div>
      </div>
    </div>
  );
}
