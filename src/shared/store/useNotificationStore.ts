import { create } from "zustand";

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
  addNotification: (title: string, body: string) => void;
  markAllRead: () => void;
  markOneRead: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (title, body) =>
    set((state) => {
      const next: AppNotification = {
        id: crypto.randomUUID(),
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

  markOneRead: (id) =>
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    }),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}));
