import { BASE_URL } from "../../config";
import { fetchWithHeaders } from "../../api";
interface DailyReport {
  date: string;
  totalCost: string;
  totalItemsSold: number;
  itemsSold: ItemSold[];
}

export interface ItemSold {
  itemId: number;
  itemName: string;
  quantitySold: number;
  totalPrice: number;
}

export interface DailyReportsSummary {
  reportId: number;
  date: string;
  totalCost: number;
  totalItemsSold: number;
  itemsSold: ItemSold[];
}

// Fetch all daily reports
export const fetchAllDailyReports = async (): Promise<
  DailyReportsSummary[]
> => {
  try {
    const response = await fetchWithHeaders(`${BASE_URL}/daily-reports`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response:", errorData);
      throw new Error(errorData.message || "Failed to fetch daily reports");
    }

    const result: DailyReportsSummary[] = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching daily reports:", error);
    throw error;
  }
};

// Fetch a single daily report
export const fetchDailyReport = async (
  reportId: number
): Promise<DailyReport> => {
  try {
    const response = await fetchWithHeaders(
      `${BASE_URL}/daily-reports/${reportId}`
    );
    console.log("Raw response:", response); // Logs the Response object

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response:", errorData);
      throw new Error(errorData.message || "Failed to fetch the daily report");
    }

    const result: DailyReport = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching daily report:", error);
    throw error;
  }
};
