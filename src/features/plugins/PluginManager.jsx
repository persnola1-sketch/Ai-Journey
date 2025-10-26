import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Settings, Download, Check, Loader, X } from 'lucide-react';
import { PLUGIN_REGISTRY, PLUGIN_CATEGORIES, getCategoryColor } from '../../utils/pluginRegistry';
import { installPlugin, uninstallPlugin, isPluginInstalled } from '../../utils/pluginStorage';
import MultiAgentSettings from '../chat/MultiAgentSettings';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const PluginManager = () => {
  const [plugins, setPlugins] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedPlugin, setSelectedPlugin] = useState(null);
  const [installingPlugins, setInstallingPlugins] = useState(new Set());
  const [showMultiAgentSettings, setShowMultiAgentSettings] = useState(false);

  // Load plugins and check installation status
  useEffect(() => {
    const pluginsWithStatus = PLUGIN_REGISTRY.map(plugin => ({
      ...plugin,
      installed: isPluginInstalled(plugin.id)
    }));
    setPlugins(pluginsWithStatus);
  }, []);

  // Handle plugin installation
  const handleInstall = async (pluginId) => {
    setInstallingPlugins(prev => new Set(prev).add(pluginId));
    
    try {
      // Simulate installation delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      await installPlugin(pluginId);
      
      // Update plugin status
      setPlugins(plugins.map(p => 
        p.id === pluginId ? { ...p, installed: true } : p
      ));
      
      // Celebrate!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      const plugin = PLUGIN_REGISTRY.find(p => p.id === pluginId);
      toast.success(`${plugin?.name || 'Plugin'} installed! 🎉`);
    } catch (error) {
      console.error('Error installing plugin:', error);
      toast.error('Failed to install plugin');
    } finally {
      setInstallingPlugins(prev => {
        const next = new Set(prev);
        next.delete(pluginId);
        return next;
      });
    }
  };

  // Handle plugin uninstallation
  const handleUninstall = async (pluginId) => {
    const plugin = PLUGIN_REGISTRY.find(p => p.id === pluginId);
    
    if (confirm(`Uninstall ${plugin?.name || 'this plugin'}? This will remove all plugin data.`)) {
      try {
        await uninstallPlugin(pluginId);
        
        setPlugins(plugins.map(p => 
          p.id === pluginId ? { ...p, installed: false } : p
        ));
        
        toast.success(`${plugin?.name || 'Plugin'} uninstalled`);
      } catch (error) {
        console.error('Error uninstalling plugin:', error);
        toast.error('Failed to uninstall plugin');
      }
    }
  };

  // Handle plugin settings
  const handleSettings = (plugin) => {
    if (plugin.id === 'multi-agent-system') {
      setShowMultiAgentSettings(true);
    } else {
      // For other plugins, show a generic settings modal (to be implemented)
      toast('Settings for this plugin coming soon!', { icon: '⚙️' });
    }
  };

  // Filter plugins
  const filteredPlugins = plugins.filter(plugin => {
    // Search filter
    const matchesSearch = 
      plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    // Category filter
    if (activeFilter === 'all') return true;
    if (activeFilter === 'installed') return plugin.installed;
    if (activeFilter === 'available') return !plugin.installed;
    return plugin.category === activeFilter;
  });

  // Count installed plugins
  const installedCount = plugins.filter(p => p.installed).length;

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Plugin Manager
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg mb-6">
            Extend your AI companion with powerful plugins
            {installedCount > 0 && ` • ${installedCount} installed`}
          </p>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search plugins..."
              className="input pl-12"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {PLUGIN_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`
                  px-4 py-2 rounded-md font-medium text-sm transition-colors border
                  ${activeFilter === category.id
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100'
                    : 'bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600'
                  }
                `}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Plugin Grid */}
        {filteredPlugins.length === 0 ? (
          <div className="card p-12 text-center">
            <Search className="w-16 h-16 text-neutral-400 dark:text-neutral-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              No plugins found
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredPlugins.map((plugin) => (
                <PluginCard
                  key={plugin.id}
                  plugin={plugin}
                  isInstalling={installingPlugins.has(plugin.id)}
                  onInstall={handleInstall}
                  onUninstall={handleUninstall}
                  onSettings={handleSettings}
                  onViewDetails={() => setSelectedPlugin(plugin)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Plugin Detail Modal */}
        <PluginDetailModal
          plugin={selectedPlugin}
          onClose={() => setSelectedPlugin(null)}
          onInstall={handleInstall}
          onUninstall={handleUninstall}
          isInstalling={installingPlugins.has(selectedPlugin?.id)}
        />

        {/* Multi-Agent Settings Modal */}
        <MultiAgentSettings
          isOpen={showMultiAgentSettings}
          onClose={() => setShowMultiAgentSettings(false)}
        />
      </div>
    </div>
  );
};

const PluginCard = ({ plugin, isInstalling, onInstall, onUninstall, onSettings, onViewDetails }) => {
  const [isHovered, setIsHovered] = useState(false);
  const categoryColor = getCategoryColor(plugin.category);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onViewDetails}
      className={`
        card p-6 cursor-pointer transition-all
        ${isHovered && 'ring-2 ring-accent-500/30 dark:ring-accent-600/30'}
        ${!plugin.enabled && 'opacity-50'}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-4xl">{plugin.icon}</div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{plugin.name}</h3>
              {plugin.installed && (
                <span className="flex items-center space-x-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-medium">
                  <Check className="w-3 h-3" />
                  <span>Installed</span>
                </span>
              )}
              {!plugin.enabled && (
                <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded text-xs font-medium">
                  Soon
                </span>
              )}
            </div>
            <span className={`text-xs font-medium text-${categoryColor} bg-${categoryColor}/10 dark:bg-${categoryColor}/20 px-2 py-0.5 rounded`}>
              {plugin.category}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4 line-clamp-2">
        {plugin.description}
      </p>

      {/* Version & Author */}
      <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-4">
        <span>v{plugin.version}</span>
        <span>by {plugin.author}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
        {plugin.installed ? (
          <>
            {plugin.settings && (
              <button
                onClick={() => onSettings(plugin)}
                className="flex-1 flex items-center justify-center space-x-2 btn-secondary"
              >
                <Settings className="w-4 h-4" />
                <span>Configure</span>
              </button>
            )}
            <button
              onClick={() => onUninstall(plugin.id)}
              className="flex-1 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 text-neutral-700 dark:text-neutral-300 rounded-md font-medium transition-colors cursor-pointer"
            >
              Uninstall
            </button>
          </>
        ) : (
          <button
            onClick={() => onInstall(plugin.id)}
            disabled={!plugin.enabled || isInstalling}
            className={`
              w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-md font-medium transition-all
              ${plugin.enabled && !isInstalling
                ? 'btn-primary'
                : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-500 cursor-not-allowed'
              }
            `}
          >
            {isInstalling ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Installing...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{plugin.enabled ? 'Install' : 'Coming Soon'}</span>
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
};

const PluginDetailModal = ({ plugin, onClose, onInstall, onUninstall, isInstalling }) => {
  if (!plugin) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-dark-700 rounded-xl border border-dark-500 shadow-glow-subtle max-h-[90vh] overflow-y-auto custom-scrollbar"
        >
          {/* Header */}
          <div className="sticky top-0 bg-dark-700 border-b border-dark-500 p-6 flex items-start justify-between z-10">
            <div className="flex items-center space-x-4">
              <div className="text-5xl">{plugin.icon}</div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <h2 className="text-2xl font-bold text-text-primary">{plugin.name}</h2>
                  {plugin.installed && (
                    <span className="flex items-center space-x-1 px-2 py-1 bg-green-500/20 text-green-500 rounded text-sm font-medium">
                      <Check className="w-4 h-4" />
                      <span>Installed</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-3 text-sm text-text-muted">
                  <span className={`text-${getCategoryColor(plugin.category)} font-medium`}>
                    {plugin.category}
                  </span>
                  <span>•</span>
                  <span>v{plugin.version}</span>
                  <span>•</span>
                  <span>by {plugin.author}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary p-2 rounded-lg hover:bg-dark-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">About</h3>
              <p className="text-text-secondary">{plugin.description}</p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">Features</h3>
              <div className="space-y-2">
                {plugin.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3 text-text-secondary">
                    <span className="text-lg">{feature.split(' ')[0]}</span>
                    <span>{feature.substring(feature.indexOf(' ') + 1)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-dark-600 hover:bg-dark-500 text-text-primary rounded-lg font-medium transition-colors cursor-pointer"
              >
                Close
              </button>
              {plugin.installed ? (
                <button
                  onClick={() => {
                    onUninstall(plugin.id);
                    onClose();
                  }}
                  className="flex-1 px-4 py-3 bg-gx-red/20 hover:bg-gx-red/30 text-gx-red rounded-lg font-medium transition-colors cursor-pointer"
                >
                  Uninstall Plugin
                </button>
              ) : (
                <button
                  onClick={() => {
                    onInstall(plugin.id);
                    onClose();
                  }}
                  disabled={!plugin.enabled || isInstalling}
                  className={`
                    flex-1 px-4 py-3 rounded-lg font-medium transition-all
                    ${plugin.enabled && !isInstalling
                      ? 'bg-gradient-primary text-white hover:brightness-110 cursor-pointer'
                      : 'bg-dark-600 text-text-muted cursor-not-allowed'
                    }
                  `}
                >
                  {isInstalling ? 'Installing...' : plugin.enabled ? 'Install Plugin' : 'Coming Soon'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PluginManager;


