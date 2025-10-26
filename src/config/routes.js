/**
 * Global Routes Configuration
 * 
 * This file contains all route definitions for the application.
 * Each route has an id, path, label, and component reference.
 */

// Route paths constants
export const ROUTES = {
  DASHBOARD: '/',
  GOALS: '/goals',
  MILESTONES: '/milestones',
  PLUGINS: '/plugins',
  HELP: '/help',
  EXPENSES: '/expenses',
  LOGIN: '/login',
  SIGNUP: '/signup',
  PROFILE: '/profile',
};

// Navigation items configuration
export const NAV_ITEMS = [
  {
    id: 'dashboard',
    path: ROUTES.DASHBOARD,
    label: 'Dashboard',
  },
  {
    id: 'goals',
    path: ROUTES.GOALS,
    label: 'Goals',
  },
  {
    id: 'milestones',
    path: ROUTES.MILESTONES,
    label: 'Milestones',
  },
  {
    id: 'plugins',
    path: ROUTES.PLUGINS,
    label: 'Plugins',
  },
  {
    id: 'help',
    path: ROUTES.HELP,
    label: 'Help',
  },
];

export default ROUTES;


