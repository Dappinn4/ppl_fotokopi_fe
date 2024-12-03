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
) => {
  try {
    const response = await fetchWithHeaders(`${BASE_URL}/inventory`);
    const data = await response.json();
    onDataFetched(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Failed to retrieve data:", error);
  }
};
