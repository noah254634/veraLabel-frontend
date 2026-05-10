import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { requestNotificationPermission, onForegroundMessage } from "../../firebase";
import { useAuthStore } from "../../modules/auth/useAuthstore";
import { useNotificationStore } from "../store/useNotificationStore";

export const useFCM = () => {
  const { isAuthenticated } = useAuthStore();
  const addNotification = useNotificationStore((s) => s.addNotification);
  const unsubscribeRef  = useRef<(() => void) | null>(null);
  const channelRef      = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    requestNotificationPermission();

    unsubscribeRef.current = onForegroundMessage((payload) => {
      const title = payload.notification?.title ?? "New notification";
      const body  = payload.notification?.body  ?? "";
      addNotification(title, body);
      toast(`🔔 ${title}${body ? `: ${body}` : ""}`, { duration: 5000 });
    });

    const bc = new BroadcastChannel("fcm-background");
    channelRef.current = bc;

    bc.onmessage = (event) => {
      if (event.data?.type !== "FCM_BACKGROUND") return;
      const { title = "New notification", body = "" } = event.data;
      addNotification(title, body);
      toast(`🔔 ${title}${body ? `: ${body}` : ""}`, { duration: 5000 });
    };

    return () => {
      unsubscribeRef.current?.();
      channelRef.current?.close();
    };
  }, [isAuthenticated, addNotification]);
};
