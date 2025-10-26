import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Plus, Edit2, Trash2, Briefcase, User, FolderOpen, Circle } from 'lucide-react';
import { milestonesStorage } from '../../utils/storage';
import { formatDate } from '../../utils/dateHelpers';
import AddMilestoneModal from './AddMilestoneModal';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const CATEGORIES = [
  { value: 'all', label: 'All', icon: Circle },
  { value: 'personal', label: 'Personal', icon: User, color: 'purple-600' },
  { value: 'work', label: 'Work', icon: Briefcase, color: 'blue-600' },
  { value: 'project', label: 'Project', icon: FolderOpen, color: 'green-600' },
  { value: 'other', label: 'Other', icon: Star, color: 'neutral-600' },
];

const MilestonesManager = () => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);

  // Load milestones on mount
  useEffect(() => {
    loadMilestones();
  }, []);

  const loadMilestones = async () => {
    try {
      setLoading(true);
      const loadedMilestones = await milestonesStorage.getAll();
      setMilestones(loadedMilestones);
    } catch (error) {
      console.error('Error loading milestones:', error);
      toast.error('Failed to load milestones');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMilestone = async (milestone) => {
    const isEdit = milestones.some(m => m.id === milestone.id);
    
    try {
      if (isEdit) {
        const updated = await milestonesStorage.update(milestone.id, milestone);
        setMilestones(milestones.map(m => m.id === milestone.id ? updated : m));
        toast.success('Milestone updated!');
      } else {
        const newMilestone = await milestonesStorage.add(milestone);
        setMilestones([newMilestone, ...milestones]);
        
        // Celebrate!
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#7289da', '#00d4ff', '#ff4654'],
        });
        toast.success('🎉 Milestone added!');
      }
      setEditingMilestone(null);
    } catch (error) {
      console.error('Error saving milestone:', error);
      toast.error('Failed to save milestone');
    }
  };

  const handleEditMilestone = (milestone) => {
    setEditingMilestone(milestone);
    setIsModalOpen(true);
  };

  const handleDeleteMilestone = async (id) => {
    if (confirm('Are you sure you want to delete this milestone?')) {
      try {
        await milestonesStorage.delete(id);
        setMilestones(milestones.filter(m => m.id !== id));
        toast.success('Milestone deleted');
      } catch (error) {
        console.error('Error deleting milestone:', error);
        toast.error('Failed to delete milestone');
      }
    }
  };

  // Filter milestones
  const filteredMilestones = filter === 'all'
    ? milestones
    : milestones.filter(m => m.category === filter);

  const getCategoryInfo = (category) => {
    const cat = CATEGORIES.find(c => c.value === category);
    return cat || CATEGORIES[CATEGORIES.length - 1];
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
              <div key={i} className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
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
                Milestones
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                {milestones.length} {milestones.length === 1 ? 'achievement' : 'achievements'} recorded
              </p>
            </div>
            <button
              onClick={() => {
                setEditingMilestone(null);
                setIsModalOpen(true);
              }}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Milestone</span>
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.value}
                  onClick={() => setFilter(cat.value)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-md font-medium text-sm transition-colors border
                    ${filter === cat.value
                      ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100'
                      : 'bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Milestones Timeline */}
        {filteredMilestones.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-neutral-400 dark:text-neutral-500" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              {filter === 'all' ? 'No milestones yet' : `No ${filter} milestones`}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              {filter === 'all' 
                ? 'Celebrate your first achievement!' 
                : `Switch to "All" to see your milestones`
              }
            </p>
            {filter === 'all' && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-primary"
              >
                Add Your First Milestone
              </button>
            )}
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-neutral-200 dark:bg-neutral-800" />

            {/* Milestones */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 relative"
            >
              <AnimatePresence mode="popLayout">
                {filteredMilestones.map((milestone, index) => (
                  <MilestoneCard
                    key={milestone.id}
                    milestone={milestone}
                    isFirst={index === 0}
                    onEdit={handleEditMilestone}
                    onDelete={handleDeleteMilestone}
                    categoryInfo={getCategoryInfo(milestone.category)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}

        {/* Modal */}
        <AddMilestoneModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingMilestone(null);
          }}
          onAdd={handleAddMilestone}
          editMilestone={editingMilestone}
        />
      </div>
    </div>
  );
};

const MilestoneCard = ({ milestone, isFirst, onEdit, onDelete, categoryInfo }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = categoryInfo.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative pl-16"
    >
      {/* Icon circle */}
      <div className={`
        absolute left-0 w-12 h-12 rounded-xl flex items-center justify-center
        ${isFirst ? 'bg-accent-500 dark:bg-accent-600' : 'bg-neutral-200 dark:bg-neutral-700'}
      `}>
        <Icon className={`w-6 h-6 ${isFirst ? 'text-white' : 'text-neutral-600 dark:text-neutral-300'}`} />
      </div>

      {/* Content card */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0 w-full sm:w-auto">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {milestone.title}
              </h3>
              <span className={`
                px-2 py-0.5 rounded text-xs font-medium capitalize
                text-${categoryInfo.color} bg-${categoryInfo.color}/10 dark:bg-${categoryInfo.color}/20
              `}>
                {milestone.category}
              </span>
            </div>
            
            {milestone.description && (
              <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3">
                {milestone.description}
              </p>
            )}
            
            <div className="flex items-center space-x-2 text-xs text-neutral-500 dark:text-neutral-400">
              <Star className="w-3 h-3" />
              <span>{formatDate(milestone.date, 'MMMM dd, yyyy')}</span>
            </div>
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
                  onClick={() => onEdit(milestone)}
                  className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(milestone.id)}
                  className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default MilestonesManager;


