import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, FileText, Camera } from 'lucide-react';
import { CATEGORIES } from '../../utils/expenseStorage';
import ReceiptUpload from './ReceiptUpload';
import ReceiptReview from './ReceiptReview';

const AddExpenseModal = ({ isOpen, onClose, onSave, editExpense = null }) => {
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' or 'receipt'
  const [scannedData, setScannedData] = useState(null);
  const [formData, setFormData] = useState({
    store: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: 'groceries',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update form when editing
  useEffect(() => {
    if (editExpense) {
      setFormData({
        store: editExpense.store || '',
        date: editExpense.date || new Date().toISOString().split('T')[0],
        amount: editExpense.amount || '',
        category: editExpense.category || 'groceries',
        notes: editExpense.notes || ''
      });
    } else {
      // Reset form for new expense
      setFormData({
        store: '',
        date: new Date().toISOString().split('T')[0],
        amount: '',
        category: 'groceries',
        notes: ''
      });
    }
  }, [editExpense, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.store.trim()) {
      setError('Store name is required');
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    setLoading(true);
    try {
      const expenseData = {
        store: formData.store.trim(),
        date: formData.date,
        amount: parseFloat(formData.amount),
        category: formData.category,
        notes: formData.notes.trim() || null
      };

      await onSave(expenseData, editExpense?.id);
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      store: '',
      date: new Date().toISOString().split('T')[0],
      amount: '',
      category: 'groceries',
      notes: ''
    });
    setError('');
    setActiveTab('manual');
    setScannedData(null);
    onClose();
  };

  const handleScanComplete = (data) => {
    setScannedData(data);
    // Pre-fill form with scanned data
    setFormData({
      store: data.store || '',
      date: data.date || new Date().toISOString().split('T')[0],
      amount: data.amount || '',
      category: data.category || 'groceries',
      notes: data.items && data.items.length > 0 
        ? `Items: ${data.items.map(item => item.name).join(', ')}` 
        : ''
    });
  };

  const handleScanError = (error) => {
    setError(error);
    setScannedData(null);
  };

  const handleRescan = () => {
    setScannedData(null);
    setFormData({
      store: '',
      date: new Date().toISOString().split('T')[0],
      amount: '',
      category: 'groceries',
      notes: ''
    });
  };

  const handleEditField = (field) => {
    // Switch to manual tab to edit
    setActiveTab('manual');
  };

  const handleConfirmScan = async () => {
    // Use the standard submit handler
    await handleSubmit(new Event('submit'));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md max-h-[90vh] overflow-y-auto card"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                {editExpense ? 'Edit Expense' : 'Add Expense'}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs - Only show for new expenses */}
          {!editExpense && (
            <div className="flex border-b border-neutral-200 dark:border-neutral-700">
              <button
                onClick={() => setActiveTab('manual')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'manual'
                    ? 'text-neutral-900 dark:text-neutral-100 border-b-2 border-neutral-900 dark:border-neutral-100'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
              >
                <FileText className="w-4 h-4" />
                Manual Entry
              </button>
              <button
                onClick={() => setActiveTab('receipt')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'receipt'
                    ? 'text-neutral-900 dark:text-neutral-100 border-b-2 border-neutral-900 dark:border-neutral-100'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
              >
                <Camera className="w-4 h-4" />
                Scan Receipt
              </button>
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {activeTab === 'receipt' && !editExpense ? (
              scannedData ? (
                <ReceiptReview
                  scannedData={scannedData}
                  onEdit={handleEditField}
                  onConfirm={handleConfirmScan}
                  onRescan={handleRescan}
                />
              ) : (
                <ReceiptUpload
                  onScanComplete={handleScanComplete}
                  onError={handleScanError}
                />
              )
            ) : (
              <>
                {/* Manual Entry Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-800 dark:text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Store Name */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                Store / Merchant <span className="text-red-600 dark:text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.store}
                onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                placeholder="e.g., Walmart, Starbucks, Amazon"
                className="input w-full"
                autoFocus
                maxLength={100}
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                Date <span className="text-red-600 dark:text-red-400">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                max={new Date().toISOString().split('T')[0]}
                className="input w-full"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                Amount <span className="text-red-600 dark:text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="input w-full pl-8"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                Category <span className="text-red-600 dark:text-red-400">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input w-full"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any additional notes..."
                rows={3}
                className="input w-full resize-none"
                maxLength={500}
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.store.trim() || !formData.amount}
                className={`
                  flex-1 px-4 py-3 rounded-md font-medium transition-all
                  ${!loading && formData.store.trim() && formData.amount
                    ? 'btn-primary'
                    : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-500 cursor-not-allowed'
                  }
                `}
              >
                {loading ? 'Saving...' : editExpense ? 'Update Expense' : 'Add Expense'}
              </button>
            </div>
          </form>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddExpenseModal;


