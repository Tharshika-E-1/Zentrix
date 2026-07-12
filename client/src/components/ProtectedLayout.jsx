import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { assets } from "../assets/assets";
import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import Login from "../pages/Login";

const ProtectedLayout = () => {
  const { user } = useAppContext();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!user) {
    return (
      <div className="bg-gradient-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen">
        <Login />
      </div>
    );
  }

  return (
    <div className="dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white">
      {!isMenuOpen && (
        <img
          src={assets.menu_icon}
          className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert"
          onClick={() => setIsMenuOpen(true)}
        />
      )}

      <div className="flex h-screen overflow-hidden">
        <Sidebar
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />

        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedLayout;