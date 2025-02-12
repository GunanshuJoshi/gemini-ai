import React, { useState, useRef, useEffect } from "react";
import Upload from "./Upload";
import { IKImage } from "imagekitio-react";
import Model from "../lib/gemini";
import Markdown from "react-markdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const URL = import.meta.env.VITE_IMAGE_KIT_API_ENDPOINT;
const PromptInput = ({ data }) => {
  console.log("🚀 ~ PromptInput ~ data:", data);
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    db: {},
    aiData: {},
  });

  const history =
    data?.history.map(({ role, parts }) => ({
      role: role,
      parts: [{ text: parts[0].text }],
    })) || [];
  console.log("🚀 ~ PromptInput ~ history:", history);

  const chat = Model.startChat({
    history: history,
    generationConfig: {
      // maxOutputTokens: 100,
    },
  });

  const formRef = useRef();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const queryClient = useQueryClient();

  const endElement = useRef(null);

  const mutation = useMutation({
    mutationFn: () => {
      return fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/chats/${data._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question.length ? question : undefined,
            answer,
            img: img.db?.filePath || undefined,
          }),
        }
      ).then((res) => res.json());
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient
        .invalidateQueries({ queryKey: ["chat", data._id] })
        .then(() => {
          formRef.current.reset();
          setQuestion("");
          setAnswer("");
          setImg({
            isLoading: false,
            error: "",
            db: {},
            aiData: {},
          });
        });
    },
    onError: (err) => {
      console.log("🚀 ~ PromptInput ~ err:", err);
    },
  });

  const addNewPrompt = async (prompt, isInitial) => {
    if (!isInitial) setQuestion(prompt);
    try {
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length ? [img.aiData, prompt] : [prompt]
      );
      console.log("🚀 ~ addNewPrompt ~ result:", result);
      let text = "";
      for await (const chunk of result.stream) {
        const temp = chunk.text();
        text += temp;
        setAnswer(text, false);
      }
      mutation.mutate();
    } catch (error) {
      console.log("🚀 ~ addNewPrompt ~ error:", error);
    }
  };

  useEffect(() => {
    if (endElement.current) {
      endElement.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [answer, question, img.db]);

  const hasRun = useRef(false);
  useEffect(() => {
    if (!hasRun.current) {
      if (data?.history?.length === 1) {
        addNewPrompt(data.history[0].parts[0].text, true);
      }
    }
    hasRun.current = true;
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    console.log("🚀 ~ handleSubmit ~ text:", text);
    if (!text) return;
    addNewPrompt(text);
  };

  return (
    <>
      {img.isLoading && <div> Loading ... </div>}
      {img.db?.filePath && (
        <IKImage
          urlEndpoint={URL}
          path={img.db.filePath}
          width={150}
          transformation={[{ width: 150 }]}
        />
      )}
      {question && <div className="user">{question}</div>}
      {answer && (
        <div className="message">
          <Markdown>{answer}</Markdown>
        </div>
      )}
      <div ref={endElement} className="h-px w-full mt-5" />
      <div className="min-w-full flex flex-row">
        <form
          action=""
          className="flex bg-[#1d2539] rounded-2xl p-3 flex-row w-full justify-between gap-3"
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <Upload setImg={setImg} />
          <input id="file" type="file" multiple={false} hidden />
          <input
            className="flex-auto border-0 focus:outline-none"
            type="text"
            name="text"
            placeholder="Ask me anything..."
          />
          <button type="submit">
            <img className="cursor-pointer w-5" src="/arrow.png" alt="" />
          </button>
        </form>
      </div>
    </>
  );
};

export default PromptInput;
