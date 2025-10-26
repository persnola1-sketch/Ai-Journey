import { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { expenseStorage } from '../../utils/expenseStorage';
import { formatCurrency, calculateMonthTotal } from '../../utils/expenseHelpers';
import ExpenseTable from './ExpenseTable';
import CategoryFilter from './CategoryFilter';
import AddExpenseModal from './AddExpenseModal';
import toast from 'react-hot-toast';

const ExpensesManager = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Load expenses
  useEffect(() => {
    loadExpenses();
  }, []);

  // Filter expenses when category or expenses change
  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredExpenses(expenses);
    } else {
      setFilteredExpenses(expenses.filter(e => e.category === activeCategory));
    }
  }, [activeCategory, expenses]);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const data = await expenseStorage.getAll();
      setExpenses(data);
    } catch (error) {
      console.error('Error loading expenses:', error);
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveExpense = async (expenseData, id) => {
    try {
      if (id) {
        // Update existing expense
        const updated = await expenseStorage.update(id, expenseData);
        setExpenses(expenses.map(e => e.id === id ? updated : e));
        toast.success('Expense updated!');
      } else {
        // Add new expense
        const newExpense = await expenseStorage.add(expenseData);
        setExpenses([newExpense, ...expenses]);
        toast.success('Expense added!');
      }
      setEditingExpense(null);
    } catch (error) {
      console.error('Error saving expense:', error);
      toast.error('Failed to save expense');
      throw error;
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleDeleteExpense = async (id) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseStorage.delete(id);
        setExpenses(expenses.filter(e => e.id !== id));
        toast.success('Expense deleted');
      } catch (error) {
        console.error('Error deleting expense:', error);
        toast.error('Failed to delete expense');
      }
    }
  };

  const monthTotal = calculateMonthTotal(
    expenses.filter(e => {
      const expenseMonth = new Date(e.date);
      return expenseMonth.getMonth() === currentMonth.getMonth() &&
             expenseMonth.getFullYear() === currentMonth.getFullYear();
    })
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Expenses
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                Track and manage your spending
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={loadExpenses}
                className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              
              <button
                onClick={() => {
                  setEditingExpense(null);
                  setIsModalOpen(true);
                }}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Expense</span>
              </button>
            </div>
          </div>

          {/* Monthly Summary */}
          <div className="card p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Total
                </p>
                <p className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">
                  {formatCurrency(monthTotal)}
                </p>
              </div>
              
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <p>{expenses.length} total expenses</p>
                <p>{filteredExpenses.length} in current view</p>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            expenses={expenses}
          />
        </div>

        {/* Expenses Table */}
        <ExpenseTable
          expenses={filteredExpenses}
          onEdit={handleEditExpense}
          onDelete={handleDeleteExpense}
          loading={loading}
        />

        {/* Add/Edit Modal */}
        <AddExpenseModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingExpense(null);
          }}
          onSave={handleSaveExpense}
          editExpense={editingExpense}
        />
      </div>
    </div>
  );
};

export default ExpensesManager;


