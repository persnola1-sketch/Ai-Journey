import { supabase } from '../../config/supabase';

export const promptStorage = {
  // Get all prompts
  async getAll() {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(prompt => ({
      id: prompt.id,
      title: prompt.title,
      prompt: prompt.prompt,
      mode: prompt.mode,
      category: prompt.category,
      isFavorite: prompt.is_favorite,
      usageCount: prompt.usage_count,
      createdAt: prompt.created_at,
      updatedAt: prompt.updated_at
    }));
  },

  // Get by mode
  async getByMode(mode) {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('mode', mode)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(prompt => ({
      id: prompt.id,
      title: prompt.title,
      prompt: prompt.prompt,
      mode: prompt.mode,
      category: prompt.category,
      isFavorite: prompt.is_favorite,
      usageCount: prompt.usage_count,
      createdAt: prompt.created_at,
      updatedAt: prompt.updated_at
    }));
  },

  // Get favorites
  async getFavorites() {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('is_favorite', true)
      .order('usage_count', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(prompt => ({
      id: prompt.id,
      title: prompt.title,
      prompt: prompt.prompt,
      mode: prompt.mode,
      category: prompt.category,
      isFavorite: prompt.is_favorite,
      usageCount: prompt.usage_count,
      createdAt: prompt.created_at,
      updatedAt: prompt.updated_at
    }));
  },

  // Add new prompt
  async add(prompt) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const promptData = {
      user_id: user.id,
      title: prompt.title,
      prompt: prompt.prompt,
      mode: prompt.mode,
      category: prompt.category || null,
      is_favorite: prompt.isFavorite || false,
      usage_count: prompt.usageCount || 0,
      created_at: prompt.createdAt || new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('prompts')
      .insert([promptData])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      prompt: data.prompt,
      mode: data.mode,
      category: data.category,
      isFavorite: data.is_favorite,
      usageCount: data.usage_count,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  // Update prompt
  async update(id, updates) {
    const updateData = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.prompt !== undefined) updateData.prompt = updates.prompt;
    if (updates.mode !== undefined) updateData.mode = updates.mode;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.isFavorite !== undefined) updateData.is_favorite = updates.isFavorite;
    if (updates.usageCount !== undefined) updateData.usage_count = updates.usageCount;

    const { data, error } = await supabase
      .from('prompts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      prompt: data.prompt,
      mode: data.mode,
      category: data.category,
      isFavorite: data.is_favorite,
      usageCount: data.usage_count,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  // Toggle favorite
  async toggleFavorite(id) {
    const { data: current, error: fetchError } = await supabase
      .from('prompts')
      .select('is_favorite')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    
    const { data, error } = await supabase
      .from('prompts')
      .update({ is_favorite: !current.is_favorite })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      prompt: data.prompt,
      mode: data.mode,
      category: data.category,
      isFavorite: data.is_favorite,
      usageCount: data.usage_count,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  // Increment usage count
  async incrementUsage(id) {
    const { data: current, error: fetchError } = await supabase
      .from('prompts')
      .select('usage_count')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    
    const { error } = await supabase
      .from('prompts')
      .update({ usage_count: (current.usage_count || 0) + 1 })
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Delete prompt
  async delete(id) {
    const { error } = await supabase
      .from('prompts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Save all prompts (for migration)
  async saveAll(prompts) {
    const promptData = prompts.map(p => ({
      title: p.title,
      prompt: p.prompt,
      mode: p.mode,
      category: p.category || null,
      is_favorite: p.isFavorite || false,
      usage_count: p.usageCount || 0,
      created_at: p.createdAt || new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('prompts')
      .insert(promptData)
      .select();
    
    if (error) throw error;
    return data;
  }
};

