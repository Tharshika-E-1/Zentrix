import { Route, Routes, useLocation } from 'react-router-dom'
import React, { useState } from 'react'
import ChatBox from './components/ChatBox'
import Credits from './pages/Credits'
import Community from './pages/Community'
import './assets/prism.css'
import Loading from './pages/Loading'
import { useAppContext } from './context/AppContext'
import {Toaster} from 'react-hot-toast'
import Splash from "./pages/Splash";
import { useEffect } from 'react'
import ShareChat from "./pages/ShareChat";
import ProtectedLayout from "./components/ProtectedLayout";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";

const App = () => {

  const {loadingUser} = useAppContext()
 

  
  const {pathname}=useLocation()
  useEffect(() => {
  console.log("Current pathname:", pathname);
  console.trace("Path changed");
}, [pathname]);
  const [showSplash, setShowSplash] = useState(true);

useEffect(() => {
  if (pathname.startsWith("/share")) return;

  const timer = setTimeout(() => {
    setShowSplash(false);
  }, 4000);

  return () => clearTimeout(timer);
}, [pathname]);
  //console.log("PATHNAME =", pathname);
  if (pathname === "/loading") {
  return <Loading />;
}

if (loadingUser) {
  return (
    <div className="bg-white dark:bg-black flex items-center justify-center h-screen">
      <div className="w-10 h-10 rounded-full border-4 border-black dark:border-white border-t-transparent animate-spin"></div>
    </div>
  );
}
  if (showSplash && !pathname.startsWith("/share")) {
  return <Splash />;
}
  console.log("PATHNAME =", pathname);
  if (pathname === "/loading") {
    return <Loading />;
}

if (loadingUser && !pathname.startsWith("/share/")) {
    return <Loading />;
}

  return (
    <>
    <Toaster />
    

    <Routes>

  {/* Public Share Page */}
  <Route
    path="/share/:id"
    element={<ShareChat />}
  />

  {/* Protected Layout */}
  <Route element={<ProtectedLayout />}>

    <Route
      path="/"
      element={<ChatBox />}
    />

    <Route
      path="/credits"
      element={<Credits />}
    />

    <Route
      path="/community"
      element={<Community />}
    />

  </Route>
  <Route
    path="/dashboard"
    element={<Dashboard />}
/>
<Route path="/account" element={<Account />} />

</Routes>
  
    
      
    </>
  )
}

export default App
