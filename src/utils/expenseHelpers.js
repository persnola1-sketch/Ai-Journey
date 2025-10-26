import { CATEGORIES } from './expenseStorage';

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const getCategoryInfo = (categoryId) => {
  return CATEGORIES.find(cat => cat.id === categoryId) || CATEGORIES[CATEGORIES.length - 1];
};

export const calculateMonthTotal = (expenses) => {
  return expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
};

export const groupByCategory = (expenses) => {
  const grouped = {};
  expenses.forEach(expense => {
    if (!grouped[expense.category]) {
      grouped[expense.category] = {
        total: 0,
        count: 0,
        expenses: []
      };
    }
    grouped[expense.category].total += parseFloat(expense.amount);
    grouped[expense.category].count += 1;
    grouped[expense.category].expenses.push(expense);
  });
  return grouped;
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};


