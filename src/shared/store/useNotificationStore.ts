import { create } from "zustand";
import { api } from "../types/api";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  receivedAt: Date;
  read: boolean;
}

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  addNotification: (title: string, body: string, id?: string) => void;
  markAllRead: () => Promise<void>;
  markOneRead: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  fetchNotifications: async () => {
    try {
      const response = await api.get("/notifications");
      const mapped: AppNotification[] = response.data.map((n: any) => ({
        id: n._id,
        title: n.title,
        body: n.body,
        read: n.read,
        receivedAt: new Date(n.createdAt),
      }));
      set({
        notifications: mapped,
        unreadCount: mapped.filter((n) => !n.read).length,
      });
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  },

  addNotification: (title, body, id) =>
    set((state) => {
      // Avoid duplicate notifications in local state
      if (id && state.notifications.some((n) => n.id === id)) {
        return state;
      }
      const next: AppNotification = {
        id: id || crypto.randomUUID(),
        title,
        body,
        receivedAt: new Date(),
        read: false,
      };
      // Keep at most 50 notifications (newest first)
      const updated = [next, ...state.notifications].slice(0, 50);
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    }),

  markOneRead: async (id) => {
    // If it's a valid MongoDB ObjectId, update on the backend
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      try {
        await api.patch(`/notifications/${id}/read`);
      } catch (err) {
        console.error("Failed to mark notification as read on backend:", err);
      }
    }
    // Always update local state
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    });
  },

  markAllRead: async () => {
    try {
      await api.patch("/notifications/read-all");
    } catch (err) {
      console.error("Failed to mark all notifications as read on backend:", err);
    }
    // Update local state
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  clearAll: async () => {
    try {
      await api.delete("/notifications");
    } catch (err) {
      console.error("Failed to clear notifications on backend:", err);
    }
    // Clear local state
    set({ notifications: [], unreadCount: 0 });
  },
}));
