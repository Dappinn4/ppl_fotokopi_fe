import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { deleteInventoryItem } from "@/service/inventory/inventory-delete-service";
import { fetchInventoryData } from "@/service/inventory/inventory-fetcher";
import { InventoryItem } from "@/service/inventory/inventory-fetcher";

interface InventoryListDeleteActionButtonInlineProps {
  onDeleteSuccess: () => void;
}

export const InventoryListDeleteActionButtonInline: React.FC<
  InventoryListDeleteActionButtonInlineProps
> = ({ onDeleteSuccess }) => {
  const { toast } = useToast();
  const [inventory_id, setInventory_id] = useState<number | string | null>("");
  const [preventSubmit, setPreventSubmit] = useState(true);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [isMainDialogOpen, setIsMainDialogOpen] = useState(false);

  const refreshData = async () => {
    try {
      await fetchInventoryData((data) => {
        setInventoryItems(data); // update state with fetched data
        if (inventory_id) {
          const foundItem = data.find(
            (item) => item.inventory_id === inventory_id
          );
          setSelectedItem(foundItem || null);
        }
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Tidak dapat mengambil data.",
      });
    }
  };

  useEffect(() => {
    refreshData(); // Fetch initial data
  }, []);

  useEffect(() => {
    if (inventory_id !== null) {
      const exists = inventoryItems.some(
        (item) => item.inventory_id === inventory_id
      );
      setPreventSubmit(!exists);
      setSelectedItem(
        inventoryItems.find((item) => item.inventory_id === inventory_id) ||
          null
      );
    } else {
      setPreventSubmit(true);
      setSelectedItem(null);
    }
  }, [inventory_id, inventoryItems]);

  const handleDeleteClick = (event: React.FormEvent) => {
    event.preventDefault();
    if (!preventSubmit) {
      setShowConfirmationDialog(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (inventory_id === null) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Tolong Masukkan ID  Barang Yang Valid.",
      });
      return;
    }

    try {
      await deleteInventoryItem(Number(inventory_id));
      toast({
        title: "Delete process successful",
        description: `Item ID ${inventory_id} has been successfully deleted.`,
      });
      await refreshData(); // Fetch new data after deletion
      onDeleteSuccess();
      setIsMainDialogOpen(false); // Close the main dialog
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Ada yang salah.",
        description: "Silahkan Coba Lagi.",
      });
    } finally {
      setShowConfirmationDialog(false); // Close confirmation dialog
    }
  };

  return (
    <Dialog open={isMainDialogOpen} onOpenChange={setIsMainDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsMainDialogOpen(true)}>
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="w-5/6 max-w-5xl">
        <DialogHeader>
          <DialogTitle>Hapus Barang</DialogTitle>
          <DialogDescription>
            Masukan ID Barang Yang Ingin Kamu Hapus.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleDeleteClick}>
          <div className="mb-4">
            {selectedItem && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Item Details</h3>
                <table className="w-full border mt-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-2 py-1">ID Barang</th>
                      <th className="border px-2 py-1">Nama Barang</th>
                      <th className="border px-2 py-1">Jumlah Barang</th>
                      <th className="border px-2 py-1">Harga</th>
                      <th className="border px-2 py-1">Terakhir Diperbarui</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-2 py-1 text-center">
                        {selectedItem.inventory_id}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {selectedItem.item_name}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {selectedItem.quantity}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        Rp.{" "}
                        {Number(selectedItem.unit_price)
                          .toFixed(0)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {new Date(selectedItem.last_updated).toLocaleTimeString(
                          "en-GB",
                          { hour12: false }
                        )}{" "}
                        |{" "}
                        {new Date(selectedItem.last_updated).toLocaleDateString(
                          "en-GB"
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            <label className="block text-sm font-medium text-gray-700">
              ID Barang
            </label>
            <Input
              type="number"
              value={inventory_id ?? ""}
              onChange={(e) =>
                setInventory_id(e.target.value ? Number(e.target.value) : "")
              }
              placeholder="Masukan ID Barang"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {!inventory_id && (
              <p className="mt-1 text-sm text-red-600">ID Barang Harus Diisi</p>
            )}
            {preventSubmit && inventory_id && (
              <p className="mt-1 text-sm text-red-600">
                ID Barang Tidak Ditemukan
              </p>
            )}
          </div>

          <Button
            disabled={preventSubmit || inventory_id === null}
            variant={!preventSubmit ? "destructive" : "default"}
            onClick={handleDeleteClick}
          >
            {!preventSubmit ? "Delete" : "Invalid ID"}
          </Button>
        </form>
      </DialogContent>

      {/* Confirmation Dialog */}
      {showConfirmationDialog && (
        <Dialog
          open={showConfirmationDialog}
          onOpenChange={setShowConfirmationDialog}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Delete this item permanently</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this item? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowConfirmationDialog(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
};
