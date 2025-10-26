import { supabase } from '../../config/supabase';

export const messagesStorage = {
  // Get all messages for a conversation
  async getByConversation(conversationId) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    return (data || []).map(msg => ({
      id: msg.id,
      conversationId: msg.conversation_id,
      role: msg.role,
      content: msg.content,
      timestamp: msg.created_at
    }));
  },

  // Get all messages (for backward compatibility)
  async getAll() {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    return (data || []).map(msg => ({
      id: msg.id,
      conversationId: msg.conversation_id,
      role: msg.role,
      content: msg.content,
      timestamp: msg.created_at
    }));
  },

  // Add new message
  async add(message) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const messageData = {
      user_id: user.id,
      conversation_id: message.conversationId || 'default',
      role: message.role || message.type, // Support both 'role' and 'type'
      content: message.content,
      created_at: message.timestamp || new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('chat_messages')
      .insert([messageData])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      conversationId: data.conversation_id,
      role: data.role,
      type: data.role, // For backward compatibility
      content: data.content,
      timestamp: data.created_at
    };
  },

  // Delete message
  async delete(id) {
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Delete all messages in a conversation
  async deleteByConversation(conversationId) {
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('conversation_id', conversationId);
    
    if (error) throw error;
    return true;
  },

  // Clear all messages
  async clear() {
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (error) throw error;
    return true;
  },

  // Save multiple messages
  async saveAll(messages) {
    // For bulk operations, we'll just ensure they're saved
    // This is mainly for migration purposes
    const messageData = messages.map(msg => ({
      conversation_id: msg.conversationId || 'default',
      role: msg.role || msg.type,
      content: msg.content,
      created_at: msg.timestamp || new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('chat_messages')
      .insert(messageData)
      .select();
    
    if (error) throw error;
    return data;
  }
};

