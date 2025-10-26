import { motion } from 'framer-motion';
import { Sparkles, Lightbulb, Zap, RefreshCw } from 'lucide-react';
import { useState } from 'react';

const samplePrompts = [
  "What's one thing I'm grateful for today?",
  "What challenge did I overcome recently?",
  "What skill do I want to develop?",
  "How can I be more present today?",
];

const PromptsView = () => {
  const [currentPrompt, setCurrentPrompt] = useState(samplePrompts[0]);

  const handleGeneratePrompt = () => {
    const randomPrompt = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];
    setCurrentPrompt(randomPrompt);
  };

  const handleUsePrompt = () => {
    alert(`This will open the chat with: "${currentPrompt}"\n\nFeature coming soon!`);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">
            Prompt Helper
          </h1>
          <p className="text-text-secondary text-lg">
            Get AI-powered conversation starters and reflection prompts
          </p>
        </motion.div>

        {/* Prompt Generator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-subtle p-8 mb-6"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Today's Prompt</h2>
            <p className="text-xl text-text-secondary italic mb-6">
              "{currentPrompt}"
            </p>
            
            <div className="flex items-center justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGeneratePrompt}
                className="flex items-center space-x-2 px-6 py-3 bg-dark-600 hover:bg-dark-500 text-text-primary rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Generate New</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUsePrompt}
                className="btn-primary cursor-pointer"
              >
                Use This Prompt
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-subtle p-12 text-center"
        >
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">More Features Coming Soon</h2>
            <p className="text-text-secondary mb-8">
              Never run out of things to talk about. Get personalized prompts for reflection, growth, and meaningful conversations.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.05, brightness: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="card-subtle p-6 cursor-pointer"
              >
                <Lightbulb className="w-8 h-8 text-gx-cyan mb-3 mx-auto" />
                <h3 className="font-semibold text-text-primary mb-2">Smart Suggestions</h3>
                <p className="text-sm text-text-secondary">Context-aware prompts</p>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, brightness: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="card-subtle p-6 cursor-pointer"
              >
                <Zap className="w-4 h-8 text-discord-purple mb-3 mx-auto" />
                <h3 className="font-semibold text-text-primary mb-2">Daily Inspiration</h3>
                <p className="text-sm text-text-secondary">Fresh topics every day</p>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PromptsView;

