import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { ArrowRight } from "lucide-react";

const WelcomeCard = ({ dashboard }) => {
  const navigate = useNavigate();
  const { user } = useAppContext();

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-8 mb-6">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">
            👋 Welcome back, {user?.name || "User"}
          </h1>

          <p className="text-gray-500 dark:text-white">
            Continue your journey with Zentrix
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition"
        >
          New Chat
          <ArrowRight size={18} />
        </button>

      </div>

    </div>
  );
};

export default WelcomeCard;