import React, { useState } from "react";
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
import { Icons } from "@/components/ui/icons";
import { deleteInventoryItem } from "@/service/inventory/inventory-delete-service";
import { fetchInventoryData } from "@/service/inventory/inventory-fetcher";

interface InventoryListDeleteButtonInlineProps {
    inventory_id: number;
    onDeleteSuccess: () => void;
}

export const InventoryListDeleteButtonInline: React.FC<
    InventoryListDeleteButtonInlineProps
> = ({ inventory_id, onDeleteSuccess }) => {
    const { toast } = useToast();
    const [preventSubmit, setPreventSubmit] = useState(false);

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">Delete</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Item</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this item?
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={async (event) => {
                            event.preventDefault();
                            setPreventSubmit(true);

                            try {
                                await deleteInventoryItem(inventory_id);

                                toast({
                                    title: "Delete process successful",
                                    description: `Item ID ${inventory_id} has been successfully deleted.`,
                                });
                                fetchInventoryData(onDeleteSuccess);
                            } catch (error) {
                                console.error("Error:", error);
                                toast({
                                    variant: "destructive",
                                    title: "Uh oh! Something went wrong.",
                                    description: "Please try again.",
                                });
                            } finally {
                                setTimeout(() => setPreventSubmit(false), 5000);
                            }
                        }}
                    >
                        <Button
                            disabled={preventSubmit}
                            variant="destructive"
                            type="submit"
                        >
                            {!preventSubmit ? (
                                "Yes, Delete"
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
        </>
    );
};
