import { useEffect, useState } from "react";
import { useTheme } from "./hooks/useTheme";
import { type Expense } from "./types";
import ExpenseForm from "./components/ExpenseForm";
import TransactionList from "./components/TransactionList";

export default function App() {
  const { theme, toggleTheme } = useTheme();

  // App State
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem("expenses");
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error(err);
      return [];
    }
  });
  const [rates, setRates] = useState<Record<string, number>>({});
  const [baseCurrency, setBaseCurrency] = useState<string>(() => {
    return localStorage.getItem("baseCurrency") || "USD";
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch live rates relative to the selected base currency
  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://open.er-api.com/v6/latest/${baseCurrency}`,
        );
        const data = await res.json();
        setRates(data.rates);
      } catch (err) {
        console.error("Failed to sync exchange rates:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
    localStorage.setItem("baseCurrency", baseCurrency);
  }, [baseCurrency]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // Calculate total converted expenses
  // const totalSpent = expenses.reduce((sum, exp) => {
  //   return sum + convertCurrency(exp.amount, "", baseCurrency, rates);
  // }, 0);
  const filteredExpenses = expenses.filter(
    (exp) => exp.currency.toUpperCase() === baseCurrency.toUpperCase(),
  );
  const totalSpent = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleAddExpense = (newExpData: Omit<Expense, "id">) => {
    const newExpense: Expense = {
      ...newExpData,
      id: crypto.randomUUID(),
    };
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-50">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">GlobalSpend</h1>

          <div className="flex items-center gap-4">
            {/* Currency Selector */}
            <select
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="SYP">SYP (ل.س.ج)</option>
            </select>

            {/* Dark/Light Mode Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {theme === "light" ? (
                // Dark Mode Icon (Moon)
                <svg
                  className="h-5 w-5 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                // Light Mode Icon (Sun)
                <svg
                  className="h-5 w-5 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Total Display Card */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Total Aggregated Balance
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight">
              {loading
                ? "---"
                : totalSpent.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
            </span>
            <span className="text-lg font-semibold text-indigo-500">
              {baseCurrency}
            </span>
          </div>
        </div>

        {/* Dashboard Grid Split */}
        <div className="grid gap-8 md:grid-cols-5">
          {/* Left Column: Form Placeholder */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 md:col-span-2 h-fit">
            <h2 className="text-lg font-semibold mb-4">Add New Expense</h2>
            <ExpenseForm
              onAddExpense={handleAddExpense}
              defaultCurrency={baseCurrency}
            />
          </div>

          {/* Right Column: List Placeholder */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 md:col-span-3 h-fit">
            <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
            <TransactionList
              expenses={filteredExpenses}
              onDeleteExpense={handleDeleteExpense}
              baseCurrency={baseCurrency}
              rates={rates}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
