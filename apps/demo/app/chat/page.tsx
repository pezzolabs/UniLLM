"use client";

import { LLMSelector } from "@/components/LLMSelector";
import { LLMs } from "@/utils/types";
import { Message } from "../../components/Message";
import {
  ChatBubbleIcon,
  PaperPlaneIcon,
} from "@radix-ui/react-icons";
import { Heading, IconButton, TextField } from "@radix-ui/themes";
import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";

export default function ChatPage() {
  const defaultLLM = Object.keys(LLMs)[0];
  const [llm, setLLM] = useState(defaultLLM);

  const body = {
    llm,
  };

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
    initialMessages: [],
    body,
  });
  const form = useRef<HTMLFormElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <main className="h-full overflow-hidden">
      <div className="h-full flex-col rounded-lg shadow-lg flex bg-neutral-100 bg-opacity-10 ">
        <div className="grid grid-flow-row-dense grid-cols-12 gap-4 h-14 items-center justify-center ">
          <div className="col-span-2 pl-4 pt-1">
  
          </div>
          <div className="flex-1 text-center col-span-8">
            <Heading size="3">
              <LLMSelector value={llm} onChange={(value) => setLLM(value)} />
            </Heading>
          </div>
          <div className="col-span-2"></div>
        </div>
        <div className="flex-1 h-full overflow-y-auto" ref={messagesEndRef}>
          <div className="flex flex-col min-h-full justify-end bg-neutral-200 bg-opacity-10">
            {messages.map((m, index) => (
              <Message key={index} message={m} />
            ))}
          </div>
        </div>

        <div className="">
          <form onSubmit={handleSubmit} ref={form}>
            <TextField.Root size="3">
              <TextField.Slot className="mx-2 rounded-bl-lg">
                <ChatBubbleIcon height={16} width={16} />
              </TextField.Slot>
              <div className="flex w-full items-center justify-center">
                <input
                  className="h-12 w-full bg-transparent focus:outline-none"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type your message here..."
                />
                <div>
                  <IconButton
                    type="submit"
                    size="4"
                    variant="solid"
                    style={{ borderRadius: 0, borderBottomRightRadius: 5 }}
                  >
                    <PaperPlaneIcon height={16} width={16} />
                  </IconButton>
                </div>
              </div>
            </TextField.Root>
          </form>
        </div>
      </div>
    </main>
  );
}
