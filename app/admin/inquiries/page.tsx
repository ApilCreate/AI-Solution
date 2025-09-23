"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Search,
  Filter,
  Mail,
  Phone,
  Building,
  Globe,
  MessageSquare,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Send,
  Download,
  RefreshCw,
  Loader2
} from "lucide-react";
import DashboardLayout from "../../../components/DashboardLayout";
import AdminGuard from "../../../components/AdminGuard";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  occupation: string;
  reason: string;
  howDidYouHear: string;
  messageTitle: string;
  message: string;
  adminResponse?: string;
  respondedAt?: string;
  status: string;
  tags: string[];
  source: string;
  createdAt: string;
}

interface FilterOptions {
  status: string;
  reason: string;
  country: string;
  dateRange: string;
}

export default function InquiriesPage() {
  const router = useRouter();
  
  // Add error handling for unhandled promise rejections
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      event.preventDefault(); // Prevent default browser behavior
    };

    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('unhandledrejection', handleUnhandledRejection);
      window.addEventListener('error', handleError);

      return () => {
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        window.removeEventListener('error', handleError);
      };
    }
  }, []);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isSendingResponse, setIsSendingResponse] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    status: "",
    reason: "",
    country: "",
    dateRange: ""
  });
  const [showFilters, setShowFilters] = useState(false);

  // Pagination and lazy loading states
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 20;

  // Status counts state
  const [statusCounts, setStatusCounts] = useState({
    new: 0,
    pending: 0,
    responded: 0,
    resolved: 0,
    cancelled: 0
  });

  // Debounce search term to prevent API calls on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    // Check authentication
    const checkAuth = () => {
      const authStatus = localStorage.getItem("adminAuthenticated");
      const loginTime = localStorage.getItem("adminLoginTime");
      
      if (authStatus === "true" && loginTime) {
        const loginTimestamp = parseInt(loginTime);
        const currentTime = Date.now();
        const sessionDuration = currentTime - loginTimestamp;
        
        if (sessionDuration < 86400000) {
          setIsAuthenticated(true);
          fetchInquiries();
          fetchStatusCounts();
        } else {
          localStorage.removeItem("adminAuthenticated");
          localStorage.removeItem("adminLoginTime");
          router.push("/admin/login");
        }
      } else {
        router.push("/admin/login");
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const fetchStatusCounts = async () => {
    try {
      console.log('Fetching status counts from /api/inquiries/stats');
      const response = await fetch('/api/inquiries/stats');
      console.log('Status counts response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Status counts data:', data);
        setStatusCounts(data.statusCounts);
        setTotalCount(data.total);
      } else {
        console.error('Failed to fetch status counts:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Response body:', errorText);
      }
    } catch (error) {
      console.error('Error fetching status counts:', error);
    }
  };

  const fetchInquiries = async (page = 1, append = false) => {
    try {
      setIsLoadingMore(append);
      if (!append) setIsLoadingInquiries(true);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        ...(filters.status && { status: filters.status }),
        ...(filters.reason && { reason: filters.reason }),
        ...(filters.country && { country: filters.country }),
        ...(debouncedSearchTerm && { search: debouncedSearchTerm })
      });

      const response = await fetch(`/api/inquiries/list?${params}`);
      const data = await response.json();

      if (append) {
        setInquiries(prev => [...prev, ...data.inquiries]);
        setFilteredInquiries(prev => [...prev, ...data.inquiries]);
      } else {
        setInquiries(data.inquiries || []);
        setFilteredInquiries(data.inquiries || []);
      }

      setTotalCount(data.total || 0);
      setHasMore((data.inquiries || []).length === ITEMS_PER_PAGE);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    } finally {
      setIsLoadingInquiries(false);
      setIsLoadingMore(false);
    }
  };

  const loadMoreInquiries = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchInquiries(currentPage + 1, true);
    }
  }, [currentPage, hasMore, isLoadingMore]);

  // Manual search function
  const handleSearch = useCallback(() => {
    setCurrentPage(1);
    setInquiries([]);
    setFilteredInquiries([]);
    fetchInquiries(1, false);
  }, [filters, debouncedSearchTerm]);

  // Handle filter changes (but not search term)
  const handleFiltersChange = useCallback(() => {
    setCurrentPage(1);
    setInquiries([]);
    setFilteredInquiries([]);
    fetchInquiries(1, false);
  }, [filters, debouncedSearchTerm]);

  // Auto-trigger search when debounced search term changes
  useEffect(() => {
    if (isAuthenticated && debouncedSearchTerm !== searchTerm) {
      handleSearch();
    }
  }, [debouncedSearchTerm, isAuthenticated, handleSearch]);

  // Use effect to trigger search when filters change (but not search term)
  useEffect(() => {
    if (isAuthenticated) {
      handleFiltersChange();
    }
  }, [filters, isAuthenticated, handleFiltersChange]);

  // Initial load
  useEffect(() => {
    if (isAuthenticated) {
      fetchInquiries(1, false);
    }
  }, [isAuthenticated]);

  const updateInquiryStatus = async (inquiryId: string, newStatus: string) => {
    try {
      console.log(`Updating inquiry ${inquiryId} to status: ${newStatus}`);
      
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      console.log(`Response status: ${response.status}`);

      if (response.ok) {
        const updatedInquiry = await response.json();
        console.log('Successfully updated inquiry:', updatedInquiry);
        
        // Update local state immediately
        setInquiries(prev => 
          prev.map(inquiry => 
            inquiry.id === inquiryId 
              ? { ...inquiry, status: newStatus }
              : inquiry
          )
        );
        
        // Also update filtered inquiries
        setFilteredInquiries(prev => 
          prev.map(inquiry => 
            inquiry.id === inquiryId 
              ? { ...inquiry, status: newStatus }
              : inquiry
          )
        );

        console.log(`Status updated to ${newStatus} for inquiry ${inquiryId}`);
        
        // Refresh status counts
        fetchStatusCounts();
      } else {
        const errorText = await response.text();
        console.error('Failed to update status. Response:', errorText);
        console.error('Status:', response.status, 'Status Text:', response.statusText);
        
        try {
          const errorData = JSON.parse(errorText);
          console.error('Error data:', errorData);
          alert(`Failed to update status: ${errorData.error || 'Unknown error'}`);
        } catch {
          alert(`Failed to update status. Server returned: ${response.status} ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Network error while updating status:', error);
      alert('Failed to update status. Please check your connection and try again.');
    }
  };

  const sendResponse = async () => {
    if (!selectedInquiry || !responseMessage.trim()) return;

    setIsSendingResponse(true);
    try {
      // Update inquiry with admin response - this will automatically send email
      const response = await fetch(`/api/inquiries/${selectedInquiry.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'responded',
          adminResponse: responseMessage.trim()
        }),
      });

      if (response.ok) {
        console.log('Response sent successfully!');
        setShowResponseModal(false);
        setResponseMessage("");
        setSelectedInquiry(null);
        
        // Refresh inquiries
        await fetchInquiries();
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to send response:', errorData);
        throw new Error(errorData.error || 'Failed to send response');
      }
    } catch (error) {
      console.error('Failed to send response:', error);
      // Show error message to user (you could use toast notification here)
      const errorMessage = error instanceof Error ? error.message : 'Error sending response. Please try again.';
      console.error('Error details:', errorMessage);
    } finally {
      setIsSendingResponse(false);
    }
  };

  const exportInquiries = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Company', 'Country', 'Reason', 'Status', 'Date'],
      ...filteredInquiries.map(inquiry => [
        inquiry.name,
        inquiry.email,
        inquiry.phone,
        inquiry.company || '',
        inquiry.country,
        inquiry.reason,
        inquiry.status,
        new Date(inquiry.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inquiries-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'responded': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <AlertCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'responded': return <Send className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <AdminGuard>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Inquiries Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and respond to customer inquiries
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={exportInquiries}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={() => {
                setCurrentPage(1);
                setInquiries([]);
                setFilteredInquiries([]);
                fetchInquiries(1, false);
              }}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search inquiries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isLoadingInquiries}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
              >
                {isLoadingInquiries ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Search
              </button>
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  const newStatus = filters.status === 'resolved' ? '' : 'resolved';
                  setFilters(prev => ({ ...prev, status: newStatus }));
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 text-sm ${
                  filters.status === 'resolved'
                    ? 'bg-green-600 text-white'
                    : 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                {filters.status === 'resolved' ? 'Show All' : 'Resolved'}
              </button>

              <button
                onClick={() => {
                  const newStatus = filters.status === 'new' ? '' : 'new';
                  setFilters(prev => ({ ...prev, status: newStatus }));
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 text-sm ${
                  filters.status === 'new'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/30'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                {filters.status === 'new' ? 'Show All' : 'New'}
              </button>

              <button
                onClick={() => {
                  const newStatus = filters.status === 'pending' ? '' : 'pending';
                  setFilters(prev => ({ ...prev, status: newStatus }));
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 text-sm ${
                  filters.status === 'pending'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/30'
                }`}
              >
                <Clock className="w-4 h-4" />
                {filters.status === 'pending' ? 'Show All' : 'Pending'}
              </button>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 text-sm"
              >
                <Filter className="w-4 h-4" />
                More Filters
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  <option value="new">New</option>
                  <option value="pending">Pending</option>
                  <option value="responded">Responded</option>
                  <option value="resolved">Resolved</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <select
                  value={filters.reason}
                  onChange={(e) => setFilters(prev => ({ ...prev, reason: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">All Reasons</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Book a Demo">Book a Demo</option>
                  <option value="Careers">Careers</option>
                  <option value="Partnerships">Partnerships</option>
                  <option value="Events Inquiry">Events Inquiry</option>
                </select>

                <select
                  value={filters.country}
                  onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">All Countries</option>
                  {Array.from(new Set(inquiries.filter(i => i.country).map(i => i.country))).sort().map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>

                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </motion.div>
          )}
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[
            { status: 'new', label: 'New', icon: AlertCircle, color: 'blue' },
            { status: 'pending', label: 'Pending', icon: Clock, color: 'yellow' },
            { status: 'responded', label: 'Responded', icon: Send, color: 'purple' },
            { status: 'resolved', label: 'Resolved', icon: CheckCircle, color: 'green' },
            { status: 'cancelled', label: 'Cancelled', icon: AlertCircle, color: 'red' }
          ].map(({ status, label, icon: Icon, color }) => {
            const count = statusCounts[status as keyof typeof statusCounts];
            const isActive = filters.status === status;
            
            return (
              <button
                key={status}
                onClick={() => {
                  const newStatus = filters.status === status ? '' : status;
                  setFilters(prev => ({ ...prev, status: newStatus }));
                }}
                className={`p-4 rounded-xl border transition-all duration-200 ${
                  isActive
                    ? `bg-${color}-50 border-${color}-200 dark:bg-${color}-900/20 dark:border-${color}-800`
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${
                    isActive 
                      ? `text-${color}-600 dark:text-${color}-400` 
                      : 'text-gray-400 dark:text-gray-500'
                  }`} />
                  <span className={`text-2xl font-bold ${
                    isActive 
                      ? `text-${color}-600 dark:text-${color}-400` 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {count}
                  </span>
                </div>
                <p className={`text-sm font-medium ${
                  isActive 
                    ? `text-${color}-700 dark:text-${color}-300` 
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {label}
                </p>
              </button>
            );
          })}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-400">
            {isLoadingInquiries ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading inquiries...
              </span>
            ) : (
              `Showing ${filteredInquiries.length} of ${totalCount} inquiries`
            )}
          </p>
          {filters.status && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, status: '' }))}
              className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200"
            >
              Clear status filter
            </button>
          )}
        </div>

        {/* Inquiries List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          {isLoadingInquiries ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Loading inquiries...</span>
              </div>
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No inquiries found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {inquiry.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {inquiry.email}
                        </div>
                        {inquiry.phone && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {inquiry.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900 dark:text-white font-medium">
                          {inquiry.messageTitle}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {inquiry.message.length > 100 
                            ? `${inquiry.message.substring(0, 100)}...` 
                            : inquiry.message
                          }
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          {inquiry.company && (
                            <span className="flex items-center gap-1">
                              <Building className="w-3 h-3" />
                              {inquiry.company}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {inquiry.country}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <MessageSquare className="w-3 h-3" />
                          {inquiry.reason}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${getStatusColor(inquiry.status)}`}>
                          {getStatusIcon(inquiry.status)}
                          {inquiry.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedInquiry(inquiry);
                            setShowDetailModal(true);
                          }}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedInquiry(inquiry);
                            setShowResponseModal(true);
                          }}
                          className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          inquiry.status === 'new' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          inquiry.status === 'responded' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}>
                          {inquiry.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Load More Button */}
        {!isLoadingInquiries && hasMore && (
          <div className="text-center py-6">
            <button
              onClick={loadMoreInquiries}
              disabled={isLoadingMore}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Load More Inquiries
                  <span className="text-sm bg-blue-500 px-2 py-1 rounded">
                    {filteredInquiries.length} of {totalCount}
                  </span>
                </>
              )}
            </button>
          </div>
        )}

        {/* End of list indicator */}
        {!isLoadingInquiries && !hasMore && filteredInquiries.length > 0 && (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
            You've reached the end of the list
          </div>
        )}
      </div>

      {/* Inquiry Detail Modal */}
      {showDetailModal && selectedInquiry && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDetailModal(false);
            }
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
               onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Inquiry Details
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column - Contact Information */}
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Contact Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                      <p className="text-gray-900 dark:text-white">{selectedInquiry.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                      <p className="text-gray-900 dark:text-white">{selectedInquiry.email}</p>
                    </div>
                    {selectedInquiry.phone && (
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                        <p className="text-gray-900 dark:text-white flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {selectedInquiry.phone}
                        </p>
                      </div>
                    )}
                    {selectedInquiry.company && (
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Company</label>
                        <p className="text-gray-900 dark:text-white flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          {selectedInquiry.company}
                        </p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Country</label>
                      <p className="text-gray-900 dark:text-white flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        {selectedInquiry.country}
                      </p>
                    </div>
                    {selectedInquiry.occupation && (
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Occupation</label>
                        <p className="text-gray-900 dark:text-white">{selectedInquiry.occupation}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Inquiry Details
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Reason</label>
                      <p className="text-gray-900 dark:text-white capitalize">{selectedInquiry.reason.replace(/-/g, ' ')}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">How They Heard About Us</label>
                      <p className="text-gray-900 dark:text-white capitalize">{selectedInquiry.howDidYouHear.replace(/-/g, ' ')}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Source</label>
                      <p className="text-gray-900 dark:text-white">{selectedInquiry.source}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedInquiry.status)}`}>
                        {getStatusIcon(selectedInquiry.status)}
                        {selectedInquiry.status}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Date Submitted</label>
                      <p className="text-gray-900 dark:text-white">{new Date(selectedInquiry.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Message */}
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Message
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Subject</label>
                      <p className="text-lg font-medium text-gray-900 dark:text-white">{selectedInquiry.messageTitle}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Message</label>
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 mt-2">
                        <p className="text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
                          {selectedInquiry.message}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin Response Section */}
                {selectedInquiry.adminResponse && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Your Response
                      {selectedInquiry.respondedAt && (
                        <span className="text-sm font-normal text-green-600 dark:text-green-300">
                          • Sent on {new Date(selectedInquiry.respondedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      )}
                    </h4>
                    <div className="bg-white dark:bg-gray-800 border border-green-200 dark:border-green-700 rounded-lg p-4">
                      <p className="text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
                        {selectedInquiry.adminResponse}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowDetailModal(false);
                      setShowResponseModal(true);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                  >
                    <MessageSquare className="w-4 h-4" />
                    {selectedInquiry.adminResponse ? 'Send Follow-up' : 'Send Response'}
                  </button>
                  
                  <select
                    value={selectedInquiry.status}
                    onChange={(e) => {
                      updateInquiryStatus(selectedInquiry.id, e.target.value);
                      setSelectedInquiry({...selectedInquiry, status: e.target.value});
                    }}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="new">New</option>
                    <option value="pending">Pending</option>
                    <option value="responded">Responded</option>
                    <option value="resolved">Resolved</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && selectedInquiry && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowResponseModal(false);
            }
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
               onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedInquiry.adminResponse ? 'Send Follow-up to' : 'Respond to'} {selectedInquiry.name}
              </h3>
              <button
                onClick={() => setShowResponseModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
            
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Original Message: {selectedInquiry.messageTitle}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {selectedInquiry.message}
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Response
              </label>
              <textarea
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Type your response here..."
              />
            </div>
            
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowResponseModal(false);
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  sendResponse();
                }}
                disabled={isSendingResponse || !responseMessage.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isSendingResponse ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Response
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        )}
      </div>
      </AdminGuard>
    </DashboardLayout>
  );
}