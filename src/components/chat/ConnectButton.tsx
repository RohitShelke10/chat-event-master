import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface ConnectButtonProps {
  onClick: () => void;
  isConnected: boolean;
}

export const ConnectButton = ({ onClick, isConnected }: ConnectButtonProps) => {
  return (
    <div className="flex justify-center mb-4 sticky top-0 z-10 py-2">
      <Button
        onClick={onClick}
        className={`flex items-center gap-2 ${
          isConnected 
            ? "bg-red-500 hover:bg-red-600" 
            : "bg-[#8B5CF6] hover:bg-[#7C3AED]"
        } text-white transition-all duration-200 hover:shadow-lg shadow-purple-500/20`}
        variant="default"
      >
        <Calendar className="h-4 w-4" />
        {isConnected ? "Disconnect from Google Calendar" : "Connect to Google Calendar"}
      </Button>
    </div>
  );
};