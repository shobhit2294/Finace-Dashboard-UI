# FinTrack — Personal Finance Dashboard
A modern, responsive personal finance dashboard built with React, TypeScript, and Tailwind CSS. Track income, expenses, and gain insights into your spending habits.
![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple)
## Features
### Dashboard Overview
- **Summary Cards** — Total Balance, Income, and Expenses at a glance
- **Balance Trend Chart** — Time-based area chart showing balance over time (Recharts)
- **Spending Breakdown** — Categorical pie chart of expenses by category
### Transactions
- Full transaction list with date, amount, category, and type (income/expense)
- **Search** — Filter transactions by description or category
- **Filter by Type** — Income, Expense, or All
- **Filter by Category** — 13 predefined categories
- **CSV Export** — Download filtered transactions as a CSV file
- **CRUD Operations** — Add, edit, and delete transactions (Admin role only)
### Role-Based UI
- **Admin** — Full access: add, edit, and delete transactions
- **Viewer** — Read-only access: view and filter data only
- Switch roles via the header dropdown for demonstration
### Insights
- Highest spending category identification
- Month-over-month spending comparison
- Savings rate calculation
- Actionable financial observations
### Optional Enhancements (Implemented)
- ✅ Dark mode toggle with system persistence
- ✅ Data persistence via `localStorage`
- ✅ Smooth animations and transitions (Framer Motion)
- ✅ CSV export functionality
- ✅ Advanced filtering (type + category + search)
- ✅ Responsive design for all screen sizes
- ✅ Empty state handling
## Tech Stack
| Layer | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript 5 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Charts | Recharts |
| Animations | Framer Motion |
| State Management | React Context API |
| Routing | React Router DOM v6 |
| UI Components | shadcn/ui (Radix primitives) |
| Fonts | Space Grotesk (headings), DM Sans (body) |
## Getting Started
### Prerequisites
- Node.js 18+ or Bun
### Installation
```bash
# Clone the repository
git clone <repository-url>
cd fintrack
# Install dependencies
npm install
# Start the development server
npm run dev
```
The app will be available at **http://localhost:8080**.
### Build for Production
```bash
npm run build
npm run preview
```
## Project Structure
```
src/
├── components/
│   ├── dashboard/
│   │   ├── Header.tsx            # App header with role switcher & dark mode
│   │   ├── SummaryCards.tsx       # Balance, income, expense cards
│   │   ├── BalanceTrend.tsx       # Area chart visualization
│   │   ├── SpendingBreakdown.tsx  # Pie chart visualization
│   │   ├── TransactionsList.tsx   # Transaction list with CRUD & filters
│   │   └── Insights.tsx          # Financial insights panel
│   └── ui/                       # shadcn/ui component library
├── context/
│   └── AppContext.tsx             # Global state management
├── data/
│   └── mockTransactions.ts       # Sample transaction data
├── types/
│   └── finance.ts                # TypeScript type definitions
├── pages/
│   ├── Index.tsx                 # Main dashboard page
│   └── NotFound.tsx              # 404 page
└── index.css                     # Design system tokens & global styles
```
## State Management Approach
The app uses **React Context API** with a single `AppProvider` that manages:
- **Transactions** — Array of transaction records with CRUD operations
- **Filters** — Search query, type filter, and category filter
- **Role** — Current user role (admin/viewer)
- **Dark Mode** — Theme preference
State is persisted to `localStorage` and restored on page load. Filtered transactions are computed via `useMemo` for performance. All state mutations use `useCallback` to prevent unnecessary re-renders.
## Design Decisions
- **HSL-based design tokens** — All colors defined as CSS custom properties for easy theming
- **Glass morphism cards** — Subtle backdrop blur effects for modern depth
- **Semantic color system** — Success (green) for income, destructive (red) for expenses
- **Mobile-first responsive** — Flexbox/Grid layouts adapt from mobile to desktop
- **Accessible** — Proper ARIA labels, keyboard navigation, and contrast ratios