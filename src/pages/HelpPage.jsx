import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { HELP_SECTIONS, searchHelpContent } from '../utils/helpContent';
import { isPluginInstalled } from '../utils/pluginStorage';
import HelpQuickTip from '../features/help/HelpQuickTip';
import HelpDetailedSection from '../features/help/HelpDetailedSection';

const HelpPage = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [searchQuery, setSearchQuery] = useState('');
  const [installedPlugins, setInstalledPlugins] = useState([]);
  const [searchResults, setSearchResults] = useState(null);

  // Load installed plugins
  useEffect(() => {
    const plugins = JSON.parse(
      localStorage.getItem('ai-companion-installed-plugins') || '[]'
    );
    setInstalledPlugins(plugins);
  }, []);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchHelpContent(searchQuery, HELP_SECTIONS, installedPlugins);
      setSearchResults(results);
    } else {
      setSearchResults(null);
    }
  }, [searchQuery, installedPlugins]);

  // Get available tabs based on installed plugins
  const getAvailableTabs = () => {
    const tabs = [
      { id: 'chat', label: 'Chat', section: HELP_SECTIONS.chat },
      { id: 'goals', label: 'Goals', section: HELP_SECTIONS.goals },
      { id: 'milestones', label: 'Milestones', section: HELP_SECTIONS.milestones },
      { id: 'plugins', label: 'Plugins', section: HELP_SECTIONS.plugins },
    ];

    // Add plugin-specific tabs if installed
    if (isPluginInstalled('multi-agent-system')) {
      tabs.push({ id: 'multiAgent', label: 'Multi-Agent', section: HELP_SECTIONS.multiAgent });
    }
    if (isPluginInstalled('prompt-helper')) {
      tabs.push({ id: 'promptHelper', label: 'Prompt Helper', section: HELP_SECTIONS.promptHelper });
    }

    return tabs;
  };

  const availableTabs = getAvailableTabs();
  const currentSection = HELP_SECTIONS[activeTab];

  const renderSearchResults = () => {
    if (!searchResults || searchResults.length === 0) {
      return (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <p className="text-neutral-600 dark:text-neutral-400">No results found for "{searchQuery}"</p>
          <p className="text-text-muted text-sm mt-2">Try different keywords</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Search Results ({searchResults.length})
          </h3>
          <button
            onClick={() => setSearchQuery('')}
            className="text-sm text-discord-purple hover:text-discord-purple-dark"
          >
            Clear search
          </button>
        </div>

        {searchResults.map((result, index) => (
          <div key={index} className="glass p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs px-2 py-1 rounded bg-discord-purple/20 text-discord-purple font-semibold">
                {result.sectionTitle}
              </span>
              <span className="text-xs text-text-muted">
                {result.type === 'quickTip' ? 'Quick Tip' : 'Detailed Guide'}
              </span>
            </div>

            {result.type === 'quickTip' && (
              <HelpQuickTip tip={result.content} />
            )}

            {result.type === 'detailedGuide' && (
              <HelpDetailedSection title={result.guideTitle} guide={result.content} />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderTabContent = () => {
    if (searchQuery.trim()) {
      return renderSearchResults();
    }

    if (!currentSection) return null;

    return (
      <div className="space-y-8">
        {/* Quick Tips Section */}
        {currentSection.quickTips && currentSection.quickTips.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Quick Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentSection.quickTips.map((tip, index) => (
                <HelpQuickTip key={index} tip={tip} />
              ))}
            </div>
          </div>
        )}

        {/* Detailed Guide Section */}
        {currentSection.detailedGuide && (
          <div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Detailed Guide</h3>
            <div className="glass rounded-lg overflow-hidden">
              {Object.entries(currentSection.detailedGuide).map(([title, guide]) => (
                <HelpDetailedSection key={title} title={title} guide={guide} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Help & Documentation
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg">
            Learn how to use all features and plugins
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documentation..."
            className="w-full pl-10 pr-10 py-3 input rounded-lg text-neutral-900 dark:text-neutral-100 placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-discord-purple focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-neutral-900 dark:text-neutral-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tabs */}
        {!searchQuery && (
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 mb-8">
            {availableTabs.map((tab) => {
              const Icon = tab.section.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-discord-purple text-white shadow-glow-purple'
                      : 'bg-dark-700 text-neutral-600 dark:text-neutral-400 hover:bg-dark-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Content */}
        <motion.div
          key={activeTab + searchQuery}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default HelpPage;


