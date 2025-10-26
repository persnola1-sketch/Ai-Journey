import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, X, ChevronDown, MessageSquarePlus, Trash2
} from 'lucide-react';
import { isPluginInstalled } from '../../utils/pluginStorage';
import { getAgentPrompt } from '../../config/agentPrompts';
import { OptionButtons, CheckboxList, PromptResultDisplay } from '../prompts/PromptHelperComponents';
import { promptStorage, localStorageBackup, modeStorage } from '../../utils/storage';
import { addContextToAPIMessages } from '../../utils/contextSummary';
import ConversationManager from './ConversationManager';
import ModelSelector from './ModelSelector';
import toast from 'react-hot-toast';

// Conversation helpers
const initializeConversations = () => {
  const existing = localStorageBackup.get('ai-companion-conversations', []);
  if (existing.length === 0) {
    const defaultConv = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date().toISOString(),
      isActive: true
    };
    localStorageBackup.set('ai-companion-conversations', [defaultConv]);
    localStorageBackup.set('ai-companion-active-conversation', defaultConv.id);
  }
};

const getActiveConversation = () => {
  const conversations = localStorageBackup.get('ai-companion-conversations', []);
  const activeId = localStorageBackup.get('ai-companion-active-conversation');
  return conversations.find(c => c.id === activeId) || conversations[0] || null;
};

const updateConversation = (id, updates) => {
  const conversations = localStorageBackup.get('ai-companion-conversations', []);
  const updated = conversations.map(c => c.id === id ? { ...c, ...updates } : c);
  localStorageBackup.set('ai-companion-conversations', updated);
};

const AI_MODES = [
  { id: 'chat', label: 'Chat', description: 'Conversational' },
  { id: 'thinking', label: 'Thinking', description: 'Deep analysis' },
  { id: 'plan', label: 'Plan', description: 'Structured plans' },
  { id: 'promptHelper', label: 'Prompt Helper', description: 'Build prompts' },
];

const ChatSidebar = ({ isVisible, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMode, setSelectedMode] = useState('chat');
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [hasMultiAgent, setHasMultiAgent] = useState(false);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showConversationManager, setShowConversationManager] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(384); // 96 * 4 = 384px (w-96)
  const [isResizing, setIsResizing] = useState(false);

  const messagesEndRef = useRef(null);
  const modeDropdownRef = useRef(null);
  const resizeRef = useRef(null);

  // Load saved model
  useEffect(() => {
    const savedModel = localStorageBackup.get('ai-companion-selected-model');
    if (savedModel) setSelectedModel(savedModel);
  }, []);

  // Save model preference
  useEffect(() => {
    localStorageBackup.set('ai-companion-selected-model', selectedModel);
  }, [selectedModel]);

  // Initialize conversations
  useEffect(() => {
    initializeConversations();
    const activeConv = getActiveConversation();
    if (activeConv) {
      setActiveConversationId(activeConv.id);
      setMessages(activeConv.messages || []);
    }
  }, []);

  // Check for Multi-Agent plugin
  useEffect(() => {
    const checkPlugin = () => {
      const installed = isPluginInstalled('multi-agent-system');
      setHasMultiAgent(installed);
      if (!installed && selectedMode !== 'chat') {
        setSelectedMode('chat');
        modeStorage.set('chat');
      }
    };
    checkPlugin();
    const handleStorageChange = (e) => {
      if (e.key === 'ai-companion-installed-plugins') checkPlugin();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [selectedMode]);

  // Load saved mode
  useEffect(() => {
    if (hasMultiAgent) {
      const savedMode = modeStorage.get();
      if (savedMode) setSelectedMode(savedMode);
    }
  }, [hasMultiAgent]);

  // Save messages
  useEffect(() => {
    if (activeConversationId && messages.length > 0) {
      updateConversation(activeConversationId, { messages });
    }
  }, [messages, activeConversationId]);

  // Save mode
  useEffect(() => {
    if (hasMultiAgent) modeStorage.set(selectedMode);
  }, [selectedMode, hasMultiAgent]);

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close mode dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modeDropdownRef.current && !modeDropdownRef.current.contains(e.target)) {
        setShowModeDropdown(false);
      }
    };
    if (showModeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showModeDropdown]);

  // Resize functionality
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      setSidebarWidth(Math.max(320, Math.min(newWidth, 800)));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing]);

  const parseMessage = (messageText) => {
    if (!messageText) return { type: 'text', text: '' };
    
    const bulletMatches = messageText.match(/•\s+[^\n]+/g);
    if (bulletMatches && bulletMatches.length >= 2) {
      const options = bulletMatches.map(m => m.replace('•', '').trim());
      const textBefore = messageText.split('•')[0].trim();
      return { type: 'options', text: textBefore, options };
    }
    
    const checkboxMatches = messageText.match(/☐\s+[^\n]+/g);
    if (checkboxMatches && checkboxMatches.length >= 2) {
      const options = checkboxMatches.map(m => m.replace('☐', '').trim());
      const textBefore = messageText.split('☐')[0].trim();
      return { type: 'checkboxes', text: textBefore, options };
    }
    
    const codeBlockMatch = messageText.match(/```\n([\s\S]+?)\n```/);
    if (codeBlockMatch && 
        (codeBlockMatch[1].includes('Build a') || codeBlockMatch[1].includes('Create a'))) {
      return { type: 'prompt', prompt: codeBlockMatch[1].trim() };
    }
    
    return { type: 'text', text: messageText };
  };

  const handleModeChange = (modeId) => {
    setSelectedMode(modeId);
    setShowModeDropdown(false);
    const mode = AI_MODES.find(m => m.id === modeId);
    toast.success(`Switched to ${mode?.label || 'Chat Mode'}`);
    
    const switchMessage = {
      id: Date.now(),
      type: 'system',
      content: `Switched to ${mode?.label || 'Chat Mode'}`,
      timestamp: new Date().toISOString(),
      mode: modeId,
    };
    setMessages(prev => [...prev, switchMessage]);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessageContent = inputValue.trim();
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: userMessageContent,
      timestamp: new Date().toISOString(),
      mode: selectedMode,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const conversationHistory = messages
        .filter(msg => msg.mode === selectedMode && msg.type !== 'system')
        .map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }));

      let apiMessages = [
        { role: 'system', content: getAgentPrompt(selectedMode) },
        ...conversationHistory,
        { role: 'user', content: userMessageContent }
      ];

      apiMessages = addContextToAPIMessages(apiMessages, messages, selectedMode);

      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: apiMessages,
          model: selectedModel
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: data.message,
        timestamp: new Date().toISOString(),
        mode: selectedMode,
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to send message. Check server connection.');
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: "Sorry, I'm having trouble connecting. Please make sure the backend server is running on port 3001.",
        timestamp: new Date().toISOString(),
        mode: selectedMode,
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    if (confirm('Clear this conversation?')) {
      const welcomeMessage = {
        id: Date.now(),
        type: 'ai',
        content: "Chat cleared! Ready for a fresh start. What's on your mind?",
        timestamp: new Date().toISOString(),
        mode: selectedMode,
      };
      setMessages([welcomeMessage]);
      toast.success('Conversation cleared');
    }
  };

  const handleNewConversation = (newConv) => {
    setActiveConversationId(newConv.id);
    setMessages(newConv.messages || []);
    setShowConversationManager(false);
  };

  const handleConversationChange = (conv) => {
    setActiveConversationId(conv.id);
    setMessages(conv.messages || []);
  };

  const currentMode = AI_MODES.find(m => m.id === selectedMode) || AI_MODES[0];

  if (!isVisible) return null;

  return (
    <>
      {/* Resize Handle */}
      <div
        ref={resizeRef}
        onMouseDown={() => setIsResizing(true)}
        className={`fixed top-0 h-full w-1 cursor-col-resize z-[60] hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors ${
          isResizing ? 'bg-neutral-400 dark:bg-neutral-600' : ''
        }`}
        style={{ right: `${sidebarWidth}px` }}
      />

      {/* Chat Sidebar */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.2 }}
        className="fixed right-0 top-0 h-screen bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800 flex flex-col z-50"
        style={{ width: `${sidebarWidth}px` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConversationManager(!showConversationManager)}
              className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              title="Conversations"
            >
              <MessageSquarePlus className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            </button>
            
            <ModelSelector 
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
            />

            {hasMultiAgent && (
              <div className="relative" ref={modeDropdownRef}>
                <button
                  onClick={() => setShowModeDropdown(!showModeDropdown)}
                  className="flex items-center gap-1.5 px-2 py-1 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                >
                  <span className="font-medium">{currentMode.label}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                <AnimatePresence>
                  {showModeDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md shadow-lg overflow-hidden z-50"
                    >
                      {AI_MODES.map((mode) => {
                        const isActive = selectedMode === mode.id;
                        return (
                          <button
                            key={mode.id}
                            onClick={() => handleModeChange(mode.id)}
                            className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                              isActive
                                ? 'bg-neutral-100 dark:bg-neutral-800'
                                : 'hover:bg-neutral-50 dark:hover:bg-neutral-800'
                            }`}
                          >
                            <div className={`font-medium ${isActive ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-700 dark:text-neutral-300'}`}>
                              {mode.label}
                            </div>
                            <div className="text-neutral-500 dark:text-neutral-400">
                              {mode.description}
                            </div>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={clearChat}
              className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            </button>
          </div>
        </div>

        {/* Conversation Manager */}
        <AnimatePresence>
          {showConversationManager && (
            <ConversationManager
              activeConversationId={activeConversationId}
              onConversationChange={handleConversationChange}
              onNewConversation={handleNewConversation}
              onClose={() => setShowConversationManager(false)}
            />
          )}
        </AnimatePresence>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {messages.map((message) => {
            if (message.type === 'system') {
              return (
                <div key={message.id} className="flex justify-center">
                  <div className="px-2 py-1 bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 text-xs rounded-md">
                    {message.content}
                  </div>
                </div>
              );
            }

            if (message.type === 'ai' && message.mode === 'promptHelper') {
              const parsed = parseMessage(message.content);
              
              if (parsed.type === 'options') {
                return (
                  <div key={message.id} className="space-y-2">
                    <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Assistant</div>
                    <div className="text-sm text-neutral-900 dark:text-neutral-100 leading-relaxed whitespace-pre-wrap">
                      {parsed.text}
                    </div>
                    <OptionButtons 
                      options={parsed.options} 
                      onSelect={(opt) => {
                        setInputValue(opt);
                        setTimeout(() => handleSend(), 50);
                      }} 
                    />
                  </div>
                );
              }
              
              if (parsed.type === 'checkboxes') {
                return (
                  <div key={message.id} className="space-y-2">
                    <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Assistant</div>
                    <div className="text-sm text-neutral-900 dark:text-neutral-100 leading-relaxed whitespace-pre-wrap">
                      {parsed.text}
                    </div>
                    <CheckboxList 
                      options={parsed.options} 
                      onConfirm={(selected) => {
                        setInputValue(`Selected: ${selected.join(', ')}`);
                        setTimeout(() => handleSend(), 50);
                      }} 
                    />
                  </div>
                );
              }
              
              if (parsed.type === 'prompt') {
                return (
                  <div key={message.id} className="space-y-2">
                    <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Assistant</div>
                    <div className="text-sm text-neutral-900 dark:text-neutral-100">Perfect! Here's your optimized prompt:</div>
                    <PromptResultDisplay 
                      prompt={parsed.prompt}
                      onSaveToLibrary={async (prompt) => {
                        try {
                          const promptData = {
                            title: 'Generated Prompt',
                            prompt: prompt,
                            mode: 'promptHelper',
                            category: 'General',
                            isFavorite: false,
                            usageCount: 0,
                            createdAt: new Date().toISOString()
                          };
                          await promptStorage.add(promptData);
                          toast.success('Saved to Prompt Library!');
                        } catch (error) {
                          console.error('Error saving prompt:', error);
                          toast.error('Failed to save prompt');
                        }
                      }}
                    />
                  </div>
                );
              }
            }

            const timestamp = new Date(message.timestamp);
            const isError = message.type === 'error';

            return (
              <div key={message.id} className="space-y-1">
                <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  {message.type === 'user' ? 'You' : 'Assistant'}
                </div>
                <div className={`text-sm leading-relaxed whitespace-pre-wrap ${
                  isError 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-neutral-900 dark:text-neutral-100'
                }`}>
                  {message.content}
                </div>
                <div className="text-xs text-neutral-400 dark:text-neutral-500">
                  {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-1"
            >
              <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Assistant</div>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-600 rounded-full typing-dot"></div>
                <div className="w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-600 rounded-full typing-dot"></div>
                <div className="w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-600 rounded-full typing-dot"></div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 p-4">
          <div className="flex items-end gap-2">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message..."
              rows="1"
              className="flex-1 bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 resize-none focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors"
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
            
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className={`p-2 rounded-md transition-colors ${
                inputValue.trim()
                  ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200'
                  : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ChatSidebar;
