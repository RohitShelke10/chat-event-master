import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { checkGoogleConnection, handleAuthClick, handleSignoutClick, initializeGoogleApi } from "@/utils/googleCalendar";
import { useEffect } from "react";

export const useGoogleCalendar = () => {
  useEffect(() => {
    initializeGoogleApi();
  }, []);

  const { data: isConnected, isLoading, refetch } = useQuery({
    queryKey: ["googleCalendarConnection"],
    queryFn: checkGoogleConnection,
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Connection Error",
          description: error.message || "Failed to check connection status",
          variant: "destructive",
        });
      },
    },
  });

  const connectToGoogle = async () => {
    try {
      const success = await handleAuthClick();
      if (success) {
        toast({
          title: "Connected",
          description: "Successfully connected to Google Calendar",
        });
        refetch();
      } else {
        toast({
          title: "Connection Failed",
          description: "Could not connect to Google Calendar",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Could not connect to Google Calendar",
        variant: "destructive",
      });
      throw error;
    }
  };

  const disconnectFromGoogle = () => {
    const success = handleSignoutClick();
    if (success) {
      toast({
        title: "Disconnected",
        description: "Successfully disconnected from Google Calendar",
      });
      refetch();
    }
  };

  return {
    isConnected,
    isLoading,
    connectToGoogle,
    disconnectFromGoogle,
  };
};