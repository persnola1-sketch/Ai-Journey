import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate, getCategoryInfo } from '../../utils/expenseHelpers';

const ExpenseTable = ({ expenses, onEdit, onDelete, loading }) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4 p-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">💳</span>
        </div>
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          No expenses yet
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400">
          Start tracking your expenses by adding your first one!
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                  Store
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {expenses.map((expense) => {
                const categoryInfo = getCategoryInfo(expense.category);
                return (
                  <motion.tr
                    key={expense.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onMouseEnter={() => setHoveredRow(expense.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
                      {formatDate(expense.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-900 dark:text-neutral-100">
                      <div className="font-medium">{expense.store}</div>
                      {expense.notes && (
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 truncate max-w-xs">
                          {expense.notes}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        bg-${categoryInfo.color}-100 dark:bg-${categoryInfo.color}-900/30
                        text-${categoryInfo.color}-800 dark:text-${categoryInfo.color}-200
                      `}>
                        <span className="mr-1">{categoryInfo.emoji}</span>
                        {categoryInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <AnimatePresence>
                        {hoveredRow === expense.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="inline-flex items-center gap-2"
                          >
                            <button
                              onClick={() => onEdit(expense)}
                              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                              title="Edit expense"
                            >
                              <Edit2 className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                            </button>
                            <button
                              onClick={() => onDelete(expense.id)}
                              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                              title="Delete expense"
                            >
                              <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {expenses.map((expense) => {
          const categoryInfo = getCategoryInfo(expense.category);
          return (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="card p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                    {expense.store}
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    {formatDate(expense.date)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    {formatCurrency(expense.amount)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`
                  inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  bg-${categoryInfo.color}-100 dark:bg-${categoryInfo.color}-900/30
                  text-${categoryInfo.color}-800 dark:text-${categoryInfo.color}-200
                `}>
                  <span className="mr-1">{categoryInfo.emoji}</span>
                  {categoryInfo.label}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(expense)}
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  </button>
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>

              {expense.notes && (
                <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700 text-sm text-neutral-600 dark:text-neutral-400">
                  {expense.notes}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </>
  );
};

export default ExpenseTable;


