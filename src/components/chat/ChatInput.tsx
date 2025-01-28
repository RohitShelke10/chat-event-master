import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ChatInputProps {
  onSendMessage: (content: string) => Promise<void>;
  disabled?: boolean;
}

export const ChatInput = ({ onSendMessage, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;

    try {
      await onSendMessage(message);
      setMessage("");
    } catch (error) {
      toast({
        title: "Message Failed",
        description: "Could not send message. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to send message:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2 w-full">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={
          disabled
            ? "Please connect to Google Calendar first"
            : "Type your message here..."
        }
        className="min-h-[50px] max-h-[200px] flex-1 bg-[#2A2F42] text-white rounded-full px-6 transition-all duration-200 focus:bg-[#363B52] resize-none border-2 border-[#8B5CF6]/20 focus:border-[#8B5CF6]/50"
        disabled={disabled}
      />
      <Button
        type="submit"
        size="icon"
        disabled={!message.trim() || disabled}
        className="bg-[#8B5CF6] hover:bg-[#7C3AED] transition-all duration-200 hover:shadow-md active:animate-button-pop rounded-full shadow-lg shadow-purple-500/20"
      >
        <SendHorizontal className="h-4 w-4" />
      </Button>
    </form>
  );
};