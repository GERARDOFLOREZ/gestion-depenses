const TABS = [
  { id: 'dashboard', label: '📊 Tableau de bord' },
  { id: 'expenses', label: '💸 Dépenses' },
  { id: 'incomes', label: '💵 Revenus' },
  { id: 'accounts', label: '🏦 Comptes' },
  { id: 'budgets', label: '🎯 Budgets' },
  { id: 'goals', label: '🐖 Épargne' },
  { id: 'recurring', label: '🔁 Récurrents' },
  { id: 'debts', label: '🤝 Dettes' },
  { id: 'categories', label: '🏷️ Catégories' },
];

function NavTabs({ activeTab, onTabChange }) {
  return (
    <nav className="nav-tabs">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

export default NavTabs;
