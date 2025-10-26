import { supabase } from '../../config/supabase';

export const preferencesStorage = {
  // Get user preferences
  async get() {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Return defaults when not authenticated (graceful fallback)
    if (!user) {
      return {
        theme: 'dark',
        installedPlugins: [],
        pluginSettings: {},
        preferences: {}
      };
    }

    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No preferences yet, create default
        return await preferencesStorage.create();
      }
      throw error;
    }
    
    return {
      id: data.id,
      theme: data.theme,
      installedPlugins: data.installed_plugins || [],
      pluginSettings: data.plugin_settings || {},
      preferences: data.preferences || {},
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  // Create default preferences
  async create() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const defaultPrefs = {
      user_id: user.id,
      theme: 'dark',
      installed_plugins: [],
      plugin_settings: {},
      preferences: {}
    };

    const { data, error } = await supabase
      .from('user_preferences')
      .insert([defaultPrefs])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      theme: data.theme,
      installedPlugins: data.installed_plugins,
      pluginSettings: data.plugin_settings,
      preferences: data.preferences,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  // Update preferences
  async update(updates) {
    // Get current preferences
    let current = await preferencesStorage.get();
    
    const updateData = {};
    if (updates.theme !== undefined) updateData.theme = updates.theme;
    if (updates.installedPlugins !== undefined) updateData.installed_plugins = updates.installedPlugins;
    if (updates.pluginSettings !== undefined) updateData.plugin_settings = updates.pluginSettings;
    if (updates.preferences !== undefined) updateData.preferences = updates.preferences;

    const { data, error } = await supabase
      .from('user_preferences')
      .update(updateData)
      .eq('id', current.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      theme: data.theme,
      installedPlugins: data.installed_plugins,
      pluginSettings: data.plugin_settings,
      preferences: data.preferences,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  // Plugin-specific methods
  async getInstalledPlugins() {
    const prefs = await preferencesStorage.get();
    return prefs.installedPlugins || [];
  },

  async installPlugin(pluginId) {
    const prefs = await preferencesStorage.get();
    const installed = prefs.installedPlugins || [];
    
    if (!installed.includes(pluginId)) {
      installed.push(pluginId);
      await preferencesStorage.update({ installedPlugins: installed });
    }
    
    return installed;
  },

  async uninstallPlugin(pluginId) {
    const prefs = await preferencesStorage.get();
    const installed = (prefs.installedPlugins || []).filter(id => id !== pluginId);
    
    await preferencesStorage.update({ installedPlugins: installed });
    return installed;
  },

  async getPluginSettings(pluginId) {
    const prefs = await preferencesStorage.get();
    return prefs.pluginSettings?.[pluginId] || null;
  },

  async setPluginSettings(pluginId, settings) {
    const prefs = await preferencesStorage.get();
    const pluginSettings = { ...(prefs.pluginSettings || {}), [pluginId]: settings };
    
    await preferencesStorage.update({ pluginSettings });
    return settings;
  }
};

