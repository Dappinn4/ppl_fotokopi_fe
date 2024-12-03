"use client";
import React, { useState, useEffect } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button"; // Adjust the import based on your UI library
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { fetchInventoryData, InventoryItem } from "@/service/inventory/inventory-fetcher"; // Adjust the import path

const DownloadButton: React.FC = () => {
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
    const [isOpen, setIsOpen] = useState(false); // State to manage dropdown open/close

    // Fetch inventory data from the API
    const handleFetchData = async () => {
        fetchInventoryData(setInventoryItems);
    };

    useEffect(() => {
        handleFetchData(); // Fetch data on component mount
    }, []);

    const handleDownload = async (selectedFormat: string) => {
        let fileName = "inventory_data";

        if (selectedFormat === "excel") {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Inventory Data");

            // Define columns for the worksheet
            worksheet.columns = [
                { header: "Inventory ID", key: "inventory_id", width: 15 },
                { header: "Item Name", key: "item_name", width: 25 },
                { header: "Quantity", key: "quantity", width: 10 },
                { header: "Unit Price", key: "unit_price", width: 15 },
                { header: "Last Updated", key: "last_updated", width: 20 },
            ];

            // Add rows to the worksheet
            inventoryItems.forEach((item) => {
                worksheet.addRow(item);
            });

            // Generate the Excel file as a Blob
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            fileName += ".xlsx"; // Excel file extension

            saveAs(blob, fileName);
        } else if (selectedFormat === "csv") {
            const csvData = inventoryItems.map(item => ({
                inventory_id: item.inventory_id,
                item_name: item.item_name,
                quantity: item.quantity,
                unit_price: item.unit_price,
                last_updated: item.last_updated,
            }));
            const csvString = Object.keys(csvData[0]).join(",") + "\n" +
                csvData.map(row => Object.values(row).join(",")).join("\n");
            const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
            fileName += ".csv"; // CSV file extension

            saveAs(blob, fileName);
        } else if (selectedFormat === "json") {
            const jsonString = JSON.stringify(inventoryItems, null, 2);
            const blob = new Blob([jsonString], { type: "application/json" });
            fileName += ".json"; // JSON file extension

            saveAs(blob, fileName);
        }

        // Close the dropdown after downloading
        setIsOpen(false);
    };

    const handleFormatChange = (value: string) => {
        handleDownload(value); // Call download with the selected format
    };

    return (
        <div className="flex items-center space-x-2">
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">Download Tabel</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel className="font-semibold w-full text-center">Format Download Tabel</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div onClick={() => handleFormatChange("excel")}>
                        <DropdownMenuItem>Excel</DropdownMenuItem>
                    </div>
                    <div onClick={() => handleFormatChange("csv")}>
                        <DropdownMenuItem>CSV</DropdownMenuItem>
                    </div>
                    <div onClick={() => handleFormatChange("json")}>
                        <DropdownMenuItem>JSON</DropdownMenuItem>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default DownloadButton;
