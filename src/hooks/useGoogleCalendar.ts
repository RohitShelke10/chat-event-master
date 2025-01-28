import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

const checkGoogleConnection = async (): Promise<boolean> => {
  try {
    // Simulate API call with 1 second delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Randomly return true or false to simulate API response
    return Math.random() > 0.5;
  } catch (error) {
    toast({
      title: "Connection Check Failed",
      description: "Could not verify Google Calendar connection",
      variant: "destructive",
    });
    throw error;
  }
};

export const useGoogleCalendar = () => {
  const { data: isConnected, isLoading } = useQuery({
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
      // Simulate connection process
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Force a refetch of the connection status
      window.location.reload();
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Could not connect to Google Calendar",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    isConnected,
    isLoading,
    connectToGoogle,
  };
};