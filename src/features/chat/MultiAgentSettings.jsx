import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Brain, ListChecks, Save } from 'lucide-react';
import { getPluginSettings, savePluginSettings } from '../../utils/pluginStorage';
import toast from 'react-hot-toast';

const AVAILABLE_AGENTS = [
  { id: 'chat', label: 'Chat Mode', icon: MessageCircle, description: 'Conversational and friendly' },
  { id: 'thinking', label: 'Thinking Agent', icon: Brain, description: 'Deep analysis and insights' },
  { id: 'plan', label: 'Plan Agent', icon: ListChecks, description: 'Structured plans and goals' },
];

const MultiAgentSettings = ({ isOpen, onClose }) => {
  const [enabledAgents, setEnabledAgents] = useState(['chat', 'thinking', 'plan']);
  const [defaultAgent, setDefaultAgent] = useState('chat');

  // Load settings on mount
  useEffect(() => {
    if (isOpen) {
      const settings = getPluginSettings('multi-agent-system');
      if (settings) {
        setEnabledAgents(settings.enabledAgents || ['chat', 'thinking', 'plan']);
        setDefaultAgent(settings.defaultAgent || 'chat');
      }
    }
  }, [isOpen]);

  const toggleAgent = (agentId) => {
    if (agentId === 'chat') return; // Chat mode is always enabled
    
    setEnabledAgents(prev => {
      if (prev.includes(agentId)) {
        // Don't allow disabling if it's the default
        if (agentId === defaultAgent) {
          toast.error('Cannot disable the default agent');
          return prev;
        }
        return prev.filter(id => id !== agentId);
      } else {
        return [...prev, agentId];
      }
    });
  };

  const handleDefaultChange = (agentId) => {
    // Make sure the agent is enabled
    if (!enabledAgents.includes(agentId)) {
      setEnabledAgents(prev => [...prev, agentId]);
    }
    setDefaultAgent(agentId);
  };

  const handleSave = () => {
    const settings = {
      enabledAgents,
      defaultAgent,
    };
    
    const success = savePluginSettings('multi-agent-system', settings);
    
    if (success) {
      toast.success('Settings saved!');
      onClose();
      
      // Trigger storage event for ChatSidebar to reload
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'ai-companion-plugin-settings-multi-agent-system',
        newValue: JSON.stringify(settings)
      }));
    } else {
      toast.error('Failed to save settings');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md max-h-[90vh] overflow-y-auto card z-50 p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Multi-Agent System Settings</h2>
              <button
                onClick={onClose}
                className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:text-neutral-100 p-1 rounded hover:bg-dark-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Enabled Agents */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Enabled Agents</h3>
              <div className="space-y-2">
                {AVAILABLE_AGENTS.map((agent) => {
                  const Icon = agent.icon;
                  const isEnabled = enabledAgents.includes(agent.id);
                  const isChat = agent.id === 'chat';
                  
                  return (
                    <label
                      key={agent.id}
                      className={`
                        flex items-center space-x-3 p-3 rounded-lg border
                        transition-all
                        ${isEnabled 
                          ? 'bg-accent-50 dark:bg-accent-950 border-accent-200 dark:border-accent-800' 
                          : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700'}
                        ${isChat ? 'opacity-100 cursor-not-allowed' : 'cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800'}
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={() => toggleAgent(agent.id)}
                        disabled={isChat}
                        className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-accent-600 focus:ring-2 focus:ring-accent-500/50 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <Icon className={`w-5 h-5 ${isEnabled ? 'text-accent-600 dark:text-accent-400' : 'text-neutral-400 dark:text-neutral-500'}`} />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{agent.label}</span>
                          {isChat && (
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">(Always enabled)</span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">{agent.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Default Agent */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Default Agent</h3>
              <select
                value={defaultAgent}
                onChange={(e) => handleDefaultChange(e.target.value)}
                className="input cursor-pointer"
              >
                {AVAILABLE_AGENTS.filter(a => enabledAgents.includes(a.id)).map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2">
                The default agent will be selected when you open the chat
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MultiAgentSettings;


