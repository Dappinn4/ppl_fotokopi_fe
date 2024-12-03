import { BASE_URL } from "../../config";
import { fetchWithHeaders } from "../../api";
interface SaleData {
  inventory_id: number;
  quantity_sold: number;
  price: number;
}

interface UpdateDailyReportPayload {
  salesData: SaleData[];
  date: string;
}

export const updateDailyReport = async (
  reportId: number,
  updateData: UpdateDailyReportPayload
): Promise<void> => {
  const { salesData, date } = updateData;

  try {
    // Send PUT request to update the daily report with new sales data and date
    const response = await fetchWithHeaders(
      `${BASE_URL}/daily-report/${reportId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          salesData,
          date,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update daily report");
    }

    console.log("Daily report updated successfully");
  } catch (error: unknown) {
    console.error("Error updating daily report:", error);
    // Type assertion to handle error as Error type
    if (error instanceof Error) {
      throw new Error("Failed to update daily report: " + error.message);
    } else {
      throw new Error("Failed to update daily report: Unknown error occurred.");
    }
  }
};
