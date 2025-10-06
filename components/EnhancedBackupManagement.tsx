'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  Database, 
  Download, 
  Trash2, 
  RotateCcw, 
  Calendar, 
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  History,
  ArrowLeft as Recover,
  Filter,
  Archive,
  Shield,
  Eye,
  X,
  AlertTriangle
} from 'lucide-react';
import EnhancedBackupModal from './EnhancedBackupModal';
import DeletedDataModal from './DeletedDataModal';

interface Backup {
  id: string;
  name: string;
  description?: string;
  backupType: string;
  status: 'in_progress' | 'completed' | 'failed';
  tablesIncluded: string[];
  recordCount: number;
  fileSize: number;
  dateFrom?: string;
  dateTo?: string;
  createdAt: string;
  expiresAt: string;
  createdBy: string;
  recoveryPoint: boolean;
}

interface DeletedRecord {
  id: string;
  tableName: string;
  recordId: string;
  deletedData: Record<string, any>;
  deletedAt: string;
  deletedBy?: string;
  reason?: string;
  originalCreatedAt?: string;
  originalUpdatedAt?: string;
  recovered: boolean;
}

interface BackupStats {
  total: number;
  active: number;
  expired: number;
  deletedRecords: number;
  unrecoveredDeletedRecords: number;
}

interface TableDateRange {
  tableName: string;
  firstRecordDate: string | null;
  lastRecordDate: string | null;
  totalRecords: number;
}

// Helper function to get meaningful title from deleted record
function getDeletedRecordTitle(record: DeletedRecord): string {
  const data = record.deletedData;
  
  switch (record.tableName) {
    case 'inquiries':
      return data.name ? `${data.name} (Inquiry)` : `Inquiry - ${record.recordId}`;
    case 'events':
      return data.title ? `${data.title} (Event)` : `Event - ${record.recordId}`;
    case 'blogs':
      return data.title ? `${data.title} (Blog)` : `Blog - ${record.recordId}`;
    case 'testimonials':
      return data.name ? `${data.name} (Testimonial)` : `Testimonial - ${record.recordId}`;
    case 'event_rsvps':
      return data.name ? `${data.name} (RSVP)` : `RSVP - ${record.recordId}`;
    case 'demo_bookings':
      return data.name ? `${data.name} (Demo Booking)` : `Demo Booking - ${record.recordId}`;
    default:
      return `${record.tableName} - ${record.recordId}`;
  }
}

// Helper function to get meaningful subtitle from deleted record
function getDeletedRecordSubtitle(record: DeletedRecord): string {
  const data = record.deletedData;
  
  switch (record.tableName) {
    case 'inquiries':
      return data.email ? `${data.email} • ${data.messageTitle || 'No title'}` : 'Inquiry details';
    case 'events':
      return data.date ? `Event Date: ${new Date(data.date).toLocaleDateString()}` : 'Event details';
    case 'blogs':
      return data.author ? `By ${data.author}` : 'Blog post';
    case 'testimonials':
      return data.company ? `From ${data.company}` : 'Testimonial';
    case 'event_rsvps':
      return data.email ? `${data.email} • ${data.eventTitle || 'Event RSVP'}` : 'RSVP details';
    case 'demo_bookings':
      return data.email ? `${data.email} • Demo booking` : 'Demo booking';
    default:
      return 'Deleted record';
  }
}

export default function EnhancedBackupManagement() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [deletedRecords, setDeletedRecords] = useState<DeletedRecord[]>([]);
  const [stats, setStats] = useState<BackupStats>({ 
    total: 0, 
    active: 0, 
    expired: 0, 
    deletedRecords: 0, 
    unrecoveredDeletedRecords: 0 
  });
  const [tableDateRanges, setTableDateRanges] = useState<TableDateRange[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showDeletedDataModal, setShowDeletedDataModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDeletedRecord, setSelectedDeletedRecord] = useState<DeletedRecord | null>(null);
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());
  const [showRecoveredRecords, setShowRecoveredRecords] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'backups' | 'deleted'>('backups');
  const [pendingAction, setPendingAction] = useState<{
    type: 'deleteBackup' | 'permanentDelete';
    message: string;
    onConfirm: () => void;
    backupId?: string;
    recordIds?: string[];
    context?: string;
  } | null>(null);

  // Custom confirmation function using toast
  const showConfirmation = (
    message: string,
    onConfirm: () => void,
    type: 'deleteBackup' | 'permanentDelete' = 'deleteBackup',
    backupId?: string,
    recordIds?: string[],
    context?: string
  ) => {
    setPendingAction({
      type,
      message,
      onConfirm,
      backupId,
      recordIds,
      context
    });
  };

  const handleConfirmAction = () => {
    if (pendingAction) {
      pendingAction.onConfirm();
      setPendingAction(null);
    }
  };

  const handleCancelAction = () => {
    setPendingAction(null);
  };

  // Helper function to get authentication headers
  const getAuthHeaders = (): HeadersInit => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    
    const adminUser = localStorage.getItem('adminUser');
    console.log('🔐 Admin user from localStorage:', adminUser);
    
    if (adminUser) {
      try {
        const userData = JSON.parse(adminUser);
        console.log('👤 Parsed user data:', userData);
        headers['x-admin-email'] = userData.email;
        console.log('📧 Setting admin email header:', userData.email);
      } catch (error) {
        console.error('❌ Failed to parse admin user data:', error);
      }
    } else {
      console.log('⚠️ No admin user found in localStorage');
    }
    
    console.log('📤 Final headers:', headers);
    return headers;
  };

  const fetchBackups = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/backups', {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch backups');
      }
      
      const data = await response.json();
      setBackups(data.backups);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching backups:', error);
      setError('Failed to load backups');
    } finally {
      setLoading(false);
    }
  };

  const fetchDeletedRecords = async () => {
    try {
      const url = `/api/backups/deleted-data${showRecoveredRecords ? '?includeRecovered=true' : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch deleted records');
      }
      
      const data = await response.json();
      setDeletedRecords(data.deletedRecords);
    } catch (error) {
      console.error('Error fetching deleted records:', error);
      setError('Failed to load deleted records');
    }
  };

  const fetchTableDateRanges = async () => {
    try {
      const response = await fetch('/api/backups/table-ranges', {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch table date ranges');
      }
      
      const data = await response.json();
      setTableDateRanges(data.dateRanges);
    } catch (error) {
      console.error('Error fetching table date ranges:', error);
    }
  };

  useEffect(() => {
    fetchBackups();
    fetchDeletedRecords();
    fetchTableDateRanges();
  }, []);

  useEffect(() => {
    fetchDeletedRecords();
  }, [showRecoveredRecords]);

  const handleCreateBackup = async (options: any) => {
    try {
      setActionLoading('create');
      setError(null);
      
      console.log('Creating backup with options:', options);
      const headers = getAuthHeaders();
      console.log('Auth headers:', headers);
      
      const requestBody = JSON.stringify(options);
      console.log('Request body:', requestBody);
      
      const response = await fetch('/api/backups', {
        method: 'POST',
        headers: headers,
        body: requestBody
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        let errorMessage = 'Failed to create backup';
        console.log('Response status:', response.status);
        console.log('Response statusText:', response.statusText);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        try {
          const responseText = await response.text();
          console.log('Raw response text:', responseText);
          
          if (responseText) {
            const errorData = JSON.parse(responseText);
            console.error('API error response:', errorData);
            
            // Handle empty object case
            if (Object.keys(errorData).length === 0) {
              errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            } else {
              errorMessage = errorData.error || errorMessage;
            }
          } else {
            console.log('Response body is empty');
            errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          }
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      console.log('Backup created successfully:', result);
      toast.success('Backup created successfully!');
      await fetchBackups();
    } catch (error) {
      console.error('Error creating backup:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      const errorMessage = error instanceof Error ? error.message : 'Failed to create backup';
      toast.error(errorMessage);
      setError(errorMessage);
      throw error;
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownloadBackup = async (backupId: string) => {
    try {
      setActionLoading(backupId);
      const response = await fetch(`/api/backups/${backupId}/download`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to download backup');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup_${backupId}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Backup downloaded successfully!');
    } catch (error) {
      console.error('Error downloading backup:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to download backup';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteBackup = async (backupId: string) => {
    showConfirmation(
      'Are you sure you want to delete this backup? This action cannot be undone.',
      () => performDeleteBackup(backupId),
      'deleteBackup',
      backupId
    );
  };

  const performDeleteBackup = async (backupId: string) => {
    try {
      setActionLoading(backupId);
      const response = await fetch(`/api/backups/${backupId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete backup');
      }
      
      toast.success('Backup deleted successfully!');
      await fetchBackups();
    } catch (error) {
      console.error('Error deleting backup:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete backup';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const generateRecoveryReason = (recordIds: string[], context?: string): string => {
    const timestamp = new Date().toLocaleString();
    const recordCount = recordIds.length;
    
    if (context === 'details') {
      return `Single record recovery from details view`;
    } else if (context === 'bulk') {
      return `Bulk recovery of ${recordCount} selected records`;
    } else if (recordCount === 1) {
      return `Single record recovery from list view`;
    } else {
      return `Bulk recovery of ${recordCount} records`;
    }
  };

  const handleBulkRecover = async () => {
    if (selectedRecords.size === 0) {
      toast.error('Please select at least one record to recover');
      return;
    }

    const recordIds = Array.from(selectedRecords);
    await handleRecoverDeletedData(recordIds, 'bulk');
    
    // Clear selection after recovery
    setSelectedRecords(new Set());
  };

  const handlePermanentDelete = async (deletedRecordIds: string[], context?: string) => {
    try {
      setActionLoading('permanent-delete');
      
      // Generate dynamic reason for permanent deletion
      const dynamicReason = `Permanent deletion - ${context || 'manual'} operation`;
      
      const response = await fetch('/api/backups/permanent-delete', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ 
          deletedRecordIds, 
          reason: dynamicReason
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to permanently delete records');
      }
      
      const result = await response.json();
      
      if (result.result.deleted > 0) {
        toast.success(`Successfully permanently deleted ${result.result.deleted} record(s)!`);
      } else {
        toast.error(`Failed to permanently delete records: ${result.message}`);
      }
      
      await fetchDeletedRecords();
      await fetchBackups(); // Refresh stats
      
      // Clear selection after deletion
      setSelectedRecords(new Set());
    } catch (error) {
      console.error('Error permanently deleting records:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to permanently delete records';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBulkPermanentDelete = async () => {
    if (selectedRecords.size === 0) {
      toast.error('Please select at least one record to permanently delete');
      return;
    }

    const recordIds = Array.from(selectedRecords);
    const confirmMessage = recordIds.length === 1
      ? 'Are you sure you want to permanently delete this record? This action cannot be undone and the data will be lost forever.'
      : `Are you sure you want to permanently delete ${recordIds.length} records? This action cannot be undone and the data will be lost forever.`;

    showConfirmation(
      confirmMessage,
      () => handlePermanentDelete(recordIds, 'bulk'),
      'permanentDelete',
      undefined,
      recordIds,
      'bulk'
    );
  };

  const handleSelectRecord = (recordId: string, checked: boolean) => {
    const newSelected = new Set(selectedRecords);
    if (checked) {
      newSelected.add(recordId);
    } else {
      newSelected.delete(recordId);
    }
    setSelectedRecords(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const unrecoveredIds = deletedRecords
        .filter(record => !record.recovered)
        .map(record => record.id);
      setSelectedRecords(new Set(unrecoveredIds));
    } else {
      setSelectedRecords(new Set());
    }
  };

  const handleRecoverDeletedData = async (deletedRecordIds: string[], context?: string) => {
    try {
      setActionLoading('recover');
      
      // Generate dynamic reason
      const dynamicReason = generateRecoveryReason(deletedRecordIds, context);
      
      const response = await fetch('/api/backups/recover', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ 
          deletedRecordIds, 
          reason: dynamicReason,
          context: context || 'list'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to recover deleted data');
      }
      
      const result = await response.json();
      
      if (result.result.recovered > 0) {
        toast.success(`Successfully recovered ${result.result.recovered} record(s)!`);
      } else {
        toast.error(`Failed to recover records: ${result.message}`);
      }
      
      await fetchDeletedRecords();
      await fetchBackups(); // Refresh stats
    } catch (error) {
      console.error('Error recovering deleted data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to recover deleted data';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const handleExportDeletedData = async (options: any) => {
    try {
      setActionLoading('export');
      setError(null);
      
      console.log('Exporting deleted data with options:', options);
      console.log('Auth headers:', getAuthHeaders());
      
      const response = await fetch('/api/backups/deleted-data', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(options)
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        let errorMessage = 'Failed to export deleted data';
        console.log('Response status:', response.status);
        console.log('Response statusText:', response.statusText);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        try {
          const responseText = await response.text();
          console.log('Raw response text:', responseText);
          
          if (responseText) {
            const errorData = JSON.parse(responseText);
            console.error('Export API error:', errorData);
            errorMessage = errorData.error || errorMessage;
          } else {
            console.log('Response body is empty');
            errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          }
        } catch (jsonError) {
          console.error('Failed to parse error response as JSON:', jsonError);
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      const blob = await response.blob();
      console.log('Blob size:', blob.size);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `deleted_data_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log('Deleted data exported successfully');
      toast.success('Deleted data exported successfully!');
    } catch (error) {
      console.error('Error exporting deleted data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to export deleted data';
      toast.error(errorMessage);
      setError(errorMessage);
      throw error; // Re-throw so the modal can handle it
    } finally {
      setActionLoading(null);
    }
  };

  const handleCleanupExpired = async () => {
    try {
      setActionLoading('cleanup');
      const response = await fetch('/api/backups/cleanup', {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cleanup expired backups');
      }
      
      const data = await response.json();
      toast.success(`Cleaned up ${data.deletedCount} expired backups!`);
      await fetchBackups();
    } catch (error) {
      console.error('Error cleaning up backups:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to cleanup expired backups';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'in_progress':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'failed':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-gray-600 dark:text-gray-400">Loading backup system...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-red-800 dark:text-red-200">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Enhanced Backup & Recovery System
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage backups, track deleted data, and recover lost information
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCleanupExpired}
            disabled={actionLoading === 'cleanup'}
            className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {actionLoading === 'cleanup' ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              'Cleanup Expired'
            )}
          </button>
          <button
            onClick={() => setShowBackupModal(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Database className="w-4 h-4" />
            <span>Create Backup</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Backups</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Backups</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Expired Backups</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.expired}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <History className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Deleted Records</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.deletedRecords}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Recover className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Unrecovered</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.unrecoveredDeletedRecords}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('backups')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'backups'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4" />
              <span>Backups</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('deleted')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'deleted'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <History className="w-4 h-4" />
              <span>Deleted Data</span>
              {stats.unrecoveredDeletedRecords > 0 && (
                <span className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 text-xs px-2 py-1 rounded-full">
                  {stats.unrecoveredDeletedRecords}
                </span>
              )}
            </div>
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'backups' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          {backups.length === 0 ? (
            <div className="text-center py-12">
              <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No backups found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create your first backup to get started
              </p>
              <button
                onClick={() => setShowBackupModal(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Create Backup
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {backups.map((backup) => (
                <motion.div
                  key={backup.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(backup.status)}
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                          {backup.name}
                          {backup.recoveryPoint && (
                            <Shield className="w-4 h-4 text-blue-500 ml-2 inline" title="Recovery Point" />
                          )}
                        </h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(backup.status)} bg-gray-100 dark:bg-gray-700`}>
                          {backup.status}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900">
                          {backup.backupType}
                        </span>
                      </div>
                      
                      {backup.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {backup.description}
                        </p>
                      )}

                      <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(backup.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FileText className="w-4 h-4" />
                          <span>{backup.recordCount} records</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Database className="w-4 h-4" />
                          <span>{backup.tablesIncluded.length} tables</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>{formatFileSize(backup.fileSize)}</span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Tables: {backup.tablesIncluded.join(', ')}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Expires: {formatDate(backup.expiresAt)}
                        </p>
                        {backup.dateFrom && backup.dateTo && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Date Range: {formatDate(backup.dateFrom)} - {formatDate(backup.dateTo)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {backup.status === 'completed' && (
                        <>
                          <button
                            onClick={() => handleDownloadBackup(backup.id)}
                            disabled={actionLoading === backup.id}
                            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50"
                            title="Download CSV"
                          >
                            {actionLoading === backup.id ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteBackup(backup.id)}
                        disabled={actionLoading === backup.id}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete Backup"
                      >
                        {actionLoading === backup.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'deleted' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                Deleted Records ({stats.unrecoveredDeletedRecords} unrecovered)
              </h4>
              <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  checked={showRecoveredRecords}
                  onChange={(e) => setShowRecoveredRecords(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span>Show recovered records</span>
              </label>
            </div>
            <div className="flex items-center space-x-3">
              {selectedRecords.size > 0 && (
                <>
                  <button
                    onClick={handleBulkRecover}
                    disabled={actionLoading === 'recover'}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Recover className="w-4 h-4" />
                    <span>Recover Selected ({selectedRecords.size})</span>
                  </button>
                  <button
                    onClick={handleBulkPermanentDelete}
                    disabled={actionLoading === 'permanent-delete'}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Forever ({selectedRecords.size})</span>
                  </button>
                </>
              )}
              <button
                onClick={() => setShowDeletedDataModal(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export Deleted Data</span>
              </button>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            {deletedRecords.length === 0 ? (
              <div className="text-center py-12">
                <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No deleted records found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Deleted records will appear here for 3 months
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {/* Select All Header */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedRecords.size > 0 && selectedRecords.size === deletedRecords.filter(r => !r.recovered).length && deletedRecords.filter(r => !r.recovered).length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      disabled={deletedRecords.filter(r => !r.recovered).length === 0}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Select All Unrecovered Records
                    </span>
                  </div>
                </div>
                
                {deletedRecords.map((record) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          {!record.recovered && (
                            <input
                              type="checkbox"
                              checked={selectedRecords.has(record.id)}
                              onChange={(e) => handleSelectRecord(record.id, e.target.checked)}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                          )}
                          <div className={`w-2 h-2 rounded-full ${record.recovered ? 'bg-green-500' : 'bg-red-500'}`} />
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                            {getDeletedRecordTitle(record)}
                          </h4>
                          {record.recovered && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900">
                              Recovered
                            </span>
                          )}
                        </div>
                        
                        <div className="mb-2">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {getDeletedRecordSubtitle(record)}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Deleted: {formatDate(record.deletedAt)}</span>
                          </div>
                          {record.originalCreatedAt && (
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>Created: {formatDate(record.originalCreatedAt)}</span>
                            </div>
                          )}
                        </div>

                        {record.reason && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Reason: {record.reason}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => {
                            setSelectedDeletedRecord(record);
                            setShowDetailsModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {!record.recovered && (
                          <>
                            <button
                              onClick={() => handleRecoverDeletedData([record.id], 'list')}
                              disabled={actionLoading === 'recover'}
                              className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors disabled:opacity-50"
                              title="Recover Record"
                            >
                              {actionLoading === 'recover' ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <Recover className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                const recordName = getDeletedRecordTitle(record);
                                showConfirmation(
                                  `Are you sure you want to permanently delete "${recordName}"? This action cannot be undone and the data will be lost forever.`,
                                  () => handlePermanentDelete([record.id], 'individual'),
                                  'permanentDelete',
                                  undefined,
                                  [record.id],
                                  'individual'
                                );
                              }}
                              disabled={actionLoading === 'permanent-delete'}
                              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete Forever"
                            >
                              {actionLoading === 'permanent-delete' ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Enhanced Backup Modal */}
      <EnhancedBackupModal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
        onBackup={handleCreateBackup}
        loading={actionLoading === 'create'}
        tableDateRanges={tableDateRanges}
      />

      {/* Deleted Data Modal */}
      <DeletedDataModal
        isOpen={showDeletedDataModal}
        onClose={() => setShowDeletedDataModal(false)}
        onExport={handleExportDeletedData}
        loading={actionLoading === 'export'}
        tableDateRanges={tableDateRanges}
      />

      {/* Details Modal */}
      {showDetailsModal && selectedDeletedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Deleted Record Details
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Record Info */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Record Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Table:</span>
                    <span className="ml-2 text-gray-900 dark:text-white capitalize">{selectedDeletedRecord.tableName}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Record ID:</span>
                    <span className="ml-2 text-gray-900 dark:text-white font-mono text-xs">{selectedDeletedRecord.recordId}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Deleted:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{formatDate(selectedDeletedRecord.deletedAt)}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      selectedDeletedRecord.recovered 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {selectedDeletedRecord.recovered ? 'Recovered' : 'Not Recovered'}
                    </span>
                  </div>
                  {selectedDeletedRecord.reason && (
                    <div className="md:col-span-2">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Reason:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{selectedDeletedRecord.reason}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Original Data */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Original Data
                </h4>
                <pre className="bg-white dark:bg-gray-800 rounded-lg p-4 overflow-x-auto text-sm text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600">
                  {JSON.stringify(selectedDeletedRecord.deletedData, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Close
              </button>
              {!selectedDeletedRecord.recovered && (
                <>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleRecoverDeletedData([selectedDeletedRecord.id], 'details');
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Recover Record
                  </button>
                  <button
                    onClick={() => {
                      const recordName = getDeletedRecordTitle(selectedDeletedRecord);
                      showConfirmation(
                        `Are you sure you want to permanently delete "${recordName}"? This action cannot be undone and the data will be lost forever.`,
                        () => {
                          setShowDetailsModal(false);
                          handlePermanentDelete([selectedDeletedRecord.id], 'details');
                        },
                        'permanentDelete',
                        undefined,
                        [selectedDeletedRecord.id],
                        'details'
                      );
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete Forever
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Confirmation Modal */}
      {pendingAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
          >
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Confirm Action
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {pendingAction.message}
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleCancelAction}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
