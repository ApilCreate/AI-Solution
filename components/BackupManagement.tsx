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
  RefreshCw
} from 'lucide-react';
import BackupModal from './BackupModal';

interface Backup {
  id: string;
  name: string;
  description?: string;
  backupType: string;
  status: 'in_progress' | 'completed' | 'failed';
  tablesIncluded: string[];
  recordCount: number;
  fileSize: number;
  createdAt: string;
  expiresAt: string;
  createdBy: string;
}

interface BackupStats {
  total: number;
  active: number;
  expired: number;
}

export default function BackupManagement() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [stats, setStats] = useState<BackupStats>({ total: 0, active: 0, expired: 0 });
  const [loading, setLoading] = useState(true);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get authentication headers
  const getAuthHeaders = (): HeadersInit => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    
    const adminUser = localStorage.getItem('adminUser');
    if (adminUser) {
      try {
        const userData = JSON.parse(adminUser);
        headers['x-admin-email'] = userData.email;
      } catch (error) {
        console.error('Failed to parse admin user data:', error);
      }
    }
    
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

  useEffect(() => {
    fetchBackups();
  }, []);

  const handleCreateBackup = async (options: any) => {
    try {
      setActionLoading('create');
      setError(null); // Clear any previous errors
      
      console.log('Creating backup with options:', options);
      console.log('Auth headers:', getAuthHeaders());
      
      const response = await fetch('/api/backups', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(options)
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backup API error:', errorData);
        throw new Error(errorData.error || 'Failed to create backup');
      }
      
      const result = await response.json();
      console.log('Backup created successfully:', result);
      await fetchBackups(); // Refresh the list
    } catch (error) {
      console.error('Error creating backup:', error);
      setError(error instanceof Error ? error.message : 'Failed to create backup');
      throw error; // Re-throw the error so the modal can handle it
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
    } catch (error) {
      console.error('Error downloading backup:', error);
      setError('Failed to download backup');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteBackup = async (backupId: string) => {
    if (!confirm('Are you sure you want to delete this backup? This action cannot be undone.')) {
      return;
    }

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
      
      await fetchBackups(); // Refresh the list
    } catch (error) {
      console.error('Error deleting backup:', error);
      setError('Failed to delete backup');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRestoreBackup = async (backupId: string) => {
    if (!confirm('Are you sure you want to restore this backup? This will overwrite existing data.')) {
      return;
    }

    try {
      setActionLoading(backupId);
      const response = await fetch(`/api/backups/${backupId}/restore`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({})
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to restore backup');
      }
      
      toast.success('Backup restored successfully!');
    } catch (error) {
      console.error('Error restoring backup:', error);
      const errorMsg = 'Failed to restore backup. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
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
      toast.success(`Successfully cleaned up ${data.deletedCount} expired backup${data.deletedCount !== 1 ? 's' : ''}!`);
      await fetchBackups(); // Refresh the list
    } catch (error) {
      console.error('Error cleaning up backups:', error);
      const errorMsg = 'Failed to cleanup expired backups. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
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
          <span className="text-gray-600 dark:text-gray-400">Loading backups...</span>
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
            Database Backups
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your database backups and recovery points
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>

      {/* Backups List */}
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
                      </h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(backup.status)} bg-gray-100 dark:bg-gray-700`}>
                        {backup.status}
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
                        <button
                          onClick={() => handleRestoreBackup(backup.id)}
                          disabled={actionLoading === backup.id}
                          className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors disabled:opacity-50"
                          title="Restore Backup"
                        >
                          {actionLoading === backup.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <RotateCcw className="w-4 h-4" />
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

      {/* Backup Modal */}
      <BackupModal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
        onBackup={handleCreateBackup}
        loading={actionLoading === 'create'}
      />
    </div>
  );
}
