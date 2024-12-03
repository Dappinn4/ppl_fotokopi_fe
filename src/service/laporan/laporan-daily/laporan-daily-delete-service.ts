import { BASE_URL } from "../../config";
import { fetchWithHeaders } from "../../api";
export async function deleteDailyReport(report_id: number): Promise<void> {
  try {
    const response = await fetchWithHeaders(
      `${BASE_URL}/daily-report/${report_id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const errorData = await response.json(); // Try to parse the response as JSON
      console.error("Error response:", errorData); // Log the error response
      throw new Error(errorData.message || "Failed to delete daily report"); // Use server's error message if available
    }
  } catch (error) {
    console.error("Error deleting daily report:", error);
    throw error; // Rethrow the error for handling in the caller function
  }
}
