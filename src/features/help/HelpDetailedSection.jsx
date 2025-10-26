import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle2 } from 'lucide-react';

const HelpDetailedSection = ({ title, guide }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderGuideContent = () => {
    if (typeof guide === 'string') {
      return <p className="text-neutral-900 dark:text-neutral-100">{guide}</p>;
    }

    return (
      <div className="space-y-4">
        {guide.content && (
          <p className="text-neutral-900 dark:text-neutral-100">{guide.content}</p>
        )}

        {guide.steps && (
          <div className="space-y-2">
            {guide.steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-100 dark:bg-accent-900 text-accent-600 dark:text-accent-400 text-sm font-semibold flex items-center justify-center">
                  {index + 1}
                </span>
                <p className="text-neutral-900 dark:text-neutral-100 flex-1">{step}</p>
              </div>
            ))}
          </div>
        )}

        {guide.tips && (
          <div className="space-y-2">
            {guide.tips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-accent-600 dark:text-accent-400 flex-shrink-0 mt-0.5" />
                <p className="text-neutral-900 dark:text-neutral-100 text-sm flex-1">{tip}</p>
              </div>
            ))}
          </div>
        )}

        {guide.modes && (
          <div className="space-y-3">
            {guide.modes.map((mode, index) => (
              <div key={index} className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl">{mode.icon}</span>
                  <h5 className="font-semibold text-neutral-900 dark:text-neutral-100">{mode.name}</h5>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{mode.description}</p>
                {mode.bestFor && (
                  <div className="mt-2">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Best for:</p>
                    <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                      {mode.bestFor.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {mode.behavior && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 italic">{mode.behavior}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {guide.commands && (
          <div className="space-y-2">
            {guide.commands.map((cmd, index) => (
              <div key={index} className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-3 rounded-lg">
                <code className="text-accent-600 dark:text-accent-400 font-mono text-sm">{cmd.command}</code>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{cmd.description}</p>
                {cmd.example && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                    Example: <code className="text-accent-600 dark:text-accent-400">{cmd.example}</code>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {guide.actions && (
          <div className="space-y-2">
            {guide.actions.map((action, index) => (
              <div key={index} className="border-l-2 border-discord-purple pl-3">
                <h5 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">{action.action}</h5>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{action.description}</p>
              </div>
            ))}
          </div>
        )}

        {guide.filters && (
          <div className="space-y-2">
            {guide.filters.map((filter, index) => (
              <div key={index} className="flex items-start space-x-3">
                <span className="text-accent-600 dark:text-accent-400 font-semibold text-sm">{filter.name}:</span>
                <span className="text-neutral-600 dark:text-neutral-400 text-sm">{filter.description}</span>
              </div>
            ))}
          </div>
        )}

        {guide.sortOptions && (
          <div className="space-y-2">
            {guide.sortOptions.map((option, index) => (
              <div key={index} className="flex items-start space-x-3">
                <span className="text-accent-600 dark:text-accent-400 font-semibold text-sm">{option.name}:</span>
                <span className="text-neutral-600 dark:text-neutral-400 text-sm">{option.description}</span>
              </div>
            ))}
          </div>
        )}

        {guide.categories && (
          <div className="space-y-2">
            {guide.categories.map((cat, index) => (
              <div key={index} className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">{cat.name}</h5>
                  {cat.color && (
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">{cat.color}</span>
                  )}
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{cat.description}</p>
                {cat.examples && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">e.g., {cat.examples}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {guide.benefits && (
          <ul className="space-y-2">
            {guide.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-accent-600 dark:text-accent-400">✓</span>
                <span className="text-neutral-900 dark:text-neutral-100 text-sm">{benefit}</span>
              </li>
            ))}
          </ul>
        )}

        {guide.features && (
          <ul className="space-y-1">
            {guide.features.map((feature, index) => (
              <li key={index} className="text-neutral-600 dark:text-neutral-400 text-sm">
                • {feature}
              </li>
            ))}
          </ul>
        )}

        {guide.taskTypes && (
          <div className="space-y-3">
            {guide.taskTypes.map((task, index) => (
              <div key={index} className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-3 rounded-lg">
                <h5 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm mb-1">{task.type}</h5>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">{task.description}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Questions: {task.questions}</p>
              </div>
            ))}
          </div>
        )}

        {guide.process && (
          <ol className="space-y-2">
            {guide.process.map((step, index) => (
              <li key={index} className="text-neutral-900 dark:text-neutral-100 text-sm">
                {index + 1}. {step}
              </li>
            ))}
          </ol>
        )}

        {guide.notes && (
          <div className="bg-discord-purple/10 border border-discord-purple/30 rounded-lg p-3 space-y-1">
            {guide.notes.map((note, index) => (
              <p key={index} className="text-sm text-neutral-900 dark:text-neutral-100">• {note}</p>
            ))}
          </div>
        )}

        {guide.warning && (
          <div className="bg-gx-red/10 border border-gx-red/30 rounded-lg p-3">
            <p className="text-sm text-gx-red font-semibold">⚠️ Warning</p>
            <p className="text-sm text-neutral-900 dark:text-neutral-100 mt-1">{guide.warning}</p>
          </div>
        )}

        {guide.options && (
          <div className="space-y-2">
            {guide.options.map((option, index) => (
              <div key={index} className="border-l-2 border-gx-cyan pl-3">
                <h5 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">{option.setting}</h5>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{option.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="border-b border-dark-500 last:border-b-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-4 px-2 hover:bg-dark-700/50 transition-colors text-left"
      >
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
        <ChevronDown
          className={`w-5 h-5 text-neutral-600 dark:text-neutral-400 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-2 pb-4">
              {renderGuideContent()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HelpDetailedSection;


