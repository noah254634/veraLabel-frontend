import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import type { MessagePayload } from "firebase/messaging";
import { api } from "./shared/types/api";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

const isSecureCtx =
  window.isSecureContext ||
  location.hostname === "localhost" ||
  location.hostname === "127.0.0.1";

export const messaging = isSecureCtx ? getMessaging(app) : null;

if (!isSecureCtx) {
  console.warn(
    "[FCM] Push notifications disabled: not a secure context.\n" +
    "  → Use http://localhost:5173 on desktop, or deploy behind HTTPS for other devices."
  );
}

export const requestNotificationPermission = async (): Promise<string | null> => {
  if (!messaging) {
    console.warn("[FCM] Messaging not available — not a secure context.");
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("[FCM] Notification permission denied.");
      return null;
    }

    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.error("[FCM] VITE_FIREBASE_VAPID_KEY is not set in .env");
      return null;
    }

    const token = await getToken(messaging, { vapidKey });
    if (!token) {
      console.warn("[FCM] No registration token available.");
      return null;
    }

    await api.post("/notifications/register-token", { token });
    console.log("[FCM] Token registered ✓", token.slice(0, 20) + "...");
    return token;
  } catch (err) {
    console.error("[FCM] Error getting token:", err);
    return null;
  }
};

export const onForegroundMessage = (
  handler: (payload: MessagePayload) => void
) => {
  if (!messaging) return () => {}; // no-op when push is unsupported
  return onMessage(messaging, handler);
};

export default app;