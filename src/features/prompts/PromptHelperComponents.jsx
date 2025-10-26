import React, { useState } from 'react';

// Single-choice option buttons
export const OptionButtons = ({ options, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2 my-3">
      {options.map((option, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(option)}
          className="px-3 py-2 sm:px-4 sm:py-2.5 min-w-[100px] flex-shrink-0 text-sm sm:text-base bg-dark-700 border border-dark-500 rounded-lg hover:border-discord-purple hover:bg-dark-600 transition-all duration-200"
        >
          {option}
        </button>
      ))}
    </div>
  );
};

// Multi-select checkboxes
export const CheckboxList = ({ options, onConfirm }) => {
  const [selected, setSelected] = useState([]);
  
  const toggleOption = (option) => {
    setSelected(prev =>
      prev.includes(option)
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };
  
  return (
    <div className="my-3">
      <div className="space-y-2">
        {options.map((option, idx) => (
          <label
            key={idx}
            className="flex items-start gap-3 p-3 sm:p-4 bg-dark-700 rounded-lg cursor-pointer hover:bg-dark-600 transition-colors"
          >
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => toggleOption(option)}
              className="w-5 h-5 mt-0.5 flex-shrink-0 accent-discord-purple"
            />
            <span className="text-sm sm:text-base text-text-primary break-words flex-1">{option}</span>
          </label>
        ))}
      </div>
      
      {selected.length > 0 && (
        <button
          onClick={() => {
            onConfirm(selected);
            setSelected([]);
          }}
          className="w-full mt-4 px-6 py-3 text-sm sm:text-base bg-gradient-primary rounded-lg hover:brightness-110 transition-all shadow-glow-purple font-semibold"
        >
          Confirm Selection ({selected.length})
        </button>
      )}
    </div>
  );
};

// Final prompt display
export const PromptResultDisplay = ({ prompt, onSaveToLibrary }) => {
  const [copied, setCopied] = useState(false);
  
  const wordCount = prompt.split(/\s+/).length;
  const tokenCount = Math.ceil(prompt.length / 4);
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      alert('Failed to copy to clipboard');
    }
  };
  
  const saveToLibrary = () => {
    if (onSaveToLibrary) {
      onSaveToLibrary(prompt);
    }
  };
  
  return (
    <div className="my-4 p-4 sm:p-6 bg-dark-800 border border-dark-500 rounded-xl max-w-full overflow-hidden">
      <pre className="text-xs sm:text-sm text-text-primary whitespace-pre-wrap break-words font-mono mb-4 overflow-x-auto max-w-full">
        {prompt}
      </pre>
      
      <div className="pt-4 border-t border-dark-500">
        <p className="text-xs sm:text-sm text-text-muted mb-3">
          📊 {wordCount} words | ~{tokenCount} tokens
        </p>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={copyToClipboard}
            className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors"
          >
            {copied ? '✅ Copied!' : '📋 Copy'}
          </button>
          
          <button
            onClick={saveToLibrary}
            className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-gradient-primary rounded-lg hover:brightness-110 transition-all shadow-glow-purple"
          >
            💾 Save to Library
          </button>
        </div>
      </div>
    </div>
  );
};


