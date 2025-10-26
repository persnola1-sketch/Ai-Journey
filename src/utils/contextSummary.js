/**
 * Context Summary Utility
 * Generates summaries of conversations from other agents for cross-agent context awareness
 */

/**
 * Get recent messages from agents different from the current one
 * @param {Array} messages - All messages
 * @param {string} currentAgent - Current agent mode
 * @param {number} count - Number of recent exchanges to include
 * @returns {Array} Recent messages from other agents
 */
export const getRecentOtherAgentMessages = (messages, currentAgent, count = 3) => {
  if (!messages || messages.length === 0) return [];
  
  // Get messages from other agents (user + AI pairs)
  const otherAgentMessages = messages.filter(msg => 
    msg.mode && msg.mode !== currentAgent
  );
  
  // Get last N messages
  return otherAgentMessages.slice(-count * 2); // *2 to get user+AI pairs
};

/**
 * Generate a summary of recent conversations from other agents
 * @param {Array} messages - All messages
 * @param {string} currentAgent - Current agent mode
 * @returns {string|null} Summary text or null if no context
 */
export const generateContextSummary = (messages, currentAgent) => {
  const recentOtherMessages = getRecentOtherAgentMessages(messages, currentAgent, 2);
  
  if (recentOtherMessages.length === 0) return null;
  
  // Group messages by agent
  const messagesByAgent = {};
  recentOtherMessages.forEach(msg => {
    if (!messagesByAgent[msg.mode]) {
      messagesByAgent[msg.mode] = [];
    }
    messagesByAgent[msg.mode].push(msg);
  });
  
  // Build summary
  const agentNames = {
    chat: 'Chat',
    thinking: 'Thinking Agent',
    plan: 'Plan Agent',
    promptHelper: 'Prompt Helper'
  };
  
  const summaries = Object.entries(messagesByAgent).map(([mode, msgs]) => {
    const agentName = agentNames[mode] || mode;
    
    // Get last user message and AI response
    const userMsgs = msgs.filter(m => m.type === 'user');
    const aiMsgs = msgs.filter(m => m.type === 'ai');
    
    if (userMsgs.length === 0) return null;
    
    const lastUser = userMsgs[userMsgs.length - 1];
    const lastAI = aiMsgs[aiMsgs.length - 1];
    
    // Truncate to first 150 chars
    const userPreview = lastUser.content.slice(0, 150);
    const aiPreview = lastAI ? lastAI.content.slice(0, 150) : '';
    
    return `[${agentName}] User asked: "${userPreview}${lastUser.content.length > 150 ? '...' : ''}"${
      aiPreview ? ` | Response: "${aiPreview}${lastAI.content.length > 150 ? '...' : ''}"` : ''
    }`;
  }).filter(Boolean);
  
  if (summaries.length === 0) return null;
  
  return `Previous context from other agents:\n${summaries.join('\n\n')}`;
};

/**
 * Add context to API messages array
 * @param {Array} apiMessages - Messages to send to API
 * @param {Array} allMessages - All stored messages
 * @param {string} currentAgent - Current agent mode
 * @returns {Array} API messages with context prepended
 */
export const addContextToAPIMessages = (apiMessages, allMessages, currentAgent) => {
  const contextSummary = generateContextSummary(allMessages, currentAgent);
  
  if (!contextSummary) return apiMessages;
  
  // Find the system message (should be first)
  const systemMessageIndex = apiMessages.findIndex(m => m.role === 'system');
  
  if (systemMessageIndex !== -1) {
    // Append context to system message
    const updatedSystemMessage = {
      ...apiMessages[systemMessageIndex],
      content: `${apiMessages[systemMessageIndex].content}\n\n---\n\n${contextSummary}\n\nNote: This is context from previous conversations with other agents. Use it to provide continuity in your responses.`
    };
    
    return [
      updatedSystemMessage,
      ...apiMessages.slice(1)
    ];
  }
  
  // If no system message, add context as first user message
  return [
    { role: 'system', content: contextSummary },
    ...apiMessages
  ];
};

