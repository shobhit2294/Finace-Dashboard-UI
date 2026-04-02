export type TransactionType = 'income' | 'expense';

export type Category =
  | 'Salary'
  | 'Freelance'
  | 'Investments'
  | 'Food & Dining'
  | 'Transportation'
  | 'Shopping'
  | 'Entertainment'
  | 'Utilities'
  | 'Healthcare'
  | 'Rent'
  | 'Travel'
  | 'Education'
  | 'Other';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
}

export type UserRole = 'admin' | 'viewer';

export interface AppState {
  transactions: Transaction[];
  role: UserRole;
  searchQuery: string;
  filterType: TransactionType | 'all';
  filterCategory: Category | 'all';
  darkMode: boolean;
}
