import { useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";

interface NotificationPayload {
  type: string;
  userId: string;
  title: string;
  message: string;
  processedAt: string;
}

export default function NotificationsWrapper() {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  useEffect(() => {
    const socket = io(import.meta.env.VITE_WS_URL + "/notifications", {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Connected to Socket.IO");
    });

    socket.on("new_notification", (data: string) => {
      const response: NotificationPayload = JSON.parse(data);
      toast(`${response.title}!\n ${response.message}`, {
        description: formatDate(response.processedAt),
      });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
}
