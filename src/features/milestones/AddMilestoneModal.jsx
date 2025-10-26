import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy } from 'lucide-react';

const CATEGORIES = [
  { value: 'personal', label: 'Personal', color: 'text-discord-purple', bgColor: 'bg-discord-purple/20' },
  { value: 'work', label: 'Work', color: 'text-gx-cyan', bgColor: 'bg-gx-cyan/20' },
  { value: 'project', label: 'Project', color: 'text-green-500', bgColor: 'bg-green-500/20' },
  { value: 'other', label: 'Other', color: 'text-text-secondary', bgColor: 'bg-dark-600' },
];

const AddMilestoneModal = ({ isOpen, onClose, onAdd, editMilestone = null }) => {
  const [title, setTitle] = useState(editMilestone?.title || '');
  const [description, setDescription] = useState(editMilestone?.description || '');
  const [category, setCategory] = useState(editMilestone?.category || 'personal');
  const [date, setDate] = useState(
    editMilestone?.date?.split('T')[0] || new Date().toISOString().split('T')[0]
  );

  // Update form when editMilestone changes
  useEffect(() => {
    if (editMilestone) {
      setTitle(editMilestone.title || '');
      setDescription(editMilestone.description || '');
      setCategory(editMilestone.category || 'personal');
      setDate(editMilestone.date?.split('T')[0] || new Date().toISOString().split('T')[0]);
    } else {
      // Reset to defaults when creating new milestone
      setTitle('');
      setDescription('');
      setCategory('personal');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [editMilestone]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const milestone = {
      id: editMilestone?.id || Date.now(),
      title: title.trim(),
      description: description.trim() || null,
      category,
      date: new Date(date).toISOString(),
      createdAt: editMilestone?.createdAt || new Date().toISOString(),
    };

    onAdd(milestone);
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setCategory('personal');
    setDate(new Date().toISOString().split('T')[0]);
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
                <Trophy className="w-6 h-6 text-accent-600 dark:text-accent-400" />
              </div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                {editMilestone ? 'Edit Milestone' : 'New Milestone'}
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
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                Achievement Title <span className="text-red-600 dark:text-red-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Completed my first marathon"
                className="w-full px-4 py-3 input"
                autoFocus
                maxLength={100}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details about this achievement..."
                rows={3}
                className="w-full px-4 py-3 input resize-none"
                maxLength={500}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`
                      px-4 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer
                      ${category === cat.value
                        ? `${cat.bgColor} ${cat.color} border-2 border-current`
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 border-2 border-transparent'
                      }
                    `}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
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
                disabled={!title.trim()}
                className={`
                  flex-1 px-4 py-3 rounded-md font-medium transition-all
                  ${title.trim()
                    ? 'btn-primary'
                    : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-500 cursor-not-allowed'
                  }
                `}
              >
                {editMilestone ? 'Update' : 'Add Milestone'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddMilestoneModal;


