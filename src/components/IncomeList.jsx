import { useIncomes } from '../hooks/useIncomes';
import IncomeItem from './IncomeItem';
import { t } from '../i18n';

function IncomeList({ onEdit }) {
  const { incomes } = useIncomes();

  if (incomes.length === 0) {
    return (
      <div className="expense-list-empty">
        <p>{t('Aucun revenu enregistré pour le moment.')}</p>
      </div>
    );
  }

  return (
    <section className="expense-list-section">
      <div className="expense-list-header">
        <h2>{t('Historique des revenus ({count})', { count: incomes.length })}</h2>
      </div>
      <ul className="expense-list">
        {incomes.map((income) => (
          <IncomeItem key={income.id} income={income} onEdit={onEdit} />
        ))}
      </ul>
    </section>
  );
}

export default IncomeList;