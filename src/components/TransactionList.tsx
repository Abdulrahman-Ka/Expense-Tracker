import { type Expense, type Category } from "../types";
import { convertCurrency } from "../lib/utils";

interface TransactionListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  baseCurrency: string;
  rates: Record<string, number>;
}

// Maps categories to explicit, modern Tailwind color treatments
const CATEGORY_COLORS: Record<Category, string> = {
  Food: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  Utilities: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  Entertainment:
    "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  Software:
    "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
  Travel:
    "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
  other: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
};

export default function TransactionList({
  expenses,
  onDeleteExpense,
  baseCurrency,
  rates,
}: TransactionListProps) {
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-slate-100 p-3 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
          No transactions yet
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Get started by adding your first expense item.
        </p>
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-my-5 divide-y divide-slate-100 dark:divide-slate-800/60">
        {expenses.map((expense) => {
          const convertedAmount = convertCurrency(
            expense.amount,
            expense.currency,
            baseCurrency,
            rates,
          );

          return (
            <li
              key={expense.id}
              className="py-4 flex items-center justify-between gap-x-4 group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {expense.title}
                  </p>
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium tracking-wide ${CATEGORY_COLORS[expense.category]}`}
                  >
                    {expense.category}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {new Date(expense.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              {/* Financial Output Side */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {convertedAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    <span className="text-xs font-semibold text-indigo-500 dark:text-indigo-400">
                      {baseCurrency}
                    </span>
                  </p>

                  {/* Show original currency conversion track context if it differs from current base */}
                  {expense.currency !== baseCurrency && (
                    <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                      Original: {expense.amount.toLocaleString()}{" "}
                      {expense.currency}
                    </p>
                  )}
                </div>

                {/* Inline Delete Button */}
                <button
                  onClick={() => onDeleteExpense(expense.id)}
                  aria-label={`Delete ${expense.title}`}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-150 opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                  <svg
                    className="h-4 w-4 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
