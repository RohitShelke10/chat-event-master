import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface ChatHeaderProps {
  onLogout: () => void;
}

export const ChatHeader = ({ onLogout }: ChatHeaderProps) => {
  return (
    <header className="border-b border-[#8B5CF6]/20 backdrop-blur-sm bg-black/30 p-4 flex justify-between items-center w-full z-10">
      <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#8B5CF6] to-[#D946EF]">
        Calendar Assistant
      </h1>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onLogout}
          className="hover:bg-red-500/10 transition-colors duration-200 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};