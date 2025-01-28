import { useQuery } from "@tanstack/react-query";

const checkGoogleConnection = async (): Promise<boolean> => {
  // Simulate API call with 1 second delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // Randomly return true or false to simulate API response
  return Math.random() > 0.5;
};

export const useGoogleCalendar = () => {
  const { data: isConnected, isLoading } = useQuery({
    queryKey: ["googleCalendarConnection"],
    queryFn: checkGoogleConnection,
  });

  const connectToGoogle = async () => {
    // Simulate connection process
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Force a refetch of the connection status
    window.location.reload();
  };

  return {
    isConnected,
    isLoading,
    connectToGoogle,
  };
};