import { Message } from "@/services/api";
import { ChatMessage } from "./ChatMessage";
import { RefObject } from "react";

interface MessageListProps {
  messages: Message[];
  messagesEndRef: RefObject<HTMLDivElement>;
}

export const MessageList = ({ messages, messagesEndRef }: MessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 rounded-lg backdrop-blur-sm bg-white/30">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};