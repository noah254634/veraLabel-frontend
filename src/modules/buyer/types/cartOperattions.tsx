import type{ CartItem,Cart } from "./cart";

export interface CartOperations {
  addToCart(item: CartItem): void;
  removeFromCart(productId: string): void;
  updateQuantity(productId: string, quantity: number): void;
  getCart(): Cart;
  clearCart(): void;
}
