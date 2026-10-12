import { useState, useCallback } from 'react';
import { useExpenses } from './hooks/useExpenses';
import { useAuth } from './hooks/useAuth';
import { useView } from './hooks/useView';
import { useAccounts } from './hooks/useAccounts';
import { useViewTotals } from './hooks/useViewTotals';
import { useAutomation } from './hooks/useAutomation';
import { formatAmount, formatMonthLabel } from './utils/formatters';
import AuthForm from './components/AuthForm';
import ResetPasswordForm from './components/ResetPasswordForm';
import NavTabs from './components/NavTabs';
import { getMenuItem } from './data/menu';
import ViewBar from './components/ViewBar';
import ExpenseForm from './components/ExpenseForm';
import ExpenseFilters from './components/ExpenseFilters';
import BudgetManager from './components/BudgetManager';
import BudgetOverview from './components/BudgetOverview';
import Summary from './components/Summary';
import ExpenseChart from './components/ExpenseChart';
import MonthlyChart from './components/MonthlyChart';
import MixedCurrencyNotice from './components/MixedCurrencyNotice';
import AccountBalances from './components/AccountBalances';
import AccountsPage from './components/AccountsPage';
import GoalsPage from './components/GoalsPage';
import RecurringPage from './components/RecurringPage';
import DebtsPage from './components/DebtsPage';
import CategoriesPage from './components/CategoriesPage';
import ExpenseList from './components/ExpenseList';
import IncomeForm from './components/IncomeForm';
import IncomeList from './components/IncomeList';
import './App.css';

const VIEW_TABS = ['dashboard', 'expenses', 'incomes'];

function Dashboard() {
  const { viewCurrencyCode } = useView();
  return (
    <section className="tab-panel">
      <AccountBalances />
      {viewCurrencyCode ? (
        <>
          <MonthlyChart />
          <ExpenseChart />
          <Summary />
        </>
      ) : (
        <MixedCurrencyNotice title="Graphiques" />
      )}
    </section>
  );
}

function App() {
  const { user, loading, signOut, recovering } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingIncome, setEditingIncome] = useState(null);

  if (loading) {
    return <div className="auth-loading">Chargement...</div>;
  }

  if (recovering) {
    return <ResetPasswordForm />;
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="app">
      <Shell
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        signOut={signOut}
        editingExpense={editingExpense}
        setEditingExpense={setEditingExpense}
        editingIncome={editingIncome}
        setEditingIncome={setEditingIncome}
      />
    </div>
  );
}

// Séparé pour que les hooks de données ne tournent que lorsque l'utilisateur est connecté.
function Shell({
  activeTab, setActiveTab, signOut,
  editingExpense, setEditingExpense, editingIncome, setEditingIncome,
}) {
  useAutomation();
  useExpenses();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const current = getMenuItem(activeTab);
  const { month, accountId } = useView();
  const { getAccount } = useAccounts();
  const totals = useViewTotals();

  const scopeLabel = [
    month === 'all' ? 'Toute la période' : formatMonthLabel(month),
    accountId === 'all' ? 'Tous les comptes' : getAccount(accountId)?.name,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="app-layout">
      <NavTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        open={menuOpen}
        onClose={closeMenu}
      />

      <div className="app-content">
      <header className="app-header">
        <div className="app-header-top">
          <button type="button" className="menu-btn" onClick={() => setMenuOpen(true)} aria-label="Ouvrir le menu">
            <span className="menu-btn-icon">☰</span>
            <span className="menu-btn-label">Menu</span>
          </button>
          <div className="header-title">
            <h1>💰 Gestion des finances</h1>
            <p className="header-scope">{scopeLabel}</p>
          </div>
          <div className="header-actions">
            <button type="button" className="logout-btn" onClick={signOut}>
              Déconnexion
            </button>
          </div>
        </div>
        <div className="balance-summary">
          <div className="balance-item balance-income">
            <span className="balance-label">Revenus</span>
            {totals.map((t) => (
              <span key={t.currency.code} className="balance-value">+ {formatAmount(t.income, t.currency)}</span>
            ))}
          </div>
          <div className="balance-item balance-expense">
            <span className="balance-label">Dépenses</span>
            {totals.map((t) => (
              <span key={t.currency.code} className="balance-value">− {formatAmount(t.expense, t.currency)}</span>
            ))}
          </div>
          <div
            className={`balance-item balance-total ${totals.every((t) => t.balance >= 0) ? 'positive' : 'negative'}`}
          >
            <span className="balance-label">Solde</span>
            {totals.map((t) => (
              <span key={t.currency.code} className="balance-value">{formatAmount(t.balance, t.currency)}</span>
            ))}
          </div>
        </div>
      </header>

      <h2 className="page-title">
        {current?.icon} {current?.label}
      </h2>

      {VIEW_TABS.includes(activeTab) && <ViewBar />}

      <main className="app-main">
        {activeTab === 'dashboard' && <Dashboard />}

        {activeTab === 'incomes' && (
          <section className="tab-panel">
            <IncomeForm editingIncome={editingIncome} onFinishEdit={() => setEditingIncome(null)} />
            <IncomeList onEdit={setEditingIncome} />
          </section>
        )}

        {activeTab === 'expenses' && (
          <section className="tab-panel">
            <ExpenseForm editingExpense={editingExpense} onFinishEdit={() => setEditingExpense(null)} />
            <ExpenseFilters />
            <ExpenseList onEdit={setEditingExpense} />
          </section>
        )}

        {activeTab === 'accounts' && (
          <section className="tab-panel"><AccountsPage /></section>
        )}

        {activeTab === 'budgets' && (
          <section className="tab-panel">
            <BudgetManager />
            <BudgetOverview />
          </section>
        )}

        {activeTab === 'goals' && <section className="tab-panel"><GoalsPage /></section>}
        {activeTab === 'recurring' && <section className="tab-panel"><RecurringPage /></section>}
        {activeTab === 'debts' && <section className="tab-panel"><DebtsPage /></section>}
        {activeTab === 'categories' && <section className="tab-panel"><CategoriesPage /></section>}
      </main>
      </div>
    </div>
  );
}

export default App;
