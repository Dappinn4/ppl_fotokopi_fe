"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date) => void;
}

export function DatePicker({ selected, onChange }: DatePickerProps) {
  const [currentYear, setCurrentYear] = React.useState(
    selected ? selected.getFullYear() : new Date().getFullYear()
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !selected && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex items-center justify-between px-4 py-2">
          {/* Year Navigation */}
          <button
            className="text-muted-foreground hover:text-primary"
            onClick={() => setCurrentYear((prev) => prev - 1)}
          >
            &lt; Prev
          </button>
          <span className="font-semibold">{currentYear}</span>
          <button
            className="text-muted-foreground hover:text-primary"
            onClick={() => setCurrentYear((prev) => prev + 1)}
          >
            Next &gt;
          </button>
        </div>
        <Calendar
          mode="single"
          selected={selected ?? undefined}
          onSelect={(date: Date | undefined) => date && onChange(date)}
          initialFocus
          fromYear={currentYear} // Dynamically update the year view
        />
      </PopoverContent>
    </Popover>
  );
}
