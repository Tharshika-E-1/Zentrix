import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import moment from 'moment'
import toast from 'react-hot-toast';
import { Pencil, Trash2, User, Pin} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({isMenuOpen, setIsMenuOpen}) => {
  const navigate = useNavigate();

  const {
  chats,
  setSelectedChat,
  theme,
  setTheme,
  user,
  createNewChat,
  axios,
  setChats,
  fetchUserChats,
  setToken,
  token,
} = useAppContext();
    const [search, setSearch] = useState('')
    const [editingChat, setEditingChat] = useState(null);
    const [newName, setNewName] = useState("");
    
    

    const logout = () => {
      localStorage.removeItem('token')
      setToken(null)
      toast.success('Logged out successfully')
    }
    const deleteChat = async (e, chatId) => {
  try {
    e.stopPropagation();

    const confirm = window.confirm(
      "Are you sure you want to delete this chat?"
    );

    if (!confirm) return;
    const { data } = await axios.post(
      "/api/chat/delete",
      { chatId },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (data.success) {
      setChats((prev) => prev.filter((chat) => chat._id !== chatId));

      await fetchUserChats();

      
    }
  } catch (error) {
    toast.error(error.message);
  }
};
const renameChat = async (chatId) => {
  try {

    const { data } = await axios.put(
      "/api/chat/rename",
      {
        chatId,
        name: newName,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (data.success) {
      toast.success("Chat renamed");
      setEditingChat(null);
      fetchUserChats();
    }

  } catch (error) {
    toast.error(error.message);
  }
};




  return (
    <div className={`flex flex-col h-screen min-w-72 px-5 pt-7 pb-5 dark:bg-gradient-to-b from-[#242124]/30 to-[#000000]/30 border-r border-[#80609F]/30 backdrop-blur-3xl transition-all duration-500 max-md:absolute left-0 z-1 ${!isMenuOpen && 'max-md:-translate-x-full'}`}>

    {/* Logo */}
    <div className="flex items-center gap-3">
  <img
    src={assets.logo}
    alt="Logo"
    className="w-12 h-12"
  />

  <div>
    <h1 className="text-3xl font-bold text-black dark:text-white">
  Zentrix
</h1>
    <p className="text-sm text-black-500 font-semibold">
      Intelligent AI Assistant
    </p>
  </div>
</div>

    {/* New Chat Button */}
    <button onClick={createNewChat} className="flex justify-center items-center w-full py-2 mt-10 text-white bg-black text-sm rounded-md cursor-pointer hover:bg-gray-900 transition-all">
        <span className="mr-2 text-xl">+</span> New Chat
    </button>
    {/* Search Conversations */}
    <div className="flex items-center gap-2 p-3 mt-4 border border-gray-400 dark:border-white/20 rounded-md">
    <img src={assets.search_icon} className="w-4 not-dark:invert" alt=""/>
    <input onChange={(e)=>setSearch(e.target.value)} value={search} type="text" placeholder="Search conversations" className="text-xs placeholder:text-gray-400 outline-none"/>
  </div>
  <div className="flex-1 overflow-y-auto mt-5 pr-2">
  {/* Recent Chats */}
  {chats.length > 0 && <p className="mt-5 text-sm">Recent Chats</p>}
  <div className=' mt-3 text-sm space-y-3'>
    {
    chats.filter((chat) =>
  chat.name.toLowerCase().includes(search.toLowerCase())
).map((chat) => (
      <div onClick={()=> {navigate('/'); setSelectedChat(chat);
        setIsMenuOpen(false)}}
      key={chat._id} className='p-2 px-4 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-md cursor-pointer flex justify-between group'>
        <div>
          {
  editingChat === chat._id ? (
    <input
      autoFocus
      value={newName}
      className="px-2 py-1 text-sm w-full"
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => setNewName(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          renameChat(chat._id);
        }

        if (e.key === "Escape") {
          setEditingChat(null);
        }
      }}
    />
  ) : (
    <div className="flex items-center gap-2">

  {chat.isPinned && (
    <Pin
      size={14}
      className="text-black-500 fill-white-500 shrink-0"
    />
  )}

  <p className="truncate w-full">
  {chat.name}
</p>

</div>
  )
}

          <p className="text-xs text-gray-500 dark:text-gray-400">
  {moment(chat.updatedAt).fromNow()}
</p>
        </div>
        <div className="hidden group-hover:flex items-center gap-3">

  <div className="hidden group-hover:flex items-center gap-2">

  <Pencil
    size={16}
    className="cursor-pointer"
    onClick={(e) => {
      e.stopPropagation();
      setEditingChat(chat._id);
      setNewName(chat.name);
      
      // rename function
    }}
  />

  <Trash2
    size={16}
    className="cursor-pointer"
    onClick={(e) =>
      toast.promise(deleteChat(e, chat._id), {
        loading: "Deleting...",
        success: "Chat deleted",
        error: "Failed to delete chat",
      })
    }
  />

</div>

</div>
      </div>
    ))
    }
</div>
{/* Bottom Section */}
<div className="mt-25">
  

{/* Community Images */}
<div 
  onClick={() => {
  navigate("/community");
  setIsMenuOpen(false);
}}
  className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all"
>
  <img
  src={assets.gallery_icon}
  className="w-4.5 not-dark:invert"
  alt=""
/>

<div className="flex flex-col text-sm">
  <p>Community Images</p>
</div>
</div>
</div>

{/* Credit Purchases Option */}
<div onClick={() => {
  navigate("/credits");
  setIsMenuOpen(false);
}} className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all">
  <img src={assets.diamond_icon} className="w-4.5 dark:invert" alt=""/>

  <div className="flex flex-col text-sm">
    <p>Credits : {user?.credits}</p>
    <p className='text-xs text-gray-400'>Purchase credits to use QuickGPT</p>
  </div>
</div>

{/* Dark Mode Toggle */}
<div className="flex items-center justify-between gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md ">

  <div className="flex items-center gap-2 text-sm">
    <img src={assets.theme_icon} className='w-4 invert dark:invert-0' alt=""/>
    <p className="text-black dark:text-white">Dark Mode</p>
  </div>
  <label className="relative inline-flex cursor-pointer">
  <input onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
    type="checkbox" className="sr-only peer" checked={theme === "dark"}/>

  <div className="w-9 h-5 bg-white border border-gray-300 rounded-full dark:bg-gray-700 dark:border-gray-600 peer-checked:bg-white transition-all"></div>

  <span className="absolute left-1 top-1 w-3 h-3 bg-black rounded-full transition-transform peer-checked:translate-x-4"></span>
</label>
</div>
{/* User Account */}
<div className="flex items-center gap-3 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer group">
  <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center">
  <User size={16} color="white" />
</div>
  <p className='flex-1 text-sm dark:text-primary truncate'>{user ? user.name : 'Login your Account'}</p>
  {user && <img onClick={logout} src={assets.logout_icon} className='h-5 cursor-pointer hidden not-dark:invert group-hover:block'/>}
</div>
<img onClick={()=> setIsMenuOpen(false)} src={assets.close_icon} className="absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert" alt=""/>

  </div>
  </div>
  
  )
}

export default Sidebar
