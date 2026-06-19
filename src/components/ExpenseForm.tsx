import React, { useState } from "react";
import { type Category, type Expense } from "../types";

interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, "id">) => void;
  defaultCurrency: string;
}

interface FormState {
  title: string;
  amount: string; // Keep as string for native input handling, parse on submit
  currency: string;
  category: Category;
  date: string;
}

interface FormErrors {
  title?: string;
  amount?: string;
  date?: string;
}

const CATEGORIES: Category[] = [
  "Food",
  "Utilities",
  "Entertainment",
  "Software",
  "Travel",
  "other",
];
const CURRENCIES = ["USD", "EUR", "SYP"];

export default function ExpenseForm({
  onAddExpense,
  defaultCurrency,
}: ExpenseFormProps) {
  const initialFormState: FormState = {
    title: "",
    amount: "",
    currency: defaultCurrency,
    category: "Food",
    date: new Date().toISOString().split("T")[0], // Defaults to today
  };

  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});

  // Unified change handler for all inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear specific error when user starts typing/correcting
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const currentErrors: FormErrors = {};
    const parsedAmount = parseFloat(formData.amount);
    const today = new Date().toISOString().split("T")[0];

    if (!formData.title.trim()) {
      currentErrors.title = "Title is required";
    } else if (formData.title.length < 3) {
      currentErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.amount) {
      currentErrors.amount = "Amount is required";
    } else if (isNaN(parsedAmount) || parsedAmount <= 0) {
      currentErrors.amount = "Amount must be a positive number";
    }

    if (!formData.date) {
      currentErrors.date = "Date is required";
    } else if (formData.date > today) {
      currentErrors.date = "Date cannot be in the future";
    }

    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onAddExpense({
      title: formData.title.trim(),
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      category: formData.category,
      date: formData.date,
    });

    // Reset form but keep currency and date configuration
    setFormData({
      ...initialFormState,
      currency: formData.currency,
      date: formData.date,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Title Input */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
        >
          Expense Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., AWS Cloud Bill"
          className={`w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-slate-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500
            ${errors.title ? "border-rose-500 focus:ring-rose-500" : "border-slate-200 dark:border-slate-800"}`}
        />
        {errors.title && (
          <p className="mt-1.5 text-xs font-medium text-rose-500">
            {errors.title}
          </p>
        )}
      </div>

      {/* Amount & Currency Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="any"
            className={`w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-slate-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500
              ${errors.amount ? "border-rose-500 focus:ring-rose-500" : "border-slate-200 dark:border-slate-800"}`}
          />
        </div>

        <div>
          <label
            htmlFor="currency"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {CURRENCIES.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>
        </div>
      </div>
      {errors.amount && (
        <p className="text-xs font-medium text-rose-500">{errors.amount}</p>
      )}

      {/* Category Input */}
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
        >
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Date Input */}
      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
        >
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className={`w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-slate-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500
            ${errors.date ? "border-rose-500 focus:ring-rose-500" : "border-slate-200 dark:border-slate-800"}`}
        />
        {errors.date && (
          <p className="mt-1.5 text-xs font-medium text-rose-500">
            {errors.date}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 text-sm shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
      >
        Log Expense
      </button>
    </form>
  );
}
