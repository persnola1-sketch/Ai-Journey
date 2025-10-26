import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Trash2, Edit2, Calendar, AlertCircle } from 'lucide-react';
import { goalsStorage } from '../../utils/storage';
import { formatDate, isOverdue, getDaysUntil } from '../../utils/dateHelpers';
import AddGoalModal from './AddGoalModal';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const FILTERS = ['all', 'active', 'completed'];
const SORTS = [
  { value: 'priority', label: 'Priority' },
  { value: 'deadline', label: 'Deadline' },
  { value: 'created', label: 'Date Created' },
];

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

const GoalsManager = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  // Load goals on mount
  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const loadedGoals = await goalsStorage.getAll();
      setGoals(loadedGoals);
    } catch (error) {
      console.error('Error loading goals:', error);
      toast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (goal) => {
    const isEdit = goals.some(g => g.id === goal.id);
    
    try {
      if (isEdit) {
        const updated = await goalsStorage.update(goal.id, goal);
        setGoals(goals.map(g => g.id === goal.id ? updated : g));
        toast.success('Goal updated!');
      } else {
        const newGoal = await goalsStorage.add(goal);
        setGoals([...goals, newGoal]);
        toast.success('Goal created!');
      }
      setEditingGoal(null);
    } catch (error) {
      console.error('Error saving goal:', error);
      toast.error('Failed to save goal');
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      const updated = await goalsStorage.toggle(id);
      
      setGoals(goals.map(g => {
        if (g.id === id) {
          if (updated.completed) {
            // Celebrate completion!
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
            toast.success('🎉 Goal completed!');
          }
          return updated;
        }
        return g;
      }));
    } catch (error) {
      console.error('Error toggling goal:', error);
      toast.error('Failed to update goal');
    }
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleDeleteGoal = async (id) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      try {
        await goalsStorage.delete(id);
        setGoals(goals.filter(g => g.id !== id));
        toast.success('Goal deleted');
      } catch (error) {
        console.error('Error deleting goal:', error);
        toast.error('Failed to delete goal');
      }
    }
  };

  // Filter goals
  const filteredGoals = goals.filter(goal => {
    if (filter === 'active') return !goal.completed;
    if (filter === 'completed') return goal.completed;
    return true;
  });

  // Sort goals
  const sortedGoals = [...filteredGoals].sort((a, b) => {
    if (sortBy === 'priority') {
      return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    }
    if (sortBy === 'deadline') {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    }
    if (sortBy === 'created') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  const stats = {
    total: goals.length,
    active: goals.filter(g => !g.completed).length,
    completed: goals.filter(g => g.completed).length,
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3"></div>
            <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Your Goals
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                {stats.active} active • {stats.completed} completed
              </p>
            </div>
            <button
              onClick={() => {
                setEditingGoal(null);
                setIsModalOpen(true);
              }}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">New Goal</span>
            </button>
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Filter tabs */}
            <div className="flex space-x-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`
                    px-4 py-2 rounded-md font-medium text-sm capitalize transition-colors border
                    ${filter === f
                      ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100'
                      : 'bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600'
                    }
                  `}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Sort dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input px-4 py-2 text-sm"
            >
              {SORTS.map((sort) => (
                <option key={sort.value} value={sort.value}>
                  Sort by: {sort.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Goals List */}
        {sortedGoals.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Plus className="w-10 h-10 text-neutral-400 dark:text-neutral-500" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              {filter === 'all' ? 'No goals yet' : `No ${filter} goals`}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              {filter === 'all' ? 'Start by creating your first goal!' : `Switch to "All" to see your goals`}
            </p>
            {filter === 'all' && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-primary"
              >
                Create Your First Goal
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {sortedGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onToggle={handleToggleComplete}
                  onEdit={handleEditGoal}
                  onDelete={handleDeleteGoal}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Modal */}
        <AddGoalModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingGoal(null);
          }}
          onAdd={handleAddGoal}
          editGoal={editingGoal}
        />
      </div>
    </div>
  );
};

const GoalCard = ({ goal, onToggle, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      case 'medium': return 'text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'low': return 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      default: return 'text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800';
    }
  };

  const overdue = goal.deadline && isOverdue(goal.deadline);
  const daysUntil = goal.deadline ? getDaysUntil(goal.deadline) : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4
        ${goal.completed ? 'opacity-60' : ''}
      `}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(goal.id)}
        className={`
          w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0
          transition-colors
          ${goal.completed
            ? 'bg-neutral-900 dark:bg-neutral-100 border-neutral-900 dark:border-neutral-100'
            : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-100'
          }
        `}
      >
        {goal.completed && <Check className="w-4 h-4 text-white dark:text-neutral-900" />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0 w-full sm:w-auto">
        <div className="flex items-center space-x-2 mb-1">
          <p className={`
            text-neutral-900 dark:text-neutral-100 font-medium
            ${goal.completed ? 'line-through opacity-60' : ''}
          `}>
            {goal.text}
          </p>
          <span className={`
            px-2 py-0.5 rounded text-xs font-medium capitalize ${getPriorityColor(goal.priority)}
          `}>
            {goal.priority}
          </span>
        </div>
        
        {goal.deadline && (
          <div className="flex items-center space-x-1 text-xs text-neutral-600 dark:text-neutral-400">
            <Calendar className="w-3 h-3" />
            <span className={overdue && !goal.completed ? 'text-red-600 dark:text-red-400' : ''}>
              {formatDate(goal.deadline)} 
              {!goal.completed && daysUntil !== null && (
                <span className="ml-1">
                  ({daysUntil === 0 ? 'Today' : daysUntil > 0 ? `${daysUntil}d left` : `${Math.abs(daysUntil)}d overdue`})
                </span>
              )}
            </span>
            {overdue && !goal.completed && <AlertCircle className="w-3 h-3 text-red-600 dark:text-red-400" />}
          </div>
        )}
      </div>

      {/* Actions */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end"
          >
            <button
              onClick={() => onEdit(goal)}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-text-secondary hover:text-discord-purple hover:bg-dark-600 rounded-lg transition-colors cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(goal.id)}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-text-secondary hover:text-gx-red hover:bg-dark-600 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GoalsManager;


