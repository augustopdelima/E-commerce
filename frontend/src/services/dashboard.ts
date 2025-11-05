import { api } from "./api";
import type { DashboardStats } from "../types/dashboard";

export const dashboardService = {
  async getDashboardStats(token: string | null, userId?:string): Promise<DashboardStats> {
    const config = token !== null && userId
      ? { headers: { Authorization: `Bearer ${token}`, userid: userId } }
      : undefined;
    const { data } = await api.get<DashboardStats>("/admin/dashboard", config);
    return data;
  },
};