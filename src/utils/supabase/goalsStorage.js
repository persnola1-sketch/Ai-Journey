import { supabase } from '../../config/supabase';

export const goalsStorage = {
  // Get all goals
  async getAll() {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Add new goal
  async add(goal) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const goalData = {
      user_id: user.id,
      text: goal.text,
      completed: goal.completed || false,
      priority: goal.priority || 'medium',
      deadline: goal.deadline || null,
      completed_at: goal.completedAt || null,
      created_at: goal.createdAt || new Date().toISOString()
    };

    const { data, error} = await supabase
      .from('goals')
      .insert([goalData])
      .select()
      .single();
    
    if (error) throw error;
    
    // Transform to match frontend format
    return {
      id: data.id,
      text: data.text,
      completed: data.completed,
      priority: data.priority,
      deadline: data.deadline,
      completedAt: data.completed_at,
      createdAt: data.created_at
    };
  },

  // Update goal
  async update(id, updates) {
    const updateData = {};
    if (updates.text !== undefined) updateData.text = updates.text;
    if (updates.completed !== undefined) updateData.completed = updates.completed;
    if (updates.priority !== undefined) updateData.priority = updates.priority;
    if (updates.deadline !== undefined) updateData.deadline = updates.deadline;
    if (updates.completedAt !== undefined) updateData.completed_at = updates.completedAt;

    const { data, error } = await supabase
      .from('goals')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      text: data.text,
      completed: data.completed,
      priority: data.priority,
      deadline: data.deadline,
      completedAt: data.completed_at,
      createdAt: data.created_at
    };
  },

  // Delete goal
  async delete(id) {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Toggle goal completion
  async toggle(id) {
    // First get the current state
    const { data: currentGoal, error: fetchError } = await supabase
      .from('goals')
      .select('completed')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    
    const newCompleted = !currentGoal.completed;
    const completedAt = newCompleted ? new Date().toISOString() : null;
    
    const { data, error } = await supabase
      .from('goals')
      .update({ 
        completed: newCompleted,
        completed_at: completedAt
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      text: data.text,
      completed: data.completed,
      priority: data.priority,
      deadline: data.deadline,
      completedAt: data.completed_at,
      createdAt: data.created_at
    };
  }
};

