import React, { useState, useEffect } from "react";
import Filters from "./card-component/daily-report-cards-filter";
import ReportCard from "./card-component/daily-report-card-component";
import PaginationComponent from "./card-component/daily-report-card-pagination";
import { Trash2, Pen } from "lucide-react";
import AddDailyReportCard from "./card-component/add-daily-report-cards";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

import { deleteDailyReport } from "@/service/laporan/laporan-daily/laporan-daily-delete-service";
import { updateDailyReport } from "@/service/laporan/laporan-daily/laporan-daily-update-service";
import { fetchInventoryData } from "@/service/inventory/inventory-fetcher"; // Import the fetch service

export interface ItemSold {
  itemId: number;
  itemName: string;
  quantitySold: number;
  totalPrice: number;
}

export interface DailyReportsSummary {
  reportId: number;
  date: string;
  totalCost: number;
  totalItemsSold: number;
  itemsSold: ItemSold[];
}

interface DailyReportCardProps {
  reports: DailyReportsSummary[];
  uniqueMonths: string[];
  uniqueYears: string[];
}

const DailyReportCard: React.FC<DailyReportCardProps> = ({
  reports,
  uniqueMonths,
  uniqueYears,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"most-recent" | "oldest">(
    "most-recent"
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] =
    useState<DailyReportsSummary | null>(null);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [reportToEdit, setReportToEdit] = useState<DailyReportsSummary | null>(
    null
  );
  const [salesData, setSalesData] = useState<
    { inventory_id: number; quantity_sold: number; price: number }[]
  >([]);
  const { toast } = useToast();
  const [inventoryData, setInventoryData] = useState<
    {
      inventory_id: number;
      item_name: string;
      quantity: number;
      price: number;
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchInventoryData(
          (
            data: {
              inventory_id: number;
              item_name: string;
              quantity: number;
              unit_price: number;
            }[]
          ) =>
            setInventoryData(
              data.map((item) => ({ ...item, price: item.unit_price }))
            )
        );
      } catch {
        toast({
          variant: "destructive",
          title: "Data Fetch Error",
          description: "Unable to load inventory items.",
        });
      }
    };
    fetchData();
  }, [toast]);

  const handleSalesChange = (
    index: number,
    field: "inventory_id" | "quantity_sold" | "price",
    value: number
  ) => {
    const newSalesData = [...salesData];
    newSalesData[index][field] = value;
    setSalesData(newSalesData);
  };
  const itemsPerPage = 11;

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleDelete = async () => {
    if (!reportToDelete) return;

    try {
      await deleteDailyReport(reportToDelete.reportId);
      toast({
        title: "Berhasil",
        description: "Laporan berhasil dihapus.",
        variant: "default",
      });
      setReportToDelete(null);
      setDeleteDialogOpen(false);
      window.location.reload();
    } catch {
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menghapus laporan.",
        variant: "destructive",
      });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportToEdit) return;

    try {
      // Adjust date to UTC format
      const utcDate = new Date(reportToEdit.date);
      const correctedDate = new Date(
        utcDate.getTime() - utcDate.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];

      // Ensure salesData includes the correct price for each item
      const updatedSalesData = salesData.map((sale) => {
        const item = inventoryData.find(
          (item) => item.inventory_id === sale.inventory_id
        );
        return {
          ...sale,
          price: item ? item.price : sale.price,
        };
      });

      await updateDailyReport(reportToEdit.reportId, {
        salesData: updatedSalesData,
        date: correctedDate, // Send corrected date
      });

      toast({
        title: "Laporan Diperbarui",
        description: "Laporan berhasil diperbarui.",
        variant: "default",
      });
      setEditSheetOpen(false);
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

  const filteredReports = reports
    .filter((report) =>
      selectedMonth ? report.date.split("-")[1] === selectedMonth : true
    )
    .filter((report) =>
      selectedYear ? report.date.split("-")[0] === selectedYear : true
    )
    .sort((a, b) =>
      sortOrder === "most-recent"
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime()
    );

  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <p>*Klik kanan kartu untuk menampilkan opsi</p>
      <Filters
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        uniqueMonths={uniqueMonths.map(Number)}
        uniqueYears={uniqueYears.map(Number)}
      />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AddDailyReportCard />
        {paginatedReports.map((report) => (
          <ContextMenu key={report.reportId}>
            <ContextMenuTrigger>
              <ReportCard key={report.reportId} report={report} />
            </ContextMenuTrigger>
            <ContextMenuContent className="w-48">
              <ContextMenuItem
                onClick={() => {
                  setReportToEdit(report);
                  setSalesData(
                    report.itemsSold.map((item) => ({
                      inventory_id: item.itemId,
                      quantity_sold: item.quantitySold,
                      price: item.totalPrice,
                    }))
                  );
                  setEditSheetOpen(true);
                }}
                className="px-3 py-2 flex items-center gap-2"
              >
                <Pen className="h-4 w-4" />
                <span>Edit Laporan</span>
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => {
                  setReportToDelete(report);
                  setDeleteDialogOpen(true);
                }}
                className="px-3 py-2 text-red-600 flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Hapus Laporan</span>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>

      <PaginationComponent
        currentPage={currentPage}
        totalItems={filteredReports.length}
        itemsPerPage={itemsPerPage}
        handlePageChange={handlePageChange}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
          </DialogHeader>
          <p>Apakah Anda yakin ingin menghapus laporan ini?</p>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={!reportToDelete}
            >
              <Trash2 />
              Hapus
            </Button>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Batal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sheet for Editing */}
      <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
        <SheetContent
          className="w-[600px] p-6 overflow-y-auto"
          style={{ maxHeight: "95vh" }}
        >
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl font-bold text-slate-900 mb-2">
              Edit Laporan Penjualan
            </SheetTitle>
            <SheetDescription className="text-gray-600 text-sm">
              Perbarui detail laporan harian Anda
            </SheetDescription>
          </SheetHeader>

          {reportToEdit && (
            <form onSubmit={handleEditSubmit} className="space-y-5">
              {/* Date Picker */}
              <div className="space-y-2">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tanggal Laporan
                </label>
                <DatePicker
                  selected={new Date(reportToEdit.date)}
                  onChange={(selectedDate: Date) => {
                    if (reportToEdit) {
                      const correctedDate = new Date(
                        selectedDate.getTime() -
                          selectedDate.getTimezoneOffset() * 60000
                      );
                      setReportToEdit({
                        ...reportToEdit,
                        date: correctedDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
                      });
                    }
                  }}
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
                          )?.price ?? 0) * sale.quantity_sold
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
                            setSalesData(
                              salesData.filter((_, i) => i !== index)
                            )
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
    </div>
  );
};

export default DailyReportCard;
