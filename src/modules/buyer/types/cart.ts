export interface CartItem {
  datasetId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Cart {
  buyerId: string;
  items: CartItem[];
  totalAmount: number;
}
