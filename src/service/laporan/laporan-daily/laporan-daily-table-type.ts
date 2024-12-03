import { DailyReportsSummary } from "@/service/laporan/laporan-daily/laporan-harian-fetcher";
import { InventoryItem } from "@/service/inventory/inventory-fetcher";

export interface SalesData {
  inventory_id: number;
  quantity_sold: number;
  price: number;
}

export interface SearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  totalReports: number;
}

export interface ReportTableProps {
  loading: boolean;
  reports: DailyReportsSummary[];
  onDelete: (reportId: number) => Promise<void>;
  onUpdate: (report: DailyReportsSummary) => Promise<void>;
  formatCurrency: (amount: number) => string;
}

export interface AddReportFormProps {
  addDate: Date | null;
  setAddDate: (date: Date) => void;
  salesData: SalesData[];
  setSalesData: React.Dispatch<React.SetStateAction<SalesData[]>>;
  inventoryData: InventoryItem[];
  onSubmit: (e: React.FormEvent) => Promise<void>;
  formatCurrency: (amount: number) => string;
}