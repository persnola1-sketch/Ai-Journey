import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Code, FileText, ListChecks, Search as SearchIcon, Copy, MessageCircle, Edit, Trash2, Eye, ArrowLeft, Star, Download } from 'lucide-react';
import {
  getAllPrompts,
  deletePrompt,
  markPromptAsUsed,
  searchPrompts,
  filterPromptsByMode,
  sortPrompts,
  toggleFavorite,
  getFavoritePrompts,
  exportPrompts,
} from '../../utils/promptStorage';
import toast from 'react-hot-toast';

const PromptLibrary = ({ onBack, onUseInChat }) => {
  const [prompts, setPrompts] = useState([]);
  const [filteredPrompts, setFilteredPrompts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMode, setActiveMode] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedPrompt, setSelectedPrompt] = useState(null);

  // Load prompts
  useEffect(() => {
    loadPrompts();
  }, []);

  // Filter and sort when dependencies change
  useEffect(() => {
    let filtered = prompts;

    // Search
    if (searchQuery.trim()) {
      filtered = searchPrompts(searchQuery);
    }

    // Filter by mode or favorites
    if (activeMode === 'favorites') {
      filtered = filtered.filter(p => p.isFavorite);
    } else if (activeMode !== 'all') {
      filtered = filterPromptsByMode(activeMode);
    }

    // Sort
    filtered = sortPrompts(filtered, sortBy);

    setFilteredPrompts(filtered);
  }, [prompts, searchQuery, activeMode, sortBy]);

  const loadPrompts = () => {
    const allPrompts = getAllPrompts();
    setPrompts(allPrompts);
    setFilteredPrompts(allPrompts);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this prompt?')) {
      const success = deletePrompt(id);
      if (success) {
        toast.success('Prompt deleted');
        loadPrompts();
      } else {
        toast.error('Failed to delete prompt');
      }
    }
  };

  const handleCopy = async (prompt) => {
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const handleUseInChat = (prompt) => {
    markPromptAsUsed(prompt.id);
    onUseInChat(prompt.prompt);
    toast.success('Prompt added to chat!');
  };

  const handleView = (prompt) => {
    setSelectedPrompt(prompt);
  };

  const handleToggleFavorite = (id, event) => {
    event.stopPropagation();
    const isFav = toggleFavorite(id);
    loadPrompts();
    toast.success(isFav ? 'Added to favorites!' : 'Removed from favorites');
  };

  const handleExport = () => {
    try {
      exportPrompts();
      toast.success('Prompts exported successfully!');
    } catch (error) {
      toast.error('Failed to export prompts');
    }
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'coding':
        return Code;
      case 'writing':
        return FileText;
      case 'planning':
        return ListChecks;
      case 'research':
        return SearchIcon;
      default:
        return Code;
    }
  };

  const getModeColor = (mode) => {
    switch (mode) {
      case 'coding':
        return 'text-discord-purple';
      case 'writing':
        return 'text-gx-cyan';
      case 'planning':
        return 'text-gx-red';
      case 'research':
        return 'text-green-500';
      default:
        return 'text-discord-purple';
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const modeStats = {
    all: prompts.length,
    favorites: prompts.filter(p => p.isFavorite).length,
    coding: prompts.filter(p => p.mode === 'coding').length,
    writing: prompts.filter(p => p.mode === 'writing').length,
    planning: prompts.filter(p => p.mode === 'planning').length,
    research: prompts.filter(p => p.mode === 'research').length,
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-dark-500">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold gradient-text mb-1">
              Prompt Library
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              {filteredPrompts.length} {filteredPrompts.length === 1 ? 'prompt' : 'prompts'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 border-neutral-300 dark:border-neutral-700 border rounded-md transition-colors cursor-pointer"
              title="Export all prompts"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 border-neutral-300 dark:border-neutral-700 border rounded-md transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500 dark:text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prompts..."
            className="w-full pl-12 pr-4 py-3 input rounded-lg text-neutral-900 dark:text-neutral-100 placeholder-text-muted focus:outline-none focus:border-discord-purple focus:ring-2 focus:ring-discord-purple/20"
          />
        </div>

        {/* Mode Tabs */}
        <div className="flex items-center space-x-2 mb-4 overflow-x-auto">
          {[
            { id: 'all', label: 'All', icon: null },
            { id: 'favorites', label: 'Favorites', icon: Star },
            { id: 'coding', label: 'Coding', icon: Code },
            { id: 'writing', label: 'Writing', icon: FileText },
            { id: 'planning', label: 'Planning', icon: ListChecks },
            { id: 'research', label: 'Research', icon: SearchIcon },
          ].map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            const count = modeStats[mode.id];

            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                  ${isActive
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 border'
                    : 'bg-white dark:bg-neutral-950 border-neutral-300 dark:border-neutral-700 border text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:text-neutral-100 hover:bg-dark-600'
                  }
                `}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{mode.label}</span>
                <span className={`text-xs ${isActive ? 'opacity-80' : 'opacity-60'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Sort */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input px-3 py-1 text-sm cursor-pointer"
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="most-used">Most Used</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Prompt List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        {filteredPrompts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              {searchQuery ? 'No prompts found' : 'No saved prompts yet'}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              {searchQuery
                ? 'Try a different search term'
                : 'Create your first prompt to build your library'}
            </p>
            {!searchQuery && (
              <button
                onClick={onBack}
                className="px-6 py-3 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 border rounded-lg font-medium hover:brightness-110 transition-all cursor-pointer"
              >
                Create Prompt
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            <AnimatePresence>
              {filteredPrompts.map((prompt) => {
                const Icon = getModeIcon(prompt.mode);
                const modeColor = getModeColor(prompt.mode);

                return (
                  <motion.div
                    key={prompt.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="card-subtle p-5"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`p-2 rounded-lg bg-dark-600 ${modeColor}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                            {prompt.title}
                          </h3>
                          <div className="flex items-center space-x-3 text-sm text-neutral-600 dark:text-neutral-400">
                            <span>{prompt.category}</span>
                            <span>•</span>
                            <span>{formatDate(prompt.createdAt)}</span>
                            {prompt.useCount > 0 && (
                              <>
                                <span>•</span>
                                <span>Used {prompt.useCount} {prompt.useCount === 1 ? 'time' : 'times'}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    {prompt.tags && prompt.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {prompt.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-dark-600 text-neutral-600 dark:text-neutral-400 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(prompt)}
                        className="flex items-center space-x-1 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 text-sm rounded-md transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handleCopy(prompt)}
                        className="flex items-center space-x-1 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 text-sm rounded-md transition-colors cursor-pointer"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </button>
                      <button
                        onClick={() => handleUseInChat(prompt)}
                        className="flex items-center space-x-1 px-3 py-2 bg-accent-600 hover:bg-accent-700 dark:bg-accent-500 dark:hover:bg-accent-600 text-white text-sm rounded-md transition-all cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Use in Chat</span>
                      </button>
                      <button
                        onClick={(e) => handleToggleFavorite(prompt.id, e)}
                        className={`flex items-center space-x-1 px-3 py-2 text-sm rounded-md transition-colors cursor-pointer ml-auto ${
                          prompt.isFavorite
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
                            : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
                        }`}
                        title={prompt.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Star className={`w-4 h-4 ${prompt.isFavorite ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleDelete(prompt.id)}
                        className="flex items-center space-x-1 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 text-neutral-600 dark:text-neutral-400 text-sm rounded-md transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* View Prompt Modal */}
      {selectedPrompt && (
        <ViewPromptModal
          prompt={selectedPrompt}
          onClose={() => setSelectedPrompt(null)}
          onCopy={() => handleCopy(selectedPrompt)}
          onUseInChat={() => handleUseInChat(selectedPrompt)}
        />
      )}
    </div>
  );
};

// View Prompt Modal
const ViewPromptModal = ({ prompt, onClose, onCopy, onUseInChat }) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[80vh] bg-dark-800 border border-dark-500 rounded-xl shadow-glow-subtle z-50 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-dark-500">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            {prompt.title}
          </h3>
          <div className="flex items-center space-x-3 text-sm text-neutral-600 dark:text-neutral-400">
            <span>{prompt.category}</span>
            <span>•</span>
            <span>{new Date(prompt.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{prompt.wordCount} words</span>
            <span>•</span>
            <span>~{prompt.tokenCount} tokens</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <div className="input rounded-lg p-4 mb-4">
            <pre className="text-neutral-900 dark:text-neutral-100 whitespace-pre-wrap font-mono text-sm leading-relaxed">
              {prompt.prompt}
            </pre>
          </div>

          {prompt.notes && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2">Notes:</h4>
              <p className="text-neutral-900 dark:text-neutral-100 text-sm">{prompt.notes}</p>
            </div>
          )}

          {prompt.tags && prompt.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2">Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {prompt.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-dark-600 text-neutral-600 dark:text-neutral-400 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-dark-500 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:text-neutral-100 hover:bg-white dark:bg-neutral-950 border-neutral-300 dark:border-neutral-700 border rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
          <div className="flex items-center space-x-3">
            <button
              onClick={onCopy}
              className="flex items-center space-x-2 px-4 py-2 input text-neutral-900 dark:text-neutral-100 rounded-lg hover:border-discord-purple/50 transition-all cursor-pointer"
            >
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </button>
            <button
              onClick={onUseInChat}
              className="flex items-center space-x-2 px-4 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 border rounded-lg hover:brightness-110 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Use in Chat</span>
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default PromptLibrary;



