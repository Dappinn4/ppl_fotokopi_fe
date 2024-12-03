import { BASE_URL } from "../../service/config";
import { fetchWithHeaders } from "../../service/api";
export interface InventoryItem {
  inventory_id: number;
  item_name: string;
  quantity: number;
  unit_price: number;
  last_updated: string;
}

export const fetchInventoryData = async (
  onDataFetched: (data: InventoryItem[]) => void
): Promise<void> => {
  try {
    const response = await fetchWithHeaders(`${BASE_URL}/inventory`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    onDataFetched(Array.isArray(data) ? data : []); // Call the callback with the fetched data
  } catch (error) {
    console.error("Failed to retrieve data:", error);
    // You may want to handle the error case as well, e.g., by calling onDataFetched with an empty array or similar.
  }
};

export const fetchInventoryItemById = async (
  id: number
): Promise<InventoryItem | null> => {
  try {
    const response = await fetch(`/api/inventory/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch inventory item");
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch item by ID:", error);
    return null; // Return null in case of error
  }
};
