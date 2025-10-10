"use client";

import { useState, useEffect } from 'react';
import { Calendar, Clock, Mail, User, Building2, Search, Filter, Eye, Reply, CheckCircle, XCircle, AlertCircle, CalendarDays, Timer, Trash2, Download } from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';
import AdminGuard from '../../../components/AdminGuard';
import toast from 'react-hot-toast';

interface DemoBooking {
  id: string;
  name: string;
  email: string;
  company: string;
  solutionId: string;
  solutionName: string;
  message: string;
  preferredDate: string;
  preferredTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  adminNotes: string;
  adminReply: string;
  repliedAt: string;
  scheduledAt: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<DemoBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [selectedBooking, setSelectedBooking] = useState<DemoBooking | null>(null);
  const [replyText, setReplyText] = useState('');
  const [notes, setNotes] = useState('');
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/demo-bookings');
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: DemoBooking['status']) => {
    try {
      const response = await fetch(`/api/demo-bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus
        }),
      });

      if (response.ok) {
        setBookings(bookings.map(b => 
          b.id === bookingId ? { ...b, status: newStatus } : b
        ));
        toast.success('Booking status updated successfully!');
      } else {
        toast.error('Failed to update booking status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status. Please try again.');
    }
  };

  const handleReply = async () => {
    if (!selectedBooking || !replyText.trim()) return;

    try {
      setReplying(true);
      const response = await fetch(`/api/demo-bookings/${selectedBooking.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminReply: replyText,
          adminNotes: notes
        }),
      });

      if (response.ok) {
        setBookings(bookings.map(b => 
          b.id === selectedBooking.id 
            ? { 
                ...b, 
                adminReply: replyText, 
                adminNotes: notes,
                repliedAt: new Date().toISOString()
              } 
            : b
        ));
        setSelectedBooking(null);
        setReplyText('');
        setNotes('');
        toast.success('Reply sent successfully!');
      } else {
        toast.error('Failed to send reply. Please try again.');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send reply. Please try again.');
    } finally {
      setReplying(false);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/demo-bookings/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBookings(bookings.filter(b => b.id !== id));
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking(null);
        }
        toast.success('Booking deleted successfully!');
      } else {
        toast.error('Failed to delete booking. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Failed to delete booking. Please try again.');
    }
  };

  const handleExportCSV = () => {
    try {
      const csvData = filteredBookings.map(booking => ({
        'Booking ID': booking.id,
        'Name': booking.name,
        'Email': booking.email,
        'Company': booking.company,
        'Solution Name': booking.solutionName || 'N/A',
        'Solution ID': booking.solutionId || 'N/A',
        'Message': booking.message || '',
        'Preferred Date': booking.preferredDate || 'Not specified',
        'Preferred Time': booking.preferredTime || 'Not specified',
        'Status': booking.status,
        'Admin Notes': booking.adminNotes || '',
        'Admin Reply': booking.adminReply || '',
        'Replied At': booking.repliedAt ? formatDateTime(booking.repliedAt).full : 'N/A',
        'Created At': formatDateTime(booking.createdAt).full,
        'Updated At': formatDateTime(booking.updatedAt).full
      }));

      const headers = Object.keys(csvData[0]);
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `demo-bookings-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Bookings exported successfully!');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Failed to export bookings. Please try again.');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.solutionName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: DemoBooking['status']) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: DemoBooking['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';

    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return { date: 'N/A', time: 'N/A', full: 'N/A' };
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return { date: 'Invalid', time: 'Invalid', full: 'Invalid date' };
    
    return {
      date: date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      full: date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  if (loading) {
    return (
      <AdminGuard>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading bookings...</div>
          </div>
        </DashboardLayout>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Demo Bookings</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage demo requests and customer interactions</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{bookings.length}</div>
              <div className="text-gray-600 dark:text-gray-400">Total Bookings</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="text-2xl font-bold text-yellow-600">
                {bookings.filter(b => b.status === 'pending').length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Pending</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="text-2xl font-bold text-blue-600">
                {bookings.filter(b => b.status === 'confirmed').length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Confirmed</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="text-2xl font-bold text-green-600">
                {bookings.filter(b => b.status === 'completed').length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Completed</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Export CSV Button */}
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Bookings List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Customer & Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Solution Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Preferred Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Requested
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {booking.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {booking.email}
                          </div>
                          <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {booking.company}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {booking.solutionName || 'Unknown Solution'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          ID: {booking.solutionId ? booking.solutionId.slice(0, 8) + '...' : 'N/A'}
                        </div>
                        {booking.message && (
                          <div className="text-xs text-gray-600 dark:text-gray-300 mt-1 max-w-xs truncate">
                            "{booking.message}"
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {booking.preferredDate || 'Not specified'} - {booking.preferredTime || 'Not specified'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1 capitalize">{booking.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4" />
                          <div>
                            <div>{formatDate(booking.createdAt)}</div>
                            <div className="text-xs text-gray-400">
                              {formatDateTime(booking.createdAt).time}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setReplyText('');
                              setNotes('');
                            }}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Delete Booking"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          
                          {/* Status Change Dropdown */}
                          <select
                            value={booking.status}
                            onChange={(e) => handleStatusUpdate(booking.id, e.target.value as DemoBooking['status'])}
                            className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredBookings.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">No bookings found</div>
                <p className="text-gray-400 dark:text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
          </div>

          {/* Reply Modal */}
          {selectedBooking && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Reply to {selectedBooking.name}
                    </h3>
                    <button
                      onClick={() => setSelectedBooking(null)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Booking Details */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">Solution:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">{selectedBooking.solutionName}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">Company:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">{selectedBooking.company}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">Preferred:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">{selectedBooking.preferredDate} - {selectedBooking.preferredTime}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">Status:</span>
                        <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                          {getStatusIcon(selectedBooking.status)}
                          <span className="ml-1 capitalize">{selectedBooking.status}</span>
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">Requested:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" />
                          {formatDate(selectedBooking.createdAt)} at {formatDateTime(selectedBooking.createdAt).time}
                        </span>
                      </div>
                      {selectedBooking.repliedAt && (
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">Replied:</span>
                          <span className="ml-2 text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            <Timer className="w-3 h-3" />
                            {formatDate(selectedBooking.repliedAt)} at {formatDateTime(selectedBooking.repliedAt).time}
                          </span>
                        </div>
                      )}
                    </div>
                    {selectedBooking.message && (
                      <div className="mt-4">
                        <span className="font-medium text-gray-900 dark:text-white">Message:</span>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">{selectedBooking.message}</p>
                      </div>
                    )}
                    {selectedBooking.adminNotes && (
                      <div className="mt-4">
                        <span className="font-medium text-gray-900 dark:text-white">Admin Notes:</span>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">{selectedBooking.adminNotes}</p>
                      </div>
                    )}
                    {selectedBooking.adminReply && (
                      <div className="mt-4">
                        <span className="font-medium text-gray-900 dark:text-white">Previous Reply:</span>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">{selectedBooking.adminReply}</p>
                      </div>
                    )}
                  </div>

                  {/* Reply Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Reply Message
                      </label>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Type your reply message here..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Admin Notes (Internal)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Internal notes about this booking..."
                      />
                    </div>


                    <div className="flex justify-end gap-4 pt-4">
                      <button
                        onClick={() => setSelectedBooking(null)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleReply}
                        disabled={replying || !replyText.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                      >
                        <Reply className="w-4 h-4" />
                        {replying ? 'Sending...' : 'Send Reply'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AdminGuard>
  );
}
