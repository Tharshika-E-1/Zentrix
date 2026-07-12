import React from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  UserCircle,
  Mail,
  Lock,
  Pencil,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const {
    user,
    axios,
    token,
    fetchUser,
  } = useAppContext();

  const [name, setName] = useState(user?.name || "");
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

const [currentPassword, setCurrentPassword] = useState("");

const [newPassword, setNewPassword] = useState("");

const [confirmPassword, setConfirmPassword] = useState("");
const [showCurrent, setShowCurrent] = useState(false);

const [showNew, setShowNew] = useState(false);

const [showConfirm, setShowConfirm] = useState(false);
const navigate = useNavigate();

  useEffect(() => {
    setName(user?.name || "");
  }, [user]);

  const updateProfile = async () => {
    try {
      const { data } = await axios.post(
        "/api/user/update-profile",
        { name },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (data.success) {
        toast.success("Profile Updated");
        fetchUser();
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  };
  const changePassword = async () => {

  if (newPassword !== confirmPassword) {
    return toast.error("Passwords do not match");
  }

  try {

    const { data } = await axios.post(
      "/api/user/change-password",
      {
        currentPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (data.success) {

      toast.success(data.message);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setShowPassword(false);

    } else {
      toast.error(data.message);
    }

  } catch (error) {
    toast.error(error.message);
  }
};


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0f0f0f] p-8">

      <div className="max-w-3xl mx-auto bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-md p-8">

        <h1 className="text-3xl font-bold mb-8 text-center">
          Account Settings
        </h1>

        <div className="flex items-center gap-6 mb-10 ">

          <UserCircle size={50} className="text-black" />

          <div>
            <h2 className="text-xl font-semibold">
              {user?.name}
            </h2>

            <p className="text-gray-500">
              {user?.email}
            </p>
          </div>

        </div>

        <div className="space-y-6">

          <div className="border rounded-xl p-5 flex items-center gap-4">
            <UserCircle size={24} />
            <div>
              <div className="flex items-center justify-between">

  <p className="font-semibold text-lg">Name</p>

  {!editing && (
    <button
      onClick={() => setEditing(true)}
      className="text-black-500 hover:text-black"
    >
      <Pencil size={18} />
    </button>
  )}

</div>

<input
  value={name}
  readOnly={!editing}
  onChange={(e) => setName(e.target.value)}
  className={`mt-2 w-full rounded-lg p-2 border
  ${
    editing
      ? "border-black bg-white"
      : "border-transparent bg-gray-100 cursor-default"
  }`}
/>

{editing && (

  <button
    onClick={async () => {
      await updateProfile();
      setEditing(false);
    }}
    className="mt-4 bg-black text-white px-6 py-2 rounded-lg"
  >
    Save Changes
  </button>

)}
            </div>
          </div>

          <div className="border rounded-xl p-5 flex items-center gap-4">
            <Mail size={24} />
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>

          <button
  onClick={() => setShowPassword(!showPassword)}
  className="w-full border rounded-xl p-5 flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
>
            <Lock size={24} />
            <span className="font-semibold">
              Change Password
            </span>
          </button>
          {showPassword && (
  <div className="border rounded-xl p-5 space-y-4">

    <div className="relative">

  <input
    type={showCurrent ? "text" : "password"}
    placeholder="Current Password"
    value={currentPassword}
    onChange={(e) => setCurrentPassword(e.target.value)}
    className="w-full border rounded-lg p-3 pr-12"
  />

  <button
    type="button"
    onClick={() => setShowCurrent(!showCurrent)}
    className="absolute right-4 top-1/2 -translate-y-1/2"
  >
    {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>

</div>

    <div className="relative">

  <input
    type={showNew ? "text" : "password"}
    placeholder="New Password"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    className="w-full border rounded-lg p-3 pr-12"
  />

  <button
    type="button"
    onClick={() => setShowNew(!showNew)}
    className="absolute right-4 top-1/2 -translate-y-1/2"
  >
    {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>

</div>

    <div className="relative">

  <input
    type={showConfirm ? "text" : "password"}
    placeholder="Confirm Password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    className="w-full border rounded-lg p-3 pr-12"
  />

  <button
    type="button"
    onClick={() => setShowConfirm(!showConfirm)}
    className="absolute right-4 top-1/2 -translate-y-1/2"
  >
    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>

</div>

    <div className="flex justify-center mt-6">
  <button
    onClick={changePassword}
    className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
  >
    Update Password
  </button>
</div>
  </div>
)}

        </div>
        <div className="flex justify-center mt-8">
  <button
    onClick={() => navigate("/")}
    className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
  >
    Back to Chat
  </button>
</div>

      </div>

    </div>
    
  );
};


export default Account;