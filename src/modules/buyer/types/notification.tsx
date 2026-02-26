export interface Notification {
  id: string;
  buyerId: string;
  message: string;
  read: boolean;
  createdAt: Date;
}
export interface NotificationOperations {
  sendNotification(buyerId: string, message: string): Notification;
  getNotifications(buyerId: string): Notification[];
  markAsRead(notificationId: string): void;
}
