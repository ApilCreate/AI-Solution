"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Search,
  Filter,
  Mail,
  Phone,
  Building,
  Globe,
  Tag,
  MessageSquare,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Send,
  Download,
  RefreshCw
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isSendingResponse, setIsSendingResponse] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    status: "",
    reason: "",
    country: "",
    dateRange: ""
  });
  const [showFilters, setShowFilters] = useState(false);

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

  const fetchInquiries = async () => {
    try {
      const response = await fetch('/api/inquiries/list');
      const data = await response.json();
      setInquiries(data);
      setFilteredInquiries(data);
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    }
  };

  const applyFilters = () => {
    let filtered = inquiries;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(inquiry =>
        inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(inquiry => inquiry.status === filters.status);
    }

    // Reason filter
    if (filters.reason) {
      filtered = filtered.filter(inquiry => inquiry.reason === filters.reason);
    }

    // Country filter
    if (filters.country) {
      filtered = filtered.filter(inquiry => inquiry.country === filters.country);
    }

    // Date range filter
    if (filters.dateRange) {
      const now = new Date();
      const daysAgo = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          daysAgo.setDate(now.getDate() - 1);
          break;
        case 'week':
          daysAgo.setDate(now.getDate() - 7);
          break;
        case 'month':
          daysAgo.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(inquiry => 
        new Date(inquiry.createdAt) >= daysAgo
      );
    }

    setFilteredInquiries(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, inquiries]);

  const updateInquiryStatus = async (inquiryId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setInquiries(prev => 
          prev.map(inquiry => 
            inquiry.id === inquiryId 
              ? { ...inquiry, status: newStatus }
              : inquiry
          )
        );
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  // Function to add tags to inquiries (placeholder for future use)
  const addTag = async (inquiryId: string, tag: string) => {
    try {
      const inquiry = inquiries.find(i => i.id === inquiryId);
      if (!inquiry) return;

      const newTags = [...(inquiry.tags || []), tag];
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: newTags })
      });

      if (response.ok) {
        setInquiries(prev => 
          prev.map(i => 
            i.id === inquiryId 
              ? { ...i, tags: newTags }
              : i
          )
        );
      }
    } catch (error) {
      console.error('Failed to add tag:', error);
    }
  };

  const sendResponse = async () => {
    if (!selectedInquiry || !responseMessage.trim()) return;

    setIsSendingResponse(true);
    try {
      // Here you would integrate with your email service (Resend)
      // For now, we'll just update the inquiry status
      await updateInquiryStatus(selectedInquiry.id, 'responded');
      
      // TODO: Send email using Resend
      // await sendEmail({
      //   to: selectedInquiry.email,
      //   subject: `Re: ${selectedInquiry.messageTitle}`,
      //   html: responseMessage
      // });

      setShowResponseModal(false);
      setResponseMessage("");
      setSelectedInquiry(null);
      
      // Refresh inquiries
      fetchInquiries();
    } catch (error) {
      console.error('Failed to send response:', error);
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
      case 'responded': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <AlertCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'responded': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <CheckCircle className="w-4 h-4" />;
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
              onClick={fetchInquiries}
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
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
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
                  <option value="closed">Closed</option>
                </select>

                <select
                  value={filters.reason}
                  onChange={(e) => setFilters(prev => ({ ...prev, reason: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">All Reasons</option>
                  <option value="general-inquiry">General Inquiry</option>
                  <option value="technical-support">Technical Support</option>
                  <option value="book-demo">Book a Demo</option>
                  <option value="careers">Careers</option>
                  <option value="partnerships">Partnerships</option>
                  <option value="events-inquiry">Events Inquiry</option>
                </select>

                <select
                  value={filters.country}
                  onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">All Countries</option>
                  {Array.from(new Set(inquiries.map(i => i.country))).map(country => (
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

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredInquiries.length} of {inquiries.length} inquiries
          </p>
        </div>

        {/* Inquiries List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
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
                          <Tag className="w-3 h-3" />
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
                      {inquiry.tags && inquiry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {inquiry.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedInquiry(inquiry)}
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
                        <select
                          value={inquiry.status}
                          onChange={(e) => updateInquiryStatus(inquiry.id, e.target.value)}
                          className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="new">New</option>
                          <option value="pending">Pending</option>
                          <option value="responded">Responded</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* No Results */}
        {filteredInquiries.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No inquiries found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Response Modal */}
      {showResponseModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Respond to {selectedInquiry.name}
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
                onClick={() => setShowResponseModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={sendResponse}
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
    </DashboardLayout>
  );
}
