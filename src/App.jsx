import { useState } from 'react';
import { useExpenses } from './hooks/useExpenses';
import { useIncomes } from './hooks/useIncomes';
import { useCurrency } from './hooks/useCurrency';
import { useAuth } from './hooks/useAuth';
import { formatAmount } from './utils/formatters';
import AuthForm from './components/AuthForm';
import NavTabs from './components/NavTabs';
import CurrencySelector from './components/CurrencySelector';
import ExpenseForm from './components/ExpenseForm';
import ExpenseFilters from './components/ExpenseFilters';
import BudgetManager from './components/BudgetManager';
import BudgetOverview from './components/BudgetOverview';
import Summary from './components/Summary';
import ExpenseChart from './components/ExpenseChart';
import ExpenseList from './components/ExpenseList';
import IncomeForm from './components/IncomeForm';
import IncomeList from './components/IncomeList';
import './App.css';

function App() {
  const { user, loading, signOut } = useAuth();
  const { totalAmount: totalExpenses } = useExpenses();
  const { totalAmount: totalIncomes } = useIncomes();
  const { currency } = useCurrency();
  const balance = totalIncomes - totalExpenses;

  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingIncome, setEditingIncome] = useState(null);

  const handleEditExpense = (expense) => setEditingExpense(expense);
  const handleFinishEditExpense = () => setEditingExpense(null);

  const handleEditIncome = (income) => setEditingIncome(income);
  const handleFinishEditIncome = () => setEditingIncome(null);

  if (loading) {
    return <div className="auth-loading">Chargement...</div>;
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-top">
          <h1>💰 Gestion des finances</h1>
          <div className="header-actions">
            <CurrencySelector />
            <button type="button" className="logout-btn" onClick={signOut}>
              Déconnexion
            </button>
          </div>
        </div>
        <div className="balance-summary">
          <div className="balance-item balance-income">
            <span className="balance-label">Revenus</span>
            <span className="balance-value">+ {formatAmount(totalIncomes, currency)}</span>
          </div>
          <div className="balance-item balance-expense">
            <span className="balance-label">Dépenses</span>
            <span className="balance-value">− {formatAmount(totalExpenses, currency)}</span>
          </div>
          <div className={`balance-item balance-total ${balance >= 0 ? 'positive' : 'negative'}`}>
            <span className="balance-label">Solde</span>
            <span className="balance-value">{formatAmount(balance, currency)}</span>
          </div>
        </div>
      </header>

      <NavTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="app-main">
        {activeTab === 'dashboard' && (
          <section className="tab-panel">
            <ExpenseChart />
            <Summary />
          </section>
        )}

        {activeTab === 'incomes' && (
          <section className="tab-panel">
            <IncomeForm editingIncome={editingIncome} onFinishEdit={handleFinishEditIncome} />
            <IncomeList onEdit={handleEditIncome} />
          </section>
        )}

        {activeTab === 'expenses' && (
          <section className="tab-panel">
            <ExpenseForm editingExpense={editingExpense} onFinishEdit={handleFinishEditExpense} />
            <ExpenseFilters />
            <ExpenseList onEdit={handleEditExpense} />
          </section>
        )}

        {activeTab === 'budgets' && (
          <section className="tab-panel">
            <BudgetManager />
            <BudgetOverview />
          </section>
        )}
      </main>
    </div>
  );
}

export default App;