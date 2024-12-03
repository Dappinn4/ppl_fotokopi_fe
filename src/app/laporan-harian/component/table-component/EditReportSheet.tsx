import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { DailyReportsSummary } from "@/service/laporan/laporan-daily/laporan-harian-fetcher";
import { SalesData } from "@/service/laporan/laporan-daily/laporan-daily-table-type";
import { useToast } from "@/hooks/use-toast";
import { updateDailyReport } from "@/service/laporan/laporan-daily/laporan-daily-update-service";
import { InventoryItem } from "@/service/inventory/inventory-fetcher";

interface EditReportSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: DailyReportsSummary | null;
  salesData: SalesData[];
  setSalesData: (data: SalesData[]) => void;
  inventoryData: InventoryItem[];
  onSubmit: (report: DailyReportsSummary) => void;
  formatCurrency: (amount: number) => string;
}

export const EditReportSheet: React.FC<EditReportSheetProps> = ({
  open,
  onOpenChange,
  report,
  salesData,
  setSalesData,
  inventoryData,
  onSubmit,
  formatCurrency,
}) => {
  const { toast } = useToast();
  const [addDate, setAddDate] = useState<Date | null>(
    report ? new Date(report.date) : new Date()
  );
  const [reportToEdit, setReportToEdit] = useState<DailyReportsSummary | null>(
    null
  );

  const handleSalesChange = (
    index: number,
    field: "inventory_id" | "quantity_sold" | "price",
    value: number
  ) => {
    const newSalesData = [...salesData];
    newSalesData[index][field] = value;
    setSalesData(newSalesData);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!addDate || !report) return;

    try {
      // Update the report's date and sales data using the updateDailyReport service
      const updatedSalesData = salesData.map((sale) => {
        const item = inventoryData.find(
          (item) => item.inventory_id === sale.inventory_id
        );
        return {
          ...sale,
          price: item ? item.unit_price * sale.quantity_sold : sale.price,
        };
      });

      await updateDailyReport(report.reportId, {
        salesData: updatedSalesData,
        date: addDate.toISOString().split("T")[0],
      });

      toast({
        title: "Laporan Diperbarui",
        description: "Laporan berhasil diperbarui.",
        variant: "default",
      });
      onOpenChange(false);
      setReportToEdit(null);
      window.location.reload();
    } catch {
      toast({
        title: "Gagal Memperbarui",
        description: "Terjadi kesalahan saat memperbarui laporan.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-[600px] p-6 overflow-y-auto"
        style={{ maxHeight: "90vh" }}
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold text-slate-900 mb-2">
            Edit Laporan Penjualan
          </SheetTitle>
          <SheetDescription className="text-gray-600 text-sm">
            Perbarui detail laporan harian Anda
          </SheetDescription>
        </SheetHeader>

        {report && (
          <form onSubmit={handleSaveEdit} className="space-y-5">
            {/* Date Picker */}
            <div className="space-y-2">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700"
              >
                Tanggal Laporan
              </label>
              <DatePicker
                selected={addDate}
                onChange={(selectedDate: Date) => setAddDate(selectedDate)}
              />
            </div>

            {/* Sales Entries */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Barang Terjual
              </h3>
              {salesData.map((sale, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="col-span-4 mb-2">
                    <label className="block text-xs text-gray-600 mb-1">
                      Harga
                    </label>
                    <Input
                      type="text"
                      value={`Rp ${Number(
                        (inventoryData.find(
                          (item) => item.inventory_id === sale.inventory_id
                        )?.unit_price ?? 0) * sale.quantity_sold
                      ).toFixed(2)}`}
                      readOnly
                      className="bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">
                      Nama Barang
                    </label>
                    <select
                      value={sale.inventory_id}
                      onChange={(e) =>
                        handleSalesChange(
                          index,
                          "inventory_id",
                          parseInt(e.target.value)
                        )
                      }
                      required
                      className="col-span-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500"
                    >
                      <option value="">Pilih Barang</option>
                      {inventoryData.map(
                        (item: {
                          inventory_id: number;
                          item_name: string;
                          quantity: number;
                        }) => (
                          <option
                            key={item.inventory_id}
                            value={item.inventory_id}
                          >
                            {item.item_name} (Stock: {item.quantity})
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs text-gray-600 mb-1">
                      Quantity
                    </label>
                    <Input
                      type="number"
                      placeholder="Qty"
                      value={sale.quantity_sold}
                      onChange={(e) => {
                        const newSalesData = [...salesData];
                        newSalesData[index].quantity_sold = parseInt(
                          e.target.value
                        );
                        setSalesData(newSalesData);
                      }}
                      min={1}
                      required
                      className="focus:ring-2 focus:ring-slate-500"
                    />
                  </div>
                  {salesData.length > 1 && (
                    <div className="col-span-1 flex items-end">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="w-full"
                        onClick={() =>
                          setSalesData(salesData.filter((_, i) => i !== index))
                        }
                      >
                        <Trash2 size={20} />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setSalesData([
                    ...salesData,
                    { inventory_id: 0, quantity_sold: 1, price: 0 },
                  ])
                }
                className="flex-1 border-slate-500 text-slate-600 hover:bg-slate-50"
              >
                <Plus size={20} className="mr-2" /> Tambah Barang
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-slate-600 hover:bg-slate-700"
              >
                Simpan Laporan
              </Button>
            </div>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
};
