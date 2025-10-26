import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Clock, X } from 'lucide-react';
import { localStorageBackup } from '../../utils/storage';
import toast from 'react-hot-toast';

const getAllConversations = () => {
  const conversations = localStorageBackup.get('ai-companion-conversations', []);
  return conversations.map((conversation) => ({
    ...conversation,
    lastActive: conversation.lastActive || conversation.createdAt,
    messageCount: conversation.messages?.length || 0,
  }));
};

const createConversation = (title = 'New Conversation') => {
  const newConversation = {
    id: Date.now().toString(),
    title,
    messages: [],
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    isActive: false,
  };

  const conversations = localStorageBackup.get('ai-companion-conversations', []);
  localStorageBackup.set('ai-companion-conversations', [...conversations, newConversation]);
  return newConversation;
};

const switchConversation = (id) => {
  const conversations = localStorageBackup.get('ai-companion-conversations', []);
  const updated = conversations.map((conversation) => ({
    ...conversation,
    isActive: conversation.id === id,
    lastActive: conversation.id === id ? new Date().toISOString() : conversation.lastActive,
  }));

  localStorageBackup.set('ai-companion-conversations', updated);
  localStorageBackup.set('ai-companion-active-conversation', id);
  return updated.find((conversation) => conversation.id === id);
};

const deleteConversation = (id) => {
  const conversations = localStorageBackup.get('ai-companion-conversations', []);
  const filtered = conversations.filter((conversation) => conversation.id !== id);
  localStorageBackup.set('ai-companion-conversations', filtered);

  const activeId = localStorageBackup.get('ai-companion-active-conversation');
  if (activeId === id && filtered.length > 0) {
    switchConversation(filtered[0].id);
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;

  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(diff / 86400000);
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
};

const ConversationManager = ({
  activeConversationId,
  onConversationChange,
  onNewConversation,
  onClose,
}) => {
  const [conversations, setConversations] = useState(getAllConversations());

  const refreshConversations = () => {
    setConversations(getAllConversations());
  };

  const handleNewConversation = () => {
    const conversation = createConversation();
    refreshConversations();
    onNewConversation(conversation);
    toast.success('New conversation created');
  };

  const handleSwitchConversation = (id) => {
    const conversation = switchConversation(id);
    if (conversation) {
      onConversationChange(conversation);
      onClose?.();
      toast.success(`Switched to ${conversation.title}`);
    }
    refreshConversations();
  };

  const handleDeleteConversation = (id) => {
    if (conversations.length <= 1) {
      toast.error('Cannot delete the last conversation');
      return;
    }

    if (confirm('Delete this conversation?')) {
      deleteConversation(id);
      refreshConversations();

      if (id === activeConversationId) {
        const remaining = getAllConversations();
        if (remaining.length > 0) {
          onConversationChange(remaining[0]);
        }
      }

      toast.success('Conversation deleted');
    }
  };

  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ type: 'tween', duration: 0.2 }}
      className="absolute top-0 left-0 w-64 h-full bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 flex flex-col z-10"
    >
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-500">
            Conversations
          </p>
          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">
            {conversations.length} total
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleNewConversation}
            className="flex items-center gap-1 rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-900 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            New
          </button>

          <button
            onClick={onClose}
            className="rounded-md p-1 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {conversations.length === 0 ? (
          <div className="px-4 py-8 text-sm text-neutral-500 dark:text-neutral-500">
            No conversations yet
          </div>
        ) : (
          <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {conversations.map((conversation) => {
              const isActive = conversation.id === activeConversationId;

              return (
                <li key={conversation.id}>
                  <button
                    onClick={() => handleSwitchConversation(conversation.id)}
                    className={`flex w-full items-start justify-between gap-2 px-4 py-3 text-left transition-colors ${
                      isActive
                        ? 'bg-neutral-100/80 dark:bg-neutral-900'
                        : 'hover:bg-neutral-50 dark:hover:bg-neutral-900/60'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p
                        className={`truncate text-sm font-medium ${
                          isActive
                            ? 'text-neutral-900 dark:text-neutral-100'
                            : 'text-neutral-700 dark:text-neutral-200'
                        }`}
                      >
                        {conversation.title}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(conversation.lastActive)}
                        </span>
                        <span>{conversation.messageCount} messages</span>
                      </div>
                    </div>

                    {conversations.length > 1 && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteConversation(conversation.id);
                        }}
                        className="rounded-md p-1 text-neutral-400 hover:text-red-500 transition-colors"
                        title="Delete conversation"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </motion.div>
  );
};

export default ConversationManager;
