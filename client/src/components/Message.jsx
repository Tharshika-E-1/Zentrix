import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import moment from 'moment'
import Markdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  User,
  Volume2,
  AudioLines,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";


const Message = ({message}) => {
  const { axios, token } = useAppContext();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
const [liked, setLiked] = useState(false);
const [disliked, setDisliked] = useState(false);
  const speakMessage = () => {
  if (isSpeaking) {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    return;
  }
  
  window.speechSynthesis.cancel();

  // Remove markdown & code before speaking
  const cleanText = (message.content || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`/g, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/#{1,6}\s/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/_/g, "")
    .replace(/\n/g, " ");

  const speech = new SpeechSynthesisUtterance(cleanText);

  const voices = window.speechSynthesis.getVoices();

  const femaleVoice =
    voices.find(v => v.name.includes("Jenny")) ||
    voices.find(v => v.name.includes("Zira")) ||
    voices.find(v => v.name.includes("Sonia")) ||
    voices.find(v => v.name.includes("Aria")) ||
    voices.find(v => v.name.includes("Google UK English Female")) ||
    voices.find(v => v.lang === "en-US");

  if (femaleVoice) {
    speech.voice = femaleVoice;
  }

  speech.lang = "en-US";
  speech.rate = 1.25;      // Slightly faster
  speech.pitch = 1.15;
  speech.volume = 1;

  speech.onstart = () => setIsSpeaking(true);

  speech.onend = () => setIsSpeaking(false);

  speech.onerror = () => setIsSpeaking(false);

  window.speechSynthesis.speak(speech);
};
const copyMessage = () => {
  navigator.clipboard.writeText(message.content);

  setCopied(true);

  setTimeout(() => {
    setCopied(false);
  }, 2000);
};

const likeMessage = () => {
  if (liked) {
    // If already liked, remove the like
    setLiked(false);
  } else {
    // Like it and remove dislike
    setLiked(true);
    setDisliked(false);
  }
};

const dislikeMessage = () => {
  if (disliked) {
    // If already disliked, remove the dislike
    setDisliked(false);
  } else {
    // Dislike it and remove like
    setDisliked(true);
    setLiked(false);
  }
};

const publishPost = async () => {
  try {
    const { data } = await axios.post(
  "/api/community/publish",
  {
    image: message.content,
    prompt: message.prompt,
  },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (data.success) {
      toast.success("Published to Community");
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};

  

  return (
    <div>
       {message.role === "user" ? (
        <div className='flex items-start justify-end my-4 gap-2'>
            <div className="flex flex-col gap-2 p-2 px-4 bg-white dark:bg-[#1F1F1F] border border-gray-300 dark:border-gray-700 rounded-md max-w-2xl shadow-sm">
              {message.website && (
  <div className="text-xs text-blue-600 mb-2 break-all">
    {message.website}
  </div>
)}
{message.pdfName && (
  <div className="mb-3 inline-flex items-center gap-3 px-3 py-2 bg-gray-100 dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-700 rounded-xl w-fit">
    <span className="text-lg">📄</span>

    <div className="flex flex-col">
      <span className="text-sm font-medium">
        {message.pdfName}
      </span>
    </div>
  </div>
)}

{message.image && (
  <div className="mb-3">
    <img
      src={message.image}
      alt="Uploaded"
      className="w-56 rounded-lg border border-gray-300"
    />
  </div>
)}
              <p className="text-sm text-black dark:text-white">
  {message.content}
</p>

<span className="text-xs text-gray-500 dark:text-gray-400">
  {moment(message.timestamp).fromNow()}
</span> 

            
        </div>

        <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
  <User size={16} color="white" />
</div>

    </div>
       )
       :
       (
        <div className="group inline-flex flex-col gap-2 p-2 px-4 max-w-2xl bg-white dark:bg-[#1F1F1F] border border-gray-300 dark:border-gray-700 rounded-md my-4 shadow-sm">
           
                {message.isImage ? (
  <>
    <img
      src={message.content}
      alt=""
      className="w-full max-w-md mt-2 rounded-md"
    />

    <button
      onClick={publishPost}
      className="mt-3 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
    >
      Publish to Community
    </button>
  </>
) : 
  (
    <div className="text-sm reset-tw">
  <Markdown
    components={{
      code({ inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || "");

        return !inline && match ? (
          <SyntaxHighlighter
            style={oneDark}
            language={match[1]}
            PreTag="div"
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        ) : (
          <code className={className} {...props}>
            {children}
          </code>
        );
      },
    }}
  >
    {message.content || ""}
  </Markdown>
</div>
  )}

 <div className="flex items-center justify-between mt-2">

  <span className="text-xs text-gray-500 dark:text-gray-400">
    {moment(message.timestamp).fromNow()}
  </span>

  <div className="flex items-center gap-2">

    <button
      onClick={copyMessage}
      className="p-0.5 rounded-md text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition"
    >
      {copied ? <Check size={17} /> : <Copy size={17} />}
    </button>

    <button
  onClick={likeMessage}
  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
>
  <ThumbsUp
    size={17}
    strokeWidth={2}
    className={liked ? "text-blue-600" : "text-gray-500"}
  />
</button>

    <button
  onClick={dislikeMessage}
  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
>
  <ThumbsDown
    size={17}
    strokeWidth={2}
    className={disliked ? "text-red-600" : "text-gray-500"}
  />
</button>

    {!message.isImage && (
      <button
        onClick={speakMessage}
        className="p-0.5 rounded-md text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        {isSpeaking ? (
          <AudioLines size={17} className="animate-pulse text-blue-600" />
        ) : (
          <Volume2 size={17} />
        )}
      </button>
    )}

  </div>

</div>
  

  
</div>

        
      )
      }
    </div>
  );
}

export default Message;

