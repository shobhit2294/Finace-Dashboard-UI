import { useApp } from '@/context/AppContext';
import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = [
  'hsl(165 60% 40%)',
  'hsl(220 70% 55%)',
  'hsl(38 92% 50%)',
  'hsl(0 70% 55%)',
  'hsl(280 60% 55%)',
  'hsl(190 70% 45%)',
  'hsl(340 65% 50%)',
  'hsl(100 50% 45%)',
];

export default function SpendingBreakdown() {
  const { transactions } = useApp();

  const data = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  if (data.length === 0) {
    return (
      <div className="glass-card rounded-lg p-5 flex items-center justify-center h-64 text-muted-foreground">
        No expenses yet
      </div>
    );
  }

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="font-heading font-semibold text-base mb-4">Spending Breakdown</h3>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="h-48 w-48 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 13 }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2 w-full">
          {data.slice(0, 5).map((d, i) => (
            <div key={d.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-foreground">{d.name}</span>
              </div>
              <span className="text-muted-foreground">{((d.value / total) * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
