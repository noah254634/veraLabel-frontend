import type { User } from "../../../shared/types/user";
export interface Buyer extends User {
  walletBalance: number;
  reputationScore: number;
  purchasedItems: string[];
}
