"use client";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, StarOff, Search, Filter } from 'lucide-react';
import SolutionForm from '../../../components/SolutionForm';
import DashboardLayout from '../../../components/DashboardLayout';
import AdminGuard from '../../../components/AdminGuard';

interface Solution {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  features: string[];
  benefits: string[];
  useCases: string[];
  pricing: string;
  imageUrl: string;
  iconName: string;
  status: 'draft' | 'published';
  featured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminSolutionsPage() {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSolution, setEditingSolution] = useState<Solution | null>(null);

  useEffect(() => {
    fetchSolutions();
  }, []);

  const fetchSolutions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/solutions');
      if (response.ok) {
        const data = await response.json();
        setSolutions(data);
      }
    } catch (error) {
      console.error('Error fetching solutions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this solution?')) return;

    try {
      const response = await fetch(`/api/solutions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSolutions(solutions.filter(s => s.id !== id));
        toast.success('Solution deleted successfully!');
      } else {
        toast.error('Failed to delete solution. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting solution:', error);
      toast.error('Failed to delete solution. Please try again.');
    }
  };

  const handleToggleStatus = async (solution: Solution) => {
    try {
      const newStatus = solution.status === 'published' ? 'draft' : 'published';
      const response = await fetch(`/api/solutions/${solution.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...solution,
          status: newStatus,
        }),
      });

      if (response.ok) {
        setSolutions(solutions.map(s => 
          s.id === solution.id ? { ...s, status: newStatus } : s
        ));
        toast.success(`Solution ${newStatus === 'published' ? 'published' : 'unpublished'} successfully!`);
      } else {
        toast.error('Failed to update solution status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating solution status:', error);
      toast.error('Failed to update solution status. Please try again.');
    }
  };

  const handleToggleFeatured = async (solution: Solution) => {
    try {
      const response = await fetch(`/api/solutions/${solution.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...solution,
          featured: !solution.featured,
        }),
      });

      if (response.ok) {
        setSolutions(solutions.map(s => 
          s.id === solution.id ? { ...s, featured: !solution.featured } : s
        ));
        toast.success(`Solution ${!solution.featured ? 'featured' : 'unfeatured'} successfully!`);
      } else {
        toast.error('Failed to update solution featured status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating solution featured status:', error);
      toast.error('Failed to update solution featured status. Please try again.');
    }
  };

  const handleSaveSolution = async (solutionData: any) => {
    try {
      const url = editingSolution ? `/api/solutions/${editingSolution.id}` : '/api/solutions';
      const method = editingSolution ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(solutionData),
      });

      if (response.ok) {
        const savedSolution = await response.json();
        
        if (editingSolution) {
          setSolutions(solutions.map(s => 
            s.id === editingSolution.id ? savedSolution : s
          ));
        } else {
          setSolutions([...solutions, savedSolution]);
        }
        
        setShowCreateForm(false);
        setEditingSolution(null);
        toast.success(editingSolution ? 'Solution updated successfully!' : 'Solution created successfully!');
      } else {
        toast.error('Failed to save solution. Please try again.');
      }
    } catch (error) {
      console.error('Error saving solution:', error);
      toast.error('Failed to save solution. Please try again.');
    }
  };

  const filteredSolutions = solutions.filter(solution => {
    const matchesSearch = solution.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         solution.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || solution.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || solution.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = [...new Set(solutions.map(s => s.category))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading solutions...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminGuard>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search solutions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Create Button */}
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Solution
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-2xl font-bold text-gray-900">{solutions.length}</div>
            <div className="text-gray-600">Total Solutions</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-2xl font-bold text-green-600">
              {solutions.filter(s => s.status === 'published').length}
            </div>
            <div className="text-gray-600">Published</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-2xl font-bold text-yellow-600">
              {solutions.filter(s => s.status === 'draft').length}
            </div>
            <div className="text-gray-600">Drafts</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-2xl font-bold text-purple-600">
              {solutions.filter(s => s.featured).length}
            </div>
            <div className="text-gray-600">Featured</div>
          </div>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSolutions.map((solution) => (
            <div key={solution.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Solution Image */}
              {solution.imageUrl && (
                <div className="h-48 bg-gray-200">
                  <img
                    src={solution.imageUrl}
                    alt={solution.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{solution.title}</h3>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      solution.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {solution.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {solution.featured && (
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {solution.shortDescription || solution.description}
                </p>

                {/* Category and Pricing */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="bg-gray-100 px-2 py-1 rounded">{solution.category}</span>
                  {solution.pricing && <span>{solution.pricing}</span>}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingSolution(solution)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleStatus(solution)}
                    className={`px-3 py-2 rounded text-sm transition-colors flex items-center gap-1 ${
                      solution.status === 'published'
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {solution.status === 'published' ? (
                      <>
                        <EyeOff className="w-4 h-4" />
                        Unpublish
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        Publish
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleToggleFeatured(solution)}
                    className={`px-3 py-2 rounded text-sm transition-colors ${
                      solution.featured
                        ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {solution.featured ? (
                      <Star className="w-4 h-4 fill-current" />
                    ) : (
                      <StarOff className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(solution.id)}
                    className="px-3 py-2 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSolutions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">No solutions found</div>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Forms */}
      {showCreateForm && (
        <SolutionForm
          onSave={handleSaveSolution}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {editingSolution && (
        <SolutionForm
          solution={editingSolution}
          onSave={handleSaveSolution}
          onCancel={() => setEditingSolution(null)}
        />
      )}
      </DashboardLayout>
    </AdminGuard>
  );
}
