import { CheckCircle2, AlertCircle, Edit2 } from 'lucide-react';
import { CATEGORIES } from '../../utils/expenseStorage';

const ReceiptReview = ({ scannedData, onEdit, onConfirm, onRescan }) => {
  if (!scannedData) return null;

  const { store, date, amount, category, items, confidence } = scannedData;

  const confidenceColor = {
    high: 'text-green-600 dark:text-green-400',
    medium: 'text-yellow-600 dark:text-yellow-400',
    low: 'text-red-600 dark:text-red-400'
  }[confidence] || 'text-neutral-600 dark:text-neutral-400';

  const confidenceIcon = confidence === 'high' ? CheckCircle2 : AlertCircle;
  const ConfidenceIcon = confidenceIcon;

  const categoryInfo = CATEGORIES.find(c => c.id === category) || CATEGORIES[CATEGORIES.length - 1];

  return (
    <div className="space-y-4">
      {/* Confidence Indicator */}
      <div className={`flex items-center gap-2 px-3 py-2 bg-neutral-50 dark:bg-neutral-900 rounded-md ${confidenceColor}`}>
        <ConfidenceIcon className="w-4 h-4" />
        <span className="text-sm font-medium">
          {confidence === 'high' && 'AI extracted successfully'}
          {confidence === 'medium' && 'AI extraction completed - please verify'}
          {confidence === 'low' && 'AI extraction uncertain - please review carefully'}
        </span>
      </div>

      {/* Extracted Data */}
      <div className="space-y-3">
        {/* Store */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
              Store
            </label>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {store}
            </p>
          </div>
          <button
            onClick={() => onEdit('store')}
            className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            title="Edit store"
          >
            <Edit2 className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
          </button>
        </div>

        {/* Date */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
              Date
            </label>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {new Date(date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <button
            onClick={() => onEdit('date')}
            className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            title="Edit date"
          >
            <Edit2 className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
          </button>
        </div>

        {/* Amount */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
              Total Amount
            </label>
            <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              ${amount.toFixed(2)}
            </p>
          </div>
          <button
            onClick={() => onEdit('amount')}
            className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            title="Edit amount"
          >
            <Edit2 className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
          </button>
        </div>

        {/* Category */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
              Category
            </label>
            <div className="flex items-center gap-2">
              <span className="text-lg">{categoryInfo.emoji}</span>
              <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {categoryInfo.label}
              </span>
            </div>
          </div>
          <button
            onClick={() => onEdit('category')}
            className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            title="Edit category"
          >
            <Edit2 className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
          </button>
        </div>
      </div>

      {/* Items List */}
      {items && items.length > 0 && (
        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-3">
          <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
            Items ({items.length})
          </label>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {items.map((item, index) => (
              <div 
                key={index}
                className="flex justify-between items-center text-xs py-1 px-2 rounded bg-neutral-50 dark:bg-neutral-900"
              >
                <span className="text-neutral-700 dark:text-neutral-300">{item.name}</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                  ${item.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onRescan}
          className="flex-1 px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm font-medium"
        >
          Re-scan
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors text-sm font-medium"
        >
          Confirm & Save
        </button>
      </div>
    </div>
  );
};

export default ReceiptReview;

