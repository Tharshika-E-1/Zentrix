import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { useNavigate, useLocation } from "react-router-dom";

const Splash = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const location = useLocation();

  useEffect(() => {

  // Don't redirect from shared links
  if (location.pathname.startsWith("/share")) {
    return;
  }

  const timer = setTimeout(() => {
    if (user) {
      console.trace("Splash navigating to /");
      navigate("/");
    } else {
      navigate("/login");
    }
  }, 4000);

  return () => clearTimeout(timer);

}, [user, location.pathname]);

  return (
    <div className="bg-white dark:bg-black h-screen flex flex-col justify-center items-center">
      <img
        src={assets.logo}
        alt="logo"
        className="w-28 h-28"
      />

      <h1 className="text-5xl font-bold mt-5 text-black dark:text-white">
        Zentrix
      </h1>

      <p className="text-gray-500 mt-2 font-semibold">
        Intelligent AI Assistant
      </p>
    </div>
  );
};

export default Splash;