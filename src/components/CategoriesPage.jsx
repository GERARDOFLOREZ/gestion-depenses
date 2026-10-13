import { useState } from 'react';
import { useExtras } from '../hooks/useExtras';
import { useCategories } from '../hooks/useCategories';
import { CATEGORIES } from '../data/categories';
import { INCOME_CATEGORIES } from '../data/incomeCategories';
import DbNotice from './DbNotice';
import ColorPicker from './ColorPicker';
import { t } from '../i18n';

function Chip({ cat, onDelete }) {
  return (
    <span className="cat-chip" style={{ backgroundColor: cat.color }}>
      {t(cat.label)}
      {onDelete && (
        <button type="button" onClick={() => onDelete(cat)} aria-label={t('Supprimer {label}', { label: cat.label })}>✕</button>
      )}
    </span>
  );
}

function CategoriesPage() {
  const { customCategories } = useExtras();
  const { customList } = useCategories();
  const [form, setForm] = useState({ kind: 'expense', label: '', color: '#2e7d32' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.label.trim()) return setError(t('Le nom est obligatoire.'));
    const { error: err } = await customCategories.add({
      kind: form.kind,
      label: form.label.trim(),
      color: form.color,
    });
    if (err) return setError(t("Impossible d'enregistrer (base de données à mettre à jour ?)."));
    setForm({ ...form, label: '' });
    setError('');
  };

  const handleDelete = (cat) => {
    if (window.confirm(t('Supprimer la catégorie "{label}" ?\nLes opérations existantes apparaîtront dans « Autre ».', { label: cat.label }))) {
      customCategories.remove(cat.rowId);
    }
  };

  return (
    <>
      <DbNotice error={customCategories.error} />

      <form className="expense-form" onSubmit={handleSubmit}>
        <h2>{t('Nouvelle catégorie')}</h2>
        {error && <p className="form-error">{error}</p>}
        <div className="segmented">
          <button type="button" className={form.kind === 'expense' ? 'on' : ''} onClick={() => setForm({ ...form, kind: 'expense' })}>💸 {t('Dépense')}</button>
          <button type="button" className={form.kind === 'income' ? 'on' : ''} onClick={() => setForm({ ...form, kind: 'income' })}>💵 {t('Revenu')}</button>
        </div>
        <div className="form-group">
          <label htmlFor="cat-label">{t('Nom')}</label>
          <input id="cat-label" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder={t('Ex : Abonnements, Dons, Primes...')} />
        </div>
        <div className="form-group">
          <label>{t('Couleur')}</label>
          <ColorPicker value={form.color} onChange={(color) => setForm({ ...form, color })} />
        </div>
        <button type="submit">{t('Ajouter la catégorie')}</button>
      </form>

      <section className="summary">
        <h2>{t('Catégories de dépenses')}</h2>
        <div className="chips">
          {CATEGORIES.map((c) => (<Chip key={c.id} cat={c} />))}
          {customList.filter((c) => c.kind === 'expense').map((c) => (<Chip key={c.id} cat={c} onDelete={handleDelete} />))}
        </div>
      </section>

      <section className="summary">
        <h2>{t('Catégories de revenus')}</h2>
        <div className="chips">
          {INCOME_CATEGORIES.map((c) => (<Chip key={c.id} cat={c} />))}
          {customList.filter((c) => c.kind === 'income').map((c) => (<Chip key={c.id} cat={c} onDelete={handleDelete} />))}
        </div>
      </section>
    </>
  );
}

export default CategoriesPage;
