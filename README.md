# 🚀 AI Journey Companion

A modern, full-stack AI companion for personal growth, goal tracking, expense management, and intelligent prompt generation. Built with React, Supabase, and powered by OpenAI.

## ✨ Features

### **Core Functionality**
- 🤖 **Multi-Agent AI System** - Chat, Thinking Agent, Plan Agent, and Prompt Helper modes (plugin)
- 🎯 **Goals Management** - Create, track, and complete personal goals with priorities and deadlines
- 🏆 **Milestones Tracker** - Celebrate achievements with a beautiful timeline interface
- 💰 **Expense Tracker** - Track spending with categories, monthly views, and analytics (plugin)
- ✍️ **Prompt Library** - Save, favorite, search, and export AI prompts
- 🧩 **Plugin System** - Modular architecture for extending functionality
- 👤 **User Authentication** - Secure sign-up, login, and user profiles
- 📚 **Help Documentation** - Comprehensive guides for all features
- 🌓 **Light/Dark Themes** - Seamless theme switching with system preference support

### **AI Chat System**
- **💬 Minimal ChatGPT-style Interface** - Clean, professional sidebar design
- **🔄 Model Selector** - Switch between GPT-4o Mini, GPT-4o, GPT-4 Turbo, GPT-3.5 Turbo
- **🎯 Multi-Agent Modes** (Plugin) - Chat, Thinking, Plan, and Prompt Helper modes
- **↔️ Resizable Sidebar** - Drag to resize chat width (320px - 800px)
- **📝 Conversation Management** - Create, switch, and manage multiple conversations
- **💾 Auto-save** - Conversations and preferences persist automatically
- **🎨 Same-style messages** - User and AI messages use consistent minimal design

### **Expense Tracker** (Plugin)
- **📸 AI Receipt Scanner** - Upload receipt photos, AI extracts data automatically (powered by GPT-4o Vision)
- Add expenses with custom amounts, stores, and categories
- 8 predefined categories (Groceries, Travel, Subscriptions, Entertainment, Housing, Transportation, Health, Other)
- **Smart image compression** - Automatically compresses receipt images before upload
- **Dual entry modes** - Manual entry or AI-powered receipt scanning with tabs
- **Review & edit** - AI-extracted data is editable before saving
- Filter expenses by category and date range
- Monthly spending summary and category breakdown
- Dashboard widget with quick stats
- Sortable expense table

### **Design Philosophy**
- Minimal, clean interface inspired by Cursor, Linear, and Obsidian
- Light mode by default with full dark mode support
- Subtle animations and smooth transitions
- Fully responsive (mobile, tablet, desktop)
- Accessibility-first approach

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **AI**: OpenAI GPT-4o-mini (via Express proxy)
- **Storage**: Supabase Database + localStorage cache

## 🚀 Quick Start

### Prerequisites
- Node.js 20.19+ (or 20.11+ with compatible Vite version)
- Supabase account ([Create free account](https://supabase.com))
- OpenAI API key (optional, for AI chat features) ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone and navigate to project**:
```bash
git clone <your-repo-url>
cd ai-journey-companion
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up Supabase**:

   a. Create a new project at [supabase.com](https://supabase.com)
   
   b. Go to **Project Settings** > **API** and copy:
      - `Project URL`
      - `anon/public` key
   
   c. Go to **SQL Editor** and run the setup scripts:
      - Run `SUPABASE_AUTH_SETUP.sql` (creates tables, RLS policies, triggers)
      - Optionally run `SUPABASE_SQL_SCRIPT.sql` (expense tracker table)

4. **Configure environment variables**:
   - Copy `.env.example` to `.env.local`
   - Add your credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=sk-your-openai-key (optional)
   ```

5. **Start the development servers**:

   **Terminal 1 - Backend (Port 3001)** - Optional, only needed for AI chat:
   ```bash
   npm run server
   ```

   **Terminal 2 - Frontend (Port 5173)**:
   ```bash
   npm run dev
   ```

6. **Open your browser**: http://localhost:5173

7. **Create an account** and start tracking your journey!

🎉 Your AI Journey Companion is ready!

## 📖 Usage

### Basic Workflow
1. **Sign Up/Login**: Create your account to get started
2. **Explore Dashboard**: See your stats and quick actions
3. **Track Goals**: Add goals with priorities and deadlines
4. **Log Milestones**: Celebrate achievements on the timeline
5. **Install Plugins**: Go to Plugins → Install "Multi-Agent System" and "Expense Tracker"
6. **Track Expenses**: Add expenses and view spending patterns
7. **Chat with AI**: Open chat sidebar to talk with AI (requires OpenAI key)
8. **Save Prompts**: Generate and save prompts to your library

### Authentication
- Sign up with email and password
- Secure authentication powered by Supabase
- User profile management
- All data is private and user-specific

### Expense Tracker (Plugin)
- Add expenses with amount, store name, and category
- Filter by category (Food, Transport, Shopping, etc.)
- View monthly spending summary
- Sort and search expenses
- Dashboard widget shows quick stats

### AI Modes (Multi-Agent Plugin)
- **Chat Mode**: Conversational and friendly
- **Thinking Agent**: Deep analysis and reasoning
- **Plan Agent**: Structured planning and actionable steps
- **Prompt Helper**: Build optimized prompts for coding tasks
- Mode selection persists across sessions

### Plugins
- Install plugins from the Plugin Manager
- Each plugin adds new features or enhances existing ones
- Uninstall anytime (data is removed)
- More plugins coming soon

## 🏗️ Project Structure

```
ai-journey-companion/
├── src/
│   ├── components/          # Shared components
│   │   ├── Navigation.jsx   # Top navigation with auth menu
│   │   ├── Layout.jsx       # Page layout wrapper
│   │   ├── ProtectedRoute.jsx # Auth guard
│   │   └── Toast.jsx        # Toast notifications
│   ├── pages/               # Main pages
│   │   ├── Dashboard.jsx    # Home page with stats
│   │   ├── HelpPage.jsx     # Help documentation
│   │   └── Auth/            # Auth pages
│   │       ├── LoginPage.jsx
│   │       ├── SignupPage.jsx
│   │       └── ProfilePage.jsx
│   ├── features/            # Feature modules
│   │   ├── chat/            # AI chat system
│   │   │   ├── ChatSidebar.jsx
│   │   │   ├── ConversationManager.jsx
│   │   │   └── MultiAgentSettings.jsx
│   │   ├── goals/           # Goals tracking
│   │   │   ├── GoalsManager.jsx
│   │   │   ├── GoalsView.jsx
│   │   │   └── AddGoalModal.jsx
│   │   ├── milestones/      # Milestones timeline
│   │   │   ├── MilestonesManager.jsx
│   │   │   ├── MilestonesView.jsx
│   │   │   └── AddMilestoneModal.jsx
│   │   ├── expenses/        # Expense tracker (plugin)
│   │   │   ├── ExpensesManager.jsx
│   │   │   ├── ExpenseTable.jsx
│   │   │   ├── AddExpenseModal.jsx
│   │   │   ├── CategoryFilter.jsx
│   │   │   └── ExpensesDashboardWidget.jsx
│   │   ├── plugins/         # Plugin system
│   │   │   └── PluginManager.jsx
│   │   └── prompts/         # Prompt library
│   │       ├── PromptLibrary.jsx
│   │       └── PromptsView.jsx
│   ├── config/              # Configuration
│   │   ├── agentPrompts.js  # AI system prompts
│   │   ├── promptTemplates.js # Prompt templates
│   │   ├── routes.js        # Route definitions
│   │   └── supabase.js      # Supabase client
│   ├── contexts/            # React contexts
│   │   ├── ThemeContext.jsx # Theme management
│   │   └── AuthContext.jsx  # Auth state
│   ├── utils/               # Utilities
│   │   ├── storage.js       # Unified storage API
│   │   ├── supabase/        # Supabase storage modules
│   │   │   ├── goalsStorage.js
│   │   │   ├── milestonesStorage.js
│   │   │   ├── promptStorage.js
│   │   │   └── ...
│   │   ├── pluginStorage.js # Plugin management
│   │   ├── expenseStorage.js # Expense data
│   │   └── helpContent.js   # Help documentation
│   └── ...
├── server.js                # Express backend for OpenAI proxy
├── .env.local               # Environment variables (create from .env.example)
├── SUPABASE_AUTH_SETUP.sql  # Database setup script
└── package.json
```

## 🎨 Customization

### Theme Colors
Edit `tailwind.config.js` to customize the color palette:
```javascript
colors: {
  'neutral': { /* Grayscale palette */ },
  'accent': { /* Primary action color (indigo) */ },
}
```

### AI Prompts
Customize AI behavior in `src/config/agentPrompts.js`:
- Modify system prompts for each mode
- Adjust conversation style and tone
- Add new AI modes

### Prompt Templates
Add new templates in `src/config/promptTemplates.js`:
- Pre-built templates for common tasks
- Customize existing templates
- Add your own categories

## 📦 Build for Production

```bash
# Build the app
npm run build

# Preview production build
npm run preview
```

The production-ready files will be in the `dist` folder.

## 🧪 Testing

See `TESTING_GUIDE.md` for comprehensive testing scenarios.

**Quick Smoke Test**:
1. Start both servers
2. Open chat and send a message
3. Add a goal and mark it complete
4. Install a plugin
5. Toggle light/dark mode

## 📊 Features Status

✅ **Complete & Working**:
- User authentication (email/password) with Supabase
- User profiles and account management
- **AI receipt scanner with GPT-4o Vision (NEW!)** 
- AI chat with 4 agent modes and model selection (Multi-Agent plugin)
- **Minimal ChatGPT-style chat sidebar with resize (NEW!)**
- **Model selector for GPT-4o Mini, GPT-4o, GPT-4 Turbo, GPT-3.5 (NEW!)**
- Goals tracking with CRUD operations
- Milestones timeline with categories
- Expense tracking with AI receipt scanning, categories, and analytics (Expense Tracker plugin)
- **Smart image compression for receipt uploads (NEW!)**
- Plugin system with install/uninstall
- Prompt library with favorites & export
- Help documentation (in-app)
- Light/dark theme switching
- Fully responsive design
- Supabase database with Row Level Security
- Real-time data synchronization
- Protected routes and auth guards

## 🔐 Security Notes

- **Environment Variables**: Never commit `.env.local` (it's gitignored)
- **Supabase RLS**: Row Level Security ensures users only access their own data
- **Authentication**: Secure JWT-based auth via Supabase
- **API Keys**: OpenAI key stored server-side, never exposed to client
- **HTTPS**: Use HTTPS in production for secure data transmission

## 💰 Cost Considerations

Using OpenAI's GPT-4o-mini model:
- Very affordable (~$0.15 per 1M input tokens)
- Typical conversation costs less than $0.01
- Perfect for personal use

## 🐛 Troubleshooting

### Backend won't start
- Check that `.env` file exists with valid API key
- Ensure API key starts with `sk-`
- Run `npm install` to install dependencies

### Frontend won't connect to backend
- Verify backend is running on port 3001
- Check browser console for errors
- Clear localStorage and refresh

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (20.19+ recommended)
- Clear `node_modules` and reinstall if needed

## 📚 Documentation

- `SETUP.md` - Detailed setup instructions
- `TESTING_GUIDE.md` - Comprehensive testing guide
- `DEPLOYMENT.md` - Deployment checklist (coming soon)
- Help documentation built into the app

## 🎯 Future Enhancements

- ✅ ~~Backend database integration~~ - **DONE** (Supabase)
- ✅ ~~User authentication and multi-user support~~ - **DONE**
- ✅ ~~Supabase integration for cloud sync~~ - **DONE**
- ✅ ~~Expense tracking plugin~~ - **DONE**
- Additional plugins (Content Drafter, Habit Tracker, Voice Notes)
- Export/import data features (CSV, JSON)
- Advanced analytics and insights
- Social features (share achievements, collaborative goals)
- Mobile app (React Native)
- Browser extension

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

Design inspired by:
- **Cursor** - Minimal, clean IDE aesthetic
- **Linear** - Sharp, high-contrast UI
- **Obsidian** - Markdown-first, subtle design

Built with ❤️ for personal growth and productivity.

---

**Version**: 2.1.0  
**Status**: Production Ready 🚀  
**Last Updated**: 2025-10-26

### What's New in v2.1.0
- 🎨 Redesigned chat UI with minimal ChatGPT-style interface
- 📸 AI-powered receipt scanner with GPT-4o Vision
- 🔄 Model selector for choosing between different GPT models
- ↔️ Resizable chat sidebar
- 🗜️ Automatic image compression for receipt uploads
- 💬 Improved conversation management
