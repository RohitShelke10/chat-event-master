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
    <div className="sticky bottom-0 backdrop-blur-sm bg-white/30 p-4 rounded-lg">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          className={`transition-all duration-200 hover:shadow-md ${
            isRecording
              ? "bg-red-100 hover:bg-red-200 text-red-600"
              : "bg-white hover:bg-gray-50 text-gray-800"
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