import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import ApiService, { Message } from "@/services/api";
import { Button } from "@/components/ui/button";
import { LogOut, Calendar, Mic } from "lucide-react";
import { useGoogleCalendar } from "@/hooks/useGoogleCalendar";
import { toast } from "@/components/ui/use-toast";

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isConnected, isLoading: isCheckingConnection, connectToGoogle } =
    useGoogleCalendar();

  useEffect(() => {
    if (!ApiService.getToken()) {
      navigate("/");
      return;
    }

    const loadMessages = async () => {
      try {
        const history = await ApiService.getMessages();
        setMessages(history);
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };

    loadMessages();
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    setLoading(true);
    try {
      const response = await ApiService.sendMessage(content);
      setMessages((prev) => [...prev, response]);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await ApiService.logout();
    navigate("/");
  };

  const toggleVoiceRecording = () => {
    setIsRecording(!isRecording);
    toast({
      title: isRecording ? "Voice recording stopped" : "Voice recording started",
      description: "This is a demo feature",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3] flex flex-col">
      <header className="border-b backdrop-blur-sm bg-white/30 p-4 flex justify-between items-center w-full z-10">
        <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          Calendar Assistant
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="hover:bg-red-100 transition-colors duration-200 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="flex-1 container mx-auto p-4 flex flex-col h-[calc(100vh-64px)]">
        {!isCheckingConnection && !isConnected && (
          <div className="flex justify-center mb-4 sticky top-0 z-10 py-2">
            <Button
              onClick={connectToGoogle}
              className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 transition-all duration-200 hover:shadow-md"
              variant="outline"
            >
              <Calendar className="h-4 w-4" />
              Connect to Google Calendar
            </Button>
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 rounded-lg backdrop-blur-sm bg-white/30">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>

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
              <ChatInput
                onSendMessage={handleSendMessage}
                disabled={loading || !isConnected}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;