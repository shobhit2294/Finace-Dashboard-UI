import { useApp } from '@/context/AppContext';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function SummaryCards() {
  const { transactions } = useApp();

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { income, expenses, balance: income - expenses };
  }, [transactions]);

  const cards = [
    {
      label: 'Total Balance',
      value: stats.balance,
      icon: Wallet,
      accent: 'text-primary',
      bg: 'bg-accent',
    },
    {
      label: 'Total Income',
      value: stats.income,
      icon: ArrowUpRight,
      accent: 'text-success',
      bg: 'bg-success/10',
    },
    {
      label: 'Total Expenses',
      value: stats.expenses,
      icon: ArrowDownRight,
      accent: 'text-destructive',
      bg: 'bg-destructive/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.35 }}
          className="glass-card rounded-lg p-5 flex items-start justify-between"
        >
          <div>
            <p className="text-sm text-muted-foreground font-medium">{card.label}</p>
            <p className="text-2xl font-heading font-bold mt-1">
              ${card.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className={`${card.bg} ${card.accent} p-2.5 rounded-lg`}>
            <card.icon className="w-5 h-5" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
