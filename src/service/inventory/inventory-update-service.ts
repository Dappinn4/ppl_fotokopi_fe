import { BASE_URL } from "../../service/config";
import { fetchWithHeaders } from "../../service/api";
export interface InventoryItemUpdateData {
  inventory_id: number;
  item_name: string;
  quantity: number;
  unit_price: number;
}

export const updateInventoryItem = async (
  itemData: InventoryItemUpdateData
): Promise<Response> => {
  try {
    const response = await fetchWithHeaders(
      `${BASE_URL}/inventory/${itemData.inventory_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update inventory item.");
    }

    return response;
  } catch (error) {
    console.error("Error in updateInventoryItem:", error);
    throw error;
  }
};
