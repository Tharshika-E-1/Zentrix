import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import Message from './Message'
import toast from 'react-hot-toast'
import { SendHorizontal } from "lucide-react";
import { Mic } from "lucide-react";
import { FileDown, MoreVertical } from "lucide-react";
import exportChatPDF from "../utils/exportChatPDF";
import { Eraser } from "lucide-react";
import { Pin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Settings, LayoutDashboard, LogOut, CircleUser,  } from "lucide-react";
import { Paperclip } from "lucide-react";
import { uploadPDF, askPDF } from "../services/ragService";



const ChatBox = () => {
  const navigate = useNavigate();
    const containerRef=useRef(null)
    const menuRef = useRef(null);
    const settingsRef = useRef(null);
    const fileInputRef = useRef(null);

    const {
  selectedChat,
  setSelectedChat,
  theme,
  user,
  axios,
  token,
  setUser,
  setToken,
} = useAppContext();

    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [showSettings, setShowSettings] = useState(false);

    const [prompt, setPrompt] = useState('')
    const [uploadedPDF, setUploadedPDF] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [mode, setMode] = useState('text')
    const [isPublished, setIsPublished] = useState(false)
    const recognitionRef = useRef(null);
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [showMenu, setShowMenu] = useState(false);
    const [shareUrl, setShareUrl] = useState("");
    const [showShareModal, setShowShareModal] = useState(false);
    const shareChat = async () => {

    try {

        const { data } = await axios.post(
            "/api/share",
            {
              
                chatId: selectedChat?._id,
                messages,
            },
            {
                headers: {
                    Authorization: token,
                },
            }
        );

        if (data.success) {
    setShareUrl(data.shareUrl);
    setShowShareModal(true);
    setShowMenu(false);
} else {
    toast.error(data.message);
}

    } catch (error) {

        console.log(error);

    }

};
const { fetchUserChats } = useAppContext();

const pinChat = async () => {
  try {

    const { data } = await axios.post(
      "/api/chat/pin",
      {
        chatId: selectedChat?._id,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (data.success) {
      toast.success(data.message);

      fetchUserChats();

      setShowMenu(false);
    } else {
      toast.error(data.message);
    }

  } catch (error) {
    toast.error(error.message);
  }
};

const clearChat = async () => {
  if (!selectedChat) return;

  const confirmClear = window.confirm(
    "Clear all messages in this chat?"
  );

  if (!confirmClear) return;

  try {
    const { data } = await axios.post(
      "/api/chat/clear",
      {
        chatId: selectedChat?._id,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (data.success) {
  toast.success("Chat cleared");

  // Clear messages immediately
  setMessages([]);

  // Update selected chat
  setSelectedChat(prev => ({
    ...prev,
    messages: [],
  }));

  // Refresh sidebar
  await fetchUserChats();

  setShowMenu(false);
}

  } catch (error) {
    toast.error(error.message);
  }
};
    useEffect(() => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition) {
    recognitionRef.current = new SpeechRecognition();
  }
}, []);
  const startListening = () => {
  const recognition = recognitionRef.current;

  if (!recognition) {
    toast.error("Speech recognition not supported");
    return;
  }

  // If already listening, stop it
  if (isListening) {
    stopListening();
    return;
  }

  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  setIsListening(true);

  recognition.start();

  recognition.onresult = (event) => {
  let transcript = "";

  for (let i = event.resultIndex; i < event.results.length; i++) {
    transcript += event.results[i][0].transcript;
  }

  setPrompt(transcript);
};
    
  recognition.onend = () => {
    setIsListening(false);
  };

  recognition.onerror = () => {
    setIsListening(false);
  };
};
const stopListening = () => {
  const recognition = recognitionRef.current;

  if (recognition) {
    recognition.stop();
  }

  setIsListening(false);
};
const handlePDFUpload = async (e) => {
  try {

    const file = e.target.files[0];

    if (!file) return;

    // IMAGE
    if (file.type.startsWith("image/")) {

      if (mode !== "vision") {
        toast.error("Switch to Image Analyzer mode first.");
        return;
      }

      setUploadedImage(file);
      toast.success("Image Selected");
      return;
    }

    // PDF
    if (file.type === "application/pdf") {

      if (mode === "vision") {
        toast.error("Please upload an image.");
        return;
      }

      await uploadPDF(file);

      setUploadedPDF(file);

      toast.success("PDF Uploaded Successfully");
    }

  } catch (error) {
    toast.error("Upload Failed");
  }
};
    const onSubmit = async (e) => {
      
        try {
  e.preventDefault();

  if (!user) return toast("Login to send message");

  setLoading(true);
  if (mode === "website" && !websiteUrl) {
  toast.error("Please enter a website URL");
  setLoading(false);
  return;
}

  const promptCopy = prompt;
const websiteUrlCopy = websiteUrl;
const currentPDF = uploadedPDF;

if (mode === "website" && !websiteUrlCopy.startsWith("http")) {
  toast.error("Please enter a valid URL");
  setLoading(false);
  return;
}

setPrompt("");

if (mode === "website") {
    setWebsiteUrl("");
}
if (currentPDF) {
    setUploadedPDF(null);
}


if (uploadedImage) {

  const tempUserMessage = {
    role: "user",
    content: promptCopy,
    image: URL.createObjectURL(uploadedImage),
    isVision: true,
    timestamp: Date.now(),
  };

  // Show instantly
  setMessages(prev => [...prev, tempUserMessage]);

  const formData = new FormData();
  formData.append("image", uploadedImage);
  formData.append("prompt", promptCopy);
  if (!selectedChat) {
  toast.error("No chat selected");
  setLoading(false);
  return;
}

formData.append("chatId", selectedChat._id);

  // remove bottom preview
  setUploadedImage(null);

  const { data } = await axios.post(
    "/api/vision/chat",
    formData,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  if (data.success) {

    // ONLY assistant
    if (!data.assistantMessage) {
  console.error("assistantMessage is missing");
  console.log(data);
  return;
}

setMessages(prev => [
  ...prev,
  data.assistantMessage,
]);

    setUser(prev => ({
      ...prev,
      credits: prev.credits - 1,
    }));

  } else {
    toast.error(data.message);
  }

  setLoading(false);
  return;
}

// If a PDF is uploaded, use RAG
if (uploadedPDF) {

    setMessages(prev => [
        ...prev,
        {
            role: "user",
            content: promptCopy,
            pdfName: currentPDF.name,
            timestamp: Date.now(),
        }
    ]);

}
else if (mode === "website") {

    setMessages(prev => [
        ...prev,
        {
            role: "user",
            website: websiteUrlCopy,
            content: promptCopy,
            timestamp: Date.now(),
        }
    ]);

}
else {

    setMessages(prev => [
        ...prev,
        {
            role: "user",
            content: promptCopy,
            timestamp: Date.now(),
        }
    ]);

}

  let endpoint = `/api/message/${mode}`;

let body = {
  chatId: selectedChat?._id,
  prompt: promptCopy,
  isPublished,
  isPDF: currentPDF ? true : false,
  pdfName: currentPDF?.name || "",
};

if (mode === "website") {
  console.log("selectedChat:", selectedChat);
console.log("selectedChat._id:", selectedChat?._id);
  endpoint = "/api/website/chat";

  body = {
  chatId: selectedChat?._id,
  url: websiteUrlCopy,
  question: promptCopy,
};
console.log("Website body:", body);
}
console.log("Mode:", mode);
console.log("Endpoint:", endpoint);
console.log("Body:", body);


console.log("selectedChat:", selectedChat);
console.log("selectedChat._id:", selectedChat?._id);
console.log("Request body:", body);

const { data } = await axios.post(endpoint, body, {
  headers: {
    Authorization: token,
  },
});

  if (data.success) {

  console.log("Website reply:", data.reply);

  if (mode === "website") {
    setMessages(prev => [
  ...prev,
  data.assistantMessage,
]);
    
  } else {
    setMessages(prev => [...prev, data.reply]);
  }
  
  // decrease credits
  if (mode === "image") {
    setUser(prev => ({
      ...prev,
      credits: prev.credits - 2,
    }));
  } else {
    setUser(prev => ({
      ...prev,
      credits: prev.credits - 1,
    }));
  }

} else {
  toast.error(data.message);
  setPrompt(promptCopy);
}
  
} catch (error) {
    toast.error(error.message);
  
}finally {
  setPrompt('');
  setLoading(false);
    }
}

   useEffect(() => {
  if (selectedChat) {
    setMessages(selectedChat.messages || []);
  } else {
    setMessages([]);
  }
}, [selectedChat]);

    useEffect(()=>{
        if(containerRef.current){
            containerRef.current.scrollTo({
                top : containerRef.current.scrollHeight,
                behavior : "smooth",
            })
            
        }
    },[messages])
    useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target)
    ) {
      setShowMenu(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };
}, []);
useEffect(() => {
  const handleClickOutsideSettings = (event) => {
    if (
      settingsRef.current &&
      !settingsRef.current.contains(event.target)
    ) {
      setShowSettings(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutsideSettings);

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutsideSettings
    );
  };
}, []);

  return (
    <div className='flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30
    max-md:mt-14 2xl:pr-40'>
      <div
  ref={menuRef}
  className="fixed top-6 right-8 z-40 flex items-center gap-3"
>
 

{/* Three Dots */}
<button
  onClick={() => setShowMenu(!showMenu)}
  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
>
  <MoreVertical size={22} />
</button>
 {/* Settings */}
<div ref={settingsRef} className="relative">
  <button
    onClick={() => setShowSettings(!showSettings)}
    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
  >
    <Settings size={18} />
    <span className="text-sm font-semibold">Settings</span>
  </button>

  {showSettings && (
  <div className="absolute right-0 top-12 w-56 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-50">

    <button
      onClick={() => {
        navigate("/account");
        setShowSettings(false);
      }}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition font-semibold"
    >
      <CircleUser size={18} />
      Account
    </button>

    <button
      onClick={() => {
        navigate("/dashboard");
        setShowSettings(false);
      }}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition font-semibold"
    >
      <LayoutDashboard size={18} />
      Dashboard
    </button>
    <button
  onClick={() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setShowSettings(false);
    navigate("/");
    toast.success("Logged out successfully");
  }}
  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition font-semibold"
>
  <LogOut size={18} />
  Logout
</button>

  </div>
)}
</div>

  {showMenu && (
    <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-50">
      

      <button
  onClick={() => {
    exportChatPDF(messages);
    setShowMenu(false);
  }}
  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
>
  <FileDown size={18} />
  <span>Export as PDF</span>
</button>
<button
  onClick={shareChat}
  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
>
  🔗 Share
</button>
<button
  onClick={pinChat}
  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
>
  <Pin size={18} />

  <span>
    {selectedChat?.isPinned ? "Unpin Chat" : "Pin Chat"}
  </span>
</button>
<button
  onClick={clearChat}
  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
>
  <Eraser size={18} />
  <span>Clear Chat</span>
</button>

    </div>
    
  )}
</div>


        {/* Chat Messages */}
        <div ref={containerRef} className='flex-1 mb-5 overflow-y-scroll'>
            {messages.length === 0 && (
                <div className='h-full flex flex-col items-center justify-center gap-2'>
                    <div className="flex items-center gap-4">
    <img
        src={assets.logo}
        alt="Zentrix"
        className="w-18 h-18"
    />

    <div>
        <h1 className="text-5xl font-bold text-black-600 dark:text-white-400">
            Zentrix
        </h1>

        <p className="text-xl text-black-500 font-semibold">
            Intelligent AI Assistant
        </p>
    </div>
</div>
                    <p className='mt-5 text-2xl sm:text-3xl text-center text-gray-400 dark:text-white'>How can I help you today?</p>
                    </div>
            )}
            
            {messages.map((message, index) => {
  console.log(index, message);

  if (!message) {
    console.error("Undefined message at index", index);
    return null;
  }
  console.log("messages =", messages);

  return (
    <Message
      key={message?._id || index}
      message={message}
    />
  );
})}

            
            

            {/* Three Dots Loading */}
            {
                loading && <div className='loader flex items-center gap-1.5'>
                    <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
                    <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
                    <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
                    </div>
            }
            
        </div>
        {mode === 'image' && (
            <label className="inline-flex items-center gap-2 mb-3 text-sm mx-auto">
                <p className="text-xs">Publish Generated Image to Community</p>
                <input type="checkbox" className="cursor-pointer" checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}/>
                </label>
            )}

        {/* Prompt Input Box */}
        <form
  id="chat-form"
  onSubmit={onSubmit}
  className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center shadow-sm"
>
  <input
    ref={fileInputRef}
    type="file"
    accept=".pdf,image/*"
    hidden
    onChange={handlePDFUpload}
/>
<button
    type="button"
    onClick={() => fileInputRef.current.click()}
>
    <Paperclip size={20} />
</button>
            <select onChange={(e)=>setMode(e.target.value)} value={mode} className='text-sm pl-3 pr-2 outline-none'>
                <option value="text">Text</option>
<option value="image">Image</option>
<option value="vision">Vision</option>
<option value="website">Website</option>


                
            </select>
            
            
            {mode === "website" && (
  <input
    type="text"
    placeholder="Paste website URL"
    value={websiteUrl}
    onChange={(e) => setWebsiteUrl(e.target.value)}
    className="flex-1 w-full text-sm outline-none border border-gray-300 rounded-lg px-3 py-2"
    required
  />
)}
<input
  onChange={(e) => setPrompt(e.target.value)}
  value={prompt}
  type="text"
  placeholder={
  mode === "website"
    ? "Ask a question"
    : mode === "vision"
    ? "Ask about the image..."
    : "Type your prompt here..."
}
  className="flex-1 w-full text-sm outline-none"
  required
/>
            <button
  type="button"
  onClick={startListening}
  className={`relative transition ${
    isListening
      ? "text-red-500 animate-pulse"
      : "hover:text-blue-600"
  }`}
>
  {isListening ? (
  <span className="text-lg font-bold">■</span>
) : (
  <Mic size={22} />
)}
</button>
            <button
  type="submit"
  disabled={loading}
  className="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-900 transition"
>
  <SendHorizontal size={18} color="white" />
</button>

        </form>
        {uploadedPDF && (
  <div className="max-w-2xl mx-auto mt-3 mb-2">
    <div className="inline-flex items-center gap-3 px-4 py-3 bg-gray-100 dark:bg-[#1F1F1F] border border-gray-300 dark:border-gray-700 rounded-xl">
      <span className="text-xl">📄</span>

      <div className="flex flex-col">
        <span className="font-medium text-sm">
          {uploadedPDF.name}
        </span>

        <span className="text-xs text-gray-500">
          {(uploadedPDF.size / 1024).toFixed(1)} KB
        </span>
      </div>

      <button
        onClick={() => setUploadedPDF(null)}
        className="ml-3 text-gray-500 hover:text-red-500 text-lg"
      >
        ✕
      </button>
    </div>
  </div>
)}
{uploadedImage && (
  <div className="max-w-2xl mx-auto mt-3 mb-2">
    <div className="inline-flex items-center gap-3 px-4 py-3 bg-gray-100 dark:bg-[#1F1F1F] border border-gray-300 dark:border-gray-700 rounded-xl">

      <img
        src={URL.createObjectURL(uploadedImage)}
        alt=""
        className="w-16 h-16 rounded-lg object-cover"
      />

      <div className="flex flex-col">
        <span className="font-medium text-sm">
          {uploadedImage.name}
        </span>

        <span className="text-xs text-gray-500">
          {(uploadedImage.size / 1024).toFixed(1)} KB
        </span>
      </div>

      <button
        onClick={() => setUploadedImage(null)}
        className="ml-3 text-red-500"
      >
        ✕
      </button>

    </div>
  </div>
)}
        
        {isListening && (
  <div className="flex justify-center mt-3">
    <div className="px-4 py-2 rounded-full bg-black-100 text-black-600 font-medium animate-pulse">
      🎤 Listening...
    </div>
  </div>
)}
{showShareModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-[450px] shadow-xl">

      <h2 className="text-xl font-bold mb-4">
        Share Chat
      </h2>

      <a
  href={shareUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="block w-full border rounded-lg p-3 text-blue-600 underline break-all hover:text-blue-800"
>
  {shareUrl}
</a>

      <div className="flex justify-end gap-3 mt-5">

        <button
          onClick={() => setShowShareModal(false)}
          className="px-4 py-2 border rounded-lg"
        >
          Close
        </button>

        <button
  onClick={() => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied!");
    setShowShareModal(false);
  }}
  className="px-4 py-2 bg-black text-white rounded-lg"
>
  Copy Link
</button>

      </div>

    </div>
  </div>
)}
    </div>
  )
}

export default ChatBox
