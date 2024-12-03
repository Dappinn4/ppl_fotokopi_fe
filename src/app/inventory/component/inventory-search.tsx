import React from "react";

// Inventory search component props
interface InventorySearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const InventorySearch: React.FC<InventorySearchProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    // Search input field
    <input
      type="text"
      placeholder="Search inventory..."
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
      className="w-full h-1/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-normal"
    />
  );
};
