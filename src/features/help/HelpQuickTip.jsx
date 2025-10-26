import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const HelpQuickTip = ({ tip }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="glass p-4 rounded-lg hover:bg-dark-600 transition-colors cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start space-x-3">
        <div className="text-2xl flex-shrink-0">{tip.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">{tip.title}</h4>
            <ChevronDown
              className={`w-4 h-4 text-neutral-600 dark:text-neutral-400 transition-transform flex-shrink-0 ml-2 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{tip.description}</p>
          
          <AnimatePresence>
            {isExpanded && tip.details && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3 pt-3 border-t border-dark-500"
              >
                <p className="text-sm text-neutral-900 dark:text-neutral-100">{tip.details}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default HelpQuickTip;


