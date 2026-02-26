import type { CartItem, Cart } from "../types/cart";
import { create } from "zustand";
type cartStore = {
  error: string | null;
  loading: boolean;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  cart: Cart;
  addToCart(item: CartItem): Promise<void>;
  removeFromCart(productId: string): Promise<void>;
  updateQuantity(productId: string, quantity: number): Promise<void>;
  getCart(): Promise<Cart>;
  clearCart(): void;
};
export const useCartStore = create<cartStore>((set, get) => ({
    error:null,
    loading:false,
    setError:(error:string|null)=>set({error}),
    setLoading:(loading:boolean)=>set({loading}),
    cart: {
        buyerId: "",
        items: [],
        totalAmount: 0,
    },
    addToCart: async (item: CartItem) => {
        try {
        }catch(err){}finally{}
    },
    removeFromCart: async (productId: string) => {
        try {
        }catch(err){}finally{

        }
        },
        updateQuantity: async (productId: string, quantity: number) => {
            try {
            }catch(err){}finally{

            }
        },
        getCart: async ():Promise<Cart> => {
            try {
                return get().cart;
            }catch(err){
                const errorMessage=err instanceof Error?err.message:"Unknown Error";
                set({ error: errorMessage });
                return get().cart;
            }finally{
            }
        },
        clearCart: () => {},
}))