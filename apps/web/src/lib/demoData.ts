import type { LowStockProduct, Transaction, TrendPoint } from "../types";

export const demoShop = {
  name: "Ajao Community Pharmacy",
  location: "Ikeja, Lagos",
  ownerInitials: "AC",
};

export const demoSummary = {
  revenueKobo: 482_350 * 100,
  revenueChangePercent: 12.8,
  weeklyRevenueKobo: 2_366_000 * 100,
  salesCount: 38,
  salesChangePercent: 8.2,
  pendingCount: 5,
  pendingAmountKobo: 64_500 * 100,
  lowStockCount: 4,
  inventoryUnits: 1_284,
  inventoryValueKobo: 3_842_600 * 100,
  paidPercent: 86,
  pendingPercent: 9,
  failedPercent: 5,
};

export const demoTrend: TrendPoint[] = [
  { day: "Fri", amountKobo: 318_500 * 100 },
  { day: "Sat", amountKobo: 402_000 * 100 },
  { day: "Sun", amountKobo: 205_000 * 100 },
  { day: "Mon", amountKobo: 364_000 * 100 },
  { day: "Tue", amountKobo: 318_000 * 100 },
  { day: "Wed", amountKobo: 276_150 * 100 },
  { day: "Thu", amountKobo: 482_350 * 100 },
];

export const demoTransactions: Transaction[] = [
  {
    id: "sale-1048",
    reference: "MPB-1048",
    description: "Walk-in sale · 3 items",
    time: "10:42 am",
    amountKobo: 28_500 * 100,
    status: "Paid",
  },
  {
    id: "sale-1047",
    reference: "MPB-1047",
    description: "Walk-in sale · 2 items",
    time: "10:18 am",
    amountKobo: 12_800 * 100,
    status: "Pending",
  },
  {
    id: "sale-1046",
    reference: "MPB-1046",
    description: "Walk-in sale · 5 items",
    time: "9:56 am",
    amountKobo: 46_250 * 100,
    status: "Paid",
  },
  {
    id: "sale-1045",
    reference: "MPB-1045",
    description: "Walk-in sale · 1 item",
    time: "9:31 am",
    amountKobo: 3_500 * 100,
    status: "Failed",
  },
  {
    id: "sale-1044",
    reference: "MPB-1044",
    description: "Walk-in sale · 4 items",
    time: "9:12 am",
    amountKobo: 19_200 * 100,
    status: "Paid",
  },
];

export const demoLowStock: LowStockProduct[] = [
  { id: "prod-1", name: "Paracetamol 500mg", category: "Pain relief", quantity: 4, reorderAt: 12 },
  { id: "prod-2", name: "ORS sachets", category: "Hydration", quantity: 7, reorderAt: 15 },
  { id: "prod-3", name: "Amoxicillin 500mg", category: "Antibiotics", quantity: 3, reorderAt: 10 },
  { id: "prod-4", name: "Vitamin C 1000mg", category: "Supplements", quantity: 8, reorderAt: 12 },
];