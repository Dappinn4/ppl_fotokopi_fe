import React from "react";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Landmark, Package } from "lucide-react";

interface ItemSold {
    itemId: number;
    itemName: string;
    quantitySold: number;
    totalPrice: number;
}

interface ReportCardProps {
    report: {
        reportId: number;
        date: string;
        totalCost: number;
        totalItemsSold: number;
        itemsSold: ItemSold[];
    }
}

const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Card className="cursor-pointer p-6 rounded-lg shadow-lg border border-gray-200 bg-gray-50 hover:bg-white transition-all transform hover:scale-105 hover:shadow-xl">
                    <h2 className="flex justify-center text-2xl font-semibold text-gray-700 mb-6">
                        {new Date(report.date).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })}
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        {/* Total Cost */}
                        <TooltipProvider>
                            <Tooltip delayDuration={100}>
                                <TooltipTrigger>
                                    <Card className="rounded-sm p-1 grid grid-cols-4 bg-inherit transform transition-transform duration-100 hover:scale-105">
                                        <Card className="p-1 col-span-1 flex items-center justify-center bg-inherit">
                                            <Landmark className="text-gray-600" />
                                        </Card>
                                        <p className="text-center text-gray-600 col-span-3 flex items-center justify-center">
                                            {formatCurrency(report.totalCost)}
                                        </p>
                                    </Card>
                                </TooltipTrigger>
                                <TooltipContent className="bg-white shadow-md border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center space-x-3">
                                        <Landmark className="text-gray-600 w-5 h-5" />
                                        <div>
                                            <h3 className="text-gray-800 font-bold text-sm">Total Pendapatan</h3>
                                            <p className="text-gray-600 text-sm">
                                                {formatCurrency(report.totalCost)}
                                            </p>
                                        </div>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        {/* Items Sold */}
                        <TooltipProvider>
                            <Tooltip delayDuration={100}>
                                <TooltipTrigger>
                                    <Card className="rounded-sm p-1 grid grid-cols-4 transform hover:scale-105 duration-100 bg-inherit">
                                        <Card className="p-1 col-span-1 flex items-center justify-center bg-inherit">
                                            <Package className="text-gray-600" />
                                        </Card>
                                        <p className="text-center text-gray-600 col-span-3 flex items-center justify-center">
                                            {report.totalItemsSold}
                                        </p>
                                    </Card>
                                </TooltipTrigger>
                                <TooltipContent className="bg-white shadow-md border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center space-x-3">
                                        <Package className="text-gray-600" />
                                        <div>
                                            <h3 className="text-gray-800 font-bold text-sm">Barang Yang Terjual</h3>
                                            <p className="text-gray-600 text-sm flex items-center">
                                                {report.totalItemsSold}
                                            </p>
                                        </div>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </Card>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold mb-4">
                        Detail Barang Terjual
                    </DialogTitle>
                    <DialogDescription className="space-y-4">
                        <div className="rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableCell className="font-semibold">Nama Barang</TableCell>
                                        <TableCell className="font-semibold text-right">Jumlah</TableCell>
                                        <TableCell className="font-semibold text-right">Harga</TableCell>
                                        <TableCell className="font-semibold text-right">Total</TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {report.itemsSold.map((item) => (
                                        <TableRow key={item.itemId} className="hover:bg-muted/50">
                                            <TableCell>{item.itemName}</TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant="outline">{item.quantitySold}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {formatCurrency(item.totalPrice / item.quantitySold)}
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {formatCurrency(item.totalPrice)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="bg-muted/50">
                                        <TableCell colSpan={3} className="font-semibold">
                                            Total
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">
                                            {formatCurrency(report.totalCost)}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-6">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Tutup
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ReportCard;