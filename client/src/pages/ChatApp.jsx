import React, { useRef, useEffect } from "react";
import PromptInput from "../components/PromptInput";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import Markdown from "react-markdown";
import { IKImage } from "imagekitio-react";
import { useAuth } from "@clerk/clerk-react";
const ChatApp = () => {
  const { getToken } = useAuth();
  const { id } = useParams();
  const { isPending, error, data } = useQuery({
    queryKey: ["chat", id],
    queryFn: async () => {
      const token = await getToken();
      return fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chats/${id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json());
    },
  });

  return (
    <div className="flex flex-col h-[100vh] lg:h-[70vh] justify-center items-center">
      <div className="flex-1 w-full min-h-[80vh] overflow-auto scrollbar-hide p-4">
        <div className="w-full flex flex-col max-w-[1/2] mx-auto h-full space-y-4">
          {isPending
            ? "Loading..."
            : error
            ? "Something went wrong!"
            : data?.history?.map((mes, i) => (
                <div
                  key={i}
                  className={` ${mes.role === "user" ? "user" : "message"}`}
                >
                  <div className="rounded-lg p-2">
                    {mes.img && (
                      <IKImage
                        urlEndpoint={
                          import.meta.env.VITE_IMAGE_KIT_API_ENDPOINT
                        }
                        path={mes.img}
                        height="300"
                        width="150"
                        transformation={[{ width: 150 }]}
                        loading="lazy"
                        lqip={{ active: true, quality: 20 }}
                        className="rounded-lg mb-2"
                      />
                    )}
                    <Markdown className="prose prose-invert  ">
                      {mes.parts[0].text}
                    </Markdown>
                  </div>
                </div>
              ))}
          <div className="justify-self-end justify-end ">
            {data && <PromptInput className="justify-end" data={data} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
