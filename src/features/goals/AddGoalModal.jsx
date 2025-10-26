import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target } from 'lucide-react';

const PRIORITIES = [
  { value: 'high', label: 'High', color: 'text-gx-red', bgColor: 'bg-gx-red/20' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-500', bgColor: 'bg-yellow-500/20' },
  { value: 'low', label: 'Low', color: 'text-green-500', bgColor: 'bg-green-500/20' },
];

const AddGoalModal = ({ isOpen, onClose, onAdd, editGoal = null }) => {
  const [text, setText] = useState(editGoal?.text || '');
  const [priority, setPriority] = useState(editGoal?.priority || 'medium');
  const [deadline, setDeadline] = useState(editGoal?.deadline?.split('T')[0] || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const goal = {
      id: editGoal?.id || Date.now(),
      text: text.trim(),
      completed: editGoal?.completed || false,
      priority,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      createdAt: editGoal?.createdAt || new Date().toISOString(),
      completedAt: editGoal?.completedAt || null,
    };

    onAdd(goal);
    handleClose();
  };

  const handleClose = () => {
    setText('');
    setPriority('medium');
    setDeadline('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md max-h-[90vh] overflow-y-auto card"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent-100 dark:bg-accent-900 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-accent-600 dark:text-accent-400" />
              </div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                {editGoal ? 'Edit Goal' : 'New Goal'}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Goal Text */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                What's your goal? <span className="text-red-600 dark:text-red-400">*</span>
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g., Learn React in 30 days"
                className="input"
                autoFocus
                maxLength={200}
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                Priority
              </label>
              <div className="flex space-x-2">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value)}
                    className={`
                      flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer
                      ${priority === p.value
                        ? `${p.bgColor} ${p.color} border-2 border-current`
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 border-2 border-transparent'
                      }
                    `}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                Deadline (Optional)
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="input"
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!text.trim()}
                className={`
                  flex-1 px-4 py-3 rounded-md font-medium transition-all
                  ${text.trim()
                    ? 'btn-primary'
                    : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-500 cursor-not-allowed'
                  }
                `}
              >
                {editGoal ? 'Update Goal' : 'Create Goal'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddGoalModal;


