import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useAuth } from "@clerk/clerk-react";

const DashBoard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  const mutation = useMutation({
    mutationFn: async (text) => {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chats`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });
      console.log("🚀 ~ mutationFn: ~ res:", res);
      const json = await res.json();
      console.log("🚀 ~ mutationFn: ~ res:", json);
      return json;
    },
    onSuccess: ({ chatId }) => {
      console.log("🚀 ~ DashBoard ~ id:", chatId);
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      navigate(`/dashboard/chats/${chatId}`);
    },
    onError: (error) => {
      console.log("🚀 ~ DashBoard ~ error:", error);
    },
  });
  const handleSubmit = async (e) => {
    console.log("handling submit");
    e.preventDefault();
    const text = e.target.text.value;
    console.log("🚀 ~ handleSubmit ~ text:", text);
    if (!text) return;
    mutation.mutate(text);
  };
  return (
    <div className="p-8 max-w-4xl flex-1 flex flex-col justify-evenly h-full gap-10">
      <div className="justify-center align-middle">
        <div className="flex items-center justify-center gap-4">
          <img
            className="w-15 object-contain"
            src="/gemini-logo.png"
            alt="logo"
          />
          <h1 className="text-7xl font-bold gradient-background pb-10">
            GJ AI
          </h1>
        </div>

        <div className="grid grid-cols-1 justify-center md:grid-cols-3 gap-6">
          {[
            { icon: "/chat.png", text: "Create a new chat" },
            { icon: "/image.png", text: "Analyze Image" },
            { icon: "/code.png", text: "Solve a issue" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 rounded-xl bg-[#1d2539] hover:bg-[#2d3649] transition-all duration-300 cursor-pointer hover:scale-105"
            >
              <img
                src={item.icon}
                alt=""
                className="w-12 h-12 object-contain"
              />
              <span className="text-gray-200 text-lg">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="justify-end ">
        <form
          className="relative max-w-2xl mx-auto flex w-full outline-0 p-4 pr-12 rounded-xl bg-[#1d2539] text-gray-200 placeholder-gray-400  focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="text"
            placeholder="Ask me anything..."
            className="flex-grow"
          />
          <button type="submit" className="hover:scale-105">
            <img
              src="/arrow.png"
              alt="Send"
              className="w-6  hover:scale-110 transition-transform"
            />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashBoard;
