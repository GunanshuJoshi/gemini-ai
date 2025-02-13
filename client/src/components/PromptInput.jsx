import React, { useState, useRef, useEffect } from "react";
import Upload from "./Upload";
import { IKImage } from "imagekitio-react";
import Model from "../lib/gemini";
import Markdown from "react-markdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";

const URL = import.meta.env.VITE_IMAGE_KIT_API_ENDPOINT;

const initialImageState = {
  isLoading: false,
  error: "",
  db: {},
  aiData: {},
};

const PromptInput = ({ data }) => {
  const [img, setImg] = useState(initialImageState);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const formRef = useRef();
  const endElement = useRef(null);
  const hasRun = useRef(false);
  const queryClient = useQueryClient();

  // Transform history data
  const history =
    data?.history.map(({ role, parts }) => ({
      role,
      parts: [{ text: parts[0].text }],
    })) || [];

  // Initialize chat
  const chat = Model.startChat({
    history,
    generationConfig: {},
  });

  // Reset state function
  const resetState = () => {
    formRef.current.reset();
    setQuestion("");
    setAnswer("");
    setImg(initialImageState);
  };

  // Mutation for updating chat
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/chats/${data._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question || undefined,
            answer,
            img: img.db?.filePath || undefined,
          }),
        }
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ["chat", data._id] })
        .then(resetState);
    },
    onError: (err) => {
      console.error("Update chat error:", err);
    },
  });

  // Handle new prompts
  const addNewPrompt = async (prompt, isInitial = false) => {
    if (!isInitial) setQuestion(prompt);

    try {
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length ? [img.aiData, prompt] : [prompt]
      );

      let text = "";
      for await (const chunk of result.stream) {
        text += chunk.text();
        setAnswer(text);
      }
      mutation.mutate();
    } catch (error) {
      console.error("Send message error:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value.trim();
    if (!text) return;
    addNewPrompt(text);
  };

  // Handle image removal
  const handleRemoveImage = () => {
    setImg(initialImageState);
  };

  // Scroll to bottom effect
  useEffect(() => {
    endElement.current?.scrollIntoView({ behavior: "smooth" });
  }, [answer, question, img.db]);

  // Initial prompt effect
  useEffect(() => {
    if (!hasRun.current && data?.history?.length === 1) {
      addNewPrompt(data.history[0].parts[0].text, true);
    }
    hasRun.current = true;
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* Loading State */}
      {img.isLoading && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      )}

      {/* Image Preview */}
      {img.db?.filePath && (
        <div className="relative inline-block">
          <button
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
          >
            <X size={16} />
          </button>
          <IKImage
            urlEndpoint={URL}
            path={img.db.filePath}
            width={150}
            transformation={[{ width: 150 }]}
            className="rounded-lg"
          />
        </div>
      )}

      {/* Chat Messages */}
      {question && (
        <div className="user bg-blue-500/10 p-4 rounded-lg">{question}</div>
      )}

      {answer && (
        <div className="message bg-gray-500/10 p-4 rounded-lg">
          <Markdown>{answer}</Markdown>
        </div>
      )}

      <div ref={endElement} className="h-px w-full mt-5" />

      <div className="min-w-full">
        <form
          className="flex bg-[#1d2539] rounded-2xl p-3 flex-row w-full justify-between gap-3"
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <Upload setImg={setImg} />
          <input id="file" type="file" multiple={false} hidden />
          <input
            className="flex-auto bg-transparent border-0 focus:outline-none text-white placeholder-gray-400"
            type="text"
            name="text"
            placeholder="Ask me anything..."
          />
          <button
            type="submit"
            className="p-2 hover:bg-blue-500/10 rounded-lg transition-colors"
          >
            <img className="cursor-pointer w-5" src="/arrow.png" alt="Send" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default PromptInput;
