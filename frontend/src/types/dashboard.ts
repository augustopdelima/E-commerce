export interface DashboardStats {
  period: {
    start: string;
    end: string;
  };
  totalSales: number;
  topProduct: {
    name: string;
    quantity: number;
    revenue: number;
  } | null;
  lowStock: Array<{
    id: number;
    name: string;
    stock: number;
    price: number;
  }>;
}