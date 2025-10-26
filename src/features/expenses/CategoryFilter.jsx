import { CATEGORIES } from '../../utils/expenseStorage';
import { getCategoryInfo } from '../../utils/expenseHelpers';

const CategoryFilter = ({ activeCategory, onCategoryChange, expenses }) => {
  // Count expenses by category
  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return expenses.length;
    return expenses.filter(e => e.category === categoryId).length;
  };

  const allCategories = [
    { id: 'all', label: 'All', emoji: '📊', color: 'neutral' },
    ...CATEGORIES
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {allCategories.map((category) => {
        const count = getCategoryCount(category.id);
        const isActive = activeCategory === category.id;
        
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all border
              ${isActive
                ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100'
                : 'bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600'
              }
            `}
          >
            <span>{category.emoji}</span>
            <span>{category.label}</span>
            {count > 0 && (
              <span className={`
                px-2 py-0.5 rounded-full text-xs font-bold
                ${isActive
                  ? 'bg-white/20 dark:bg-black/20'
                  : 'bg-neutral-100 dark:bg-neutral-800'
                }
              `}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;


