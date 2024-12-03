import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { format } from "date-fns";
import {
  fetchInventoryData,
  InventoryItem,
} from "@/service/inventory/inventory-fetcher";
import { DatePicker } from "@/components/ui/date-picker";
import { recordDailyReport } from "@/service/laporan/laporan-daily/laporan-daily-add-service";

interface SalesData {
  inventory_id: number;
  quantity_sold: number;
  price: number; // This is the calculated price based on quantity_sold
  unit_price: number; // This stores the original unit price
}

export default function AddDailyReportCard() {
  const { toast } = useToast();

  // States
  const [date, setDate] = useState<Date | null>(new Date());
  const [salesData, setSalesData] = useState<SalesData[]>([
    { inventory_id: 0, quantity_sold: 1, price: 0, unit_price: 0 },
  ]);
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Fetch inventory data on component mount
  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
  }, [toast]);

  // Add a new sales row
  const addSalesItemRow = () =>
    setSalesData([
      ...salesData,
      { inventory_id: 0, quantity_sold: 1, price: 0, unit_price: 0 },
    ]);

  // Update sales data
  const handleSalesChange = (
    index: number,
    field: keyof SalesData,
    value: string | number
  ) => {
    setSalesData((prev) => {
      const updated = [...prev];
      if (field === "inventory_id") {
        const id = parseInt(value as string, 10);
        const selectedItem = inventoryData.find(
          (item) => item.inventory_id === id
        );
        updated[index] = {
          ...updated[index],
          inventory_id: id,
          unit_price: selectedItem ? selectedItem.unit_price : 0,
          price: selectedItem
            ? selectedItem.unit_price * updated[index].quantity_sold
            : 0, // Calculated price based on quantity
        };
      } else if (field === "quantity_sold") {
        updated[index] = {
          ...updated[index],
          quantity_sold: value as number,
          price:
            (inventoryData.find(
              (item) => item.inventory_id === updated[index].inventory_id
            )?.unit_price || 0) * (value as number),
        };
      }
      return updated;
    });
  };

  // Submit the daily report
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      toast({
        variant: "destructive",
        title: "Date Missing",
        description: "Please select a valid date for the report.",
      });
      return;
    }

    // Prepare data with original unit_price for submission
    const modifiedSalesData = salesData.map((sale) => ({
      inventory_id: sale.inventory_id,
      quantity_sold: sale.quantity_sold,
      price: sale.unit_price, // Use the original price for submission
    }));

    try {
      const result = await recordDailyReport({
        date: format(date, "yyyy-MM-dd"),
        salesData: modifiedSalesData, // Send modified data to the API
      });
      toast({
        title: "Report Submitted",
        description: result.message || "Daily report recorded successfully!",
        variant: "default",
      });
      setIsSheetOpen(false); // Close the sheet
      window.location.reload(); // Refresh the page
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Submission Error",
        description:
          error instanceof Error ? error.message : "Unknown error occurred.",
      });
    }
  };

  // Remove a sales row
  const removeSalesItemRow = (index: number) =>
    setSalesData((prev) => prev.filter((_, i) => i !== index));

  // Render
  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Card className="p-8 flex justify-center items-center transform transition-transform duration-300 hover:scale-105 cursor-pointer rounded-lg shadow-lg bg-gray-50 hover:bg-white">
          <div className="flex flex-col items-center">
            <Plus size={35} className="text-gray-700" />
            <p className="text-gray-700 mt-2 text-lg font-semibold">
              Add Report
            </p>
          </div>
        </Card>
      </SheetTrigger>
      <SheetContent className="w-[500px] p-8 overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-3xl font-bold text-slate-900">
            Laporan Penjualan
          </SheetTitle>
          <SheetDescription className="text-gray-600">
            Catat penjualan harian dan pergerakan inventaris Anda
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Picker */}
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tanggal Laporan
            </label>
            <DatePicker
              selected={date}
              onChange={(selectedDate: Date) => setDate(selectedDate)}
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
                <Input
                  type="text"
                  value={`Rp ${Number(sale.price).toFixed(2)}`} // Display calculated price based on quantity
                  readOnly
                  className="bg-gray-100 text-gray-600 cursor-not-allowed col-span-4"
                />
                <select
                  value={sale.inventory_id}
                  onChange={(e) =>
                    handleSalesChange(index, "inventory_id", e.target.value)
                  }
                  required
                  className="col-span-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500"
                >
                  <option value="">Pilih Barang</option>
                  {inventoryData.map((item) => (
                    <option key={item.inventory_id} value={item.inventory_id}>
                      {item.item_name} (Stock: {item.quantity})
                    </option>
                  ))}
                </select>
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={sale.quantity_sold}
                  onChange={(e) =>
                    handleSalesChange(
                      index,
                      "quantity_sold",
                      parseInt(e.target.value)
                    )
                  }
                  min={1}
                  required
                  className="focus:ring-2 focus:ring-slate-500"
                />
                {salesData.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="justify-self-end"
                    onClick={() => removeSalesItemRow(index)}
                  >
                    <Trash2 size={20} />
                  </Button>
                )}
              </div>
            ))}
          </div>
          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={addSalesItemRow}
              className="flex-1 border-slate-500 text-slate-600 hover:bg-slate-50"
            >
              <Plus size={20} className="mr-2" /> Tambah Barang
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-slate-600 hover:bg-slate-700"
            >
              Kirim Laporan
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
