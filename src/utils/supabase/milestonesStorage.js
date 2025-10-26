import { supabase } from '../../config/supabase';

export const milestonesStorage = {
  // Get all milestones
  async getAll() {
    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Add new milestone
  async add(milestone) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const milestoneData = {
      user_id: user.id,
      title: milestone.title,
      description: milestone.description || '',
      category: milestone.category,
      date: milestone.date,
      created_at: milestone.createdAt || new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('milestones')
      .insert([milestoneData])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      date: data.date,
      createdAt: data.created_at
    };
  },

  // Update milestone
  async update(id, updates) {
    const updateData = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.date !== undefined) updateData.date = updates.date;

    const { data, error } = await supabase
      .from('milestones')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      date: data.date,
      createdAt: data.created_at
    };
  },

  // Delete milestone
  async delete(id) {
    const { error } = await supabase
      .from('milestones')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Get by category
  async getByCategory(category) {
    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .eq('category', category)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get by date range
  async getByDateRange(startDate, endDate) {
    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
};

