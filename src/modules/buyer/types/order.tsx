import type{ CartItem,Cart } from "./cart";
export interface Order {
  id: string;
  buyerId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  shippingAddress: string;
  paymentMethod: 'wallet' | 'card' | 'other';
}
export interface OrderOperations {
  placeOrder(cart: Cart, paymentMethod: 'wallet' | 'card'): Order;
  trackOrder(orderId: string): Order;
  cancelOrder(orderId: string): boolean;
  getOrderHistory(buyerId: string): Order[];
}
