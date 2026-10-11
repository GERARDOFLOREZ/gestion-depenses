import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useExpenses } from '../hooks/useExpenses';
import { useView } from '../hooks/useView';
import { useCategories } from '../hooks/useCategories';
import { getCurrencyByCode } from '../data/currencies';
import MixedCurrencyNotice from './MixedCurrencyNotice';
import { formatAmount } from '../utils/formatters';

function ExpenseChart() {
  const { expenses } = useExpenses();
  const { viewCurrencyCode } = useView();
  const { expenseCategories } = useCategories();
  const currency = getCurrencyByCode(viewCurrencyCode || 'EUR');

  const chartData = useMemo(() => {
    return expenseCategories.map((cat) => {
      const total = expenses
        .filter((exp) => exp.category === cat.id)
        .reduce((sum, exp) => sum + Number(exp.amount), 0);
      return { name: cat.label, value: total, color: cat.color };
    }).filter((entry) => entry.value > 0);
  }, [expenses, expenseCategories]);

  if (!viewCurrencyCode) {
    return <MixedCurrencyNotice title="Répartition des dépenses" />;
  }

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
          <Tooltip formatter={(value) => formatAmount(value, currency)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </section>
  );
}

export default ExpenseChart;