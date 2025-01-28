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
        className="min-h-[50px] max-h-[200px] flex-1 bg-white/80 backdrop-blur-sm transition-all duration-200 focus:bg-white"
        disabled={disabled}
      />
      <Button
        type="submit"
        size="icon"
        disabled={!message.trim() || disabled}
        className="bg-primary hover:bg-primary/90 transition-all duration-200 hover:shadow-md active:animate-button-pop"
      >
        <SendHorizontal className="h-4 w-4" />
      </Button>
    </form>
  );
};