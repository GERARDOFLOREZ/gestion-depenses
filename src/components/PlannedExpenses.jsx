import { useState } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { useAccounts } from '../hooks/useAccounts';
import { useCategories } from '../hooks/useCategories';
import { usePlanned } from '../hooks/usePlanned';
import { formatAmount, formatAmountOrRange, formatDate, daysFromToday, getTodayISO } from '../utils/formatters';
import { t } from '../i18n';

function dueText(date) {
  const days = daysFromToday(date);
  if (days < 0) return { text: t('en retard de {n} j', { n: -days }), late: true };
  if (days === 0) return { text: t("aujourd'hui"), late: false };
  if (days === 1) return { text: t('demain'), late: false };
  return { text: t('dans {n} jours', { n: days }), late: false };
}

function PlannedItem({ expense, onEdit }) {
  const { updateExpense, deleteExpense } = useExpenses();
  const { getAccountCurrency, getAccount } = useAccounts();
  const { getExpenseCategory } = useCategories();
  const currency = getAccountCurrency(expense.account_id);
  const category = getExpenseCategory(expense.category);
  const account = getAccount(expense.account_id);
  const due = dueText(expense.date);

  const [paying, setPaying] = useState(false);
  const [paidAmount, setPaidAmount] = useState(String(expense.amount));
  const [paidDate, setPaidDate] = useState(getTodayISO());

  const confirmPay = () => {
    const amount = Number(paidAmount);
    if (!amount || amount <= 0) return;
    updateExpense(expense.id, {
      status: 'done',
      amount,
      date: paidDate,
      // Le prix réel est connu : on efface la fourchette (si la base la gère).
      ...('amount_min' in expense ? { amount_min: null, amount_max: null } : {}),
    });
  };

  return (
    <li className={`expense-item planned-item ${due.late ? 'is-late' : ''}`}>
      <span className="expense-category-badge" style={{ backgroundColor: category.color }}>
        {category.label}
      </span>
      <div className="expense-info">
        <p className="expense-label">{expense.label}</p>
        <p className="expense-date">
          {t('Prévue le {date}', { date: formatDate(expense.date) })} ·{' '}
          <span className={due.late ? 'late-text' : ''}>{due.text}</span>
          {account ? ` · ${account.name}` : ''}
        </p>
      </div>
      <span className="expense-amount">{formatAmountOrRange(expense, currency)}</span>
      <button type="button" className="expense-edit-btn planned-pay-btn" onClick={() => setPaying((p) => !p)} aria-label={t('Marquer comme payée')} title={t('Marquer comme payée')}>
        ✅
      </button>
      <button type="button" className="expense-edit-btn" onClick={() => onEdit(expense)} aria-label={t('Modifier {label}', { label: expense.label })}>
        ✏️
      </button>
      <button
        type="button"
        className="expense-delete-btn"
        onClick={() => window.confirm(t('Supprimer la dépense "{label}" ?', { label: expense.label })) && deleteExpense(expense.id)}
        aria-label={t('Supprimer {label}', { label: expense.label })}
      >
        🗑️
      </button>

      {paying && (
        <div className="pay-row">
          <label>
            {t('Montant réellement payé')} ({currency.symbol})
            <input type="number" min="0" step="0.01" value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} />
          </label>
          <label>
            {t('Date du paiement')}
            <input type="date" value={paidDate} onChange={(e) => setPaidDate(e.target.value)} />
          </label>
          <button type="button" className="pay-confirm" onClick={confirmPay}>{t('Confirmer le paiement')}</button>
        </div>
      )}
    </li>
  );
}

function PlannedExpenses({ onEdit }) {
  const { list, groups } = usePlanned();
  if (list.length === 0) return null;

  return (
    <section className="expense-list-section planned-section">
      <div className="expense-list-header">
        <h2>🗓️ {t('À venir ({count})', { count: list.length })}</h2>
      </div>
      <div className="planned-totals">
        {groups.map((g) => (
          <p key={g.currency.code}>
            {t('Total prévu')} :{' '}
            <strong>
              {g.low === g.high
                ? formatAmount(g.high, g.currency)
                : `${formatAmount(g.low, g.currency)} – ${formatAmount(g.high, g.currency)}`}
            </strong>
          </p>
        ))}
      </div>
      <ul className="expense-list">
        {list.map((e) => (
          <PlannedItem key={e.id} expense={e} onEdit={onEdit} />
        ))}
      </ul>
    </section>
  );
}

export default PlannedExpenses;
