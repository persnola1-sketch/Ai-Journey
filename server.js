import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit for receipt images
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, 'dist')));

// Check for API key
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error('\n❌ ERROR: OpenAI API key is missing!\n');
  console.error('📝 Please follow these steps:\n');
  console.error('1. Open the .env file in: G:\\cursor\\Mia OS\\ai-journey-companion\\.env');
  console.error('2. Add this line (replace with your actual key):');
  console.error('   OPENAI_API_KEY=sk-your-actual-api-key-here\n');
  console.error('3. Get your API key from: https://platform.openai.com/api-keys\n');
  console.error('OR run: node setup-env.js (for interactive setup)\n');
  process.exit(1);
}

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: apiKey,
});

// System prompt for the AI Journey Companion
const SYSTEM_PROMPT = `You are a supportive and insightful AI Journey Companion. Your role is to help users with:
- Personal growth and self-reflection
- Goal setting and achievement
- Daily check-ins and emotional support
- Mindfulness and productivity tips
- Celebrating wins and learning from challenges

Be warm, encouraging, empathetic, and ask thoughtful questions to help users reflect deeply. Keep responses concise but meaningful. Use emojis occasionally to make conversations feel friendly and engaging.`;

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Validate model
    const allowedModels = ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'];
    const selectedModel = allowedModels.includes(model) ? model : 'gpt-4o-mini';

    // Add system prompt if not already present
    const apiMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ];

    console.log(`Sending request to OpenAI using model: ${selectedModel}...`);

    const completion = await openai.chat.completions.create({
      model: selectedModel,
      messages: apiMessages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0].message.content;
    console.log('Received response from OpenAI');

    res.json({
      message: aiResponse,
      usage: completion.usage,
    });

  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({ 
        error: 'Invalid OpenAI API key. Please check your .env file.' 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to get AI response. Please try again.',
      details: error.message 
    });
  }
});

// Receipt scanning endpoint
app.post('/api/scan-receipt', async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Validate base64 image format
    if (!image.startsWith('data:image')) {
      return res.status(400).json({ error: 'Invalid image format. Must be base64 encoded.' });
    }

    console.log('Scanning receipt with OpenAI Vision...');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{
        role: 'user',
        content: [
          { 
            type: 'text', 
            text: `Analyze this receipt image and extract the following information in JSON format:
{
  "store": "store name",
  "date": "YYYY-MM-DD format",
  "amount": number (total amount),
  "category": "one of: groceries, travel, subscriptions, entertainment, housing, transportation, health, other",
  "items": [{"name": "item name", "price": number}],
  "confidence": "high, medium, or low"
}

If you cannot extract certain fields, use null. Suggest the most appropriate category based on the store and items.`
          },
          { 
            type: 'image_url', 
            image_url: { url: image } 
          }
        ]
      }],
      max_tokens: 800,
      temperature: 0.2, // Lower temperature for more consistent extraction
    });

    const aiResponse = response.choices[0].message.content;
    console.log('Raw AI response:', aiResponse);

    // Parse the JSON response
    let extractedData;
    try {
      // Try to extract JSON from code blocks if present
      const jsonMatch = aiResponse.match(/```(?:json)?\n?([\s\S]*?)\n?```/) || [null, aiResponse];
      extractedData = JSON.parse(jsonMatch[1].trim());
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return res.status(500).json({ 
        error: 'Failed to parse receipt data',
        details: 'AI response was not valid JSON'
      });
    }

    // Validate and sanitize extracted data
    const sanitizedData = {
      store: extractedData.store || 'Unknown Store',
      date: extractedData.date || new Date().toISOString().split('T')[0],
      amount: parseFloat(extractedData.amount) || 0,
      category: extractedData.category || 'other',
      items: Array.isArray(extractedData.items) ? extractedData.items : [],
      confidence: extractedData.confidence || 'medium'
    };

    console.log('Extracted receipt data:', sanitizedData);

    res.json({
      success: true,
      data: sanitizedData,
      usage: response.usage
    });

  } catch (error) {
    console.error('Receipt scanning error:', error.message);
    
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({ 
        error: 'Invalid OpenAI API key. Please check your .env file.' 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to scan receipt. Please try again.',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'AI Journey Companion Backend is running!',
    hasApiKey: !!process.env.OPENAI_API_KEY 
  });
});

// Catch-all fallback - serve React app for all non-API routes
// This must be the LAST route handler
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 AI Journey Companion Backend is running!`);
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`🔑 OpenAI API Key: ${process.env.OPENAI_API_KEY ? '✅ Loaded' : '❌ Missing'}`);
  console.log(`\n✨ Ready to chat!\n`);
});

