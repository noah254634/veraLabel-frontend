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
  requestWithdrawalOTP: (amount: number) => Promise<boolean>;
  requestPayout: (amount: number, phoneNumber: string, otp: string) => Promise<void>;
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
      const data = response.data?.data || response.data;
      
      set({
        balance: data.currentBalance || 0,
        totalEarned: data.totalEarned || 0,
        pendingPayment: data.pendingPayment || 0,
        lastPayoutDate: data.lastPayoutDate || null,
        transactions: data.transactions || []
      });
    } catch (error) {
      console.error("Failed to fetch earnings", error);
    } finally {
      set({ loading: false });
    }
  },

  requestWithdrawalOTP: async (amount: number) => {
    try {
      set({ loading: true });
      await api.post('/payments/withdraw/otp', { amount });
      toast.success("OTP sent to your email.");
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP.");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  requestPayout: async (amount: number, phoneNumber: string, otp: string) => {
    try {
      set({ loading: true });
      await api.post('/payments/withdraw', { amount, phoneNumber, otp });
      toast.success("Withdrawal request submitted successfully.");
      await get().fetchEarnings();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Withdrawal request failed.");
      throw error; // Rethrow to let the UI handle the failure state if needed
    } finally {
      set({ loading: false });
    }
  }
}));
