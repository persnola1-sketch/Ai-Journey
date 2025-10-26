import { useState, useMemo } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, User, LogOut, PanelRightOpen, PanelRightClose } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { NAV_ITEMS, ROUTES } from '../config/routes';
import { isPluginInstalled } from '../utils/pluginStorage';
import toast from 'react-hot-toast';

const Navigation = ({ onToggleChat, isChatVisible }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide navigation on auth pages
  const isAuthPage = location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.SIGNUP;

  // Dynamically add expenses nav item if plugin is installed
  const navItems = useMemo(() => {
    const items = [...NAV_ITEMS];
    if (isPluginInstalled('expense-tracker')) {
      // Insert expenses before plugins
      const pluginsIndex = items.findIndex(item => item.id === 'plugins');
      items.splice(pluginsIndex, 0, {
        id: 'expenses',
        path: ROUTES.EXPENSES,
        label: '💰 Expenses',
      });
    }
    return items;
  }, []);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate(ROUTES.LOGIN);
      setUserMenuOpen(false);
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  // Don't render navigation on auth pages
  if (isAuthPage) return null;

  return (
    <>
      {/* Main Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo/Brand */}
            <NavLink
              to={ROUTES.DASHBOARD}
              className="flex items-center space-x-2 text-neutral-900 dark:text-neutral-100 font-semibold text-lg focus:outline-none"
            >
              <span>AI Journey</span>
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) => `
                    relative px-3 py-1.5 text-sm font-medium transition-colors rounded-md
                    ${isActive 
                      ? 'text-neutral-900 dark:text-neutral-100' 
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      
                      {/* Active underline */}
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-neutral-900 dark:bg-neutral-100" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              {/* Chat Toggle Button */}
              {user && (
                <button
                  onClick={onToggleChat}
                  aria-pressed={isChatVisible}
                  className={`
                    flex items-center gap-2 h-9 px-3 text-sm font-medium rounded-md border transition-colors
                    ${isChatVisible
                      ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100'
                      : 'bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600'
                    }
                  `}
                >
                  {isChatVisible ? (
                    <PanelRightClose className="w-4 h-4" />
                  ) : (
                    <PanelRightOpen className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">Chat</span>
                </button>
              )}

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>

              {/* User Menu */}
              {user && (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                  >
                    <User className="w-4 h-4" />
                  </button>

                  {/* User Dropdown */}
                  {userMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 z-50">
                        <div className="p-3 border-b border-neutral-200 dark:border-neutral-700">
                          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                            {user.email}
                          </p>
                        </div>
                        <div className="p-2">
                          <button
                            onClick={() => {
                              navigate(ROUTES.PROFILE);
                              setUserMenuOpen(false);
                            }}
                            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                          >
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                          </button>
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-md"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-14 left-0 right-0 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 z-50 md:hidden">
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={({ isActive }) => `
                    block w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                    }
                  `}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Spacer */}
      <div className="h-14" />
    </>
  );
};

export default Navigation;
