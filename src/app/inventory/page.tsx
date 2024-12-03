"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home, Package, ShoppingCart, LucideIcon } from "lucide-react";
import { InventoryList } from "@/app/inventory/component/inventory-list";
import {
  fetchInventoryData,
  InventoryItem,
} from "@/service/inventory/inventory-fetcher";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MetricCard = ({
  title,
  value,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
}) => (
  <Card className="flex-1 hover:scale-105 transition-all duration-300 hover:shadow-lg">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          {trend && <p className="text-sm mt-2 text-red-600">{trend}</p>}
        </div>
        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const Inventory: React.FC = () => {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchInventory = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetchInventoryData((data) => {
        setInventoryData(data);
        setIsLoading(false);
      });
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const metrics = useMemo(() => {
    const totalItems = inventoryData.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const totalValue = inventoryData.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );
    const averagePrice = totalValue / totalItems || 0;
    const lowStockItems = inventoryData.filter(
      (item) => item.quantity < 20
    ).length;

    return {
      totalItems,
      totalValue,
      averagePrice,
      lowStockItems,
    };
  }, [inventoryData]);

  const chartData = useMemo(
    () =>
      inventoryData.map((item) => ({
        name: item.item_name,
        quantity: item.quantity,
      })),
    [inventoryData]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => (window.location.href = "/")}
            className="hover:bg-gray-100"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
          <Breadcrumb className="animate-[fadeIn_0.5s_ease-out_forwards]">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Inventaris
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/laporan/harian"
                  className="font-semibold"
                >
                  Inventaris Barang
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Title Section */}
        <div className="mb-8 animate-[fadeIn_0.5s_ease-out_forwards]">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-primary animate-[bounce_2s_infinite]" />
            <h1 className="text-3xl font-bold text-gray-900">
              Tabel Inventaris
            </h1>
          </div>
          <p className="mt-2 text-gray-600">
            Kelola dan pantau item inventaris Anda
          </p>
        </div>

        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
          {[
            {
              title: "Total Barang",
              value: metrics.totalItems.toLocaleString(),
              icon: ShoppingCart,
            },
            {
              title: "Barang Dengan Stok Rendah",
              value: metrics.lowStockItems.toString(),
              icon: Package,
              trend: "Dibawah 20 unit",
            },
          ].map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>

        {/* Chart Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Inventory Quantities</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantity" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Inventory List */}
        <InventoryList
          inventoryData={inventoryData}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          itemsPerPage={10}
          isLoading={isLoading}
          onUpdateSuccess={fetchInventory}
          onDeleteSuccess={fetchInventory}
        />
      </div>
    </div>
  );
};

export default Inventory;
