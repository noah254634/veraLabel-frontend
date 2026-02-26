import { toast } from "react-hot-toast";
import { create } from "zustand";
import type { Buyer } from "../types/buyer";
import type { Order } from "../types/order";
import type { CartOperations } from "../types/cartOperattions";
import type { CartItem, Cart } from "../types/cart";

type BuyerStore = {
  cart: Cart;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  user: Buyer;
  setUser: (user: Buyer) => void;
  error: string;
  setError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  order: Order;
  placeOrder(cart: Cart, paymentMethod: 'wallet' | 'card'): Order;
  trackOrder(orderId: string):Promise<Order>;
  cancelOrder(orderId: string): boolean;
  getOrderHistory(buyerId: string):Promise<Order[]>;
  
};
