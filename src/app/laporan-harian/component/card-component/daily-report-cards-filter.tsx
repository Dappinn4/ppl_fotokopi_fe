// components/Filters.tsx
import React from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface FiltersProps {
    selectedMonth: string;
    setSelectedMonth: (month: string) => void;
    selectedYear: string;
    setSelectedYear: (year: string) => void;
    sortOrder: "most-recent" | "oldest";
    setSortOrder: (order: "most-recent" | "oldest") => void;
    uniqueMonths: number[];
    uniqueYears: number[];
}

const Filters: React.FC<FiltersProps> = ({ selectedMonth, setSelectedMonth, selectedYear, setSelectedYear, sortOrder, setSortOrder, uniqueMonths, uniqueYears }) => {
    return (
        <div className="flex items-center gap-6 mt-4">
            {/* Month Filter */}
            <div className="flex items-center gap-2">
                <label htmlFor="month" className="text-sm font-medium text-gray-700">Bulan:</label>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="w-32 p-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm text-left flex justify-between items-center text-sm">
                            {selectedMonth
                                ? new Date(0, parseInt(selectedMonth) - 1).toLocaleString("id-ID", { month: "long" })
                                : "Pilih Bulan"}
                            <span className="ml-2">&#x25BE;</span>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white border border-gray-200 rounded-lg shadow-lg w-32">
                        {uniqueMonths.map((month) => (
                            <DropdownMenuItem
                                key={month}
                                onClick={() => setSelectedMonth(month.toString())}
                                className="p-2 text-sm hover:bg-gray-100 text-left"
                            >
                                {new Date(0, month - 1).toLocaleString("id-ID", { month: "long" })}
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuItem
                            onClick={() => setSelectedMonth("")}
                            className="p-2 text-sm text-gray-500 hover:bg-gray-100"
                        >
                            Semua Bulan
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Year Filter */}
            <div className="flex items-center gap-2">
                <label htmlFor="year" className="text-sm font-medium text-gray-700">Tahun:</label>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="w-32 p-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm text-left flex justify-between items-center text-sm">
                            {selectedYear || "Pilih Tahun"}
                            <span className="ml-2">&#x25BE;</span>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white border border-gray-200 rounded-lg shadow-lg w-32">
                        {uniqueYears.map((year) => (
                            <DropdownMenuItem
                                key={year}
                                onClick={() => setSelectedYear(year.toString())}
                                className="p-2 text-sm hover:bg-gray-100"
                            >
                                {year}
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuItem
                            onClick={() => setSelectedYear("")}
                            className="p-2 text-sm text-gray-500 hover:bg-gray-100"
                        >
                            Semua Tahun
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Sort Order Filter */}
            <div className="flex items-center gap-2">
                <label htmlFor="sortOrder" className="text-sm font-medium text-gray-700">Urutkan:</label>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="w-40 p-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm text-left flex justify-between items-center text-sm">
                            {sortOrder === "most-recent" ? "Terbaru" : "Terlama"}
                            <span className="ml-2">&#x25BE;</span>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white border border-gray-200 rounded-lg shadow-lg w-40">
                        <DropdownMenuItem
                            onClick={() => setSortOrder("most-recent")}
                            className="p-2 text-sm hover:bg-gray-100"
                        >
                            Terbaru
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setSortOrder("oldest")}
                            className="p-2 text-sm hover:bg-gray-100"
                        >
                            Terlama
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default Filters;
