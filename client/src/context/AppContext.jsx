import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyChats, dummyUserData } from "../assets/assets";
import axios from 'axios';
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const AppContext = createContext()

export const AppContextProvider = ({ children }) => {

    const navigate = useNavigate()
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loadingUser, setLoadingUser] = useState(true)
    
    const fetchUser = async () => {
      console.trace("fetchUser called");
        try {
    const { data } = await axios.get("/api/user/data", {
      headers: {
        Authorization: token,
      },
    });

    if (data.success) {
      setUser(data.user);
    } else {
        toast.error(data.message)
    }
  } catch (error) {
    toast.error(error.message)
  }finally{
    setLoadingUser(false)
  }
}
const createNewChat = async () => {
  try {
    if (!user) return toast("Login to create a new chat");

    navigate("/");

    const { data } = await axios.get("/api/chat/create", {
      headers: {
        Authorization: token,
      },
    });

    if (data.success) {
      await fetchUserChats();

      // Automatically open the newly created chat
      setSelectedChat(data.chat);
    }
  } catch (error) {
    toast.error(error.message);
  }
};
    const fetchUserChats = async () => {
        try {
    const { data } = await axios.get("/api/chat/get", {
      headers: { Authorization: token },
    });

    if (data.success) {
      setChats(data.chats);

      // If the user has no chats, create one
      if (data.chats.length === 0) {
        await createNewChat();
        return fetchUserChats();
      } else {
        if (data.chats.length === 0) {
  await createNewChat();
  return;
}

if (!location.pathname.startsWith("/share/")) {

  if (selectedChat) {

    const current = data.chats.find(
      chat => chat._id === selectedChat._id
    );

    setSelectedChat(current || data.chats[0]);

  } else {

    // First time opening the app
    setSelectedChat(data.chats[0]);

  }

}
      }
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
}

    useEffect(() => {
        if(theme === 'dark' ){
            document.documentElement.classList.add('dark');
        }else{
            document.documentElement.classList.remove('dark');
        }
    },[theme])

    useEffect(() => {
    if (location.pathname.startsWith("/share/")) {
        return;
    }

    if (user) {
        fetchUserChats();
    } else {
        setChats([]);
        setSelectedChat(null);
    }
}, [user, location.pathname]);


    useEffect(() => {

    if (location.pathname.startsWith("/share/")) {
        setLoadingUser(false);
        return;
    }

    if (token) {
        setSelectedChat(null);   // Reset old chat
        fetchUser();
    } else {
        setUser(null);
        setSelectedChat(null);
        setLoadingUser(false);
    }

}, [token, location.pathname]);

    const value = {
        navigate, user, setUser, fetchUser, chats, setChats, selectedChat, setSelectedChat, theme, setTheme, createNewChat, loadingUser,
        fetchUserChats, token, setToken, axios
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)