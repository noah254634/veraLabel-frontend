export interface Review {
  id: string;
  buyerId: string;
  productId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: Date;
}
