import React, { useEffect, useState, useRef } from "react";
import { addInventoryItem } from "@/service/inventory/inventory-add-service";
import { fetchInventoryData } from "@/service/inventory/inventory-fetcher";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";
import { InventoryItem } from "@/service/inventory/inventory-fetcher";

interface InventoryListAddButtonInlineProps {
  onAddSuccess: () => void;
}

export const InventoryListAddButtonInline: React.FC<
  InventoryListAddButtonInlineProps
> = ({ onAddSuccess }) => {
  const { toast } = useToast();
  const [inventory_id, setInventory_id] = useState<number | string>("");
  const [generateId, setGenerateId] = useState(false); // State for toggling random ID generation
  const [incrementId, setIncrementId] = useState(true); // State for toggling increment ID generation
  const [item_name, setItem_name] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [unit_price, setUnit_price] = useState<number>(0);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [preventSubmit, setPreventSubmit] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const isDuplicateRef = useRef(false);
  const requiredField = !inventory_id || !item_name || !quantity || !unit_price;

  const generateRandomId = () => Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit random ID

  // Effect to handle random ID generation
  useEffect(() => {
    if (generateId) {
      const newId = generateRandomId();
      setInventory_id(newId);
      isDuplicateRef.current = inventoryItems.some(
        (item) => item.inventory_id === newId
      );
      setPreventSubmit(isDuplicateRef.current);
    } else if (incrementId) {
      const maxId = Math.max(
        ...inventoryItems.map((item) => item.inventory_id),
        0
      );
      setInventory_id(maxId + 1);
      isDuplicateRef.current = inventoryItems.some(
        (item) => item.inventory_id === maxId + 1
      );
      setPreventSubmit(isDuplicateRef.current);
    } else {
      setInventory_id(""); // Clear ID if random generation is toggled off
    }
  }, [generateId, incrementId, inventoryItems]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchInventoryData(setInventoryItems);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!generateId && !incrementId) {
      isDuplicateRef.current = inventoryItems.some(
        (item) => item.inventory_id === Number(inventory_id)
      );
      setPreventSubmit(isDuplicateRef.current);
    }
  }, [inventory_id, inventoryItems, generateId, incrementId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPreventSubmit(true);

    if (!inventory_id || !item_name || !quantity || !unit_price) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Harus Diisi!`,
      });
      setPreventSubmit(false);
      return;
    }

    // Set last_update to the current date and time in ISO format
    const last_updated = new Date().toISOString();

    const data = {
      inventory_id: Number(inventory_id),
      item_name: item_name,
      quantity: quantity,
      unit_price: unit_price,
      last_updated: last_updated, // Automatically setting last_updated here
    };

    try {
      await addInventoryItem(data);
      onAddSuccess();
      toast({
        title: "Berhasil Ditambahkan",
        description: `Item ${inventory_id} telah ditambahkan.`,
      });
      setShowDialog(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Gagal untuk menambahkan : ${(error as Error).message}`,
      });
    } finally {
      setPreventSubmit(false);
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mr-2">
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[100%] max-w-xl rounded-md">
        <DialogHeader>
          <DialogTitle>Add Item</DialogTitle>
          <DialogDescription>
            Fill in the details below to add an item to the inventory.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 w-1/2">
                ID Barang
              </label>
              <div className="flex items-center w-1/2 justify-end">
                <label className="block text-sm font-medium text-gray-700 mr-2">
                  Buat ID Acak
                </label>
                <div
                  className="switch flex items-center p-1 w-12 h-6 bg-slate-100 rounded-full cursor-pointer"
                  onClick={() => {
                    setGenerateId(!generateId);
                    setIncrementId(false);
                  }}
                  data-ison={generateId}
                  style={{
                    justifyContent: generateId ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    className="handle"
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      backgroundColor: !generateId ? "#ffffff" : "gray",
                      border: "2px solid #d1d5db",
                      boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)",
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center w-1/2 justify-end mt-2">
                <label className="block text-sm font-medium text-gray-700 mr-2">
                  Penambahan ID
                </label>
                <div
                  className="switch flex items-center p-1 w-12 h-6 bg-slate-100 rounded-full cursor-pointer"
                  onClick={() => {
                    setIncrementId(!incrementId);
                    setGenerateId(false);
                  }}
                  data-ison={incrementId}
                  style={{
                    justifyContent: incrementId ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    className="handle"
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      backgroundColor: !incrementId ? "#ffffff" : "gray",
                      border: "2px solid #d1d5db",
                      boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)",
                    }}
                  />
                </div>
              </div>
            </div>
            <Input
              type="number"
              value={inventory_id}
              onChange={(e) =>
                setInventory_id(e.target.value ? Number(e.target.value) : "")
              }
              placeholder="Masukan ID Inventaris"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              disabled={generateId || incrementId}
            />
            {!inventory_id && (
              <p className="mt-1 text-sm text-red-600">
                ID inventaris harus diisi.
              </p>
            )}
            {preventSubmit && (
              <p className="mt-1 text-sm text-red-600">
                Sudah ada barang yang memakai ID ini
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Nama Barang
            </label>
            <Input
              type="text"
              value={item_name}
              onChange={(e) => setItem_name(e.target.value)}
              placeholder="Masukan Nama Barang"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {!item_name && (
              <p className="mt-1 text-sm text-red-600">
                Nama barang harus diisi.
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Jumlah Barang
            </label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="Masukan jumlah stok barang"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {!quantity && (
              <p className="mt-1 text-sm text-red-600">
                Jumlah barang harus diisi.
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Harga
            </label>
            <Input
              type="number"
              value={unit_price}
              onChange={(e) => setUnit_price(Number(e.target.value))}
              placeholder="Masukan Harga"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {!unit_price && (
              <p className="mt-1 text-sm text-red-600">Harga harus diisi.</p>
            )}
          </div>

          <Button disabled={preventSubmit || requiredField} type="submit">
            {requiredField ? (
              "Isi Seluruh Kolom"
            ) : !preventSubmit ? (
              "Add"
            ) : isDuplicateRef.current ? (
              "ID Sudah Diisi Barang Lain"
            ) : (
              <Icons.spinner
                style={{
                  animationName: "spin",
                  animationDuration: "1s",
                  animationTimingFunction: "linear",
                  animationIterationCount: "infinite",
                }}
              />
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
