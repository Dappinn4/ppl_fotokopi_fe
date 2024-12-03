import { BASE_URL } from "../../service/config";
import { fetchWithHeaders } from "../../service/api";
export async function deleteInventoryItem(inventory_id: number): Promise<void> {
  const response = await fetchWithHeaders(
    `${BASE_URL}/inventory/${inventory_id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
}
