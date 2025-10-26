import { MessageCircle, Target, Trophy, Puzzle, Bot, Wand2, Brain, DollarSign } from 'lucide-react';

export const HELP_SECTIONS = {
  chat: {
    title: 'AI Chat',
    icon: MessageCircle,
    quickTips: [
      {
        title: 'Start a Conversation',
        description: 'Click the chat button in the navigation or dashboard to open the AI chat sidebar.',
        icon: '💬',
        details: 'The chat interface opens as a sidebar overlay. You can ask questions, discuss your goals, get advice, or just have a conversation.'
      },
      {
        title: 'Use Commands',
        description: 'Type /prompt in chat to open the Prompt Helper (if installed).',
        icon: '⚡',
        details: 'Commands start with /. Currently available: /prompt [query] - Opens Prompt Helper with optional pre-filled query.'
      },
      {
        title: 'Close Chat Anytime',
        description: 'Click the X button, the backdrop, or press ESC to close the chat.',
        icon: '✖️',
        details: 'Your conversation is automatically saved and will be there when you return.'
      },
      {
        title: 'Message Persistence',
        description: 'All your conversations are saved locally. Last 200 messages are kept.',
        icon: '💾',
        details: 'Messages are stored in your browser\'s localStorage, so they persist between sessions.'
      }
    ],
    detailedGuide: {
      'Getting Started': {
        content: 'The AI Chat is your main interface for interacting with your journey companion. Simply type your message and press Send or hit Enter. The AI will respond based on the current mode (if Multi-Agent plugin is installed) or in default conversational mode.',
        steps: [
          'Open chat by clicking the message icon in navigation',
          'Type your message in the input field at the bottom',
          'Press Enter or click Send',
          'Wait for the AI response (indicated by typing animation)',
          'Continue the conversation naturally'
        ]
      },
      'AI Modes': {
        content: 'If you have the Multi-Agent System plugin installed, you can switch between different AI modes, each optimized for specific tasks.',
        modes: [
          {
            name: 'Chat Mode',
            icon: '💬',
            description: 'Default conversational mode. Friendly, empathetic, and supportive. Best for general discussion and emotional support.'
          },
          {
            name: 'Thinking Agent',
            icon: '🧠',
            description: 'Analytical mode that breaks down complex problems step-by-step. Shows reasoning process explicitly.'
          },
          {
            name: 'Plan Agent',
            icon: '📋',
            description: 'Creates structured, actionable plans with numbered steps, timelines, and success metrics.'
          }
        ]
      },
      'Commands': {
        content: 'Slash commands provide quick access to special features.',
        commands: [
          {
            command: '/prompt',
            description: 'Opens the Prompt Helper tool (requires plugin)',
            example: '/prompt build a todo app'
          },
          {
            command: '/prompt [query]',
            description: 'Opens Prompt Helper with pre-filled query',
            example: '/prompt fix authentication bug'
          }
        ]
      },
      'Error Handling': {
        content: 'If a message fails to send (network error, API issue), you\'ll see an error message with a Retry button. Your original message is preserved so you can try again.',
        tips: [
          'Check your internet connection',
          'Ensure your OpenAI API key is valid',
          'Click Retry to resend the message',
          'Error messages appear in red with an alert icon'
        ]
      }
    }
  },

  goals: {
    title: 'Goals Tracker',
    icon: Target,
    quickTips: [
      {
        title: 'Add a Goal',
        description: 'Click "Add New Goal" button to create a goal with priority and optional deadline.',
        icon: '🎯',
        details: 'You can set High, Medium, or Low priority and add a deadline date to keep yourself accountable.'
      },
      {
        title: 'Track Progress',
        description: 'Click the checkbox to mark goals as complete. Completed goals show with strikethrough.',
        icon: '✅',
        details: 'Completed goals are timestamped and can be filtered out of the active view.'
      },
      {
        title: 'Set Priorities',
        description: 'Use priority badges (High/Medium/Low) to organize what matters most.',
        icon: '🔥',
        details: 'High priority goals show in red, Medium in yellow, Low in green. Sort by priority to focus on what\'s urgent.'
      },
      {
        title: 'Filter & Sort',
        description: 'Use tabs to view All, Active, or Completed goals. Sort by priority, deadline, or creation date.',
        icon: '🔍',
        details: 'Filter and sort options help you focus on the right goals at the right time.'
      }
    ],
    detailedGuide: {
      'Creating Goals': {
        content: 'Goals help you track what you want to achieve. They can be short-term or long-term, personal or professional.',
        steps: [
          'Click "Add New Goal" button',
          'Enter your goal text (required)',
          'Select priority level: High, Medium, or Low',
          'Optionally set a deadline date',
          'Click "Add Goal" to save'
        ]
      },
      'Managing Goals': {
        content: 'Once created, goals can be edited, completed, or deleted.',
        actions: [
          {
            action: 'Complete',
            description: 'Click the checkbox to mark as done. Goal gets a strikethrough and completion timestamp.'
          },
          {
            action: 'Edit',
            description: 'Click the pencil icon to modify goal text, priority, or deadline.'
          },
          {
            action: 'Delete',
            description: 'Click the trash icon to remove. A confirmation dialog will appear.'
          },
          {
            action: 'Uncomplete',
            description: 'Click checkbox again to mark as active again if completed by mistake.'
          }
        ]
      },
      'Filtering and Sorting': {
        content: 'Goals can be filtered and sorted to help you focus.',
        filters: [
          { name: 'All', description: 'Shows all goals regardless of status' },
          { name: 'Active', description: 'Shows only incomplete goals' },
          { name: 'Completed', description: 'Shows only completed goals' }
        ],
        sortOptions: [
          { name: 'Priority', description: 'High → Medium → Low' },
          { name: 'Deadline', description: 'Soonest deadline first' },
          { name: 'Created', description: 'Newest first' }
        ]
      },
      'Best Practices': {
        tips: [
          'Be specific with goal text (e.g., "Learn React hooks" vs "Learn coding")',
          'Use High priority sparingly for truly urgent goals',
          'Set realistic deadlines to maintain motivation',
          'Review and update goals weekly',
          'Celebrate completed goals by viewing the Completed tab',
          'Break large goals into smaller sub-goals'
        ]
      }
    }
  },

  milestones: {
    title: 'Milestones Logger',
    icon: Trophy,
    quickTips: [
      {
        title: 'Log Achievements',
        description: 'Click "Add Milestone" to celebrate wins, big or small. Every achievement counts!',
        icon: '🏆',
        details: 'Milestones are displayed in a timeline view, showing your progress over time.'
      },
      {
        title: 'Categorize Milestones',
        description: 'Choose from Personal, Work, Project, or Other categories to organize achievements.',
        icon: '🏷️',
        details: 'Categories are color-coded: Personal (purple), Work (blue), Project (green), Other (gray).'
      },
      {
        title: 'Add Details',
        description: 'Include a description to remember the context and significance of each milestone.',
        icon: '📝',
        details: 'The more details you add, the better you can reflect on your journey later.'
      },
      {
        title: 'Celebration Effects',
        description: 'Enjoy confetti animation when you add a new milestone!',
        icon: '🎉',
        details: 'Because every achievement deserves a celebration!'
      }
    ],
    detailedGuide: {
      'Adding Milestones': {
        content: 'Milestones mark significant achievements or turning points in your journey.',
        steps: [
          'Click "Add Milestone" button',
          'Enter a title for your achievement (required)',
          'Add an optional description with more context',
          'Select a category (Personal, Work, Project, Other)',
          'Choose the date (defaults to today)',
          'Click "Add Milestone" and enjoy the confetti!'
        ]
      },
      'Managing Milestones': {
        content: 'Edit or remove milestones as needed.',
        actions: [
          {
            action: 'Edit',
            description: 'Click the pencil icon to modify title, description, category, or date.'
          },
          {
            action: 'Delete',
            description: 'Click the trash icon to remove. Confirmation dialog will appear.'
          }
        ]
      },
      'Timeline View': {
        content: 'Milestones are displayed in a vertical timeline with connecting lines, showing your journey chronologically.',
        features: [
          'Most recent milestones appear at the top',
          'Category badges are color-coded',
          'Dates are formatted for readability',
          'Icons indicate category type',
          'Timeline connects all achievements visually'
        ]
      },
      'Filtering': {
        content: 'Filter milestones by category to focus on specific areas of your life.',
        categories: [
          { name: 'Personal', color: 'Purple', description: 'Personal growth, health, relationships' },
          { name: 'Work', color: 'Blue', description: 'Career achievements, promotions, projects' },
          { name: 'Project', color: 'Green', description: 'Side projects, learning milestones' },
          { name: 'Other', color: 'Gray', description: 'Anything else worth celebrating' }
        ]
      },
      'Best Practices': {
        tips: [
          'Don\'t wait for "big" achievements - small wins matter!',
          'Add context in descriptions to remember why it mattered',
          'Review your timeline monthly for motivation',
          'Use milestones to track progress toward goals',
          'Celebrate both outcomes and effort',
          'Be honest about dates - it helps track your growth pace'
        ]
      }
    }
  },

  plugins: {
    title: 'Plugin System',
    icon: Puzzle,
    quickTips: [
      {
        title: 'Browse Plugins',
        description: 'Visit the Plugins page to see all available extensions for your AI companion.',
        icon: '🧩',
        details: 'Plugins add new features like Multi-Agent modes, Prompt Helper, and more.'
      },
      {
        title: 'Install & Uninstall',
        description: 'Click Install to add a plugin. Features activate immediately. Uninstall removes all plugin data.',
        icon: '⚡',
        details: 'Installation is instant. Some plugins add new UI elements, others enhance existing features.'
      },
      {
        title: 'Configure Settings',
        description: 'Click the gear icon on installed plugins to customize behavior.',
        icon: '⚙️',
        details: 'Each plugin may have different settings. Changes apply immediately.'
      },
      {
        title: 'Filter by Category',
        description: 'Use category tabs to find plugins: AI Agents, Tools, Productivity.',
        icon: '🔍',
        details: 'Categories help you discover plugins that match your needs.'
      }
    ],
    detailedGuide: {
      'What Are Plugins?': {
        content: 'Plugins are modular extensions that add new features to your AI Journey Companion. The base app works perfectly on its own, and plugins let you customize it to your needs.',
        benefits: [
          'Modular: Only install what you need',
          'Lightweight: Core app stays fast',
          'Customizable: Configure each plugin independently',
          'Extensible: More plugins coming soon'
        ]
      },
      'Installing Plugins': {
        content: 'Installation is simple and instant.',
        steps: [
          'Go to the Plugins page',
          'Browse available plugins or use search',
          'Click "Install" on a plugin card',
          'Wait for confirmation toast',
          'Plugin features activate immediately'
        ],
        notes: [
          'Installed plugins show a green "Installed" badge',
          'Some plugins add new navigation items',
          'Others enhance existing features (like AI modes in chat)',
          'All plugin data is stored locally in your browser'
        ]
      },
      'Uninstalling Plugins': {
        content: 'Uninstalling removes the plugin and all its data.',
        steps: [
          'Click "Uninstall" on an installed plugin',
          'Confirm in the dialog',
          'Plugin features are removed immediately',
          'All plugin-specific data is deleted'
        ],
        warning: 'Uninstalling is permanent. Any data stored by the plugin (settings, saved items) will be lost.'
      },
      'Plugin Categories': {
        categories: [
          {
            name: 'AI Agents',
            description: 'Specialized AI modes with different behaviors',
            examples: 'Multi-Agent System'
          },
          {
            name: 'Tools',
            description: 'Utilities to enhance your workflow',
            examples: 'Prompt Helper, Voice Notes'
          },
          {
            name: 'Productivity',
            description: 'Features to boost productivity',
            examples: 'Habit Tracker, Content Drafter'
          }
        ]
      },
      'Plugin Settings': {
        content: 'Plugins with configurable options show a gear icon when installed.',
        steps: [
          'Click the gear icon on a plugin card',
          'Modify settings in the modal',
          'Click "Save" to apply changes',
          'Settings take effect immediately'
        ]
      }
    }
  },

  expenseTracker: {
    title: 'Expense Tracker',
    icon: DollarSign,
    requiresPlugin: 'expense-tracker',
    quickTips: [
      {
        title: 'Add an Expense',
        description: 'Click "Add Expense" button to log a new expense with amount, store, and category.',
        icon: '💰',
        details: 'Fill in the amount (required), store name (optional), select a category, and the date defaults to today.'
      },
      {
        title: '8 Categories',
        description: 'Choose from Food, Transport, Shopping, Bills, Entertainment, Health, Education, or Other.',
        icon: '🏷️',
        details: 'Categories help you understand where your money goes. Filter by category to see spending patterns.'
      },
      {
        title: 'Filter & Sort',
        description: 'Use category filters and sort by date, amount, store, or category.',
        icon: '🔍',
        details: 'Quickly find specific expenses or analyze spending in particular categories.'
      },
      {
        title: 'Dashboard Widget',
        description: 'See your monthly spending summary right on the dashboard.',
        icon: '📊',
        details: 'Widget shows total monthly expenses, number of transactions, and category breakdown.'
      }
    ],
    detailedGuide: {
      'Getting Started': {
        content: 'The Expense Tracker helps you log and analyze your spending. Install the plugin from the Plugin Manager to get started.',
        steps: [
          'Go to Plugins page',
          'Install "Expense Tracker" plugin',
          'Navigate to Expenses page (appears in navigation)',
          'Click "Add Expense" to log your first expense',
          'View the dashboard widget for quick insights'
        ]
      },
      'Adding Expenses': {
        content: 'Log expenses quickly with just a few clicks.',
        steps: [
          'Click "Add Expense" button',
          'Enter the amount (required)',
          'Add store name (optional but recommended)',
          'Select a category from the dropdown',
          'Choose a date (defaults to today)',
          'Click "Add Expense" to save'
        ],
        tips: [
          'Be consistent with store names for better tracking',
          'Add expenses as they happen for accuracy',
          'Use "Other" category sparingly - specific categories are more useful',
          'Round to nearest dollar if you prefer simplicity'
        ]
      },
      'Categories Explained': {
        categories: [
          { name: 'Food 🍕', description: 'Groceries, restaurants, takeout, coffee' },
          { name: 'Transport 🚗', description: 'Gas, public transit, ride-sharing, parking' },
          { name: 'Shopping 🛍️', description: 'Clothing, electronics, household items' },
          { name: 'Bills 📄', description: 'Utilities, rent, subscriptions, insurance' },
          { name: 'Entertainment 🎮', description: 'Movies, games, hobbies, events' },
          { name: 'Health 💊', description: 'Medical, pharmacy, gym, wellness' },
          { name: 'Education 📚', description: 'Courses, books, training, tuition' },
          { name: 'Other 📦', description: 'Everything else' }
        ]
      },
      'Filtering and Sorting': {
        content: 'Find expenses quickly with powerful filtering and sorting.',
        filters: [
          { name: 'All Categories', description: 'Shows all expenses' },
          { name: 'By Category', description: 'Click a category button to filter' }
        ],
        sortOptions: [
          { name: 'Date', description: 'Newest first (default)' },
          { name: 'Amount', description: 'Highest to lowest' },
          { name: 'Store', description: 'Alphabetical' },
          { name: 'Category', description: 'Grouped by type' }
        ]
      },
      'Dashboard Widget': {
        content: 'The expense widget on your dashboard shows a monthly summary.',
        features: [
          'Total amount spent this month',
          'Number of transactions',
          'Spending by category (pie chart)',
          'Quick link to Expenses page',
          'Updates automatically when you add/edit/delete expenses'
        ],
        notes: [
          'Widget shows current month only',
          'Resets on the 1st of each month',
          'Only visible when plugin is installed'
        ]
      },
      'Managing Expenses': {
        content: 'Edit or delete expenses as needed.',
        actions: [
          {
            action: 'Edit',
            description: 'Click the pencil icon to modify amount, store, category, or date.'
          },
          {
            action: 'Delete',
            description: 'Click the trash icon to remove. A confirmation dialog will appear.'
          },
          {
            action: 'Search',
            description: 'Use the search box to find expenses by store name or category.'
          }
        ]
      },
      'Best Practices': {
        tips: [
          'Log expenses daily for best accuracy',
          'Use specific store names consistently',
          'Review your spending weekly to spot patterns',
          'Set mental budgets for each category',
          'Use the dashboard widget as a quick spending check',
          'Don\'t overthink categories - be consistent',
          'Export data (coming soon) for deeper analysis'
        ]
      }
    }
  },

  multiAgent: {
    title: 'Multi-Agent System',
    icon: Bot,
    requiresPlugin: 'multi-agent-system',
    quickTips: [
      {
        title: 'Switch AI Modes',
        description: 'Use the mode selector at the top of the chat to switch between Chat, Thinking, and Plan agents.',
        icon: '🤖',
        details: 'Each mode optimizes the AI for different types of tasks.'
      },
      {
        title: 'Mode Indicators',
        description: 'AI responses show a badge indicating which mode generated them.',
        icon: '🏷️',
        details: 'Helps you understand the context and approach of each response.'
      },
      {
        title: 'Configure Agents',
        description: 'Open plugin settings to enable/disable specific agents and set a default mode.',
        icon: '⚙️',
        details: 'Customize which agents are available in your chat.'
      },
      {
        title: 'Mode Persistence',
        description: 'Your selected mode is saved and remembered between sessions.',
        icon: '💾',
        details: 'The app remembers your preference and starts in your last-used mode.'
      }
    ],
    detailedGuide: {
      'Agent Modes Explained': {
        content: 'The Multi-Agent System provides three specialized AI modes, each optimized for different scenarios.',
        modes: [
          {
            name: 'Chat Mode (💬)',
            purpose: 'General conversation and emotional support',
            bestFor: [
              'Casual discussion',
              'Sharing feelings or experiences',
              'Getting encouragement',
              'Exploring ideas informally'
            ],
            behavior: 'Conversational, warm, empathetic. Asks follow-up questions. Celebrates wins.'
          },
          {
            name: 'Thinking Agent (🧠)',
            purpose: 'Deep analysis and problem-solving',
            bestFor: [
              'Complex problems requiring analysis',
              'Decision-making with multiple factors',
              'Understanding cause and effect',
              'Learning new concepts'
            ],
            behavior: 'Analytical, step-by-step reasoning. Shows thought process explicitly. Considers multiple angles.'
          },
          {
            name: 'Plan Agent (📋)',
            purpose: 'Creating structured action plans',
            bestFor: [
              'Breaking down large projects',
              'Creating actionable roadmaps',
              'Setting up systems and processes',
              'Organizing complex tasks'
            ],
            behavior: 'Structured, practical. Provides numbered steps, timelines, and success metrics.'
          }
        ]
      },
      'Switching Modes': {
        content: 'Change modes anytime during a conversation.',
        steps: [
          'Look for the mode selector at the top of the chat',
          'Click on the desired mode (Chat, Thinking, or Plan)',
          'A subtle notification confirms the switch',
          'Your next message will use the new mode'
        ],
        notes: [
          'Switching modes doesn\'t resend previous messages',
          'Each message is tagged with the mode that was active',
          'You can mix modes in a single conversation',
          'The AI maintains context across mode switches'
        ]
      },
      'Configuring Agents': {
        content: 'Customize which agents are available and set defaults.',
        steps: [
          'Go to Plugins page',
          'Click gear icon on Multi-Agent System',
          'Check/uncheck agents to enable/disable',
          'Select default agent from dropdown',
          'Click Save'
        ],
        options: [
          {
            setting: 'Enabled Agents',
            description: 'Choose which modes appear in the selector'
          },
          {
            setting: 'Default Mode',
            description: 'Which mode the chat starts in'
          }
        ]
      },
      'Best Practices': {
        tips: [
          'Use Chat Mode for emotional support and brainstorming',
          'Switch to Thinking Agent when facing complex decisions',
          'Use Plan Agent when you need clear action steps',
          'Review mode badges on old messages to understand context',
          'Experiment with different modes for the same question',
          'Default to Chat Mode if unsure - it\'s the most versatile'
        ]
      }
    }
  },

  promptHelper: {
    title: 'Prompt Helper',
    icon: Wand2,
    requiresPlugin: 'prompt-helper',
    quickTips: [
      {
        title: 'Access via Dashboard',
        description: 'Click the "Prompt Helper" button on the dashboard if the plugin is installed.',
        icon: '✨',
        details: 'Opens the guided prompt creation interface.'
      },
      {
        title: 'Use /prompt Command',
        description: 'Type /prompt in chat to open Prompt Helper. Add text after to pre-fill.',
        icon: '⚡',
        details: 'Example: /prompt build a habit tracker app'
      },
      {
        title: 'Choose Task Type',
        description: 'Select what you\'re building: New App, Feature, Bug Fix, Refactor, etc.',
        icon: '🎯',
        details: 'The interview flow adapts based on your selection.'
      },
      {
        title: 'Save to Library',
        description: 'Save generated prompts for reuse. Add tags and notes for easy searching.',
        icon: '💾',
        details: 'Access your saved prompts anytime from the Library view.'
      }
    ],
    detailedGuide: {
      'What is Prompt Helper?': {
        content: 'Prompt Helper guides you through creating detailed, optimized prompts for AI coding assistants. Instead of struggling to describe what you need, answer a few questions and get a professional prompt.',
        benefits: [
          'No more vague prompts that confuse the AI',
          'Structured questions ensure you cover all details',
          'Optimized output (under 500 tokens) for best results',
          'Reusable library of your best prompts'
        ]
      },
      'Coding Agent Mode': {
        content: 'Currently, Coding Agent is the active mode. More modes coming soon!',
        taskTypes: [
          {
            type: 'New App/Project',
            description: 'Building something from scratch',
            questions: 'App type, features, tech stack, design style'
          },
          {
            type: 'New Feature',
            description: 'Adding to existing codebase',
            questions: 'Feature description, integration points, dependencies'
          },
          {
            type: 'Fix Bug',
            description: 'Debugging and troubleshooting',
            questions: 'Bug description, context, what you\'ve tried'
          },
          {
            type: 'Refactor Code',
            description: 'Improving existing code',
            questions: 'What to refactor, goals (performance, readability, etc.)'
          },
          {
            type: 'Component/Module',
            description: 'Building reusable parts',
            questions: 'Component details, props, state, requirements'
          },
          {
            type: 'API/Backend',
            description: 'Server-side logic',
            questions: 'Endpoints, data models, authentication, etc.'
          }
        ]
      },
      'The Interview Flow': {
        content: 'After selecting a task type, you\'ll answer adaptive questions.',
        process: [
          'Phase 1: Select task type (New App, Bug Fix, etc.)',
          'Phase 2-4: Answer specific questions (varies by task type)',
          'Phase 5: Review and generate optimized prompt',
          'Final: Copy, use in chat, save to library, or regenerate'
        ],
        features: [
          'Progress sidebar shows completed and current phases',
          'Click completed phases to edit previous answers',
          'Skip optional questions if not relevant',
          'Add custom details in text areas'
        ]
      },
      'Using Generated Prompts': {
        content: 'Once generated, you have several options.',
        actions: [
          {
            action: 'Copy Prompt',
            description: 'Copies to clipboard. Paste anywhere you need it.'
          },
          {
            action: 'Use in Chat',
            description: 'Opens the chat sidebar and pastes the prompt. Review and send.'
          },
          {
            action: 'Regenerate',
            description: 'Adjust prompt style (shorter, more detailed, different focus).'
          },
          {
            action: 'Save to Library',
            description: 'Save with name, category, tags, and notes for future use.'
          },
          {
            action: 'Start Over',
            description: 'Go back to mode selection and create a new prompt.'
          }
        ]
      },
      'Prompt Library': {
        content: 'Your saved prompts are stored in the library for easy reuse.',
        features: [
          'Search by name, tags, or content',
          'Filter by category',
          'Sort by date or usage count',
          'View full prompt with metadata',
          'Copy, edit, delete, or use in chat',
          'Track how many times you\'ve used each prompt'
        ],
        tips: [
          'Use descriptive names for easy searching',
          'Add relevant tags (react, api, authentication, etc.)',
          'Add notes about when/why you use this prompt',
          'Review and update prompts that work well',
          'Delete outdated or unused prompts'
        ]
      },
      'Best Practices': {
        tips: [
          'Answer all questions, even optional ones, for best results',
          'Be specific in text areas - details improve the prompt',
          'Use the "Let AI decide" options if you\'re flexible',
          'Save prompts you use repeatedly',
          'Try regenerating with different focus for variations',
          'Combine with Multi-Agent System for powerful workflows',
          'Use /prompt command in chat for quick access',
          'Review generated prompts before using - adjust if needed'
        ]
      }
    }
  }
};

// Search function to filter content
export const searchHelpContent = (query, sections, installedPlugins = []) => {
  if (!query.trim()) return null;
  
  const lowerQuery = query.toLowerCase();
  const results = [];

  Object.entries(sections).forEach(([key, section]) => {
    // Skip plugin sections if not installed
    if (section.requiresPlugin && !installedPlugins.includes(section.requiresPlugin)) {
      return;
    }

    // Search in quick tips
    section.quickTips?.forEach(tip => {
      if (
        tip.title.toLowerCase().includes(lowerQuery) ||
        tip.description.toLowerCase().includes(lowerQuery) ||
        tip.details?.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          section: key,
          sectionTitle: section.title,
          type: 'quickTip',
          content: tip
        });
      }
    });

    // Search in detailed guide
    if (section.detailedGuide) {
      Object.entries(section.detailedGuide).forEach(([title, guide]) => {
        const guideText = JSON.stringify(guide).toLowerCase();
        if (title.toLowerCase().includes(lowerQuery) || guideText.includes(lowerQuery)) {
          results.push({
            section: key,
            sectionTitle: section.title,
            type: 'detailedGuide',
            guideTitle: title,
            content: guide
          });
        }
      });
    }
  });

  return results;
};

