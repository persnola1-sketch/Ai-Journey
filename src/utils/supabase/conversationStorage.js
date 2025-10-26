import { supabase } from '../../config/supabase';

export const conversationStorage = {
  // Get all conversations
  async getAll() {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(conv => ({
      id: conv.id,
      title: conv.title,
      mode: conv.mode,
      isActive: conv.is_active,
      createdAt: conv.created_at,
      updatedAt: conv.updated_at
    }));
  },

  // Get active conversation
  async getActive() {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('is_active', true)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // No active conversation
      throw error;
    }
    
    return data ? {
      id: data.id,
      title: data.title,
      mode: data.mode,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    } : null;
  },

  // Create new conversation
  async create(conversation) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Deactivate all other conversations first
    await supabase
      .from('conversations')
      .update({ is_active: false })
      .eq('user_id', user.id)
      .eq('is_active', true);

    const conversationData = {
      user_id: user.id,
      title: conversation.title,
      mode: conversation.mode || 'chat',
      is_active: conversation.isActive !== undefined ? conversation.isActive : true,
      created_at: conversation.createdAt || new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('conversations')
      .insert([conversationData])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      mode: data.mode,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  // Update conversation
  async update(id, updates) {
    const updateData = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.mode !== undefined) updateData.mode = updates.mode;
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

    const { data, error } = await supabase
      .from('conversations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      mode: data.mode,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  // Set active conversation
  async setActive(id) {
    // Deactivate all conversations
    await supabase
      .from('conversations')
      .update({ is_active: false })
      .eq('is_active', true);

    // Activate the selected one
    const { data, error } = await supabase
      .from('conversations')
      .update({ is_active: true })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      mode: data.mode,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  // Delete conversation
  async delete(id) {
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

