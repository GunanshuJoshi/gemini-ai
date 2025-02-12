import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";

const ChatList = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["userChats"],
    queryFn: () => {
      return fetch(`${import.meta.env.VITE_BACKEND_URL}/api/userchats`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
    },
  });

  return (
    <div className="flex flex-col h-full  bg-[#1b1f30] text-gray-100 rounded-lg p-4">
      <div className="mb-6">
        <h1 className="font-bold text-xl mb-4">Dashboard</h1>
        <div className="flex flex-col gap-3 ">
          <Link
            to="/"
            className="flex items-center   rounded-lg hover:bg-[#1d2539] transition-colors"
          >
            <span className="text-white font-bold ">Home</span>
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center  rounded-lg hover:bg-[#1d2539] transition-colors"
          >
            <span className="text-white font-bold">New Chat</span>
          </Link>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-4">
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
          Recent Chats
        </h2>
        <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-250px)]">
          {isPending
            ? "Loading..."
            : error
            ? "Something went wrong..."
            : data?.map((i) => (
                <Link
                  key={i._id}
                  className="flex items-center  gap-2 p-3 rounded-lg bg-[#1d2539] hover:bg-[#2d3649] transition-colors"
                  to={`/dashboard/chats/${i._id}`}
                >
                  <span className="text-white ">{i.title}</span>
                </Link>
              ))}
        </div>
      </div>

      <div className="mt-auto">
        <a
          href="mailto:gunanshu02@gmail.com"
          className="bg-red-500 flex justify-center text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
        >
          <span className="text-white">Contact Me</span>
        </a>
      </div>
    </div>
  );
};
export default ChatList;
