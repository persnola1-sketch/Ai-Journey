/**
 * Pre-built Prompt Templates
 * Ready-to-use templates for common development tasks
 */

export const PROMPT_TEMPLATES = [
  {
    id: 'web-app',
    name: 'Web Application',
    category: 'Full Stack',
    description: 'Build a complete web application with frontend and backend',
    tags: ['web', 'full-stack', 'react'],
    useCases: ['SaaS product', 'Dashboard', 'Admin panel'],
    template: `Build a modern web application with the following specifications:

PROJECT NAME: [App Name]

CORE FUNCTIONALITY:
- [Primary feature 1]
- [Primary feature 2]
- [Primary feature 3]

USER INTERFACE:
- Clean, responsive design that works on desktop and mobile
- Intuitive navigation
- [Specific UI requirements]

TECHNICAL STACK:
- Frontend: React + Tailwind CSS
- Backend: Node.js + Express
- Database: [PostgreSQL/MongoDB/Your choice]
- Authentication: JWT or similar

KEY FEATURES:
1. User authentication (signup, login, logout)
2. [Feature 1 with details]
3. [Feature 2 with details]
4. Data persistence and CRUD operations
5. Error handling and validation

DELIVERABLES:
- Fully functional web app
- Clean, maintainable code
- Basic documentation
- Deployment ready`
  },
  
  {
    id: 'landing-page',
    name: 'Landing Page',
    category: 'Frontend',
    description: 'Create a conversion-focused landing page',
    tags: ['web', 'marketing', 'frontend'],
    useCases: ['Product launch', 'Lead generation', 'Portfolio'],
    template: `Create a high-converting landing page with the following:

PURPOSE: [What the page is promoting]

SECTIONS:
1. Hero section with compelling headline and CTA
2. Features/benefits section (3-6 key points)
3. Social proof (testimonials, logos, stats)
4. Call-to-action section
5. Footer with links

DESIGN REQUIREMENTS:
- Modern, clean design
- Mobile-responsive
- Fast loading (<3 seconds)
- Accessibility compliant

TECHNICAL:
- React or Next.js
- Tailwind CSS for styling
- Framer Motion for animations (subtle)
- SEO optimized

CALL-TO-ACTION:
- Primary CTA: [e.g., "Start Free Trial"]
- Secondary CTA: [e.g., "Watch Demo"]

DELIVERABLES:
- Responsive landing page
- Contact form integration
- Analytics tracking ready`
  },

  {
    id: 'rest-api',
    name: 'REST API',
    category: 'Backend',
    description: 'Build a RESTful API with proper architecture',
    tags: ['backend', 'api', 'node'],
    useCases: ['Mobile app backend', 'Microservice', 'Data service'],
    template: `Build a RESTful API with the following specifications:

API PURPOSE: [What the API does]

ENDPOINTS:
- GET /api/[resource] - List all
- GET /api/[resource]/:id - Get single
- POST /api/[resource] - Create new
- PUT /api/[resource]/:id - Update
- DELETE /api/[resource]/:id - Delete

AUTHENTICATION:
- JWT-based authentication
- Protected routes
- Role-based access control (if needed)

DATA MODEL:
[Resource schema]:
- field1: type
- field2: type
- field3: type

TECHNICAL REQUIREMENTS:
- Node.js + Express
- Database: [PostgreSQL/MongoDB]
- Input validation (Joi or similar)
- Error handling middleware
- Rate limiting
- CORS configured

FEATURES:
- Pagination for list endpoints
- Filtering and sorting
- Proper HTTP status codes
- Request logging
- API documentation (Swagger/OpenAPI)

DELIVERABLES:
- Working API with all endpoints
- Environment configuration
- README with setup instructions
- Postman collection or API docs`
  },

  {
    id: 'cli-tool',
    name: 'CLI Tool',
    category: 'Utility',
    description: 'Create a command-line interface tool',
    tags: ['cli', 'node', 'automation'],
    useCases: ['Automation script', 'Developer tool', 'File processor'],
    template: `Build a command-line interface (CLI) tool:

TOOL PURPOSE: [What the CLI does]

COMMANDS:
- [command-name] [action] - [description]
- [command-name] [action] - [description]

OPTIONS/FLAGS:
- --help, -h: Show help
- --version, -v: Show version
- --[option]: [description]

FEATURES:
- Interactive prompts when needed
- Clear error messages
- Progress indicators for long operations
- Color-coded output (success/error/info)
- Configuration file support

TECHNICAL:
- Node.js
- Commander.js or Yargs for CLI
- Chalk for colors
- Ora for spinners
- Inquirer for prompts

INPUT/OUTPUT:
- Input: [files, text, API data, etc.]
- Output: [formatted text, files, reports, etc.]

ERROR HANDLING:
- Validate inputs
- Graceful failures with helpful messages
- Exit codes (0 for success, 1 for error)

DELIVERABLES:
- Working CLI tool
- npm package (publishable)
- README with installation and usage
- Examples and GIFs/screenshots`
  },

  {
    id: 'dashboard',
    name: 'Analytics Dashboard',
    category: 'Frontend',
    description: 'Build a data visualization dashboard',
    tags: ['dashboard', 'charts', 'analytics'],
    useCases: ['Business analytics', 'Admin panel', 'Monitoring'],
    template: `Create an analytics dashboard with the following:

DASHBOARD PURPOSE: [What data/metrics it displays]

MAIN SECTIONS:
1. Overview with key metrics (KPIs)
2. Interactive charts and graphs
3. Data tables with sorting/filtering
4. Date range selectors
5. Export functionality

VISUALIZATIONS:
- Line charts for trends
- Bar charts for comparisons
- Pie/donut charts for distributions
- Stats cards for key numbers
- [Other specific chart types]

DATA:
- Real-time updates (if applicable)
- Historical data views
- Filtering by: [date, category, etc.]

TECHNICAL STACK:
- React + Tailwind CSS
- Chart.js or Recharts for visualizations
- React Query for data fetching
- LocalStorage or backend API for data

FEATURES:
- Responsive design (mobile-friendly)
- Dark mode toggle
- Data export (CSV, PDF)
- Customizable dashboard layout
- Loading states and error handling

DELIVERABLES:
- Fully functional dashboard
- Sample data or API integration
- Responsive across devices
- Clean, professional UI`
  },

  {
    id: 'chrome-extension',
    name: 'Chrome Extension',
    category: 'Browser',
    description: 'Create a Chrome browser extension',
    tags: ['extension', 'browser', 'productivity'],
    useCases: ['Productivity tool', 'Content modifier', 'Automation'],
    template: `Build a Chrome extension with these specifications:

EXTENSION PURPOSE: [What problem it solves]

FUNCTIONALITY:
- [Main feature 1]
- [Main feature 2]
- [Main feature 3]

USER INTERFACE:
- Popup: [What appears when clicking extension icon]
- Options page: [Settings/configuration]
- Content scripts: [What modifies on web pages]

PERMISSIONS NEEDED:
- activeTab
- storage
- [Other permissions]

TECHNICAL:
- Manifest V3
- JavaScript (or React for complex UI)
- Chrome Storage API
- Message passing between components

FEATURES:
- Keyboard shortcuts (optional)
- Context menu items (optional)
- Badge notifications
- Sync settings across devices
- Dark mode support

USER EXPERIENCE:
- Fast and lightweight
- Clear value proposition
- Minimal permissions requested
- Respects user privacy

DELIVERABLES:
- Working Chrome extension
- Icons (16px, 48px, 128px)
- Privacy policy (if collecting data)
- README with installation instructions
- Ready for Chrome Web Store submission`
  },

  {
    id: 'npm-package',
    name: 'NPM Package',
    category: 'Library',
    description: 'Create a reusable npm package/library',
    tags: ['npm', 'library', 'open-source'],
    useCases: ['Utility library', 'React components', 'Framework'],
    template: `Create an npm package with the following:

PACKAGE NAME: @[scope]/[package-name]

PACKAGE PURPOSE: [What functionality it provides]

API DESIGN:
\`\`\`javascript
// Main exports
import { functionName, ClassName } from '[package-name]';

// Usage example
const result = functionName(params);
\`\`\`

FEATURES:
- [Feature 1]
- [Feature 2]
- [Feature 3]

TECHNICAL REQUIREMENTS:
- Written in TypeScript (with type definitions)
- Zero dependencies (or minimal, well-justified deps)
- Tree-shakeable
- Works in Node.js and browsers
- ESM and CommonJS exports

QUALITY:
- Unit tests (Jest or Vitest)
- 90%+ code coverage
- TypeScript types exported
- JSDoc comments
- No console.logs in production

DOCUMENTATION:
- Clear README with examples
- API documentation
- Migration guide (if updates)
- Contributing guidelines

PUBLISHING:
- Semantic versioning
- Changelog
- GitHub Actions for CI/CD
- npm publish automation

DELIVERABLES:
- Published npm package
- GitHub repository
- Documentation site (optional but recommended)
- Example projects using the package`
  },

  {
    id: 'mobile-app',
    name: 'Mobile App (React Native)',
    category: 'Mobile',
    description: 'Build a cross-platform mobile app',
    tags: ['mobile', 'react-native', 'ios', 'android'],
    useCases: ['Mobile product', 'Companion app', 'Utility'],
    template: `Build a React Native mobile app:

APP NAME: [App Name]

PURPOSE: [What the app does]

CORE SCREENS:
1. Welcome/Onboarding
2. [Main screen]
3. [Feature screen]
4. Profile/Settings

FEATURES:
- [Key feature 1]
- [Key feature 2]
- [Key feature 3]
- Push notifications (if needed)
- Offline mode (if needed)

TECHNICAL STACK:
- React Native (Expo or bare workflow)
- Navigation: React Navigation
- State: Redux/Context/Zustand
- Storage: AsyncStorage or SQLite
- API: REST or GraphQL

USER EXPERIENCE:
- Smooth animations
- Native feel (platform-specific UI)
- Loading states
- Error handling
- Pull-to-refresh

PLATFORM REQUIREMENTS:
- iOS 13+ and Android 8+
- Portrait and landscape support
- Dark mode
- Accessibility features

DELIVERABLES:
- Working app on both platforms
- App icons and splash screens
- Basic analytics
- Ready for App Store and Play Store submission`
  },

  {
    id: 'automation-script',
    name: 'Automation Script',
    category: 'Automation',
    description: 'Create a task automation script',
    tags: ['automation', 'scripting', 'productivity'],
    useCases: ['Data processing', 'File management', 'Web scraping'],
    template: `Create an automation script for the following task:

TASK: [What needs to be automated]

INPUT:
- Source: [files, API, database, web pages]
- Format: [CSV, JSON, HTML, etc.]

PROCESS:
1. [Step 1: e.g., Read data from source]
2. [Step 2: e.g., Transform/filter data]
3. [Step 3: e.g., Process/analyze]
4. [Step 4: e.g., Generate output]

OUTPUT:
- Format: [files, database, API, email]
- Destination: [where results go]

TECHNICAL:
- Language: [Python/Node.js/Bash]
- Libraries: [pandas, puppeteer, etc.]
- Error handling: Retry logic, logs
- Scheduling: [cron job, manual, triggered]

FEATURES:
- Dry-run mode (preview without executing)
- Progress logging
- Error notifications
- Configurable via config file
- Backup before modifications

ROBUSTNESS:
- Handle edge cases
- Rate limiting (if API calls)
- Graceful degradation
- Resume capability (if long-running)

DELIVERABLES:
- Working automation script
- Configuration template
- README with setup and usage
- Sample input/output examples
- Scheduling instructions (if applicable)`
  },

  {
    id: 'database-schema',
    name: 'Database Schema Design',
    category: 'Backend',
    description: 'Design a database schema with migrations',
    tags: ['database', 'sql', 'schema'],
    useCases: ['New project', 'Data modeling', 'Migration'],
    template: `Design a database schema for:

PROJECT: [Project/Feature name]

ENTITIES:
1. [Entity 1]
   - id: UUID/Integer (primary key)
   - [field]: type
   - created_at: timestamp
   - updated_at: timestamp

2. [Entity 2]
   - id: UUID/Integer (primary key)
   - [entity_1]_id: foreign key
   - [field]: type

RELATIONSHIPS:
- [Entity 1] has many [Entity 2] (one-to-many)
- [Entity 2] belongs to [Entity 1]
- [Other relationships]

INDEXES:
- Primary keys (automatic)
- Foreign keys for joins
- [Field] for frequent queries
- Composite index on [field1, field2]

CONSTRAINTS:
- NOT NULL on required fields
- UNIQUE on [field]
- CHECK constraints for validation
- ON DELETE CASCADE for dependent records

TECHNICAL:
- Database: [PostgreSQL/MySQL/MongoDB]
- ORM: [Prisma/TypeORM/Mongoose]
- Migrations: Automated, version-controlled

FEATURES:
- Soft deletes (deleted_at field)
- Audit trail (created_by, updated_by)
- Optimistic locking (version field)
- Full-text search indexes (if needed)

DELIVERABLES:
- Complete schema definition
- Migration files
- Seed data for testing
- ER diagram (optional but helpful)
- Documentation of relationships and constraints`
  }
];

/**
 * Get template by ID
 */
export const getTemplateById = (id) => {
  return PROMPT_TEMPLATES.find(template => template.id === id);
};

/**
 * Get templates by category
 */
export const getTemplatesByCategory = (category) => {
  return PROMPT_TEMPLATES.filter(template => template.category === category);
};

/**
 * Get all unique categories
 */
export const getCategories = () => {
  return [...new Set(PROMPT_TEMPLATES.map(t => t.category))];
};

/**
 * Search templates by query
 */
export const searchTemplates = (query) => {
  const lowerQuery = query.toLowerCase();
  return PROMPT_TEMPLATES.filter(template => 
    template.name.toLowerCase().includes(lowerQuery) ||
    template.description.toLowerCase().includes(lowerQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    template.useCases.some(useCase => useCase.toLowerCase().includes(lowerQuery))
  );
};

export default PROMPT_TEMPLATES;

