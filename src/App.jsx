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
import CurrencySelector from './components/CurrencySelector';
import ExpenseChart from './components/ExpenseChart';
import MonthlyChart from './components/MonthlyChart';
import BudgetAlertsBanner from './components/BudgetAlertsBanner';
import BudgetToasts from './components/BudgetToasts';
import UpcomingCard from './components/UpcomingCard';
import PlannedExpenses from './components/PlannedExpenses';
import { useBudgetToasts } from './hooks/useBudgetAlerts';
import AccountBalances from './components/AccountBalances';
import AccountsPage from './components/AccountsPage';
import GoalsPage from './components/GoalsPage';
import RecurringPage from './components/RecurringPage';
import DebtsPage from './components/DebtsPage';
import CategoriesPage from './components/CategoriesPage';
import ExpenseList from './components/ExpenseList';
import IncomeForm from './components/IncomeForm';
import IncomeList from './components/IncomeList';
import LanguageSelector from './components/LanguageSelector';
import { useLanguage } from './hooks/useLanguage';
import { t } from './i18n';
import './App.css';

const VIEW_TABS = ['dashboard', 'expenses', 'incomes'];

function Dashboard({ onSeeBudgets, onSeePlanned, onSeeCash }) {
  const { viewCurrencyCode, isMixed } = useView();
  return (
    <section className="tab-panel">
      <div className="currency-bar">
        <CurrencySelector />
        <p className="hint">
          {isMixed
            ? t('Vos comptes ont des devises différentes : les graphiques sont en {code}. Changez la devise ici, ou choisissez un compte.', { code: viewCurrencyCode })
            : t('Utilisée pour vos budgets et pour les nouveaux comptes.')}
        </p>
      </div>
      <BudgetAlertsBanner onSeeBudgets={onSeeBudgets} />
      <UpcomingCard onSee={onSeePlanned} />
      <AccountBalances onCash={onSeeCash} />
      <MonthlyChart />
      <ExpenseChart />
    </section>
  );
}

function App() {
  const { user, loading, signOut, recovering } = useAuth();
  useLanguage(); // se réabonne : tout l'arbre se réaffiche quand la langue change
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingIncome, setEditingIncome] = useState(null);

  if (loading) {
    return <div className="auth-loading">{t('Chargement...')}</div>;
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
  const { toasts, dismissToast } = useBudgetToasts();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const current = getMenuItem(activeTab);
  const { month, accountId } = useView();
  const { getAccount } = useAccounts();
  const totals = useViewTotals();
  useLanguage();

  const scopeLabel = [
    month === 'all' ? t('Toute la période') : formatMonthLabel(month),
    accountId === 'all' ? t('Tous les comptes') : getAccount(accountId)?.name,
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
          <button type="button" className="menu-btn" onClick={() => setMenuOpen(true)} aria-label={t('Ouvrir le menu')}>
            <span className="menu-btn-icon">☰</span>
            <span className="menu-btn-label">{t('Menu')}</span>
          </button>
          <div className="header-title">
            <h1>💰 {t('Gestion des finances')}</h1>
            <p className="header-scope">{scopeLabel}</p>
          </div>
          <div className="header-actions">
            <LanguageSelector className="header-lang" />
            <button type="button" className="logout-btn" onClick={signOut}>
              {t('Déconnexion')}
            </button>
          </div>
        </div>
        <div className="balance-summary">
          <div className="balance-item balance-income">
            <span className="balance-label">{t('Revenus')}</span>
            {totals.map((tot) => (
              <span key={tot.currency.code} className="balance-value">+ {formatAmount(tot.income, tot.currency)}</span>
            ))}
          </div>
          <div className="balance-item balance-expense">
            <span className="balance-label">{t('Dépenses')}</span>
            {totals.map((tot) => (
              <span key={tot.currency.code} className="balance-value">− {formatAmount(tot.expense, tot.currency)}</span>
            ))}
          </div>
          <div
            className={`balance-item balance-total ${totals.every((tot) => tot.balance >= 0) ? 'positive' : 'negative'}`}
          >
            <span className="balance-label">{t('Solde')}</span>
            {totals.map((tot) => (
              <span key={tot.currency.code} className="balance-value">{formatAmount(tot.balance, tot.currency)}</span>
            ))}
          </div>
        </div>
      </header>

      <h2 className="page-title">
        {current?.icon} {current && t(current.label)}
      </h2>

      {VIEW_TABS.includes(activeTab) && <ViewBar />}

      <main className="app-main">
        {activeTab === 'dashboard' && <Dashboard onSeeBudgets={() => setActiveTab('budgets')} onSeePlanned={() => setActiveTab('expenses')} onSeeCash={() => setActiveTab('accounts')} />}

        {activeTab === 'incomes' && (
          <section className="tab-panel">
            <IncomeForm editingIncome={editingIncome} onFinishEdit={() => setEditingIncome(null)} />
            <IncomeList onEdit={setEditingIncome} />
          </section>
        )}

        {activeTab === 'expenses' && (
          <section className="tab-panel">
            <BudgetAlertsBanner onSeeBudgets={() => setActiveTab('budgets')} />
            <ExpenseForm editingExpense={editingExpense} onFinishEdit={() => setEditingExpense(null)} />
            <PlannedExpenses onEdit={setEditingExpense} />
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

      <BudgetToasts toasts={toasts} onClose={dismissToast} />
    </div>
  );
}

export default App;
