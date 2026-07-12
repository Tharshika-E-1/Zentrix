import React from "react";
import { User, Mail, KeyRound } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

const Account = () => {
  const { user } = useAppContext();

  if (!user) return null;

  return (
    <div >

      
    </div>
  );
};

export default Account;