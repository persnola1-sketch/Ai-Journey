import { motion } from 'framer-motion';
import { Target, Plus, TrendingUp, Calendar } from 'lucide-react';
import { useState } from 'react';

const GoalsView = () => {
  const [showAddGoal, setShowAddGoal] = useState(false);

  const handleAddGoal = () => {
    setShowAddGoal(true);
    // TODO: Implement add goal functionality
    alert('Goal creation feature coming soon!');
    setShowAddGoal(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                Your Goals
              </h1>
              <p className="text-text-secondary text-lg">
                Track and achieve your dreams, one step at a time
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddGoal}
              className="btn-primary flex items-center space-x-2 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">New Goal</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Placeholder Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-subtle p-12 text-center"
        >
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Goals Feature Coming Soon</h2>
            <p className="text-text-secondary mb-8">
              Set, track, and crush your goals with AI-powered insights and personalized recommendations.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.05, brightness: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="card-subtle p-6 cursor-pointer"
              >
                <TrendingUp className="w-8 h-8 text-discord-purple mb-3 mx-auto" />
                <h3 className="font-semibold text-text-primary mb-2">Progress Tracking</h3>
                <p className="text-sm text-text-secondary">Visual progress charts</p>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, brightness: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="card-subtle p-6 cursor-pointer"
              >
                <Calendar className="w-8 h-8 text-gx-cyan mb-3 mx-auto" />
                <h3 className="font-semibold text-text-primary mb-2">Smart Goals</h3>
                <p className="text-sm text-text-secondary">AI-suggested action items</p>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GoalsView;


