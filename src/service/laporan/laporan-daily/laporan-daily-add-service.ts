import { BASE_URL } from "../../config";
import { fetchWithHeaders } from "../../api";
// Interface for a single sale record
interface SaleRecord {
  inventory_id: number;
  quantity_sold: number;
  price: number; // Unit price of the item
}

// Interface for the payload to create a daily report
interface DailyReportPayload {
  date: string;
  salesData: SaleRecord[];
}

// Function to record daily sales and update inventory
export const recordDailyReport = async (
  reportData: DailyReportPayload
): Promise<{ message: string }> => {
  try {
    const response = await fetchWithHeaders(`${BASE_URL}/daily-report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reportData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response:", errorData);
      throw new Error(
        errorData.message ||
          "Failed to record daily report and update inventory"
      );
    }

    const result = await response.json();
    return result; // Returns the success message
  } catch (error) {
    console.error("Error recording daily report:", error);
    throw error; // Rethrow the error for handling in the caller function
  }
};
