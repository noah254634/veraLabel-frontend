export interface OrderType {
  orderNumber: string;
  reference: string;
  _id: string;
  buyerId: string;
  totalPrice: number;
  status: 'pending' | 'approved';
  createdAt: Date;
  updatedAt: Date;
  paymentMethod: 'wallet' | 'card' | 'other';
}

