import { Message } from "@/services/api";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full message-transition",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2 shadow-md transition-all duration-200 hover:shadow-lg border border-[#8B5CF6]/10",
          isUser
            ? "bg-chat-user text-white mr-2"
            : "bg-chat-bot text-white ml-2"
        )}
      >
        <p className="text-sm">{message.content}</p>
        <span className="text-xs text-purple-300/60 mt-1 block">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};