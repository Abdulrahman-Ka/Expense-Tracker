const BASE_URL =
  "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest";

export interface ApiResponse {
  date: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [currency: string]: any;
}

export const fetchLatestRates = async (
  baseCurrency: string = "usd",
): Promise<Record<string, number>> => {
  try {
    const lowercaseBase = baseCurrency.toLowerCase();
    const response = await fetch(
      `${BASE_URL}/currencies/${lowercaseBase}.json`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates");
    }
    const data: ApiResponse = await response.json();
    return data[lowercaseBase];
  } catch (error) {
    console.error("Error loading currency data:", error);

    return {};
  }
};
