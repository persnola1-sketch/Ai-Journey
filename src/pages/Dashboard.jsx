import { useState, useEffect } from 'react';
import { MessageCircle, Target, Trophy, TrendingUp, CheckCircle2, Circle } from 'lucide-react';
import { goalsStorage, milestonesStorage, messagesStorage } from '../utils/storage';
import { isPluginInstalled } from '../utils/pluginStorage';
import ExpensesDashboardWidget from '../features/expenses/ExpensesDashboardWidget';

const Dashboard = ({ onOpenChat }) => {
  const [stats, setStats] = useState([
    { label: 'Total Messages', value: '0', icon: MessageCircle },
    { label: 'Goals Completed', value: '0', icon: Target },
    { label: 'Milestones', value: '0', icon: Trophy },
    { label: 'Active Goals', value: '0', icon: TrendingUp },
  ]);
  
  const [recentGoals, setRecentGoals] = useState([]);
  const [recentMilestones, setRecentMilestones] = useState([]);

  useEffect(() => {
    // Function to load stats from storage
    const loadStats = async () => {
      try {
        const [goals, milestones, messages] = await Promise.all([
          goalsStorage.getAll(),
          milestonesStorage.getAll(),
          messagesStorage.getAll()
        ]);

        const completedGoals = goals.filter(g => g.completed).length;
        const activeGoals = goals.filter(g => !g.completed).length;
        const userMessages = messages.filter(m => (m.type === 'user' || m.role === 'user')).length;

        setStats([
          { label: 'Total Messages', value: String(userMessages), icon: MessageCircle },
          { label: 'Goals Completed', value: String(completedGoals), icon: Target },
          { label: 'Milestones', value: String(milestones.length), icon: Trophy },
          { label: 'Active Goals', value: String(activeGoals), icon: TrendingUp },
        ]);

        // Sort and get recent goals (last 5)
        const sortedGoals = [...goals].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentGoals(sortedGoals.slice(0, 5));

        // Sort and get recent milestones (last 5)
        const sortedMilestones = [...milestones].sort((a, b) => new Date(b.date) - new Date(a.date));
        setRecentMilestones(sortedMilestones.slice(0, 5));
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      }
    };

    // Load stats initially
    loadStats();

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key && (e.key.includes('goals') || e.key.includes('milestones') || e.key.includes('messages') || e.key.includes('plugins'))) {
        loadStats();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also poll for changes every 2 seconds (for same-tab updates)
    const interval = setInterval(loadStats, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
            AI Journey Companion
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg mb-8">
            Your personal growth partner powered by AI
          </p>
          
          <button
            onClick={onOpenChat}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Start Chat</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="card p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-6 h-6 text-neutral-400 dark:text-neutral-500" />
                  <span className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
                    {stat.value}
                  </span>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Expense Widget */}
        {isPluginInstalled('expense-tracker') && (
          <div className="mb-6">
            <ExpensesDashboardWidget />
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Goals */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Recent Goals
            </h3>
            {recentGoals.length === 0 ? (
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                No goals yet. Start creating goals to track your progress!
              </p>
            ) : (
              <div className="space-y-3">
                {recentGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
                  >
                    {goal.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-5 h-5 text-neutral-400 dark:text-neutral-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-medium ${
                        goal.completed 
                          ? 'text-neutral-500 dark:text-neutral-400 line-through' 
                          : 'text-neutral-900 dark:text-neutral-100'
                      }`}>
                        {goal.title}
                      </h4>
                      {goal.description && (
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
                          {goal.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Milestones */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Recent Milestones
            </h3>
            {recentMilestones.length === 0 ? (
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                No milestones yet. Celebrate your achievements!
              </p>
            ) : (
              <div className="space-y-3">
                {recentMilestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
                  >
                    <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {milestone.title}
                      </h4>
                      {milestone.description && (
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
                          {milestone.description}
                        </p>
                      )}
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        {new Date(milestone.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


