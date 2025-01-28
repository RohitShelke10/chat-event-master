import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { ChatInput } from "./ChatInput";

interface ChatControlsProps {
  isRecording: boolean;
  toggleVoiceRecording: () => void;
  onSendMessage: (content: string) => Promise<void>;
  disabled: boolean;
}

export const ChatControls = ({
  isRecording,
  toggleVoiceRecording,
  onSendMessage,
  disabled,
}: ChatControlsProps) => {
  return (
    <div className="sticky bottom-0 backdrop-blur-sm bg-black/30 p-4 rounded-lg">
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className={`transition-all duration-200 ${
            isRecording
              ? "text-red-500 hover:text-red-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
          onClick={toggleVoiceRecording}
        >
          <Mic className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <ChatInput onSendMessage={onSendMessage} disabled={disabled} />
        </div>
      </div>
    </div>
  );
};