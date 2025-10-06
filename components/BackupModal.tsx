'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Database, Download, AlertCircle } from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackup: (options: BackupOptions) => Promise<void>;
  loading: boolean;
}

interface BackupOptions {
  tables: string[];
  fromDate?: string;
  toDate?: string;
  name: string;
  description?: string;
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

export default function BackupModal({ isOpen, onClose, onBackup, loading }: BackupModalProps) {
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [backupName, setBackupName] = useState('');
  const [description, setDescription] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
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

    if (!backupName.trim()) {
      newErrors.name = 'Backup name is required';
    }

    if (selectedTables.length === 0) {
      newErrors.tables = 'Please select at least one table';
    }

    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      newErrors.dateRange = 'From date must be before to date';
    }

    // Check if date range is within 3 months
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    if (fromDate && new Date(fromDate) < threeMonthsAgo) {
      newErrors.dateRange = 'Date range cannot exceed 3 months';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onBackup({
        tables: selectedTables,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        name: backupName.trim(),
        description: description.trim() || undefined
      });
      
      // Reset form
      setSelectedTables([]);
      setBackupName('');
      setDescription('');
      setFromDate('');
      setToDate('');
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Backup failed:', error);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSelectedTables([]);
      setBackupName('');
      setDescription('');
      setFromDate('');
      setToDate('');
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
            className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Create Database Backup
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Select tables and date range for backup
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
              {/* Backup Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Backup Name *
                </label>
                <input
                  type="text"
                  value={backupName}
                  onChange={(e) => setBackupName(e.target.value)}
                  placeholder="Enter backup name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  disabled={loading}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter backup description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  disabled={loading}
                />
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    From Date (Optional)
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
                    To Date (Optional)
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
              {errors.dateRange && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.dateRange}
                </p>
              )}

              {/* Table Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Tables *
                  </label>
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
                    <p className="font-medium">Backup Information:</p>
                    <ul className="mt-1 space-y-1 text-xs">
                      <li>• Backups are automatically deleted after 3 months</li>
                      <li>• Data will be exported as CSV format</li>
                      <li>• Large backups may take several minutes to complete</li>
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
                disabled={loading || selectedTables.length === 0 || !backupName.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Backup...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Create Backup</span>
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

