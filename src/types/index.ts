export type Category =
  | "Food"
  | "Utilities"
  | "Entertainment"
  | "Software"
  | "Travel"
  | "other";

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: Category;
  date: string;
  currency: string;
  notes?: string;
}

export interface CurrencyRates {
  base: string;
  date: string;
  rates: {
    [currencyCode: string]: number;
  };
}
