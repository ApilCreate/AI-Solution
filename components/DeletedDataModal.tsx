'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, AlertCircle, Filter, Calendar, History } from 'lucide-react';

interface DeletedDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => Promise<void>;
  loading: boolean;
  tableDateRanges: TableDateRange[];
}

interface ExportOptions {
  tables: string[];
  fromDate?: string;
  toDate?: string;
  includeRecovered?: boolean;
}

interface TableDateRange {
  tableName: string;
  firstRecordDate: string | null;
  lastRecordDate: string | null;
  totalRecords: number;
}

const AVAILABLE_TABLES = [
  { id: 'inquiries', name: 'Inquiries', description: 'Contact form submissions' },
  { id: 'events', name: 'Events', description: 'Event listings and details' },
  { id: 'blogs', name: 'Blogs', description: 'Blog posts and articles' },
  { id: 'ratings', name: 'Ratings', description: 'User ratings and feedback' },
  { id: 'solutions', name: 'Solutions', description: 'AI solutions catalog' },
  { id: 'demoBookings', name: 'Demo Bookings', description: 'Demo request bookings' },
  { id: 'testimonials', name: 'Testimonials', description: 'Published testimonials' },
  { id: 'eventRsvps', name: 'Event RSVPs', description: 'Event attendance records' },
  { id: 'adminUsers', name: 'Admin Users', description: 'Administrator accounts' },
  { id: 'activityLogs', name: 'Activity Logs', description: 'System activity records' }
];

export default function DeletedDataModal({ 
  isOpen, 
  onClose, 
  onExport, 
  loading,
  tableDateRanges 
}: DeletedDataModalProps) {
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [includeRecovered, setIncludeRecovered] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleTableToggle = (tableId: string) => {
    setSelectedTables(prev => 
      prev.includes(tableId) 
        ? prev.filter(id => id !== tableId)
        : [...prev, tableId]
    );
    // Clear table selection error
    if (errors.tables) {
      setErrors(prev => ({ ...prev, tables: '' }));
    }
  };

  const handleSelectAll = () => {
    if (selectedTables.length === AVAILABLE_TABLES.length) {
      setSelectedTables([]);
    } else {
      setSelectedTables(AVAILABLE_TABLES.map(table => table.id));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (selectedTables.length === 0) {
      newErrors.tables = 'Please select at least one table';
    }

    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      newErrors.dateRange = 'From date must be before to date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onExport({
        tables: selectedTables,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        includeRecovered
      });
      
      // Reset form
      setSelectedTables([]);
      setFromDate('');
      setToDate('');
      setIncludeRecovered(false);
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      // Don't close the modal on error so user can see the error message
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSelectedTables([]);
      setFromDate('');
      setToDate('');
      setIncludeRecovered(false);
      setErrors({});
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-3xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <History className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Export Deleted Data
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Export deleted records as CSV for analysis or recovery
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={loading}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(90vh-140px)] overflow-y-auto">
              {/* Include Recovered Option */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Filter className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900 dark:text-yellow-100">Export Options</h4>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                      Choose whether to include records that have already been recovered.
                    </p>
                    <label className="flex items-center mt-3">
                      <input
                        type="checkbox"
                        checked={includeRecovered}
                        onChange={(e) => setIncludeRecovered(e.target.checked)}
                        className="mr-2"
                        disabled={loading}
                      />
                      <span className="text-sm text-yellow-800 dark:text-yellow-200">
                        Include already recovered records
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Date Range */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Date Range (Optional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      From Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      To Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        min={fromDate}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
                {errors.dateRange && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.dateRange}
                  </p>
                )}
              </div>

              {/* Table Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Select Tables *
                  </h3>
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    disabled={loading}
                  >
                    {selectedTables.length === AVAILABLE_TABLES.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                  {AVAILABLE_TABLES.map((table) => (
                    <label
                      key={table.id}
                      className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTables.includes(table.id)}
                        onChange={() => handleTableToggle(table.id)}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        disabled={loading}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {table.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {table.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.tables && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.tables}
                  </p>
                )}
              </div>

              {/* Info Note */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium">Deleted Data Export Information:</p>
                    <ul className="mt-1 space-y-1 text-xs">
                      <li>• Exported data includes all deleted records with metadata</li>
                      <li>• CSV format includes: deletion date, table name, original data, recovery status</li>
                      <li>• Deleted records are automatically removed after 3 months</li>
                      <li>• Use this export to analyze deletion patterns or prepare for recovery</li>
                      <li>• Recovered records can be identified by the "recovered" column</li>
                    </ul>
                  </div>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading || selectedTables.length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
