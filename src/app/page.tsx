"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ShoppingCart,
  Package,
  ListFilter,
  Calendar,
  Table,
} from "lucide-react";
import {
  fetchInventoryData,
  InventoryItem,
} from "@/service/inventory/inventory-fetcher";
import { fetchAllDailyReports } from "@/service/laporan/laporan-daily/laporan-harian-fetcher";

const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 30;
    const stepValue = value / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setDisplayValue(Math.min(Math.round(stepValue * currentStep), value));

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className="inline-block transform transition-all duration-300 hover:scale-105">
      {displayValue}
    </span>
  );
};

const MetricCard = ({
  title,
  value,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
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

export default function Home() {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    thisYear: 0,
  });

  const fetchInventory = useCallback(async () => {
    setIsLoading(true);
    try {
      // Provide a callback function to handle the fetched data
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

    const getReports = async () => {
      try {
        const data = await fetchAllDailyReports();
        setStats({
          total: data.length,
          thisMonth: data.filter(
            (report) =>
              new Date(report.date).getMonth() === new Date().getMonth()
          ).length,
          thisYear: data.filter(
            (report) =>
              new Date(report.date).getFullYear() === new Date().getFullYear()
          ).length,
        });
      } catch (error) {
        console.error("Error fetching daily reports:", error);
      }
    };

    getReports();
  }, [fetchInventory]);

  const metrics = useMemo(() => {
    const totalItems = inventoryData.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const lowStockItems = inventoryData.filter(
      (item) => item.quantity < 20
    ).length;

    return {
      totalItems,
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
        {/* Title Section */}
        <div className="mb-8 animate-[fadeIn_0.5s_ease-out_forwards]">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-primary animate-[bounce_2s_infinite]" />
            <h1 className="text-3xl font-bold text-gray-900">Inventaris</h1>
          </div>
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
        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Total Laporan",
              value: stats.total,
              icon: ListFilter,
              description: "Semua laporan yang telah dibuat",
              delay: "delay-[400ms]",
            },
            {
              title: "Laporan Bulan Ini",
              value: stats.thisMonth,
              icon: Calendar,
              description: "Laporan yang dibuat bulan ini",
              delay: "delay-[500ms]",
            },
            {
              title: "Laporan Tahun Ini",
              value: stats.thisYear,
              icon: Table,
              description: "Total laporan tahun berjalan",
              delay: "delay-[600ms]",
            },
          ].map((stat) => (
            <Card
              key={stat.title}
              className={`transform hover:scale-105 hover:shadow-lg transition-all duration-300 opacity-1 animate-[fadeIn_0.5s_ease-out_forwards] ${stat.delay}`}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="w-4 h-4 text-primary transform transition-transform duration-300 group-hover:rotate-12" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <AnimatedNumber value={stat.value} />
                </div>
                <p className="text-xs text-muted-foreground mt-1 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards] delay-[800ms]">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
