import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  fetchInventoryData,
  InventoryItem,
} from "@/service/inventory/inventory-fetcher";
import {
  fetchAllDailyReports,
  DailyReportsSummary,
} from "@/service/laporan/laporan-daily/laporan-harian-fetcher";
import { recordDailyReport } from "@/service/laporan/laporan-daily/laporan-daily-add-service";
import { SearchFilters } from "./table-component/table-search-filter";
import { ReportTable } from "./table-component/report-table-component";
import { AddReportForm } from "./table-component/add-report-table-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SalesData } from "@/service/laporan/laporan-daily/laporan-daily-table-type";
import { EditReportSheet } from "./table-component/EditReportSheet";
import { deleteDailyReport } from "@/service/laporan/laporan-daily/laporan-daily-delete-service";
import { updateDailyReport } from "@/service/laporan/laporan-daily/laporan-daily-update-service";

export default function DailyReportDataTable() {
  const { toast } = useToast();
  const [dailyReports, setDailyReports] = useState<DailyReportsSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [date, setDate] = useState<Date>();
  const [addDate, setAddDate] = useState<Date | null>(new Date());
  const [salesData, setSalesData] = useState<SalesData[]>([
    { inventory_id: 0, quantity_sold: 1, price: 0 },
  ]);
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [reportToEdit, setReportToEdit] = useState<DailyReportsSummary | null>(
    null
  );
  const [editSheetOpen, setEditSheetOpen] = useState(false);

  useEffect(() => {
    loadReports();
    loadInventoryData();
  }, []);

  const loadReports = async () => {
    try {
      const reports = await fetchAllDailyReports();
      setDailyReports(reports);
    } catch (err) {
      setError("Failed to fetch daily reports.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadInventoryData = async () => {
    try {
      await fetchInventoryData((data) => setInventoryData(data));
    } catch {
      toast({
        variant: "destructive",
        title: "Data Fetch Error",
        description: "Unable to load inventory items.",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!addDate) {
      toast({
        variant: "destructive",
        title: "Date Missing",
        description: "Please select a valid date for the report.",
      });
      return;
    }

    try {
      const result = await recordDailyReport({
        date: format(addDate, "yyyy-MM-dd"),
        salesData,
      });

      await loadReports();

      toast({
        title: "Report Submitted",
        description: result.message || "Daily report recorded successfully!",
        variant: "default",
      });

      setSalesData([{ inventory_id: 0, quantity_sold: 1, price: 0 }]);
      setAddDate(new Date());
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Error Submitting Report",
        description:
          error instanceof Error ? error.message : "Unknown error occurred.",
      });
    }
  };

  const handleDelete = async (reportId: number) => {
    try {
      await deleteDailyReport(reportId);
      setDailyReports(
        dailyReports.filter((report) => report.reportId !== reportId)
      );
      toast({
        title: "Report Deleted",
        description: "Daily report deleted successfully!",
        variant: "default",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error Deleting Report",
        description:
          error instanceof Error ? error.message : "Unknown error occurred.",
      });
    }
  };

  const handleUpdate = async (report: DailyReportsSummary) => {
    setReportToEdit(report);
    setSalesData(
      report.itemsSold.map((item) => ({
        inventory_id: item.itemId,
        quantity_sold: item.quantitySold,
        price: item.totalPrice,
      }))
    );
    setEditSheetOpen(true);
  };

  const handleSaveEdit = async (updatedReport: DailyReportsSummary) => {
    try {
      await updateDailyReport(updatedReport.reportId, {
        date: format(new Date(updatedReport.date), "yyyy-MM-dd"),
        salesData,
      });

      setEditSheetOpen(false);
      setReportToEdit(null);
      await loadReports();
      toast({
        title: "Report Updated",
        description: "Daily report updated successfully!",
        variant: "default",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error Updating Report",
        description:
          error instanceof Error ? error.message : "Unknown error occurred.",
      });
    }
  };

  const filteredReports = dailyReports.filter((report) => {
    const matchesSearch = report.itemsSold.some((item) =>
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const matchesDate = date
      ? format(new Date(report.date), "yyyy-MM-dd") ===
        format(date, "yyyy-MM-dd")
      : true;

    return matchesSearch && matchesDate;
  });

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-800 flex items-center gap-2">
          <span className="rounded-full bg-red-100 p-1">⚠️</span>
          {error}
        </p>
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <SearchFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          date={date}
          setDate={setDate}
          totalReports={filteredReports.length}
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Report
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Daily Report</DialogTitle>
              <DialogDescription>
                Record your daily sales and inventory movements
              </DialogDescription>
            </DialogHeader>
            <AddReportForm
              addDate={addDate}
              setAddDate={setAddDate}
              salesData={salesData}
              setSalesData={setSalesData}
              inventoryData={inventoryData}
              onSubmit={handleAddSubmit}
              formatCurrency={formatCurrency}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border">
        <ReportTable
          loading={loading}
          reports={filteredReports}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          formatCurrency={formatCurrency}
        />
      </div>

      {/* Edit Sheet */}
      <EditReportSheet
        open={editSheetOpen}
        onOpenChange={setEditSheetOpen}
        report={reportToEdit}
        salesData={salesData}
        setSalesData={setSalesData}
        inventoryData={inventoryData}
        onSubmit={handleSaveEdit}
        formatCurrency={formatCurrency}
      />
    </Card>
  );
}
