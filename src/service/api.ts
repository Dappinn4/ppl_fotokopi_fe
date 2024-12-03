// src/service/api.ts
export const fetchWithHeaders = async (
  url: string,
  options?: RequestInit
): Promise<Response> => {
  const headers = {
    "ngrok-skip-browser-warning": "69420",
    ...options?.headers, // Include any additional headers passed in
  };

  const response = await fetch(url, {
    ...options,
    headers: headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error response:", errorData);
    throw new Error(errorData.message || "Network response was not ok");
  }

  return response;
};
