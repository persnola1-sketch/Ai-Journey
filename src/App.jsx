import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import ChatSidebar from './features/chat/ChatSidebar';
import GoalsManager from './features/goals/GoalsManager';
import MilestonesManager from './features/milestones/MilestonesManager';
import PluginManager from './features/plugins/PluginManager';
import HelpPage from './pages/HelpPage';
import ExpensesManager from './features/expenses/ExpensesManager';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import ProfilePage from './pages/Auth/ProfilePage';
import Toast from './components/Toast';
import { ROUTES } from './config/routes';

function AppContent() {
  const [isChatVisible, setIsChatVisible] = useState(true);
  const location = useLocation();
  const { user } = useAuth();

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };

  const openChat = () => {
    setIsChatVisible(true);
  };

  const closeChat = () => {
    setIsChatVisible(false);
  };

  return (
    <div className="relative">
      <Toast />
      
      <Navigation 
        onToggleChat={toggleChat}
        isChatVisible={isChatVisible}
      />
      
      <Layout isChatVisible={isChatVisible}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Routes location={location}>
              {/* Public routes */}
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
              <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
              
              {/* Protected routes */}
              <Route path={ROUTES.DASHBOARD} element={
                <ProtectedRoute>
                  <Dashboard onOpenChat={openChat} />
                </ProtectedRoute>
              } />
              <Route path={ROUTES.GOALS} element={
                <ProtectedRoute>
                  <GoalsManager />
                </ProtectedRoute>
              } />
              <Route path={ROUTES.MILESTONES} element={
                <ProtectedRoute>
                  <MilestonesManager />
                </ProtectedRoute>
              } />
              <Route path={ROUTES.PLUGINS} element={
                <ProtectedRoute>
                  <PluginManager />
                </ProtectedRoute>
              } />
              <Route path={ROUTES.EXPENSES} element={
                <ProtectedRoute>
                  <ExpensesManager />
                </ProtectedRoute>
              } />
              <Route path={ROUTES.PROFILE} element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path={ROUTES.HELP} element={
                <ProtectedRoute>
                  <HelpPage />
                </ProtectedRoute>
              } />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </Layout>

      {/* Chat Sidebar - Only for authenticated users */}
      {user && (
        <ChatSidebar 
          isVisible={isChatVisible} 
          onClose={closeChat}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
