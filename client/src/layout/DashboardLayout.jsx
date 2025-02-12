import { useAuth } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import ChatList from "../components/ChatList";
const DashboardLayout = () => {
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
    <div className="min-h-screen bg-[#101828] text-white flex flex-row">
      <div className="container mx-auto p-4 flex-1">
        <ChatList />
      </div>
      <div className="bg-[#101828] rounded-lg p-4 flex-4">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
