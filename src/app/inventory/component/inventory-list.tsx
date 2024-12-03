"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableRowSkeleton } from "@/components/ui/table-row-skeleton";
import { InventorySearch } from "./inventory-search";
import { filterInventory } from "./filter-inventory";
import { InventoryListDeleteButtonInline } from "./Inventory-list-delete-button-inline";
import { InventoryListUpdateButtonInline } from "./Inventory-list-update-button-inline";
import { InventoryListAddButtonInline } from "./inventory-list-add-action-button";
import { InventoryListDeleteActionButtonInline } from "./inventory-list-delete-action-button";
import { Pagination } from "@/components/ui/pagination";
import DownloadButton from "./inventory-list-download-action-button";
// Inventory item type
interface InventoryItem {
    inventory_id: number;
    item_name: string;
    quantity: number
    unit_price: number
    last_updated: string;
}

// InventoryList component props
interface InventoryListProps {
    inventoryData: InventoryItem[];
    searchQuery: string;
    onSearchChange: (query: string) => void;
    itemsPerPage: number;
    onDeleteSuccess: () => void;
    onUpdateSuccess: () => void;
    isLoading: boolean;
}

export const InventoryList: React.FC<InventoryListProps> = ({
    inventoryData,
    searchQuery,
    onSearchChange,
    itemsPerPage,
    onDeleteSuccess,
    isLoading,
    onUpdateSuccess,
}) => {

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);

    // Filter inventory data based on search query
    const filteredInventory = filterInventory(inventoryData, searchQuery);

    // Calculate total pages and get items for current page
    const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);

    // Slice the inventory data based on current page
    const displayedItems = filteredInventory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        // Tabel Inventaris
        <div>
            <Card className="p-4">
                <CardHeader>
                    {/* Inventory title */}
                    <CardTitle>
                        <div className="flex justify-between items-center">
                            <div className="text-xl font-semibold">
                                <h1>Tabel Inventaris</h1>
                            </div>
                            {/* Search input field */}
                            <div className="w-1/3">
                                <InventorySearch searchQuery={searchQuery} onSearchChange={onSearchChange} />
                            </div>
                        </div>
                    </CardTitle>
                </CardHeader>
                {/* Inventory table content */}
                <CardContent>
                    <Table className="overflow-auto ">
                        <TableHeader>
                            <TableRow className="bg-gray-100">
                                {/* Table headers */}
                                <TableHead className="text-gray text-center">ID Inventaris</TableHead>
                                <TableHead className="text-gray text-center">Nama Item</TableHead>
                                <TableHead className="text-gray text-center">Stok Barang</TableHead>
                                <TableHead className="text-gray text-center">Harga</TableHead>
                                <TableHead className="text-gray text-center">Terakhir Diperbarui</TableHead>
                                <TableHead colSpan={2} className="pe-11 text-gray text-center">Action Button</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Display inventory data */}
                            {isLoading ? (
                                <TableRowSkeleton rows={5} />
                            ) : displayedItems.length > 0 ? (
                                displayedItems.map((item: InventoryItem) => (
                                    <TableRow key={item.inventory_id}>
                                        <TableCell className="text-center">{item.inventory_id}</TableCell>
                                        <TableCell className="text-center">{item.item_name}</TableCell>
                                        <TableCell className="text-center">{item.quantity}</TableCell>
                                        <TableCell className="text-center">Rp.{Number(item.unit_price).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</TableCell>
                                        <TableCell className="text-center">
                                            {new Date(item.last_updated).toLocaleTimeString('en-GB', { hour12: false })} | {new Date(item.last_updated).toLocaleDateString('en-GB')}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                {/* Update inventory item */}
                                                <InventoryListUpdateButtonInline
                                                    inventory_id={item.inventory_id}
                                                    item_name={item.item_name}
                                                    quantity={item.quantity}
                                                    unit_price={item.unit_price}
                                                    onUpdateSuccess={onUpdateSuccess}
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                {/* Delete inventory item */}
                                                <InventoryListDeleteButtonInline
                                                    inventory_id={item.inventory_id}
                                                    onDeleteSuccess={onDeleteSuccess}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    {/* Display message if no inventory data */}
                                    <TableCell colSpan={7}>No inventory data available.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>

                {/* Button Container with Pagination */}
                <div className="mb-4 ms-4 flex flex-col md:flex-row md:justify-between md:items-center flex-wrap gap-4">
                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-1 justify-center align-middle gap-1">
                        <div>
                            <InventoryListAddButtonInline onAddSuccess={onUpdateSuccess} />
                        </div>
                        <div>
                            <InventoryListDeleteActionButtonInline
                                {...{
                                    inventoryData,
                                    onDeleteSuccess,
                                }}
                            />
                        </div>
                        <div>
                            <DownloadButton />
                        </div>
                    </div>

                    {/* Pagination */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        className="pagination cursor-pointer text-sm md:text-base"
                    />
                </div>
            </Card>
        </div>
    );
};
