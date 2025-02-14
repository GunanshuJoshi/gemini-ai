import { useAuth } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import ChatList from "../components/ChatList";
import { Menu, X } from "lucide-react";

const DashboardLayout = () => {
  const [isChatListOpen, setIsChatListOpen] = useState(false);
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !userId) navigate("/sign-in");
  }, [userId, isLoaded, navigate]);

  if (!isLoaded)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1b1f30]">
        <div className="text-white">Loading...</div>
      </div>
    );

  return (
    <div className="h-auto bg-[#101828] text-white">
      <button
        onClick={() => setIsChatListOpen(!isChatListOpen)}
        className="fixed top-5 left-5 z-50 p-2 bg-blue-600 rounded-lg md:hidden"
      >
        {isChatListOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className="flex flex-row h-auto">
        <div
          className={`${
            isChatListOpen ? "translate-x-0" : "-translate-x-full"
          } fixed md:relative md:translate-x-0 z-40 w-80 h-full transition-transform duration-300 ease-in-out bg-[#101828] border-r border-gray-700`}
        >
          <div className="pt-16 md:pt-4 px-4">
            <ChatList />
          </div>
        </div>

        <div className="flex-1 w-full md:w-auto p-4 md:p-6">
          <Outlet />
        </div>

        {isChatListOpen && (
          <div
            className="inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsChatListOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;
