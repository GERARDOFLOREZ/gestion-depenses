const EXPENSES_KEY = 'gestion-depenses:expenses';
const INCOMES_KEY = 'gestion-depenses:incomes';
const BUDGETS_KEY = 'gestion-depenses:budgets';

export function loadExpenses() {
  try {
    const data = localStorage.getItem(EXPENSES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erreur lors du chargement des dépenses :', error);
    return [];
  }
}

export function saveExpenses(expenses) {
  try {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des dépenses :', error);
  }
}

export function loadIncomes() {
  try {
    const data = localStorage.getItem(INCOMES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erreur lors du chargement des revenus :', error);
    return [];
  }
}

export function saveIncomes(incomes) {
  try {
    localStorage.setItem(INCOMES_KEY, JSON.stringify(incomes));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des revenus :', error);
  }
}

export function loadBudgets() {
  try {
    const data = localStorage.getItem(BUDGETS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Erreur lors du chargement des budgets :', error);
    return {};
  }
}

export function saveBudgets(budgets) {
  try {
    localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des budgets :', error);
  }
}