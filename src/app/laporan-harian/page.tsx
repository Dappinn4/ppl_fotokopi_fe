"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar, ListFilter, Table, ArrowUp, FileChartColumnIncreasing, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import DailyReportTable from "./component/daily-report-table";
import DailyReportCard from "./component/daily-report-card";
import { fetchAllDailyReports, DailyReportsSummary } from "@/service/laporan/laporan-daily/laporan-harian-fetcher";
// import Calendars from "./component/calender-visualization";

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

const LoadingSpinner = () => (
    <div className="flex items-center justify-center space-x-3">
        <div className="w-3 h-3 bg-primary rounded-full animate-[bounce_1s_infinite] [animation-delay:-0.30s]"></div>
        <div className="w-3 h-3 bg-primary rounded-full animate-[bounce_1s_infinite] [animation-delay:-0.15s]"></div>
        <div className="w-3 h-3 bg-primary rounded-full animate-[bounce_1s_infinite]"></div>
    </div>
);

export default function LaporanHarianPage() {
    const [view, setView] = useState("card");
    const [reports, setReports] = useState<DailyReportsSummary[]>([]);
    const [uniqueMonths, setUniqueMonths] = useState<string[]>([]);
    const [uniqueYears, setUniqueYears] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);

    useEffect(() => {
        setPageLoaded(true);
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 200);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const getReports = async () => {
            try {
                const data = await fetchAllDailyReports();
                setReports(data);
                
                const months = Array.from(new Set(data.map((report) => report.date.split("-")[1])));
                const years = Array.from(new Set(data.map((report) => report.date.split("-")[0])));
                
                setUniqueMonths(months);
                setUniqueYears(years);
            } catch (error) {
                console.error("Error fetching daily reports:", error);
            } finally {
                setTimeout(() => setIsLoading(false), 800);
            }
        };

        getReports();
    }, []);

    const getReportStats = () => {
        if (!reports.length) return { total: 0, thisMonth: 0, thisYear: 0 };
        
        const currentDate = new Date();
        const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
        const currentYear = String(currentDate.getFullYear());
        
        return {
            total: reports.length,
            thisMonth: reports.filter(report => report.date.split("-")[1] === currentMonth).length,
            thisYear: reports.filter(report => report.date.split("-")[0] === currentYear).length
        };
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const stats = getReportStats();

    return (
        <div className={`min-h-screen bg-gray-50 p-6 space-y-6 max-w-7xl mx-auto transition-all duration-500 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex justify-between items-center space-y-4">
                <Link href="/" className="opacity-0 animate-[fadeIn_0.5s_ease-out_forwards] delay-100">
                    <Button 
                        variant="ghost" 
                        size="sm"
                        className="group flex items-center gap-2 hover:bg-primary/10"
                    >
                        <Home className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-300" />
                        Kembali ke Beranda
                    </Button>
                </Link>

                <Breadcrumb className="opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/" className="flex items-center gap-2">
                                <FileChartColumnIncreasing className="w-4 h-4" />
                                Laporan
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/laporan/harian" className="font-semibold">
                                Laporan Harian
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="space-y-2 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards] delay-200">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-primary animate-[bounce_2s_infinite]" />
                    Laporan Harian
                </h1>
                <p className="text-muted-foreground">
                    Manajemen dan pemantauan laporan harian kegiatan
                </p>
            </div>

            {/* Rest of the component remains the same */}
            <div className="grid gap-4 md:grid-cols-3">
                {[
                    { 
                        title: "Total Laporan", 
                        value: stats.total, 
                        icon: ListFilter, 
                        description: "Semua laporan yang telah dibuat",
                        delay: "delay-[400ms]"
                    },
                    { 
                        title: "Laporan Bulan Ini", 
                        value: stats.thisMonth, 
                        icon: Calendar, 
                        description: "Laporan yang dibuat bulan ini",
                        delay: "delay-[500ms]"
                    },
                    { 
                        title: "Laporan Tahun Ini", 
                        value: stats.thisYear, 
                        icon: Table, 
                        description: "Total laporan tahun berjalan",
                        delay: "delay-[600ms]"
                    }
                ].map((stat) => (
                    <Card 
                        key={stat.title} 
                        className={`transform hover:scale-105 hover:shadow-lg transition-all duration-300 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards] ${stat.delay}`}
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
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
            {/* <div className="h-64 w-32 md:w-1/2 mx-auto overflow-x-auto">
                <Calendars reports={reports} />
            </div> */}

            <Card className="mt-6 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards] delay-[700ms] transform transition-all duration-300 hover:shadow-lg">
                <CardContent className="pt-6">
                    <Tabs value={view} onValueChange={setView} className="w-full">
                        <div className="flex justify-between items-center mb-4">
                            <TabsList className="transition-all duration-300 hover:shadow-md">
                                <TabsTrigger value="card" className="flex items-center gap-2 transition-all duration-300 hover:bg-primary/10">
                                    <Calendar className="w-4 h-4" />
                                    Kartu
                                </TabsTrigger>
                                <TabsTrigger value="table" className="flex items-center gap-2 transition-all duration-300 hover:bg-primary/10">
                                    <Table className="w-4 h-4" />
                                    Tabel
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {isLoading ? (
                            <div className="flex items-center justify-center h-64 transition-all duration-300">
                                <LoadingSpinner />
                            </div>
                        ) : (
                            <div className="transition-all duration-300">
                                <TabsContent value="card" className="transition-all duration-300 origin-top">
                                    <DailyReportCard 
                                        reports={reports} 
                                        uniqueMonths={uniqueMonths} 
                                        uniqueYears={uniqueYears} 
                                    />
                                </TabsContent>
                                <TabsContent value="table" className="transition-all duration-300 origin-top">
                                    <DailyReportTable />
                                </TabsContent>
                            </div>
                        )}
                    </Tabs>
                </CardContent>
            </Card>

            <button
                onClick={scrollToTop}
                className={`fixed bottom-8 right-8 bg-primary text-primary-foreground p-3 rounded-full shadow-lg 
                    transition-all duration-300 hover:scale-110 hover:shadow-xl hover:bg-primary/90
                    ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
            >
                <ArrowUp className="w-5 h-5 animate-[bounce_2s_infinite]" />
            </button>

            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes bounce {
                    0%, 100% { transform: translateY(-10%); }
                    50% { transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}