// Plugin Registry - Hardcoded for now, can be API-driven later

export const PLUGIN_REGISTRY = [
  {
    id: 'multi-agent-system',
    name: 'Multi-Agent System',
    description: 'Add multiple specialized AI agents: Thinking Agent, Planning Agent, Research Agent, and more',
    icon: '🤖',
    category: 'AI Agent',
    version: '1.0.0',
    author: 'AI Journey',
    features: [
      '🧠 Thinking Agent - Deep analytical reasoning',
      '📋 Planning Agent - Structured action plans',
      '🔍 Research Agent - In-depth analysis',
      '💡 Creative Agent - Brainstorming and ideas'
    ],
    settings: {
      enabledAgents: ['thinking', 'planning'],
      defaultAgent: 'thinking'
    },
    installed: false,
    enabled: true
  },
  {
    id: 'prompt-helper',
    name: 'Prompt Helper',
    description: 'Create optimized prompts with guided workflows. Coding Agent mode fully functional!',
    icon: '✨',
    category: 'Tool',
    version: '1.0.0',
    author: 'AI Journey',
    features: [
      '💻 Coding Agent - Build apps, fix bugs, create components',
      '📚 Prompt Library - Save and reuse prompts',
      '📋 Copy & Use in Chat - Seamless integration',
      '🎯 Adaptive flows - Questions change based on task type'
    ],
    settings: null,
    installed: false,
    enabled: true
  },
  {
    id: 'content-drafter',
    name: 'Content Drafter',
    description: 'Draft social media posts, blogs, emails based on your journey',
    icon: '📝',
    category: 'Productivity',
    version: '1.0.0',
    author: 'AI Journey',
    features: [
      '🐦 Twitter/X thread generator',
      '📱 LinkedIn post creator',
      '📧 Email templates',
      '📰 Blog post outlines'
    ],
    settings: {
      platforms: ['twitter', 'linkedin'],
      tone: 'professional'
    },
    installed: false,
    enabled: true
  },
  {
    id: 'habit-tracker',
    name: 'Habit Tracker',
    description: 'Track daily habits and build streaks with AI coaching',
    icon: '✅',
    category: 'Productivity',
    version: '1.0.0',
    author: 'AI Journey',
    features: [
      '📊 Streak tracking',
      '🎯 Habit reminders',
      '📈 Progress analytics',
      '🤖 AI habit coaching'
    ],
    settings: {
      habits: [],
      reminderTime: '09:00'
    },
    installed: false,
    enabled: true
  },
  {
    id: 'voice-notes',
    name: 'Voice Notes',
    description: 'Voice-to-text journaling with AI transcription and analysis',
    icon: '🎙️',
    category: 'Tool',
    version: '1.0.0',
    author: 'AI Journey',
    features: [
      '🎤 Voice recording',
      '📝 Auto-transcription',
      '🧠 Sentiment analysis',
      '🔍 Searchable voice notes'
    ],
    settings: null,
    installed: false,
    enabled: false // coming soon
  },
  {
    id: 'mood-tracker',
    name: 'Mood Tracker',
    description: 'Track your daily mood and emotions with visualizations',
    icon: '😊',
    category: 'Productivity',
    version: '1.0.0',
    author: 'AI Journey',
    features: [
      '😃 Daily mood logging',
      '📊 Mood analytics',
      '🌤️ Weather correlation',
      '💭 Emotion insights'
    ],
    settings: null,
    installed: false,
    enabled: true
  },
  {
    id: 'focus-timer',
    name: 'Focus Timer',
    description: 'Pomodoro-style timer with AI-powered break suggestions',
    icon: '⏱️',
    category: 'Productivity',
    version: '1.0.0',
    author: 'AI Journey',
    features: [
      '⏰ Customizable timers',
      '📈 Session tracking',
      '🧠 Smart break suggestions',
      '🎯 Goal integration'
    ],
    settings: null,
    installed: false,
    enabled: true
  },
  {
    id: 'expense-tracker',
    name: 'Expense Tracker',
    description: 'Cloud-based expense tracking with Supabase',
    icon: '💰',
    category: 'Productivity',
    version: '1.0.0',
    author: 'AI Journey Team',
    features: [
      '☁️ Cloud storage with Supabase',
      '💳 Manual expense entry',
      '📊 Category organization',
      '📈 Monthly spending overview',
      '📋 Expense history table',
      '🎯 Dashboard widget',
      '🔄 Real-time sync'
    ],
    settings: false,
    installed: false,
    enabled: true
  }
];

export const PLUGIN_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'installed', label: 'Installed' },
  { id: 'available', label: 'Available' },
  { id: 'AI Agent', label: 'AI Agents' },
  { id: 'Tool', label: 'Tools' },
  { id: 'Productivity', label: 'Productivity' },
];

export const getCategoryColor = (category) => {
  const colors = {
    'AI Agent': 'discord-purple',
    'Tool': 'gx-cyan',
    'Productivity': 'green-500',
  };
  return colors[category] || 'text-secondary';
};

