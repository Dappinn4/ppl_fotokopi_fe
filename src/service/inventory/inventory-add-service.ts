import { BASE_URL } from "../../service/config";
interface InventoryItem {
  inventory_id: number;
  item_name: string;
  quantity: number;
  unit_price: number;
  last_updated: string;
}

export const addInventoryItem = async (
  item: InventoryItem
): Promise<InventoryItem> => {
  try {
    const response = await fetch(`${BASE_URL}/inventory`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      const errorData = await response.json(); // Try to parse the response as JSON
      console.error("Error response:", errorData); // Log the error response
      throw new Error(errorData.message || "Failed to add inventory item"); // Use server's error message if available
    }

    const result = await response.json();
    return result; // Return the response data if needed
  } catch (error) {
    console.error("Error adding inventory item:", error);
    throw error; // Rethrow the error for handling in the caller function
  }
};

export const addInventoryIncrementIDItem = async (
  item: InventoryItem
): Promise<InventoryItem> => {
  try {
    const response = await fetch(`${BASE_URL}/inventory/increment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      const errorData = await response.json(); // Try to parse the response as JSON
      console.error("Error response:", errorData); // Log the error response
      throw new Error(errorData.message || "Failed to add inventory item"); // Use server's error message if available
    }

    const result = await response.json();
    return result; // Return the response data if needed
  } catch (error) {
    console.error("Error adding inventory item:", error);
    throw error; // Rethrow the error for handling in the caller function
  }
};
