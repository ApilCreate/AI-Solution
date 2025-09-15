"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Camera,
  Eye,
  Heart,
  Mail,
  MessageCircle,
  Phone,
  Rocket,
  Sparkles,
  Zap
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import OptimizedSpline from "./components/OptimizedSpline";
import Showcase from "./components/Showcase";
import HomeDataVisualization from "./components/HomeDataVisualization";
import { FeatureCard, GradientButton, PrimaryButton, ProjectCard, SecondaryButton } from "./components/ui";

export default function Home() {
  const [splineReady, setSplineReady] = useState(false);
  const [splineError, setSplineError] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const handleSplineError = useCallback((error: Error | unknown) => {
    console.warn('Spline loading error:', error);
    setSplineError(true);
  }, []);

  // Delay text animations until spline is ready
  useEffect(() => {
    const timeout = setTimeout(() => setSplineReady(true), 2500);
    return () => clearTimeout(timeout);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const projects = [
    {
      name: "AI Chatbots",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      description: "Transform customer interactions with intelligent conversational AI that understands context, learns from interactions, and provides 24/7 multilingual support.",
      keyFeatures: ["Natural Language Processing", "Multi-platform Integration", "Real-time Learning"],
      useCases: ["Customer Support", "Sales Assistance", "Internal Help Desk"],
      metric: "90% faster response times"
    },
    {
      name: "Document AI",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      description: "Revolutionize document processing with advanced OCR, intelligent data extraction, and automated workflow integration for contracts, invoices, and reports.",
      keyFeatures: ["Smart OCR Technology", "Data Validation", "Workflow Automation"],
      useCases: ["Contract Analysis", "Invoice Processing", "Compliance Reporting"],
      metric: "85% reduction in processing time"
    },
    {
      name: "Vision AI",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      description: "Deploy cutting-edge computer vision for real-time object detection, quality control, security monitoring, and visual content analysis.",
      keyFeatures: ["Real-time Detection", "Custom Model Training", "Edge Computing"],
      useCases: ["Quality Control", "Security Systems", "Inventory Management"],
      metric: "99.2% accuracy rate"
    },
    {
      name: "Predictive Analytics",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      description: "Harness the power of machine learning to predict trends, forecast outcomes, and optimize decision-making processes for your business.",
      keyFeatures: ["Trend Analysis", "Risk Assessment", "Performance Optimization"],
      useCases: ["Market Forecasting", "Risk Management", "Resource Planning"],
      metric: "94% prediction accuracy"
    },
    {
      name: "Process Automation",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      description: "Streamline your operations with intelligent automation that handles repetitive tasks, optimizes workflows, and reduces manual errors.",
      keyFeatures: ["Workflow Optimization", "Task Automation", "Error Reduction"],
      useCases: ["Data Entry", "Report Generation", "System Integration"],
      metric: "75% time savings"
    },
    {
      name: "Voice AI",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
      description: "Enable seamless voice interactions with advanced speech recognition, natural language understanding, and multi-language support.",
      keyFeatures: ["Speech Recognition", "Language Understanding", "Voice Synthesis"],
      useCases: ["Voice Assistants", "Call Analytics", "Voice Commands"],
      metric: "98% recognition accuracy"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      company: "MedTech Solutions",
      rating: 5,
      review: "AI-Solution transformed our diagnostic workflow. The accuracy and speed improvements are remarkable."
    },
    {
      name: "Michael Rodriguez",
      company: "Global Finance Corp",
      rating: 5,
      review: "Their chatbot solution reduced our customer service costs by 60% while improving satisfaction scores."
    },
    {
      name: "Emily Johnson",
      company: "EduConnect Academy",
      rating: 4,
      review: "The personalized learning platform has significantly improved our student engagement and outcomes."
    },
    {
      name: "David Park",
      company: "RetailMax Inc",
      rating: 5,
      review: "The computer vision system gave us insights we never had before. ROI was achieved in just 3 months."
    }
  ];

  return (
    <div style={{ fontFamily: 'Manrope, sans-serif' }} className="min-h-screen w-full">
      
      {/* Hero Section with Spline Background */}
      <section className="relative min-h-screen w-full overflow-hidden bg-[#05010D] text-[#e0e0ff]">
        {/* 3D Background - Only for Hero */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {!splineError ? (
            <OptimizedSpline 
              scene="https://prod.spline.design/SuXUHJDHRHL8sEFE/scene.splinecode"
              onLoad={() => console.log('Spline loaded successfully')}
              onError={handleSplineError}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500/20 via-fuchsia-500/30 to-indigo-500/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/10 pointer-events-none" />
        </div>

        <div className="relative z-10 px-6 pt-48 pb-24 max-w-6xl mx-auto text-center flex flex-col items-center">
          {splineReady && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-fuchsia-500 to-indigo-400 bg-clip-text text-transparent">
                Unlock the Power of AI for Your Business
              </h1>

              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                We build intelligent software solutions using advanced AI technology to transform your digital future.
              </p>

              <div className="flex justify-center gap-6 pt-2">
                <PrimaryButton href="/solutions">
                  Explore Solutions
                </PrimaryButton>
                <SecondaryButton href="/contact">
                  Contact Us
                </SecondaryButton>
              </div>
            </motion.div>
          )}

          {/* Feature Callout */}
          {splineReady && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="mt-16 w-full max-w-2xl rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl p-6 md:p-8"
            >
              <h2 className="text-lg md:text-xl font-semibold text-white mb-2">
                Smart AI Workflows. <span className="text-purple-400">Real Results.</span>
              </h2>
              <p className="text-gray-300">
                Our software helps companies automate tasks, gain deeper insights, and scale efficiently.
              </p>
            </motion.div>
          )}

          {/* Highlight Section */}
          {splineReady && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 1 }}
              className="mt-24 grid md:grid-cols-3 gap-8 w-full"
            >
              {[
                {
                  title: "AI-Powered Automation",
                  description: "Streamline your workflows with intelligent bots and task engines.",
                  icon: <Zap className="w-8 h-8" />
                },
                {
                  title: "Predictive Analytics",
                  description: "Make smarter decisions with AI that forecasts outcomes and trends.",
                  icon: <Eye className="w-8 h-8" />
                },
                {
                  title: "Custom AI Solutions",
                  description: "Tailored machine learning models crafted for your business goals.",
                  icon: <Rocket className="w-8 h-8" />
                }
              ].map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Dark Theme Sections Start Here */}
      <div className="bg-[#05010D]">

        {/* Company Mission Section */}
        <section className="px-6 py-24 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/5 border border-purple-500/30 backdrop-blur-sm mb-6">
              <Sparkles className="w-4 h-4 text-purple-300 mr-2" />
              <span className="text-sm font-medium text-purple-300">About AI Solution</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-500 to-indigo-400 bg-clip-text text-transparent">
                Who We Are
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              AI-Solution is an innovative software company at the forefront of artificial intelligence, machine learning, and automation technology. We specialize in creating intelligent solutions that transform businesses, streamline operations, and unlock new possibilities for growth.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Eye className="w-8 h-8" />,
                title: "Our Vision",
                desc: "To democratize AI technology and make intelligent automation accessible to businesses of all sizes.",
                gradient: "from-purple-500/20 to-fuchsia-500/20"
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: "Our Values",
                desc: "Innovation, integrity, and client success drive everything we do. We believe in transparent, ethical AI development.",
                gradient: "from-fuchsia-500/20 to-indigo-500/20"
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Our Goals",
                desc: "To be the leading AI solutions provider, helping 1000+ businesses transform through intelligent automation by 2025.",
                gradient: "from-indigo-500/20 to-purple-500/20"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 transition-all duration-300 group-hover:border-purple-500/30 group-hover:bg-white/10">
                  <div className="flex justify-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center border border-white/10`}>
                      <div className="text-purple-400">{item.icon}</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 text-center">{item.title}</h3>
                  <p className="text-gray-300 text-center leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Projects Showcase Section */}
        <section className="px-6 py-24 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/5 border border-purple-500/30 backdrop-blur-sm mb-6">
              <Rocket className="w-4 h-4 text-purple-300 mr-2" />
              <span className="text-sm font-medium text-purple-300">Our Solutions</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-500 to-indigo-400 bg-clip-text text-transparent">
                AI-Powered Solutions
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Discover how we&apos;ve helped businesses across industries leverage AI to solve complex challenges and drive innovation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {projects.slice(0, 3).map((project, index) => (
              <ProjectCard
                key={index}
                name={project.name}
                icon={project.icon}
                description={project.description}
                keyFeatures={project.keyFeatures}
                useCases={project.useCases}
                gradient="from-purple-500/10 to-fuchsia-500/10"
                index={index}
                actionButton={
                  <GradientButton
                    href="/contact"
                    size="sm"
                    className="w-full"
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    }
                  >
                    Learn More
                  </GradientButton>
                }
              />
            ))}
          </div>

          {/* See More Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-center mt-16"
          >
            <PrimaryButton
              href="/solutions"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
            >
              See More Solutions
            </PrimaryButton>
          </motion.div>
        </section>

        {/* Showcase Section */}
        <Showcase />

        {/* Customer Feedback Section */}
        <section className="px-6 py-24 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/5 border border-purple-500/30 backdrop-blur-sm mb-6">
              <MessageCircle className="w-4 h-4 text-purple-300 mr-2" />
              <span className="text-sm font-medium text-purple-300">Client Testimonials</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-500 to-indigo-400 bg-clip-text text-transparent">
                What Clients Say
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Don&apos;t just take our word for it. Here&apos;s what our clients have to say about working with AI-Solution.
            </p>
          </motion.div>

          <div className="relative max-w-5xl mx-auto">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="group relative"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-12 md:p-16 transition-all duration-300 group-hover:border-purple-500/30 group-hover:bg-white/10">
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <svg key={i} className="w-6 h-6 text-yellow-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  
                  <div className="mb-8">
                    <svg className="w-12 h-12 text-purple-400 mx-auto mb-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                    </svg>
                  </div>
                  
                  <blockquote className="text-xl md:text-2xl text-gray-200 mb-8 italic leading-relaxed">
                    "{testimonials[currentTestimonial].review}"
                  </blockquote>
                  
                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-full flex items-center justify-center border border-white/10">
                      <span className="text-xl font-bold text-purple-300">
                        {testimonials[currentTestimonial].name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-white text-lg">
                        {testimonials[currentTestimonial].name}
                      </div>
                      <div className="text-purple-400 text-sm">
                        {testimonials[currentTestimonial].company}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'bg-purple-600 scale-125'
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Data Visualization Section */}
        <HomeDataVisualization />

        {/* Photo Gallery Section */}
        <section className="px-6 py-24 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/5 border border-purple-500/30 backdrop-blur-sm mb-6">
              <Camera className="w-4 h-4 text-purple-300 mr-2" />
              <span className="text-sm font-medium text-purple-300">Our Culture</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-500 to-indigo-400 bg-clip-text text-transparent">
                Events & Culture
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Get a glimpse into our dynamic work environment, team events, and the culture that drives our innovation.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop"
            ].map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="group relative"
              >
                <div className="aspect-square rounded-2xl overflow-hidden border border-white/10 backdrop-blur-sm transition-all duration-300 group-hover:border-purple-500/30 group-hover:shadow-xl group-hover:shadow-purple-500/10">
                  <img
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <PrimaryButton size="lg">
              See More
            </PrimaryButton>
          </motion.div>
        </section>

        {/* Contact CTA Banner */}
        <section className="px-6 py-24 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-2xl p-12 md:p-16 text-white text-center"
          >
            {/* Gradient Border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 p-[2px]">
              <div className="h-full w-full rounded-2xl bg-[#05010D]"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold">
                Let&apos;s Build Something Amazing Together
              </h2>
              
              <p className="text-xl max-w-3xl mx-auto opacity-90">
                Ready to transform your business with AI? Let&apos;s discuss your project and explore how our intelligent solutions can drive your success.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <PrimaryButton href="/contact" size="lg">
                  Contact Us Today
                </PrimaryButton>
                
                <Link
                  href="/solutions"
                  className="bg-white/10 border border-white/30 text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/20 transition-colors duration-300"
                >
                  View Solutions
                </Link>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-sm opacity-80 pt-6 border-t border-white/20">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>info@ai-solution.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+977 9862448800</span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

      </div>
    </div>
  )}