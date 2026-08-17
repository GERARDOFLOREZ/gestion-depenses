import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useExpenses } from '../hooks/useExpenses';
import { CATEGORIES } from '../data/categories';
import { formatAmount } from '../utils/formatters';

function ExpenseChart() {
  const { expenses } = useExpenses();

  const chartData = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const total = expenses
        .filter((exp) => exp.category === cat.id)
        .reduce((sum, exp) => sum + Number(exp.amount), 0);
      return { name: cat.label, value: total, color: cat.color };
    }).filter((entry) => entry.value > 0);
  }, [expenses]);

  if (chartData.length === 0) {
    return null;
  }

  return (
    <section className="expense-chart">
      <h2>Répartition des dépenses</h2>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatAmount(value)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </section>
  );
}

export default ExpenseChart;