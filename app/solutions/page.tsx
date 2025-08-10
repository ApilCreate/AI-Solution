"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { 
  BrainCircuit, Bot, FileText, Eye, Mic, LineChart, Rocket, Wand2, ShieldCheck,
  ArrowRight, CheckCircle, Zap, Users, TrendingUp, Clock, Shield, Globe
} from "lucide-react";
import { GradientButton, FeatureCard, SectionHeader, Badge, StatCard, SolutionCard, PrimaryButton, SecondaryButton } from "../components/ui";
import OptimizedSpline from "../components/OptimizedSpline";
import OptimizedMotion, { fadeInUp, fadeIn, staggerContainer } from "../components/OptimizedMotion";

// Dynamically import Spline with better error handling
const Spline = dynamic(() => import("@splinetool/react-spline"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-purple-500/20 via-fuchsia-500/30 to-indigo-500/20 animate-pulse" />
  )
});

// Simple Error Boundary component
function ErrorBoundary({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

const solutions = [
  {
    title: "AI Chatbots",
    description: "Transform customer interactions with intelligent conversational AI that understands context, learns from interactions, and provides 24/7 multilingual support.",
    icon: <Bot size={32} className="text-purple-300" />,
    features: ["Natural Language Processing", "Multi-platform Integration", "Real-time Learning"],
    useCases: ["Customer Support", "Sales Assistance", "Internal Help Desk"],
    metrics: "90% faster response times"
  },
  {
    title: "Document AI",
    description: "Revolutionize document processing with advanced OCR, intelligent data extraction, and automated workflow integration for contracts, invoices, and reports.",
    icon: <FileText size={32} className="text-purple-300" />,
    features: ["Smart OCR Technology", "Data Validation", "Workflow Automation"],
    useCases: ["Contract Analysis", "Invoice Processing", "Compliance Reporting"],
    metrics: "85% reduction in processing time"
  },
  {
    title: "Vision AI",
    description: "Deploy cutting-edge computer vision for real-time object detection, quality control, security monitoring, and visual content analysis.",
    icon: <Eye size={32} className="text-purple-300" />,
    features: ["Real-time Detection", "Custom Model Training", "Edge Computing"],
    useCases: ["Quality Control", "Security Systems", "Inventory Management"],
    metrics: "99.2% accuracy rate"
  },
  {
    title: "Voice AI",
    description: "Enable natural voice interactions with advanced speech recognition, sentiment analysis, and text-to-speech capabilities for seamless user experiences.",
    icon: <Mic size={32} className="text-purple-300" />,
    features: ["Speech Recognition", "Voice Synthesis", "Emotion Detection"],
    useCases: ["Voice Assistants", "Call Analytics", "Accessibility Solutions"],
    metrics: "95% voice recognition accuracy"
  },
  {
    title: "Predictive Analytics",
    description: "Harness the power of machine learning to forecast trends, optimize operations, and make data-driven decisions that drive business growth.",
    icon: <LineChart size={32} className="text-purple-300" />,
    features: ["Time Series Forecasting", "Anomaly Detection", "Risk Assessment"],
    useCases: ["Demand Forecasting", "Fraud Detection", "Market Analysis"],
    metrics: "40% improvement in forecasting accuracy"
  },
  {
    title: "Recommendation Engines",
    description: "Boost engagement and revenue with AI-powered personalization that adapts to user behavior, preferences, and contextual signals in real-time.",
    icon: <Rocket size={32} className="text-purple-300" />,
    features: ["Collaborative Filtering", "Content-based Filtering", "Hybrid Models"],
    useCases: ["E-commerce", "Content Platforms", "Product Discovery"],
    metrics: "35% increase in user engagement"
  },
  {
    title: "Automation Tools",
    description: "Deploy intelligent AI agents that streamline complex workflows, reduce manual tasks, and optimize business processes across departments.",
    icon: <Wand2 size={32} className="text-purple-300" />,
    features: ["Process Mining", "RPA Integration", "Decision Automation"],
    useCases: ["Data Processing", "Report Generation", "Task Scheduling"],
    metrics: "70% reduction in manual work"
  },
  {
    title: "Secure AI Infrastructure",
    description: "Build enterprise-grade AI systems with advanced security, compliance monitoring, model governance, and scalable cloud architecture.",
    icon: <ShieldCheck size={32} className="text-purple-300" />,
    features: ["End-to-End Encryption", "Model Governance", "Compliance Monitoring"],
    useCases: ["Enterprise AI", "Regulated Industries", "Data Protection"],
    metrics: "100% compliance adherence"
  },
];

const benefits = [
  {
    icon: <Zap className="text-yellow-400" size={24} />,
    title: "Rapid Implementation",
    description: "Deploy AI solutions in weeks, not months, with our proven methodologies"
  },
  {
    icon: <Users className="text-blue-400" size={24} />,
    title: "Expert Support",
    description: "Dedicated AI specialists guide you through every step of the journey"
  },
  {
    icon: <TrendingUp className="text-green-400" size={24} />,
    title: "Measurable ROI",
    description: "Track performance with detailed analytics and impact measurements"
  },
  {
    icon: <Shield className="text-purple-400" size={24} />,
    title: "Enterprise Security",
    description: "Bank-level security with compliance standards and data protection"
  }
];

export default function SolutionsPage() {
  const [showContent, setShowContent] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [splineError, setSplineError] = useState(false);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  const handleSplineError = useCallback((error: any) => {
    console.warn('Spline loading error:', error);
    setSplineError(true);
  }, []);

  const handleSplineLoad = useCallback(() => {
    setSplineLoaded(true);
  }, []);

  useEffect(() => {
    setMounted(true);
    const delay = setTimeout(() => setShowContent(true), 1500);
    
    // Fallback timeout for Spline loading
    const splineTimeout = setTimeout(() => {
      if (!splineLoaded && !splineError) {
        console.warn('Spline loading timeout, switching to fallback');
        setSplineError(true);
      }
    }, 5000);
    
    return () => {
      clearTimeout(delay);
      clearTimeout(splineTimeout);
    };
  }, [splineLoaded, splineError]);

  return (
    <main className="relative w-full overflow-hidden bg-[#05010D] text-[#e0e0ff]">
      {/* Hide Spline watermarks */}
      <style jsx global>{`
        #spline-watermark,
        .spline-watermark,
        [class*="watermark"],
        .spline-logo,
        [data-spline*="logo"],
        [class*="spline-logo"],
        canvas + div,
        canvas ~ div,
        div[style*="position: absolute"][style*="bottom"],
        div[style*="position: absolute"][style*="right"],
        div[style*="position: fixed"][style*="bottom"],
        div[style*="position: fixed"][style*="right"],
        [class*="logo"],
        [id*="logo"],
        [data-*="logo"],
        a[href*="spline"],
        div[style*="z-index: 999"],
        div[style*="z-index: 9999"],
        iframe + div,
        canvas + a,
        [style*="position: absolute; bottom: 20px"],
        [style*="position: absolute; right: 20px"],
        [style*="cursor: pointer"][style*="position: absolute"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
          z-index: -9999 !important;
          width: 0 !important;
          height: 0 !important;
          overflow: hidden !important;
        }
        
        /* Hide small clickable elements that might be logos */
        div[style*="width: 40px"],
        div[style*="width: 50px"],
        div[style*="width: 60px"],
        div[style*="height: 40px"],
        div[style*="height: 50px"],
        div[style*="height: 60px"] {
          display: none !important;
        }

        /* Additional logo hiding for Spline */
        canvas ~ * {
          display: none !important;
        }
        
        /* Force hide any remaining watermarks */
        * [class*="watermark"], 
        * [id*="watermark"],
        * [class*="logo"],
        * [id*="logo"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
        }
      `}</style>

      {/* Hero Section w/ 3D background */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20 pb-32 z-10">
        <div className="absolute inset-0 z-0 pointer-events-none">
          {!splineError ? (
            <div className="relative w-full h-full">
              {mounted && (
                <OptimizedSpline
                  scene="https://prod.spline.design/dL3Q4AD8LjqF02yB/scene.splinecode"
                  onError={handleSplineError}
                  onLoad={handleSplineLoad}
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    background: 'transparent',
                    pointerEvents: 'none'
                  }}
                />
              )}
              {/* Strong dark overlay to completely hide Spline logo */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Bottom overlay - larger and darker */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/95 via-black/70 to-transparent"></div>
                {/* Right overlay - larger coverage */}
                <div className="absolute bottom-0 right-0 w-48 h-32 bg-gradient-to-tl from-black/95 via-black/70 to-transparent"></div>
                {/* Additional corner coverage with blur for seamless blending */}
                <div className="absolute bottom-0 right-0 w-40 h-28 bg-black/85 blur-sm"></div>
                {/* Extra edge coverage */}
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/60 to-transparent"></div>
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/60 to-transparent"></div>
                <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/60 to-transparent"></div>
              </div>
              {!splineLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-fuchsia-500/30 to-indigo-500/20 animate-pulse" />
              )}
            </div>
          ) : (
            // Fallback gradient background when Spline fails
            <div className="w-full h-full bg-gradient-to-br from-purple-500/20 via-fuchsia-500/30 to-indigo-500/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#05010D]/20 to-[#05010D] pointer-events-none" />
        </div>

        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative z-10 max-w-5xl space-y-8 bg-black/20 backdrop-blur-lg border border-white/10 rounded-3xl p-12 shadow-2xl"
          >
            <Badge
              variant="purple"
              icon={<BrainCircuit size={16} />}
              size="md"
            >
              Cutting-Edge AI Solutions
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
              <span className="bg-gradient-to-r from-purple-300 via-fuchsia-400 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(147,51,234,0.8)]">
                Transform Your Business
              </span>
              <br />
              <span className="text-white/90 text-4xl md:text-5xl font-semibold">
                with AI-Powered Solutions
              </span>
            </h1>
            
            <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
              Unlock the full potential of artificial intelligence with our comprehensive suite of AI solutions. 
              From intelligent automation to predictive analytics, we help companies innovate, scale, and stay ahead of the competition.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-wrap justify-center items-center gap-6 pt-6"
            >
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle size={16} className="text-purple-400" />
                <span>Enterprise-Ready</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle size={16} className="text-purple-400" />
                <span>Scalable Architecture</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle size={16} className="text-purple-400" />
                <span>24/7 Support</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </section>

      {/* Solutions Grid */}
      <section className="relative z-10 px-6 pb-24 max-w-7xl mx-auto">
        <SectionHeader
          title="Our AI Solutions Portfolio"
          description="Choose from our comprehensive range of AI-powered tools and services, each designed to address specific business challenges and drive measurable results."
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, staggerChildren: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {solutions.map((solution, index) => (
            <SolutionCard 
              key={index} 
              {...solution}
              index={index}
              activeCard={activeCard}
              setActiveCard={setActiveCard}
            />
          ))}
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 px-6 py-24 bg-gradient-to-b from-transparent to-purple-900/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose Our AI Solutions?
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              We combine cutting-edge technology with deep industry expertise to deliver AI solutions that drive real business value.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4 border border-white/20">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 p-12 rounded-3xl border border-purple-400/30 backdrop-blur-lg"
          >
            <Globe size={48} className="text-purple-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Whether you're building a new AI product or integrating smart automation into your existing systems, 
              our solutions are built to scale, adapt, and deliver measurable impact across industries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <GradientButton variant="secondary" size="lg">
                Contact Us
              </GradientButton>
              <GradientButton variant="outline" size="lg">
                View Testimonials
              </GradientButton>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}