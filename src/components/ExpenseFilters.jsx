import { useExpenses } from '../hooks/useExpenses';
import { useCategories } from '../hooks/useCategories';

function ExpenseFilters() {
  const { filters, updateFilter, resetFilters } = useExpenses();
  const { expenseCategories } = useCategories();

  const handleChange = (e) => {
    updateFilter(e.target.name, e.target.value);
  };

  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.startDate ||
    filters.endDate ||
    filters.search;

  return (
    <section className="expense-filters">
      <div className="filter-group filter-search">
        <label htmlFor="filter-search">Recherche</label>
        <input
          type="text"
          id="filter-search"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Rechercher un libellé..."
        />
      </div>

      <div className="filter-group">
        <label htmlFor="filter-category">Catégorie</label>
        <select
          id="filter-category"
          name="category"
          value={filters.category}
          onChange={handleChange}
        >
          <option value="all">Toutes</option>
          {expenseCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="filter-start">Du</label>
        <input
          type="date"
          id="filter-start"
          name="startDate"
          value={filters.startDate}
          onChange={handleChange}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="filter-end">Au</label>
        <input
          type="date"
          id="filter-end"
          name="endDate"
          value={filters.endDate}
          onChange={handleChange}
        />
      </div>

      {hasActiveFilters && (
        <button type="button" className="filter-reset-btn" onClick={resetFilters}>
          Réinitialiser
        </button>
      )}
    </section>
  );
}

export default ExpenseFilters;