import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useExpenses } from '../hooks/useExpenses';
import { useIncomes } from '../hooks/useIncomes';
import { useAccounts } from '../hooks/useAccounts';
import { useView } from '../hooks/useView';
import { getCurrencyByCode } from '../data/currencies';
import { useLanguage } from '../hooks/useLanguage';
import { formatAmount, formatShortMonth, getMonthISO, shiftMonth } from '../utils/formatters';
import { t } from '../i18n';

const MONTHS_SHOWN = 6;

function MonthlyChart() {
  const { allExpenses } = useExpenses();
  const { allIncomes } = useIncomes();
  const { getAccountCurrency } = useAccounts();
  const { month, accountId, viewCurrencyCode } = useView();
  const { locale } = useLanguage();

  const data = useMemo(() => {
    const end = month === 'all' ? getMonthISO() : month;
    const months = Array.from({ length: MONTHS_SHOWN }, (_, i) => shiftMonth(end, i - (MONTHS_SHOWN - 1)));
    const keep = (item) =>
      (accountId === 'all' || item.account_id === accountId) &&
      getAccountCurrency(item.account_id).code === viewCurrencyCode;
    return months.map((m) => ({
      name: formatShortMonth(m),
      income: allIncomes.filter((i) => keep(i) && i.date.startsWith(m)).reduce((s, i) => s + Number(i.amount), 0),
      expense: allExpenses.filter((e) => keep(e) && e.date.startsWith(m)).reduce((s, e) => s + Number(e.amount), 0),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allExpenses, allIncomes, month, accountId, viewCurrencyCode, locale]);

  const currency = getCurrencyByCode(viewCurrencyCode);
  const hasData = data.some((d) => d.income > 0 || d.expense > 0);
  if (!hasData) return null;

  return (
    <section className="expense-chart">
      <h2>{t('Évolution sur {n} mois', { n: MONTHS_SHOWN })}</h2>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dde6df" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={56} tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)} />
          <Tooltip formatter={(value) => formatAmount(value, currency)} />
          <Legend />
          <Bar dataKey="income" name={t('Revenus')} fill="#2e7d32" radius={[6, 6, 0, 0]} />
          <Bar dataKey="expense" name={t('Dépenses')} fill="#e57373" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}

export default MonthlyChart;
