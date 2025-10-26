import { motion } from 'framer-motion';
import { Trophy, Star, Award, Zap } from 'lucide-react';

const MilestonesView = () => {
  const handleViewAchievements = () => {
    alert('Achievements feature coming soon!');
  };

  const handleViewTimeline = () => {
    alert('Timeline feature coming soon!');
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
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">
            Milestones
          </h1>
          <p className="text-text-secondary text-lg">
            Celebrate your achievements and track your journey
          </p>
        </motion.div>

        {/* Placeholder Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-subtle p-12 text-center"
        >
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Milestones Feature Coming Soon</h2>
            <p className="text-text-secondary mb-8">
              Celebrate every win and keep track of your personal growth journey with beautiful milestone markers.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.05, brightness: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleViewAchievements}
                className="card-subtle p-6 cursor-pointer"
              >
                <Star className="w-8 h-8 text-discord-purple mb-3 mx-auto" />
                <h3 className="font-semibold text-text-primary mb-2">Achievement Badges</h3>
                <p className="text-sm text-text-secondary">Unlock special rewards</p>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, brightness: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleViewTimeline}
                className="card-subtle p-6 cursor-pointer"
              >
                <Award className="w-8 h-8 text-gx-red mb-3 mx-auto" />
                <h3 className="font-semibold text-text-primary mb-2">Journey Timeline</h3>
                <p className="text-sm text-text-secondary">Visual progress history</p>
              </motion.button>
            </div>

            {/* Coming Soon Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 inline-flex items-center space-x-2 bg-dark-600 px-4 py-2 rounded-full"
            >
              <Zap className="w-4 h-4 text-gx-cyan" />
              <span className="text-sm text-text-secondary">In development</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MilestonesView;

