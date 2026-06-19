# GlobalSpend // Multi-Currency Expense Tracker

A high-performance, client-side financial ledger built with React, TypeScript, and Tailwind CSS v4. The application features isolated multi-currency account tracking, manual input validations, automatic theme synchronization, and optimized persistent state handling.

## 🚀 Live Demo
[Insert Your Live Deployment Link Here - e.g., Cloudflare/GitHub Pages]

## 🛠️ Tech Stack & Architecture

* **Framework:** React 19 (via Vite for optimized, native ESM-based fast refreshes)
* **Type Safety:** TypeScript (Strictly typed schemas for domain models and data states)
* **Styling:** Tailwind CSS v4 (Utilizing the new CSS-first configuration and `@custom-variant` architecture)
* **State & Storage:** Native React hooks paired with performant lazy initialization and defensive local storage sync.

## 🧠 Key Architectural Decisions

### 1. Currency Isolation & Decoupled State
Instead of merging all currencies into a single volatile total via fluctuating API parameters, this application implements an **isolated ledger pattern**. Changing the active currency strictly filters both the metrics layer and the transaction feed. This design choices makes core dashboard computations fully synchronous and instant.

### 2. Performance Optimized State (Lazy Initialization)
To prevent the common "double-render flash" associated with retrieving local client storage on mount, `localStorage` extraction is executed lazily directly inside the initial state hook assignment:
```typescript
const [expenses, setExpenses] = useState<Expense[]>(() => {
  try {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    return []; // Defensive fallback against data corruption
  }
});
```
This guarantees synchronous string parsing happens exactly once during the initial bootstrap cycle rather than on subsequent UI micro-renders.

### 3. Native Form Engine with UX Micro-Interactions
Rather than bundling massive, heavy third-party form abstraction utilities, the input engine uses a unified controlled state block. Input validation operates with early-exit conditions and semantic error schemas. Field errors are purged dynamically the moment a user changes the target input, ensuring smooth form completion.

### 4. Semantic, Layout-Driven Tailwind v4 Theme Switcher
The dark mode structure uses native CSS variables and token lookups via a custom `useTheme` hook. Manual dark/light transitions hook directly into Tailwind v4's modern compiling structure via localized CSS configuration rules:
```css
@custom-variant dark (&:where(.dark, .dark *));
```

## 📂 Project Structure

```text
src/
├── components/        # Isolated, presentational UI blocks (Form, Lists)
├── hooks/             # Extracted state engines (useTheme)
├── lib/               # Utilities, calculations, and mathematical formats
├── types/             # Explicit domain interfaces (Expense, Category)
├── App.tsx            # Main layout layout assembly and state hubs
└── main.tsx           # Application entry mount point
```

## 🔧 Installation & Local Setup

1. Clone the repository:
   ```bash
   git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
   ```
2. Install project dependencies:
   ```bash
   npm install
   ```
3. Boot up the Vite local development server:
   ```bash
   npm run dev
   ```
4. Build the static, optimized application for production:
   ```bash
   npm run build
   ```