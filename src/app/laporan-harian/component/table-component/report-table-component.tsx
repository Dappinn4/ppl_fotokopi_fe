import React from "react";
import { format } from "date-fns";
import { Package, MoreHorizontal, Trash2, DollarSign } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge"; // Import Badge
import { Button } from "@/components/ui/button"; // Import Button
import { ReportTableProps } from "@/service/laporan/laporan-daily/laporan-daily-table-type";

export const ReportTable: React.FC<ReportTableProps> = ({
  loading,
  reports,
  onDelete,
  onUpdate,
  formatCurrency,
}) => {
  if (loading) {
    return (
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Date</TableHead>
            <TableHead>Total Cost</TableHead>
            <TableHead>Items Sold</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="h-4 bg-muted rounded animate-pulse w-24" />
              </TableCell>
              <TableCell>
                <div className="h-4 bg-muted rounded animate-pulse w-32" />
              </TableCell>
              <TableCell>
                <div className="h-4 bg-muted rounded animate-pulse w-16" />
              </TableCell>
              <TableCell>
                <div className="h-8 bg-muted rounded animate-pulse w-8" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Biaya
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Barang Terjual
            </div>
          </TableHead>
          <TableHead className="w-[100px]">Detail</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.map((report) => (
          <TableRow key={report.reportId}>
            <TableCell className="font-medium">
              {format(new Date(report.date), "dd MMMM yyyy")}
            </TableCell>
            <TableCell className="font-medium text-primary">
              {formatCurrency(Number(report.totalCost))}
            </TableCell>
            <TableCell>
              <Badge variant="secondary">{report.totalItemsSold} items</Badge>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    onClick={() => onUpdate(report)}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Detail
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    onClick={() => onUpdate(report)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem> */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the report and remove the data from the server.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(report.reportId)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
