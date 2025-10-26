import { supabase } from '../config/supabase';

// Category definitions
export const CATEGORIES = [
  { id: 'groceries', label: 'Groceries', emoji: '🛒', color: 'green' },
  { id: 'travel', label: 'Travel', emoji: '✈️', color: 'blue' },
  { id: 'subscriptions', label: 'Subscriptions', emoji: '📱', color: 'purple' },
  { id: 'entertainment', label: 'Entertainment', emoji: '🎉', color: 'pink' },
  { id: 'housing', label: 'Housing', emoji: '🏠', color: 'orange' },
  { id: 'transportation', label: 'Transportation', emoji: '🚗', color: 'cyan' },
  { id: 'health', label: 'Health', emoji: '🏥', color: 'red' },
  { id: 'other', label: 'Other', emoji: '💳', color: 'gray' }
];

export const expenseStorage = {
  // Get all expenses
  async getAll() {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Add new expense
  async add(expense) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const expenseData = {
      ...expense,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('expenses')
      .insert([expenseData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update expense
  async update(id, expense) {
    const { data, error } = await supabase
      .from('expenses')
      .update(expense)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete expense
  async delete(id) {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Get expenses by month
  async getByMonth(year, month) {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`;
    
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get expenses by category
  async getByCategory(category) {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('category', category)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

