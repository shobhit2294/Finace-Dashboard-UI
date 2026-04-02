import { useApp } from '@/context/AppContext';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, BarChart3 } from 'lucide-react';

export default function Insights() {
  const { transactions } = useApp();

  const insights = useMemo(() => {
    const result: { icon: React.ElementType; title: string; description: string; accent: string }[] = [];

    // Highest spending category
    const catTotals: Record<string, number> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
    });
    const topCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];
    if (topCat) {
      result.push({
        icon: AlertTriangle,
        title: 'Top Spending Category',
        description: `${topCat[0]} accounts for $${topCat[1].toLocaleString()} in expenses.`,
        accent: 'text-warning',
      });
    }

    // Monthly comparison
    const months: Record<string, { income: number; expenses: number }> = {};
    transactions.forEach(t => {
      const key = t.date.slice(0, 7);
      if (!months[key]) months[key] = { income: 0, expenses: 0 };
      if (t.type === 'income') months[key].income += t.amount;
      else months[key].expenses += t.amount;
    });
    const sortedMonths = Object.entries(months).sort((a, b) => b[0].localeCompare(a[0]));
    if (sortedMonths.length >= 2) {
      const [curr, prev] = [sortedMonths[0], sortedMonths[1]];
      const diff = curr[1].expenses - prev[1].expenses;
      const pct = prev[1].expenses > 0 ? ((diff / prev[1].expenses) * 100).toFixed(1) : '0';
      result.push({
        icon: diff > 0 ? TrendingUp : TrendingDown,
        title: 'Monthly Spending Change',
        description: diff > 0
          ? `Spending increased by ${pct}% compared to last month.`
          : `Spending decreased by ${Math.abs(Number(pct))}% compared to last month.`,
        accent: diff > 0 ? 'text-destructive' : 'text-success',
      });
    }

    // Savings rate
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    if (totalIncome > 0) {
      const rate = ((1 - totalExpenses / totalIncome) * 100).toFixed(1);
      result.push({
        icon: BarChart3,
        title: 'Savings Rate',
        description: `You're saving ${rate}% of your total income.`,
        accent: Number(rate) > 20 ? 'text-success' : 'text-warning',
      });
    }

    return result;
  }, [transactions]);

  if (insights.length === 0) {
    return (
      <div className="glass-card rounded-lg p-5 text-center text-muted-foreground">
        Add more transactions to see insights.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-heading font-semibold text-base">Insights</h3>
      {insights.map((insight, i) => (
        <motion.div
          key={insight.title}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
          className="glass-card rounded-lg p-4 flex items-start gap-3"
        >
          <div className={`${insight.accent} mt-0.5`}>
            <insight.icon className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium text-sm">{insight.title}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{insight.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
