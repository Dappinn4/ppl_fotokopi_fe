import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { DialogClose } from "@/components/ui/dialog";
import { DatePicker } from "@/components/ui/date-picker";
import {
  AddReportFormProps,
  SalesData,
} from "@/service/laporan/laporan-daily/laporan-daily-table-type";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const AddReportForm: React.FC<AddReportFormProps> = ({
  addDate,
  setAddDate,
  salesData,
  setSalesData,
  inventoryData,
  onSubmit,
  formatCurrency,
}) => {
  const addSalesItemRow = () =>
    setSalesData([
      ...salesData,
      { inventory_id: 0, quantity_sold: 1, price: 0 },
    ]);

  const removeSalesItemRow = (index: number) =>
    setSalesData((prev) => prev.filter((_, i) => i !== index));

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
          price: selectedItem
            ? selectedItem.unit_price * updated[index].quantity_sold
            : 0,
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(event);
    window.location.reload(); // Refresh the page after submitting the form
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Tanggal Laporan
        </label>
        <DatePicker
          selected={addDate}
          onChange={(selectedDate: Date) => setAddDate(selectedDate)}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Barang Terjual</h3>
        <div className="overflow-auto max-h-[50vh]">
          {salesData.map((sale, index) => (
            <div
              key={index}
              className="grid grid-cols-4 gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-200"
            >
              <Input
                type="text"
                value={formatCurrency(Number(sale.price))}
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
      </div>

      <DialogFooter className="space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={addSalesItemRow}
          className="flex items-center"
        >
          <Plus size={20} className="mr-2" /> Tambah Barang
        </Button>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Batal
          </Button>
        </DialogClose>
        <Button type="submit">Kirim Laporan</Button>
      </DialogFooter>
    </form>
  );
};
