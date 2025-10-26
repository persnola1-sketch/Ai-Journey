// ============================================
// SUPABASE-POWERED STORAGE
// ============================================
// This file now exports Supabase storage modules
// localStorage versions kept for migration purposes

// Import Supabase storage modules
import { goalsStorage as goalsSupabase } from './supabase/goalsStorage';
import { milestonesStorage as milestonesSupabase } from './supabase/milestonesStorage';
import { messagesStorage as messagesSupabase } from './supabase/messagesStorage';
import { conversationStorage } from './supabase/conversationStorage';
import { promptStorage } from './supabase/promptStorage';
import { preferencesStorage } from './supabase/preferencesStorage';

// Export Supabase versions as main storage
export const goalsStorage = goalsSupabase;
export const milestonesStorage = milestonesSupabase;
export const messagesStorage = messagesSupabase;
export { conversationStorage, promptStorage, preferencesStorage };

// ============================================
// LOCALSTORAGE HELPERS (For migration)
// ============================================

const STORAGE_KEYS = {
  MESSAGES: 'ai-companion-messages',
  GOALS: 'ai-companion-goals',
  MILESTONES: 'ai-companion-milestones',
  SUMMARIES: 'ai-companion-summaries',
  MODE: 'ai-companion-mode',
  PROFILE: 'ai-companion-profile',
};

// Generic localStorage functions (kept for migration)
export const localStorageBackup = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
      return false;
    }
  },

  clearAll: () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },
};

// Mode preference (keep in localStorage for now)
export const modeStorage = {
  get: () => localStorageBackup.get(STORAGE_KEYS.MODE, 'chat'),
  set: (mode) => localStorageBackup.set(STORAGE_KEYS.MODE, mode),
};

// Summaries storage (keep in localStorage for now)
export const summariesStorage = {
  getAll: () => localStorageBackup.get(STORAGE_KEYS.SUMMARIES, []),
  save: (summaries) => localStorageBackup.set(STORAGE_KEYS.SUMMARIES, summaries),
  add: (summary) => {
    const summaries = summariesStorage.getAll();
    summaries.push(summary);
    return summariesStorage.save(summaries);
  },
  getRecent: (count = 3) => {
    const summaries = summariesStorage.getAll();
    return summaries.slice(-count);
  },
};

export { STORAGE_KEYS };

