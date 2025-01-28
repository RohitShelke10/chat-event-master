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
  const { isConnected, isLoading: isCheckingConnection, connectToGoogle } = useGoogleCalendar();

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
    <div className="min-h-screen bg-background">
      <header className="border-b p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Calendar Assistant</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <main className="container mx-auto p-4 flex flex-col chat-container">
        {!isCheckingConnection && !isConnected && (
          <div className="flex justify-center mb-4">
            <Button
              onClick={connectToGoogle}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Calendar className="h-4 w-4" />
              Connect to Google Calendar
            </Button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className={isRecording ? "bg-red-100 hover:bg-red-200" : ""}
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
      </main>
    </div>
  );
};

export default Chat;