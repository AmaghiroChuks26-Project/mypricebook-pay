export type BadgeTone = "success" | "warning" | "danger" | "info" | "neutral";

export type PaymentStatus = "Paid" | "Pending" | "Failed";

export interface Transaction {
  id: string;
  reference: string;
  description: string;
  time: string;
  amountKobo: number;
  status: PaymentStatus;
}

export interface LowStockProduct {
  id: string;
  name: string;
  category: string;
  quantity: number;
  reorderAt: number;
}

export interface TrendPoint {
  day: string;
  amountKobo: number;
}