import { useApp } from '@/context/AppContext';
import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function BalanceTrend() {
  const { transactions } = useApp();

  const data = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const byMonth: Record<string, { income: number; expenses: number }> = {};
    sorted.forEach(t => {
      const key = t.date.slice(0, 7);
      if (!byMonth[key]) byMonth[key] = { income: 0, expenses: 0 };
      if (t.type === 'income') byMonth[key].income += t.amount;
      else byMonth[key].expenses += t.amount;
    });
    let balance = 0;
    return Object.entries(byMonth).map(([month, v]) => {
      balance += v.income - v.expenses;
      const label = new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      return { month: label, income: v.income, expenses: v.expenses, balance };
    });
  }, [transactions]);

  if (data.length === 0) return <EmptyState />;

  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="font-heading font-semibold text-base mb-4">Balance Trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(165 60% 40%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(165 60% 40%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="month" className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
            <YAxis className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 13 }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
            />
            <Area type="monotone" dataKey="balance" stroke="hsl(165 60% 40%)" fill="url(#balGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="glass-card rounded-lg p-5 flex items-center justify-center h-64 text-muted-foreground">
      No data to display
    </div>
  );
}
