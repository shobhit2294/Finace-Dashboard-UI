import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { Transaction, UserRole, TransactionType, Category } from '@/types/finance';
import { mockTransactions } from '@/data/mockTransactions';

interface AppContextType {
  transactions: Transaction[];
  role: UserRole;
  searchQuery: string;
  filterType: TransactionType | 'all';
  filterCategory: Category | 'all';
  darkMode: boolean;
  setRole: (role: UserRole) => void;
  setSearchQuery: (q: string) => void;
  setFilterType: (t: TransactionType | 'all') => void;
  setFilterCategory: (c: Category | 'all') => void;
  toggleDarkMode: () => void;
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, t: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  filteredTransactions: Transaction[];
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

const STORAGE_KEY = 'fintrack-data';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : mockTransactions;
    } catch {
      return mockTransactions;
    }
  });
  const [role, setRole] = useState<UserRole>('admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('fintrack-dark') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('fintrack-dark', String(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => setDarkMode(d => !d), []);

  const addTransaction = useCallback((t: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [{ ...t, id: crypto.randomUUID() }, ...prev]);
  }, []);

  const editTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (filterType !== 'all' && t.type !== filterType) return false;
      if (filterCategory !== 'all' && t.category !== filterCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
      }
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filterType, filterCategory, searchQuery]);

  return (
    <AppContext.Provider value={{
      transactions, role, searchQuery, filterType, filterCategory, darkMode,
      setRole, setSearchQuery, setFilterType, setFilterCategory, toggleDarkMode,
      addTransaction, editTransaction, deleteTransaction, filteredTransactions,
    }}>
      {children}
    </AppContext.Provider>
  );
}
