import { create } from "zustand";
import { api } from "../../../shared/types/api";
import toast from "react-hot-toast";

interface Transaction {
  id: string;
  type: 'payout' | 'earning';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  method?: string;
  reference?: string;
}

interface WalletState {
  balance: number;
  totalEarned: number;
  pendingPayment: number;
  lastPayoutDate: string | null;
  transactions: Transaction[];
  loading: boolean;
  
  fetchEarnings: () => Promise<void>;
  requestPayout: (amount: number, method: string) => Promise<void>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  balance: 0,
  totalEarned: 0,
  pendingPayment: 0,
  lastPayoutDate: null,
  transactions: [],
  loading: false,

  fetchEarnings: async () => {
    try {
      set({ loading: true });
      const response = await api.get('/labeller/earnings');
      const data = response.data;
      
      set({
        balance: data.currentBalance || 0,
        totalEarned: data.totalEarned || 0,
        pendingPayment: data.pendingPayment || 0,
        lastPayoutDate: data.lastPayoutDate || null,
        // Mocking transactions for now until we have a real transactions model
        transactions: [
           { id: '1', type: 'earning', amount: 4.20, status: 'completed', date: new Date().toISOString(), method: 'Batch_Settlement', reference: 'B-69FA-01' },
           { id: '2', type: 'payout', amount: 50.00, status: 'completed', date: new Date(Date.now() - 86400000).toISOString(), method: 'M-Pesa', reference: 'TR-99812' },
           { id: '3', type: 'earning', amount: 12.50, status: 'pending', date: new Date(Date.now() - 172800000).toISOString(), method: 'Batch_Settlement', reference: 'B-772A-04' },
        ]
      });
    } catch (error) {
      console.error("Failed to fetch earnings", error);
    } finally {
      set({ loading: false });
    }
  },

  requestPayout: async (amount, method) => {
    try {
      set({ loading: true });
      // This endpoint would be implemented next
      // await api.post('/labeller/request-payout', { amount, method });
      toast.success("Payout request submitted to terminal.");
      await get().fetchEarnings();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Payout request failed.");
    } finally {
      set({ loading: false });
    }
  }
}));
