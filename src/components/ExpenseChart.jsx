import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useExpenses } from '../hooks/useExpenses';
import { useAccounts } from '../hooks/useAccounts';
import { useView } from '../hooks/useView';
import { useCategories } from '../hooks/useCategories';
import { getCurrencyByCode } from '../data/currencies';
import { formatAmount, formatMonthLabel } from '../utils/formatters';

function ExpenseChart() {
  const { expenses } = useExpenses();
  const { getAccountCurrency } = useAccounts();
  const { viewCurrencyCode, month } = useView();
  const { expenseCategories } = useCategories();
  const currency = getCurrencyByCode(viewCurrencyCode || 'EUR');

  const { rows, total } = useMemo(() => {
    const inCurrency = expenses.filter(
      (e) => getAccountCurrency(e.account_id).code === currency.code
    );
    const list = expenseCategories
      .map((cat) => ({
        id: cat.id,
        name: cat.label,
        color: cat.color,
        value: inCurrency
          .filter((e) => e.category === cat.id)
          .reduce((sum, e) => sum + Number(e.amount), 0),
      }))
      .filter((r) => r.value > 0)
      .sort((a, b) => b.value - a.value);
    return { rows: list, total: list.reduce((s, r) => s + r.value, 0) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenses, expenseCategories, currency.code]);

  if (rows.length === 0) return null;

  const centerLabel = month === 'all' ? 'Total' : formatMonthLabel(month).split(' ')[0];

  return (
    <section className="expense-chart">
      <h2>Répartition des dépenses</h2>

      <div className="donut-layout">
        <div className="donut-box">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={rows}
                dataKey="value"
                nameKey="name"
                innerRadius="64%"
                outerRadius="100%"
                paddingAngle={rows.length > 1 ? 2 : 0}
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                {rows.map((r) => (
                  <Cell key={r.id} fill={r.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatAmount(value, currency)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="donut-center">
            <span className="donut-center-label">{centerLabel}</span>
            <strong>{formatAmount(total, currency)}</strong>
          </div>
        </div>

        <ul className="donut-legend">
          {rows.map((r) => (
            <li key={r.id}>
              <div className="donut-legend-head">
                <span>{r.name}</span>
                <span>{formatAmount(r.value, currency)}</span>
              </div>
              <div className="donut-legend-track">
                <div
                  className="donut-legend-fill"
                  style={{ width: `${(r.value / total) * 100}%`, backgroundColor: r.color }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default ExpenseChart;
