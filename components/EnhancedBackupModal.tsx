'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Database, Download, AlertCircle, Shield, Clock } from 'lucide-react';

interface EnhancedBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackup: (options: BackupOptions) => Promise<void>;
  loading: boolean;
  tableDateRanges: TableDateRange[];
}

interface BackupOptions {
  tables: string[];
  fromDate?: string;
  toDate?: string;
  name: string;
  description?: string;
  backupType: 'manual' | 'recovery';
  recoveryPoint?: boolean;
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

export default function EnhancedBackupModal({ 
  isOpen, 
  onClose, 
  onBackup, 
  loading,
  tableDateRanges 
}: EnhancedBackupModalProps) {
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [backupName, setBackupName] = useState('');
  const [description, setDescription] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [backupType, setBackupType] = useState<'manual' | 'recovery'>('manual');
  const [recoveryPoint, setRecoveryPoint] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dateRangeInfo, setDateRangeInfo] = useState<{
    earliestDate: string | null;
    latestDate: string | null;
    totalRecords: number;
  }>({ earliestDate: null, latestDate: null, totalRecords: 0 });

  // Update date range info when selected tables change
  useEffect(() => {
    if (selectedTables.length === 0) {
      setDateRangeInfo({ earliestDate: null, latestDate: null, totalRecords: 0 });
      return;
    }

    const selectedTableRanges = tableDateRanges.filter(range => 
      selectedTables.includes(range.tableName)
    );

    if (selectedTableRanges.length === 0) {
      setDateRangeInfo({ earliestDate: null, latestDate: null, totalRecords: 0 });
      return;
    }

    const earliestDate = selectedTableRanges.reduce((earliest, range) => {
      if (!range.firstRecordDate) return earliest;
      if (!earliest) return range.firstRecordDate;
      return new Date(range.firstRecordDate) < new Date(earliest) ? range.firstRecordDate : earliest;
    }, null as string | null);

    const latestDate = selectedTableRanges.reduce((latest, range) => {
      if (!range.lastRecordDate) return latest;
      if (!latest) return range.lastRecordDate;
      return new Date(range.lastRecordDate) > new Date(latest) ? range.lastRecordDate : latest;
    }, null as string | null);

    const totalRecords = selectedTableRanges.reduce((sum, range) => sum + range.totalRecords, 0);

    setDateRangeInfo({ earliestDate, latestDate, totalRecords });
  }, [selectedTables, tableDateRanges]);

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

    // Check if date range is within the available data range
    if (fromDate && dateRangeInfo.earliestDate && new Date(fromDate) < new Date(dateRangeInfo.earliestDate)) {
      newErrors.dateRange = `From date cannot be before ${new Date(dateRangeInfo.earliestDate).toLocaleDateString()}`;
    }

    if (toDate && dateRangeInfo.latestDate && new Date(toDate) > new Date(dateRangeInfo.latestDate)) {
      newErrors.dateRange = `To date cannot be after ${new Date(dateRangeInfo.latestDate).toLocaleDateString()}`;
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
        description: description.trim() || undefined,
        backupType,
        recoveryPoint
      });
      
      // Reset form
      setSelectedTables([]);
      setBackupName('');
      setDescription('');
      setFromDate('');
      setToDate('');
      setBackupType('manual');
      setRecoveryPoint(false);
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
      setBackupType('manual');
      setRecoveryPoint(false);
      setErrors({});
      onClose();
    }
  };

  const formatDateForInput = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
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
            className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Create Enhanced Backup
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Select tables, date range, and backup options
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
              {/* Backup Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Backup Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="backupType"
                      value="manual"
                      checked={backupType === 'manual'}
                      onChange={(e) => setBackupType(e.target.value as 'manual')}
                      className="mr-3"
                      disabled={loading}
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Manual Backup</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Regular data backup</div>
                    </div>
                  </label>
                  <label className="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="backupType"
                      value="recovery"
                      checked={backupType === 'recovery'}
                      onChange={(e) => setBackupType(e.target.value as 'recovery')}
                      className="mr-3"
                      disabled={loading}
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Recovery Point</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Critical backup for disaster recovery</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Recovery Point Option */}
              {backupType === 'recovery' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">Recovery Point</h4>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                        Recovery points are special backups designed for disaster recovery scenarios. 
                        They are kept for 6 months and can be used to restore your entire system.
                      </p>
                      <label className="flex items-center mt-3">
                        <input
                          type="checkbox"
                          checked={recoveryPoint}
                          onChange={(e) => setRecoveryPoint(e.target.checked)}
                          className="mr-2"
                          disabled={loading}
                        />
                        <span className="text-sm text-blue-800 dark:text-blue-200">
                          Mark as critical recovery point
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

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

              {/* Dynamic Date Range Selection */}
              {selectedTables.length > 0 && dateRangeInfo.earliestDate && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Available Data Range
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Earliest:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">
                        {new Date(dateRangeInfo.earliestDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Latest:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">
                        {new Date(dateRangeInfo.latestDate!).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Total Records:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">
                        {dateRangeInfo.totalRecords.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

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
                      min={formatDateForInput(dateRangeInfo.earliestDate)}
                      max={formatDateForInput(dateRangeInfo.latestDate)}
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
                      min={fromDate || formatDateForInput(dateRangeInfo.earliestDate)}
                      max={formatDateForInput(dateRangeInfo.latestDate)}
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
                  {AVAILABLE_TABLES.map((table) => {
                    const tableRange = tableDateRanges.find(range => range.tableName === table.id);
                    return (
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
                          {tableRange && (
                            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                              {tableRange.totalRecords.toLocaleString()} records
                              {tableRange.firstRecordDate && (
                                <span className="ml-2">
                                  ({new Date(tableRange.firstRecordDate).toLocaleDateString()} - {new Date(tableRange.lastRecordDate!).toLocaleDateString()})
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </label>
                    );
                  })}
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
                    <p className="font-medium">Enhanced Backup Information:</p>
                    <ul className="mt-1 space-y-1 text-xs">
                      <li>• Backups are stored both in database and as CSV files</li>
                      <li>• Regular backups expire after 6 months, recovery points are kept longer</li>
                      <li>• Date ranges are dynamically limited to available data</li>
                      <li>• Large backups may take several minutes to complete</li>
                      <li>• Recovery points can be used for disaster recovery scenarios</li>
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
