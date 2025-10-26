import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { expenseStorage } from '../../utils/expenseStorage';
import { formatCurrency, groupByCategory, getCategoryInfo } from '../../utils/expenseHelpers';
import { ROUTES } from '../../config/routes';

const ExpensesDashboardWidget = () => {
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [topCategories, setTopCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExpenseData();
  }, []);

  const loadExpenseData = async () => {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      
      // Get expenses for current month
      const monthExpenses = await expenseStorage.getByMonth(currentYear, currentMonth);
      
      // Calculate total
      const total = monthExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
      setMonthlyTotal(total);
      
      // Group by category and get top 3
      const grouped = groupByCategory(monthExpenses);
      const sortedCategories = Object.entries(grouped)
        .map(([categoryId, data]) => ({
          ...getCategoryInfo(categoryId),
          total: data.total,
          count: data.count
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 3);
      
      setTopCategories(sortedCategories);
    } catch (error) {
      console.error('Error loading expense data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-32 mb-4"></div>
          <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded w-40 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <span>💰</span>
          Monthly Spending
        </h3>
        <TrendingUp className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
      </div>
      
      <div className="mb-6">
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
        <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          {formatCurrency(monthlyTotal)}
        </p>
      </div>

      {topCategories.length > 0 ? (
        <div className="space-y-3 mb-4">
          {topCategories.map((category) => {
            const percentage = monthlyTotal > 0 ? (category.total / monthlyTotal * 100) : 0;
            
            return (
              <div key={category.id}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
                    <span>{category.emoji}</span>
                    <span>{category.label}</span>
                  </span>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {formatCurrency(category.total)}
                  </span>
                </div>
                <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-${category.color}-500 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  {percentage.toFixed(0)}% • {category.count} {category.count === 1 ? 'expense' : 'expenses'}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-4 text-sm text-neutral-600 dark:text-neutral-400">
          No expenses this month yet
        </div>
      )}

      <Link
        to={ROUTES.EXPENSES}
        className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors group"
      >
        <span>View All Expenses</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};

export default ExpensesDashboardWidget;


