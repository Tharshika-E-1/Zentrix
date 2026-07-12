import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Loading = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { axios, fetchUser } = useAppContext();

  useEffect(() => {
    const loadData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 8000));

        const params = new URLSearchParams(location.search);
        const session_id = params.get("session_id");

        if (session_id) {
          await axios.get(`/api/credit/verify?session_id=${session_id}`);
        }

        await fetchUser();

        if (session_id) {
  navigate("/");
}
      } catch (error) {
        console.log(error);
        navigate("/");
      }
    };

    loadData();
  }, [location.pathname]);

  return (
    <div className="bg-white dark:bg-black flex items-center justify-center h-screen w-screen">
      <div className="w-10 h-10 rounded-full border-4 border-black dark:border-white border-t-transparent animate-spin"></div>
    </div>
  );
};

export default Loading;