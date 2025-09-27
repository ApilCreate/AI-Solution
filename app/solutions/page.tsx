"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Award,
  BarChart3,
  Bot,
  Brain,
  Building2,
  Calendar,
  CheckCircle,
  ChevronRight,
  Cpu,
  Database,
  Eye,
  FileText,
  Globe,
  LineChart,
  Mic,
  Phone,
  PieChart,
  Rocket,
  Settings,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X,
  Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import dynamic from "next/dynamic";
const Beams = dynamic(() => import("../../components/Beams"), { ssr: false });
const Magnet = dynamic(() => import("../../components/Magnet"), { ssr: false });
const BackgroundBeams = dynamic(() => import("../../components/ui/background-beams").then(m => m.BackgroundBeams), { ssr: false });
const PointerHighlight = dynamic(() => import("../../components/ui/pointer-highlight").then(m => m.PointerHighlight), { ssr: false });
import H1Reveal from "../../components/H1Reveal";
import { useOutsideClick } from "../../hooks/use-outside-click";

// Dynamic import for Lucide icons
const getIcon = (iconName: string) => {
  const icons: { [key: string]: any } = {
    Bot, BarChart3, Database, Brain, Shield, Zap, Cpu, Globe, Users, Settings, TrendingUp, Target, PieChart, Activity, Eye, Mic, FileText, LineChart, Rocket
  };
  return icons[iconName] || Bot;
};

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

const benefits = [
  {
    icon: <Zap className="text-white" size={24} />,
    title: "Rapid Implementation",
    description: "Deploy AI solutions in weeks, not months, with our proven methodologies",
    color: "from-slate-700/20 to-gray-800/20"
  },
  {
    icon: <Users className="text-white" size={24} />,
    title: "Expert Support",
    description: "Dedicated AI specialists guide you through every step of the journey",
    color: "from-gray-700/20 to-slate-800/20"
  },
  {
    icon: <TrendingUp className="text-white" size={24} />,
    title: "Measurable ROI",
    description: "Track performance with detailed analytics and impact measurements",
    color: "from-slate-600/20 to-gray-700/20"
  },
  {
    icon: <Shield className="text-white" size={24} />,
    title: "Enterprise Security",
    description: "Bank-level security with compliance standards and data protection",
    color: "from-gray-800/20 to-black/20"
  }
];

export default function SolutionsPage() {
  const router = useRouter();
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Solution | boolean | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref as React.RefObject<HTMLDivElement>, () => setActive(null));

  const handleLearnMore = (solution: Solution) => {
    setActive(solution);
  };

  // Transform API data to match component expectations
  const transformedSolutions = solutions.map(solution => {
    const IconComponent = getIcon(solution.iconName);
    return {
      ...solution,
      icon: <IconComponent size={32} className="text-white" />,
      badge: solution.featured ? "Featured" : null,
      metrics: solution.pricing || "Custom pricing available",
      color: solution.featured ? "from-blue-700/20 to-blue-800/20" : "from-slate-700/20 to-slate-800/20",
      borderColor: solution.featured ? "border-blue-600/30" : "border-slate-600/30"
    };
  });

  return (
    <main className="relative w-full overflow-hidden bg-black text-white">
      {/* Add CSS for expandable cards */}
      <style jsx global>{`
        /* Smooth animations for expandable cards */
        .expandable-card {
          transform-origin: center !important;
          backface-visibility: hidden !important;
          -webkit-backface-visibility: hidden !important;
          will-change: transform !important;
        }
        
        /* Prevent text selection during animations */
        .expandable-card {
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
        }
        
        /* Line clamp utility for card descriptions */
        .line-clamp-3 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
        }
      `}</style>
      
      {/* Hero Section with RippleGrid Background */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-24">
        {/* Background */}
        <div className="absolute inset-0">
          <Beams />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Centered Content */}
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div className="bg-slate-800 no-underline group cursor-default relative shadow-2xl shadow-slate-900 rounded-xl p-px text-xs font-semibold leading-6 text-white inline-block mb-8">
              <span className="absolute inset-0 overflow-hidden rounded-xl">
                <span className="absolute inset-0 rounded-xl bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_75%)] opacity-100"></span>
              </span>
              <div className="relative flex space-x-2 items-center justify-center z-10 rounded-xl bg-slate-950 px-6 py-2 ring-1 ring-white/10">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-white text-sm">
                  AI Solutions Portfolio
                </span>
              </div>
              <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-slate-400/0 via-slate-400/90 to-slate-400/0"></span>
            </div>
            
            {/* Main Title */}
            <H1Reveal>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              AI Solutions for
              <div className="flex justify-center">
                <PointerHighlight
                  pointerClassName="text-cyan-400"
                  rectangleClassName="border-cyan-400/50"
                >
                  <span className="bg-gradient-to-r from-[#00FFB7] to-[#0000E0] bg-clip-text text-transparent">
                    Modern Business
                  </span>
                </PointerHighlight>
              </div>
            </h1>
            </H1Reveal>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-gray-200 max-w-4xl mx-auto mb-12 leading-relaxed">
              Transform your business with cutting-edge AI solutions designed to automate, 
              optimize, and scale your operations. From intelligent chatbots to predictive analytics, 
              we deliver enterprise-grade AI that drives real results.
            </p>

            {/* CTA Button */}
            <Magnet magnetStrength={2} padding={100}>
              <button 
                onClick={() => router.push('/book-demo')}
                className="bg-white text-black no-underline group cursor-pointer relative shadow-2xl shadow-white/20 rounded-full px-8 py-4 text-lg font-semibold leading-6 inline-block transition-all duration-300 hover:scale-105 hover:shadow-white/40"
              >
                <span className="absolute inset-0 overflow-hidden rounded-full">
                  <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
                </span>
                <div className="relative flex space-x-2 items-center z-10 rounded-full">
                  <span className="text-black font-medium">Book a Demo</span>
                  <ArrowRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" />
                </div>
                <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-black/0 via-black/30 to-black/0 transition-opacity duration-500 group-hover:opacity-40"></span>
              </button>
            </Magnet>
          </motion.div>
        </div>
      </section>

      {/* Solutions Section with Expandable Cards */}
      <section className="relative bg-black mt-10">
        {/* Section Header */}
        <div className="relative z-10 px-6 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <div className="bg-slate-800 no-underline group cursor-default relative shadow-2xl shadow-slate-900 rounded-xl p-px text-xs font-semibold leading-6 text-white inline-block mb-8">
                <span className="absolute inset-0 overflow-hidden rounded-xl">
                  <span className="absolute inset-0 rounded-xl bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_75%)] opacity-100"></span>
                </span>
                <div className="relative flex space-x-2 items-center justify-center z-10 rounded-xl bg-slate-950 px-6 py-2 ring-1 ring-white/10">
                  <Target className="w-4 h-4 text-white" />
                  <span className="text-white text-sm">Our Solutions</span>
                </div>
                <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-slate-400/0 via-slate-400/90 to-slate-400/0"></span>
              </div>
              
              <div className="flex justify-center">
                <PointerHighlight
                  pointerClassName="text-cyan-400"
                  rectangleClassName="border-cyan-400/50"
                >
                  <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#00FFB7] to-[#0000E0] bg-clip-text text-transparent">
                    Enterprise AI Solutions
                  </h2>
                </PointerHighlight>
              </div>
              
              <p className="text-lg text-gray-200 max-w-3xl mx-auto">
                Discover powerful AI solutions designed to transform your business operations, 
                enhance customer experiences, and drive sustainable growth.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Expandable Cards Grid */}
        <div className="max-w-7xl mx-auto px-6 pb-24">
          {/* Expandable Card Modal */}
          <AnimatePresence>
            {active && typeof active === "object" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 h-full w-full z-50"
              />
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {active && typeof active === "object" ? (
              <div className="fixed inset-0 grid place-items-center z-[100] p-4">
                <motion.button
                  key={`button-${active.title}-${id}`}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.05 } }}
                  className="flex absolute top-4 right-4 items-center justify-center bg-white/20 backdrop-blur-sm border border-white/30 rounded-full h-10 w-10 text-white hover:bg-white/30 transition-colors z-[110]"
                  onClick={() => setActive(null)}
                >
                  <X className="w-5 h-5" />
                </motion.button>
                
                <motion.div
                  layoutId={`card-${active.title}-${id}`}
                  ref={ref}
                  className="w-full max-w-4xl h-full md:h-fit md:max-h-[90%] flex flex-col bg-gradient-to-br from-slate-900/95 to-black/95 backdrop-blur-xl border border-slate-700/50 sm:rounded-3xl overflow-hidden shadow-2xl"
                >
                  {/* Header */}
                  <div className="p-8 border-b border-slate-700/50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-6">
                        <motion.div 
                          layoutId={`icon-${active.title}-${id}`}
                          className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm"
                        >
                          {(() => {
                            const IconComponent = getIcon(active.iconName);
                            return <IconComponent size={32} className="text-white" />;
                          })()}
                        </motion.div>
                        <div>
                          <div className="text-lg text-slate-400 mb-2 uppercase tracking-wider">{active.category}</div>
                          <motion.h3
                            layoutId={`title-${active.title}-${id}`}
                            className="text-4xl font-bold text-white"
                          >
                            {active.title}
                          </motion.h3>
                        </div>
                      </div>
                      
                      {active.featured && (
                        <div className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold mt-3">
                          Featured
                        </div>
                      )}
                    </div>
                    
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-slate-300 text-xl mt-4 leading-relaxed"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-8 overflow-auto">
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid md:grid-cols-2 gap-8"
                    >
                      {/* Key Features */}
                      <div>
                        <h4 className="text-white font-semibold mb-6 flex items-center gap-3 text-2xl">
                          <Award className="w-8 h-8" />
                          Key Features
                        </h4>
                        <div className="space-y-4">
                          {active.features && active.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-3 text-slate-300">
                              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                              <span className="leading-relaxed text-lg">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Use Cases */}
                      <div>
                        <h4 className="text-white font-semibold mb-6 flex items-center gap-3 text-2xl">
                          <Building2 className="w-8 h-8" />
                          Use Cases
                        </h4>
                        <div className="space-y-4">
                          {active.useCases && active.useCases.map((useCase, idx) => (
                            <div key={idx} className="flex items-start gap-3 text-slate-300">
                              <div className="w-3 h-3 bg-blue-400 rounded-full flex-shrink-0 mt-2"></div>
                              <span className="leading-relaxed text-lg">{useCase}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Metrics */}
                    <div className="mt-8 p-6 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3 text-white">
                        <TrendingUp className="w-8 h-8 text-green-400" />
                        <span className="text-2xl font-semibold">Performance Metrics</span>
                      </div>
                      <p className="text-slate-300 mt-2 text-xl">{active.pricing || "Custom pricing available"}</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-8 border-t border-slate-700/50">
                    <div className="flex justify-between items-center">
                      <div className="text-gray-200 text-lg">
                        Category: <span className="text-white font-semibold">{active.category}</span>
                      </div>
                      <button
                        onClick={() => {
                          setActive(null);
                          router.push(`/book-demo?solution=${active.id}`);
                        }}
                        className="bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-slate-200 transition-colors flex items-center gap-2 text-lg"
                      >
                        <span>Book a Demo</span>
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            ) : null}
          </AnimatePresence>

          {/* Loading State */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-slate-800/50 rounded-2xl p-8 animate-pulse">
                  <div className="w-16 h-16 bg-slate-700 rounded-xl mb-6"></div>
                  <div className="h-4 bg-slate-700 rounded mb-2"></div>
                  <div className="h-6 bg-slate-700 rounded mb-4"></div>
                  <div className="h-20 bg-slate-700 rounded mb-4"></div>
                  <div className="h-4 bg-slate-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            /* Solutions Grid with Proper Hover Effects */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transformedSolutions.map((solution, index) => (
              <div
                key={`hover-card-${solution.title}-${id}`}
                className="relative group block p-2 h-full w-full"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Animated Hover Background from card-hover-effect */}
                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.span
                      className="absolute inset-0 h-full w-full bg-slate-800/[0.8] block rounded-3xl"
                      layoutId="hoverBackground"
                      initial={{ opacity: 3 }}
                      animate={{
                        opacity: 5,
                        transition: { duration: 0.15 },
                      }}
                      exit={{
                        opacity: 0,
                        transition: { duration: 0.15, delay: 0.8 },
                      }}
                    />
                  )}
                </AnimatePresence>
                
                {/* Expandable Card Content */}
                <motion.div
                  layoutId={`card-${solution.title}-${id}`}
                  onClick={() => setActive(solution)}
                  className="relative z-20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 group-hover:border-slate-600/70 rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:scale-[1.02] h-full overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {/* Badge */}
                  {solution.badge && (
                    <div className="absolute -top-3 -right-3 bg-white text-black px-4 py-2 rounded-full text-sm font-semibold shadow-lg z-30 mt-7 mr-5">
                      {solution.badge}
                    </div>
                  )}
                  
                  {/* Card Inner Content with z-50 to stay above hover effect */}
                  <div className="relative z-50">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <motion.div 
                        layoutId={`icon-${solution.title}-${id}`}
                        className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:bg-white/15 transition-colors"
                      >
                        {solution.icon}
                      </motion.div>
                      <div>
                        <div className="text-sm text-slate-400 uppercase tracking-wider">{solution.category}</div>
                        <motion.h3
                          layoutId={`title-${solution.title}-${id}`}
                          className="text-white font-bold text-2xl group-hover:text-slate-100 transition-colors"
                        >
                          {solution.title}
                        </motion.h3>
                      </div>
                    </div>

                    {/* Description */}
                    <motion.p
                      layoutId={`description-${solution.description}-${id}`}
                      className="text-gray-200 text-lg leading-relaxed mb-6 line-clamp-3"
                    >
                      {solution.shortDescription}
                    </motion.p>

                    {/* Metrics */}
                    <div className="flex items-center gap-3 text-slate-400 text-lg mb-6">
                      <TrendingUp className="w-5 h-5" />
                      <span>{solution.metrics}</span>
                    </div>

                    {/* Features Preview */}
                    <div className="mb-6">
                      <div className="text-lg text-slate-400 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Key Features
                      </div>
                      <div className="space-y-2">
                        {solution.features && solution.features.slice(0, 2).map((feature, idx) => (
                          <div key={idx} className="text-base text-slate-300 flex items-center gap-3">
                            <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                            <span className="truncate">{feature}</span>
                          </div>
                        ))}
                        {solution.features && solution.features.length > 2 && (
                          <div className="text-base text-slate-400">+{solution.features.length - 2} more features</div>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex justify-between items-center pt-4 border-t border-slate-700/50">
                      <span className="text-base text-slate-500">Click to expand</span>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* Benefits Section with BackgroundBeams */}
      <section className="relative px-6 py-24 bg-black overflow-hidden mt-14">
        <BackgroundBeams />
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex justify-center">
              <PointerHighlight
                pointerClassName="text-cyan-400"
                rectangleClassName="border-cyan-400/50"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#00FFB7] to-[#0000E0] bg-clip-text text-transparent">
                  Why Choose Our AI Solutions?
                </h2>
              </PointerHighlight>
            </div>
            <p className="text-gray-200 text-lg max-w-3xl mx-auto">
              We combine cutting-edge technology with deep industry expertise to deliver 
              AI solutions that drive real business value and sustainable growth.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`group relative p-6 rounded-2xl bg-gradient-to-br ${benefit.color} border border-white/10 backdrop-blur-sm hover:scale-105 transition-all duration-300`}
              >
                <div className="btn-shimmer absolute inset-0 bg-[image:radial-gradient(88%_100%_at_top,rgba(255,255,255,0.05),transparent)] opacity-20 rounded-2xl hover:bg-black/40 transition duration-300 overflow-hidden"></div>
                
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">{benefit.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative px-6 py-24 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText size={32} className="text-blue-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-200 text-lg max-w-2xl mx-auto leading-relaxed">
              Get answers to common questions about our AI solutions and implementation process
            </p>
          </motion.div>
          
          <div className="grid gap-6 max-w-4xl mx-auto">
            {[
              {
                question: "What AI solutions does your company specialize in?",
                answer: "We specialize in developing custom AI solutions including intelligent chatbots, automated document processing, computer vision systems, predictive analytics, business process automation, and voice AI technologies. Our solutions are tailored to meet the specific needs of various industries."
              },
              {
                question: "How can AI solutions benefit my business?",
                answer: "Our AI solutions deliver measurable business value by automating repetitive tasks, enhancing decision-making through predictive analytics, reducing operational costs by up to 40%, improving customer satisfaction with 24/7 support, and providing actionable insights from your data."
              },
              {
                question: "What is the typical timeline for implementing an AI solution?",
                answer: "Implementation timelines vary based on complexity. Simple chatbot integrations take 2-4 weeks, mid-complexity automation solutions require 6-12 weeks, while comprehensive enterprise AI systems may need 3-6 months. We provide detailed project roadmaps during consultation."
              },
              {
                question: "How do you ensure data security and privacy?",
                answer: "We implement enterprise-grade security protocols including end-to-end encryption, secure APIs, and compliance with GDPR, HIPAA, and SOC 2. We offer flexible deployment options including on-premise, cloud, and hybrid solutions to meet your security requirements."
              },
              {
                question: "Can AI solutions integrate with existing business systems?",
                answer: "Absolutely. Our AI solutions are designed for seamless integration with your existing technology stack including CRM systems, ERP platforms, databases, and third-party applications using industry-standard APIs and protocols."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-white mb-4">{faq.question}</h3>
                <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 py-24 bg-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-slate-900/20 to-gray-900/20 p-12 rounded-3xl border border-white/10 backdrop-blur-lg relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[image:radial-gradient(88%_100%_at_top,rgba(255,255,255,0.05),transparent)] opacity-20"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Globe size={32} className="text-white" />
              </div>
              
              <div className="flex justify-center">
                <PointerHighlight
                  pointerClassName="text-cyan-400"
                  rectangleClassName="border-cyan-400/50"
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[#00FFB7] to-[#0000E0] bg-clip-text text-transparent">
                    Ready to Transform Your Business?
                  </h2>
                </PointerHighlight>
              </div>
              
              <p className="text-gray-200 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                Whether you're building a new AI product or integrating smart automation into your existing systems, 
                our solutions are built to scale, adapt, and deliver measurable impact across industries.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Magnet magnetStrength={1.5} padding={50}>
                  <button
                    onClick={() => router.push('/book-demo')}
                    className="group bg-white text-black px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:bg-gray-200 hover:scale-105 flex items-center gap-3 shadow-2xl shadow-white/10"
                  >
                    <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Book a Demo
                  </button>
                </Magnet>
                <Magnet magnetStrength={1.5} padding={50}>
                  <button
                    onClick={() => router.push('/contact')}
                    className="group border border-white/30 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:bg-white/10 hover:scale-105 flex items-center gap-3"
                  >
                    <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Contact Us
                  </button>
                </Magnet>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}