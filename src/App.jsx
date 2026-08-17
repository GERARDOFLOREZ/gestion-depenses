import { useState } from 'react';
import { useExpenses } from './hooks/useExpenses';
import { useIncomes } from './hooks/useIncomes';
import { formatAmount } from './utils/formatters';
import NavTabs from './components/NavTabs';
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
  const { totalAmount: totalExpenses } = useExpenses();
  const { totalAmount: totalIncomes } = useIncomes();
  const balance = totalIncomes - totalExpenses;

  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingIncome, setEditingIncome] = useState(null);

  const handleEditExpense = (expense) => setEditingExpense(expense);
  const handleFinishEditExpense = () => setEditingExpense(null);

  const handleEditIncome = (income) => setEditingIncome(income);
  const handleFinishEditIncome = () => setEditingIncome(null);

  return (
    <div className="app">
      <header className="app-header">
        <h1>💰 Gestion des finances</h1>
        <div className="balance-summary">
          <span className="balance-item balance-income">
            + {formatAmount(totalIncomes)}
          </span>
          <span className="balance-item balance-expense">
            − {formatAmount(totalExpenses)}
          </span>
          <span className={`balance-item balance-total ${balance >= 0 ? 'positive' : 'negative'}`}>
            Solde : {formatAmount(balance)}
          </span>
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