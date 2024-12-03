import React, { useEffect, useState } from "react";
import { CalendarIcon, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { SearchFilterProps } from "@/service/laporan/laporan-daily/laporan-daily-table-type";
import { InventoryItem, fetchInventoryData } from "@/service/inventory/inventory-service";
import { cn } from "@/lib/utils";

export const SearchFilters: React.FC<SearchFilterProps> = ({
  searchQuery,
  setSearchQuery,
  date,
  setDate,
  totalReports,
}) => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    fetchInventoryData(setInventoryItems);
  }, []);

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4 flex-1">
        {/* Inventory Dropdown */}
        <div className="relative flex-1 md:max-w-xs">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className={cn(
                  "w-full justify-between",
                  "border-gray-200 hover:bg-gray-50",
                  "text-left font-normal"
                )}
              >
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-gray-500" />
                  <span className="truncate">
                    {searchQuery || "Select an item..."}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
              {inventoryItems.map((item) => (
                <DropdownMenuItem
                  key={item.inventory_id}
                  onClick={() => setSearchQuery(item.item_name)}
                  className="flex justify-between items-center"
                >
                  <span className="truncate">{item.item_name}</span>
                  <Badge variant="secondary" className="ml-2">
                    {item.quantity}
                  </Badge>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Date Picker */}
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className={cn(
                  "w-[240px] justify-start",
                  "border-gray-200 hover:bg-gray-50",
                  "text-left font-normal"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar 
                mode="single" 
                selected={date} 
                onSelect={setDate} 
                initialFocus 
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>

          {date && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDate(undefined)}
              className="hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Total Reports Badge */}
      <div className="flex justify-end">
        <Badge 
          variant="secondary" 
          className="px-4 py-2 text-sm font-medium"
        >
          Total Reports: {totalReports}
        </Badge>
      </div>
    </div>
  );
};

export default SearchFilters;