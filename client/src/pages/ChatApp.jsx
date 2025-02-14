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
    <div className="h-screen flex flex-col w-full items-center">
      <div className="h-full w-full flex flex-col items-center ">
        <div className="chat sm:w-full lg:w-1/2  h-full flex flex-col items-center   scrollbar-hide rounded-2xl">
          <div className="w-full h-full overflow-y-auto scrollbar-hide px-4">
            <div className="flex flex-col gap-2">
              {isPending
                ? "Loading..."
                : error
                ? "Something went wrong!"
                : data?.history?.map((mes, i) => (
                    <>
                      {mes.img && (
                        <IKImage
                          key={i}
                          urlEndpoint={
                            import.meta.env.VITE_IMAGE_KIT_API_ENDPOINT
                          }
                          path={mes.img}
                          height="300"
                          width="150"
                          transformation={[{ width: 150 }]}
                          loading="lazy"
                          lqip={{ active: true, quality: 20 }}
                        />
                      )}
                      <div
                        className={mes.role === "user" ? "user" : "message"}
                        key={i}
                      >
                        <Markdown>{mes.parts[0].text}</Markdown>
                      </div>
                    </>
                  ))}
              {data && <PromptInput data={data} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
