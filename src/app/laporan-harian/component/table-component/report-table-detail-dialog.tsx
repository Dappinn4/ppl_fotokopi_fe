import React from "react";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DailyReportsSummary } from "@/service/laporan/laporan-daily/laporan-harian-fetcher";

interface ReportDetailsDialogProps {
  report: DailyReportsSummary;
  formatCurrency: (amount: number) => string;
}

export const ReportDetailsDialog: React.FC<ReportDetailsDialogProps> = ({ report, formatCurrency }) => (
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
                <TableHead>Nama Barang</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead className="text-right">Harga</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.itemsSold.map((item) => (
                <TableRow key={item.itemId}>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">{item.quantitySold}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                   {item.totalPrice/item.quantitySold}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(Number(item.totalPrice))}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50">
                <TableCell colSpan={3} className="font-semibold">
                  Total Pendapatan
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
);
