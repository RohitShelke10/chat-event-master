import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ApiService, { Message } from "@/services/api";
import { useGoogleCalendar } from "@/hooks/useGoogleCalendar";
import { toast } from "@/components/ui/use-toast";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ConnectButton } from "@/components/chat/ConnectButton";
import { MessageList } from "@/components/chat/MessageList";
import { ChatControls } from "@/components/chat/ChatControls";

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
      <ChatHeader onLogout={handleLogout} />
      <div className="flex-1 container mx-auto p-4 flex flex-col h-[calc(100vh-64px)]">
        {!isCheckingConnection && !isConnected && (
          <ConnectButton onClick={connectToGoogle} />
        )}
        <MessageList messages={messages} messagesEndRef={messagesEndRef} />
        <ChatControls
          isRecording={isRecording}
          toggleVoiceRecording={toggleVoiceRecording}
          onSendMessage={handleSendMessage}
          disabled={loading || !isConnected}
        />
      </div>
    </div>
  );
};

export default Chat;