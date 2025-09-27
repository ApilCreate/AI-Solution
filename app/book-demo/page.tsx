"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Mail, 
  MapPin, 
  Send, 
  User, 
  Building2,
  CheckCircle,
  ArrowLeft,
  MessageCircle,
  Phone
} from 'lucide-react';
import dynamic from 'next/dynamic';

const BackgroundBeams = dynamic(() => import("../../components/ui/background-beams").then(m => m.BackgroundBeams), { ssr: false });
const PointerHighlight = dynamic(() => import("../../components/ui/pointer-highlight").then(m => m.PointerHighlight), { ssr: false });

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

function BookDemoForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    solutionId: searchParams.get('solution') || '',
    message: '',
    preferredDate: 'ASAP',
    preferredTime: 'Morning'
  });

  useEffect(() => {
    fetchSolutions();
  }, []);

  const fetchSolutions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/solutions/list?status=published');
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.company || !formData.solutionId) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const selectedSolution = solutions.find(s => s.id === formData.solutionId);
      if (!selectedSolution) {
        setError('Selected solution not found');
        return;
      }

      const response = await fetch('/api/demo-bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          solutionName: selectedSolution.title
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to submit demo request');
      }
    } catch (error) {
      console.error('Error submitting demo request:', error);
      setError('Failed to submit demo request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedSolution = solutions.find(s => s.id === formData.solutionId);

  if (submitted) {
    return (
      <main className="relative w-full overflow-hidden bg-black text-white min-h-screen">
        <BackgroundBeams />
        
        <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-24">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Demo Request Submitted!
              </h1>
              
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                Thank you for your interest! We've received your demo request for{' '}
                <span className="text-cyan-400 font-semibold">
                  {selectedSolution?.title}
                </span>
                {' '}and will get back to you within 24 hours.
              </p>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">What happens next?</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">We'll review your request and contact you via email</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Schedule a convenient time for your demo session</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Prepare a customized demo based on your requirements</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/solutions')}
                  className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Explore More Solutions
                </button>
                <button
                  onClick={() => router.push('/contact')}
                  className="border border-white/30 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  Contact Us
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative w-full overflow-hidden bg-black text-white min-h-screen">
      <BackgroundBeams />
      
      {/* Header */}
      <div className="relative z-10 pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Back Button */}
            <div className="flex justify-start mb-8">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>

            {/* Badge */}
            <div className="bg-slate-800 no-underline group cursor-default relative shadow-2xl shadow-slate-900 rounded-xl p-px text-xs font-semibold leading-6 text-white inline-block mb-8">
              <span className="absolute inset-0 overflow-hidden rounded-xl">
                <span className="absolute inset-0 rounded-xl bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_75%)] opacity-100"></span>
              </span>
              <div className="relative flex space-x-2 items-center justify-center z-10 rounded-xl bg-slate-950 px-6 py-2 ring-1 ring-white/10">
                <Calendar className="w-4 h-4 text-white" />
                <span className="text-white text-sm">Book a Demo</span>
              </div>
              <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-slate-400/0 via-slate-400/90 to-slate-400/0"></span>
            </div>
            
            {/* Main Title */}
            <div className="flex justify-center">
              <PointerHighlight
                pointerClassName="text-cyan-400"
                rectangleClassName="border-cyan-400/50"
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#00FFB7] to-[#0000E0] bg-clip-text text-transparent">
                  Request a Demo
                </h1>
              </PointerHighlight>
            </div>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-12 leading-relaxed">
              Experience the power of our AI solutions firsthand. Schedule a personalized demo 
              tailored to your business needs and see how we can transform your operations.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Form Section */}
      <div className="relative z-10 px-6 pb-24">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gradient-to-br from-slate-900/95 to-black/95 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
                  {error}
                </div>
              )}

              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company/Organization *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Your company or organization name"
                    required
                  />
                </div>
              </div>

              {/* Solution Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Solution *
                </label>
                <div className="relative">
                  <select
                    value={formData.solutionId}
                    onChange={(e) => handleInputChange('solutionId', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none cursor-pointer"
                    required
                    disabled={loading}
                  >
                    <option value="" className="bg-slate-800 text-white">Choose a solution...</option>
                    {solutions.map((solution) => (
                      <option key={solution.id} value={solution.id} className="bg-slate-800 text-white">
                        {solution.title}
                      </option>
                    ))}
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {loading && (
                  <p className="text-sm text-gray-400 mt-2">Loading solutions...</p>
                )}
              </div>

              {/* Preferred Date and Time */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preferred Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      value={formData.preferredDate}
                      onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                      className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none cursor-pointer"
                    >
                      <option value="ASAP" className="bg-slate-800 text-white">ASAP</option>
                      <option value="This week" className="bg-slate-800 text-white">This week</option>
                      <option value="Next week" className="bg-slate-800 text-white">Next week</option>
                      <option value="Within 2 weeks" className="bg-slate-800 text-white">Within 2 weeks</option>
                      <option value="Within a month" className="bg-slate-800 text-white">Within a month</option>
                      <option value="Flexible" className="bg-slate-800 text-white">Flexible</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preferred Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                      className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none cursor-pointer"
                    >
                      <option value="Morning" className="bg-slate-800 text-white">Morning (9 AM - 12 PM)</option>
                      <option value="Afternoon" className="bg-slate-800 text-white">Afternoon (12 PM - 5 PM)</option>
                      <option value="Evening" className="bg-slate-800 text-white">Evening (5 PM - 8 PM)</option>
                      <option value="Flexible" className="bg-slate-800 text-white">Flexible</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Message (Optional)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                  placeholder="Tell us more about your requirements, specific features you're interested in, or any questions you have..."
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={submitting || loading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Request Demo
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Contact Alternative */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="text-center">
                <p className="text-gray-400 mb-4">Having some doubts?</p>
                <button
                  onClick={() => router.push('/contact')}
                  className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contact Us Instead
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

export default function BookDemoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    }>
      <BookDemoForm />
    </Suspense>
  );
}
