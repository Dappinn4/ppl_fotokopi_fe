import React, { useState } from "react";
import { updateInventoryItem } from "@/service/inventory/inventory-update-service";
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

// InventoryListUpdateButtonInlineProps type
interface InventoryListUpdateButtonInlineProps {
    inventory_id: number;
    item_name: string;
    quantity: number
    unit_price: number
  onUpdateSuccess: () => void;
}

export const InventoryListUpdateButtonInline: React.FC<InventoryListUpdateButtonInlineProps> = ({
    inventory_id,
    item_name,
    quantity,
    unit_price,
  onUpdateSuccess,
}) => {

  // Toast hook
  const { toast } = useToast();

  // State for input fields
  const [namaItem, setNamaItem] = useState(item_name);
  const [kuantitas, setKuantitas] = useState(quantity);
  const [harga, setHarga] = useState(unit_price);

  // State for dialog visibility
  const [preventSubmit, setPreventSubmit] = useState(false);

  // State for dialog visibility
  const [showDialog, setShowDialog] = useState(false);

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setPreventSubmit(true);

    {/* Update inventory item */}
    const data = {
      inventory_id: inventory_id,
      item_name: namaItem,
      quantity: kuantitas,
      unit_price: harga
    };

    try {
      {/* Call the updateInventoryItem function */}
      await updateInventoryItem(data);
      onUpdateSuccess();
      toast({
        title: "Update successful",
        description: `Item ID ${inventory_id} has been successfully updated.`,
      });
      setShowDialog(false);
      {/* Error handling */}
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update item: ${(error as Error).message}`,
      });
      {/* Disable prevent submit */}
    } finally {
      setPreventSubmit(false);
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      {/* Dialog component */}
      <DialogTrigger asChild>
        {/* Dialog trigger */}
        <Button variant="outline" className="mr-2">
          Update
        </Button>
      </DialogTrigger>
      {/* Dialog content */}
      <DialogContent className="w-[100%] max-w-xl rounded-md">
        <DialogHeader>
          {/* Dialog header */}
          <DialogTitle>Update Item</DialogTitle>
          {/* Dialog description */}
          <DialogDescription>
            Fill in the details below to update an existing item in the inventory.
          </DialogDescription>
        </DialogHeader>

        {/* Form for updating inventory item */}
        <form onSubmit={handleUpdate}>
          {/* Item ID */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nama Barang</label>
            <Input
              type="text"
              value={namaItem}
              onChange={(e) => setNamaItem(e.target.value)}
              placeholder="Enter updated name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          { /* Category */ }
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Jumlah Barang</label>
            <Input
              type="text"
              value={kuantitas}
              onChange={(e) => setKuantitas(Number(e.target.value))}
              placeholder="Enter updated category"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          {/* Price */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Harga Barang</label>
            <Input
              type="number"
              value={harga}
              onChange={(e) => setHarga(Number(e.target.value))}
              placeholder="Enter updated price"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          {/* Update button */}
          <Button disabled={preventSubmit} type="submit">
            {/* Update button text */}
            {!preventSubmit ? (
              "Update"
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
