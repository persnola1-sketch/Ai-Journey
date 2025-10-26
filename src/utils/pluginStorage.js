// Plugin storage utilities (Supabase-powered)
import { preferencesStorage } from './supabase/preferencesStorage';

// For synchronous backwards compatibility (used in Navigation.jsx)
// We cache the installed plugins list
let installedPluginsCache = [];

// Initialize cache on load
const initCache = async () => {
  try {
    installedPluginsCache = await preferencesStorage.getInstalledPlugins();
  } catch (error) {
    console.error('Error initializing plugin cache:', error);
    installedPluginsCache = [];
  }
};
initCache();

// Get installed plugin IDs (async)
export const getInstalledPlugins = async () => {
  try {
    const installed = await preferencesStorage.getInstalledPlugins();
    installedPluginsCache = installed; // Update cache
    return installed;
  } catch (error) {
    console.error('Error reading installed plugins:', error);
    return [];
  }
};

// Check if plugin is installed (synchronous - uses cache)
export const isPluginInstalled = (pluginId) => {
  return installedPluginsCache.includes(pluginId);
};

// Install a plugin (async)
export const installPlugin = async (pluginId) => {
  try {
    const installed = await preferencesStorage.installPlugin(pluginId);
    installedPluginsCache = installed; // Update cache
    // Trigger storage event for other tabs
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'ai-companion-plugins-updated',
      newValue: Date.now().toString()
    }));
    return true;
  } catch (error) {
    console.error('Error installing plugin:', error);
    return false;
  }
};

// Uninstall a plugin (async)
export const uninstallPlugin = async (pluginId) => {
  try {
    const installed = await preferencesStorage.uninstallPlugin(pluginId);
    installedPluginsCache = installed; // Update cache
    
    // Clear plugin settings
    try {
      const prefs = await preferencesStorage.get();
      const settings = { ...(prefs.pluginSettings || {}) };
      delete settings[pluginId];
      await preferencesStorage.update({ pluginSettings: settings });
    } catch (err) {
      console.error('Error clearing plugin settings:', err);
    }
    
    // Trigger storage event for other tabs
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'ai-companion-plugins-updated',
      newValue: Date.now().toString()
    }));
    
    return true;
  } catch (error) {
    console.error('Error uninstalling plugin:', error);
    return false;
  }
};

// Get plugin settings (async)
export const getPluginSettings = async (pluginId) => {
  try {
    return await preferencesStorage.getPluginSettings(pluginId);
  } catch (error) {
    console.error('Error reading plugin settings:', error);
    return null;
  }
};

// Save plugin settings (async)
export const savePluginSettings = async (pluginId, settings) => {
  try {
    await preferencesStorage.setPluginSettings(pluginId, settings);
    return true;
  } catch (error) {
    console.error('Error saving plugin settings:', error);
    return false;
  }
};

// Refresh cache (call this when needed)
export const refreshPluginCache = async () => {
  await initCache();
  return installedPluginsCache;
};

