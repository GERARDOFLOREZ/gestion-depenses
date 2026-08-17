const TABS = [
  { id: 'dashboard', label: '📊 Tableau de bord' },
  { id: 'incomes', label: '💵 Revenus' },
  { id: 'expenses', label: '💸 Dépenses' },
  { id: 'budgets', label: '🎯 Budgets' },
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