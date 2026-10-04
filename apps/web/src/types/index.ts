export type BadgeTone = "success" | "warning" | "danger" | "info" | "neutral";

export type PaymentStatus = "Paid" | "Pending" | "Failed";
export type ProductStatus = "active" | "inactive";

export interface ProductPricing {
  currency: string;
  selling_price_kobo: number;
  cost_price_kobo: number;
}

export interface ProductStock {
  quantity: number;
  reorder_level: number;
}

export interface Product {
  id: string;
  name: string;
  generic_name: string | null;
  brand: string | null;
  category: string;
  strength: string | null;
  dosage_form: string | null;
  pack_size: string | null;
  sku: string;
  unit: string;
  status: ProductStatus;
  pricing: ProductPricing;
  stock: ProductStock;
  created_at: string;
  updated_at: string;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
}

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