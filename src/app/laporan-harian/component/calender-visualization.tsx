import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Define the structure of the report data
interface Report {
  date: string; // Expected to be in "YYYY-MM-DD" format
}

interface CalendarProps {
  reports: Report[];
}

const Calendars: React.FC<CalendarProps> = ({ reports }) => {
  const [currentDate, setCurrentDate] = React.useState<Date>(new Date());

  // Get first and last days of the current month
  const firstDayOfMonth = useMemo(() => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1), [currentDate]);
  const lastDayOfMonth = useMemo(() => new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0), [currentDate]);

  // Generate a record of dates with reports for quick lookup
  const datesWithReports: Record<string, boolean> = useMemo(() => {
    return reports.reduce((acc, report) => {
      const reportDate = report.date.replace(/-/g, ""); // Convert to "YYYYMMDD"
      acc[reportDate] = true;
      return acc;
    }, {} as Record<string, boolean>);
  }, [reports]);

  // Generate calendar days for the current month
  const calendarDays = useMemo(() => {
    const days: Array<{ date: number; hasReport: boolean } | null> = [];
    const startDay = firstDayOfMonth.getDay();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // Add all days of the current month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const currentDateStr = `${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, "0")}${String(i).padStart(2, "0")}`;
      days.push({
        date: i,
        hasReport: datesWithReports[currentDateStr] || false,
      });
    }

    return days;
  }, [currentDate, firstDayOfMonth, lastDayOfMonth, datesWithReports]);

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const navigateMonth = (direction: number) => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
  };

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  }, []);

  return (
    <Card className="w-full mt-6 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards] delay-[800ms]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            Kalender Laporan
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select
              value={currentDate.getFullYear().toString()}
              onValueChange={(value) => setCurrentDate(new Date(parseInt(value), currentDate.getMonth(), 1))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateMonth(-1)}
            className="hover:bg-primary/10"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateMonth(1)}
            className="hover:bg-primary/10"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-muted-foreground p-2"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={cn(
                "aspect-square flex items-center justify-center rounded-lg text-sm transition-all duration-200",
                day === null ? "invisible" : "visible",
                day?.hasReport
                  ? "bg-primary/20 text-primary font-semibold hover:bg-primary/30"
                  : day !== null
                  ? "hover:bg-muted"
                  : "",
                "cursor-pointer"
              )}
            >
              {day?.date}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-primary/20"></div>
            <span>Laporan Tersedia</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Calendars;
