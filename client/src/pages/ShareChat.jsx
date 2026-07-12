import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import exportChatPDF from "../utils/exportChatPDF";
import { Copy, Check, FileDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import "highlight.js/styles/atom-one-dark.css";

const ShareChat = () => {
  const { id } = useParams();
  const location = useLocation();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState(null);
  useEffect(() => {
    console.log("ShareChat mounted:", location.pathname);

    return () => {
      console.log("ShareChat unmounted");
    };
  }, [location.pathname]);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const { data } = await axios.get(`/api/share/${id}`);

        if (data.success) {
          setMessages(data.messages);
        }
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    };

    fetchChat();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">

  <h1 className="text-4xl font-bold">
    Zentrix Chat
  </h1>

  <button
    onClick={() => exportChatPDF(messages)}
    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
  >
    <FileDown size={18} />
    Export as PDF
  </button>

</div>

      {messages.map((message, index) => (
        <div
  key={index}
  className="mb-6 border rounded-xl p-5 relative"
>
          <h2 className="font-bold mb-3">
            {message.role === "assistant" && (
  <button
  onClick={() => {
    navigator.clipboard.writeText(message.content);

    setCopiedIndex(index);

    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  }}
  className="absolute top-4 right-4 flex items-center gap-2 text-sm px-3 py-1 border rounded-lg hover:bg-gray-100 transition"
>
  {copiedIndex === index ? (
    <>
      <Check size={16} />
      Copied
    </>
  ) : (
    <>
      <Copy size={16} />
      Copy
    </>
  )}
</button>
)}
            {message.role === "user" ? "USER" : "AI RESPONSE"}
          </h2>

          {message.website && (
            <p className="text-blue-600 mb-2">
              Website: {message.website}
            </p>
          )}

          {message.isImage ? (
            <img
              src={message.content}
              alt=""
              className="rounded-lg max-w-sm"
            />
          ) : (
            <ReactMarkdown
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[rehypeHighlight]}
>
  {message.content}
</ReactMarkdown>
          )}
        </div>
      ))}
    </div>
  );
};

export default ShareChat;