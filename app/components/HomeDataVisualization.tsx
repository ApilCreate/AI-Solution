"use client";

import { motion } from "framer-motion";
import { Activity, Globe, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface InquiryData {
  id: string;
  name: string;
  email: string;
  country: string;
  reason: string;
  status: string;
  createdAt: string;
}

interface AnalyticsData {
  total: number;
  last7: number;
  pending: number;
}

interface ChartData {
  name: string;
  value: number;
}

const COLORS = ['#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe', '#e9d5ff', '#f3e8ff'];

export default function HomeDataVisualization() {
  const [inquiriesData, setInquiriesData] = useState<InquiryData[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [reasonData, setReasonData] = useState<ChartData[]>([]);
  const [countryData, setCountryData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch inquiries data
        const inquiriesResponse = await fetch('/api/inquiries/list');
        if (inquiriesResponse.ok) {
          const inquiries = await inquiriesResponse.json();
          setInquiriesData(inquiries);

          // Process reason distribution
          const reasonCount: { [key: string]: number } = {};
          inquiries.forEach((inquiry: InquiryData) => {
            reasonCount[inquiry.reason] = (reasonCount[inquiry.reason] || 0) + 1;
          });
          
          const reasonChartData = Object.entries(reasonCount).map(([name, value]) => ({
            name: name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            value
          }));
          setReasonData(reasonChartData);

          // Process country distribution (top 6)
          const countryCount: { [key: string]: number } = {};
          inquiries.forEach((inquiry: InquiryData) => {
            countryCount[inquiry.country] = (countryCount[inquiry.country] || 0) + 1;
          });
          
          const countryChartData = Object.entries(countryCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 6)
            .map(([name, value]) => ({ name, value }));
          setCountryData(countryChartData);
        }

        // Fetch analytics data
        const analyticsResponse = await fetch('/api/analytics/overview');
        if (analyticsResponse.ok) {
          const analytics = await analyticsResponse.json();
          setAnalyticsData(analytics);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <section className="px-6 py-24 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/5 border border-purple-500/30 backdrop-blur-sm mb-6">
          <Activity className="w-4 h-4 text-purple-300 mr-2" />
          <span className="text-sm font-medium text-purple-300">Live Data Insights</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
          <span className="bg-gradient-to-r from-purple-400 via-fuchsia-500 to-indigo-400 bg-clip-text text-transparent">
            Real-Time Analytics
          </span>
        </h2>
        <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
          Get insights into our client engagement and see how businesses worldwide are connecting with our AI solutions.
        </p>
      </motion.div>

      {/* Key Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
      >
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 transition-all duration-300 group-hover:border-purple-500/30 group-hover:bg-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-500/20">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{analyticsData?.total || 0}</div>
                <div className="text-sm text-gray-400">Total Inquiries</div>
              </div>
            </div>
            <div className="text-sm text-gray-300">
              Growing client interest in AI solutions
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 transition-all duration-300 group-hover:border-purple-500/30 group-hover:bg-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-500/20">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{analyticsData?.last7 || 0}</div>
                <div className="text-sm text-gray-400">Last 7 Days</div>
              </div>
            </div>
            <div className="text-sm text-gray-300">
              Recent engagement activity
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 transition-all duration-300 group-hover:border-purple-500/30 group-hover:bg-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <Globe className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{countryData.length}</div>
                <div className="text-sm text-gray-400">Countries</div>
              </div>
            </div>
            <div className="text-sm text-gray-300">
              Global reach and interest
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inquiry Reasons Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 transition-all duration-300 group-hover:border-purple-500/30 group-hover:bg-white/10">
            <h3 className="text-xl font-semibold text-white mb-6">Inquiry Categories</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reasonData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    dataKey="value"
                    className="outline-none"
                  >
                    {reasonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '12px',
                      color: 'white'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {reasonData.map((entry, index) => (
                <div key={entry.name} className="flex items-center text-sm">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-gray-300 truncate">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Country Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 transition-all duration-300 group-hover:border-purple-500/30 group-hover:bg-white/10">
            <h3 className="text-xl font-semibold text-white mb-6">Top Countries</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="rgba(255,255,255,0.6)"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="rgba(255,255,255,0.6)" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '12px',
                      color: 'white'
                    }}
                  />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}