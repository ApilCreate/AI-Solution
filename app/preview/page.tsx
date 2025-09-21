"use client";

import { Check, BarChart3, Bot, TrendingUp, Activity, Link, Rocket, Clipboard, Settings, Users, CheckSquare, Globe, RefreshCw, Webhook, Shuffle, Shield } from "lucide-react";
import React from "react";
import { SparklesCore } from "../../components/ui/sparkles";
import Magnet from "../../components/Magnet";
import { ContainerScroll } from "../../components/ui/container-scroll-animation";
import { CometCard } from "../../components/ui/comet-card";
import { StickyScroll } from "../../components/ui/sticky-scroll-reveal";
import { HorizontalScroll } from "../../components/ui/horizontal-scroll-reveal";
import { InfiniteMovingCards } from "../../components/ui/infinite-moving-cards";

export default function AILandingPage() {
  const horizontalSections = [
    {
      title: "Simplify Intricate business operations with AI",
      description: (
        <div className="space-y-4">
          <p className="text-lg mb-6">Leverage cutting-edge AI technology to transform your business operations, enhance productivity, and unlock new growth opportunities with our comprehensive solution suite.</p>
          
          <div className="flex items-center gap-3 text-white">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <div>
              <span className="font-semibold">Advanced Analytics</span>
              <p className="text-gray-300 text-sm mt-1">Get deeper insights into your business metrics with AI-powered analytics that reveal hidden patterns and opportunities for growth.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-white">
            <Bot className="w-5 h-5 text-green-400" />
            <div>
              <span className="font-semibold">Smart Automation</span>
              <p className="text-gray-300 text-sm mt-1">Automate repetitive tasks and complex workflows with intelligent systems that learn and improve over time.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-white">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <div>
              <span className="font-semibold">Predictive Intelligence</span>
              <p className="text-gray-300 text-sm mt-1">Make data-driven decisions with predictive models that forecast trends and identify potential risks before they occur.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-white">
            <Activity className="w-5 h-5 text-red-400" />
            <div>
              <span className="font-semibold">Real-time Monitoring</span>
              <p className="text-gray-300 text-sm mt-1">Track performance metrics and KPIs in real-time with comprehensive dashboards and automated reporting.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-white">
            <Link className="w-5 h-5 text-cyan-400" />
            <div>
              <span className="font-semibold">Data Integration</span>
              <p className="text-gray-300 text-sm mt-1">Seamlessly connect and analyze data from multiple sources for complete business visibility.</p>
            </div>
          </div>
        </div>
      ),
      content: (
        <div className="h-full w-full bg-black rounded-lg p-12 flex flex-col justify-center items-center shadow-2xl border border-gray-800">
          <img
            src="/images/ai-finance.png"
            alt="AI Business Operations"
            className="w-96 h-64 object-cover rounded-lg mb-8 shadow-lg"
          />
          <div className="text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Advanced Analytics Dashboard</h3>
            <p className="text-gray-300 text-lg">Real-time insights and comprehensive reporting</p>
          </div>
        </div>
      ),
    },
    {
      title: "Streamline Operations with Intelligent Automation", 
      description: (
        <div className="space-y-4">
          <p className="text-lg mb-6">Transform your business operations with our comprehensive automation suite designed specifically for modern enterprises and growing businesses.</p>
          
          <div className="flex items-center gap-3 text-white">
            <Rocket className="w-5 h-5 text-orange-400" />
            <div>
              <span className="font-semibold">Workflow Automation</span>
              <p className="text-gray-300 text-sm mt-1">Streamline complex business processes with intelligent automation that adapts to your specific needs and requirements.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-white">
            <Clipboard className="w-5 h-5 text-blue-400" />
            <div>
              <span className="font-semibold">Task Management</span>
              <p className="text-gray-300 text-sm mt-1">Automatically prioritize and delegate tasks based on business rules, deadlines, and AI-powered recommendations.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-white">
            <Settings className="w-5 h-5 text-gray-400" />
            <div>
              <span className="font-semibold">Process Optimization</span>
              <p className="text-gray-300 text-sm mt-1">Continuously improve workflows using machine learning algorithms that identify bottlenecks and suggest improvements.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-white">
            <Users className="w-5 h-5 text-indigo-400" />
            <div>
              <span className="font-semibold">Resource Allocation</span>
              <p className="text-gray-300 text-sm mt-1">Optimize resource distribution across projects and teams for maximum efficiency and productivity.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-white">
            <CheckSquare className="w-5 h-5 text-green-400" />
            <div>
              <span className="font-semibold">Quality Assurance</span>
              <p className="text-gray-300 text-sm mt-1">Implement automated quality checks and validation processes to maintain high standards consistently.</p>
            </div>
          </div>
        </div>
      ),
      content: (
        <div className="h-full w-full bg-black rounded-lg p-12 flex flex-col justify-center items-center shadow-2xl border border-gray-800">
          <img
            src="/images/ai-marketing.png"
            alt="Smart Automation"
            className="w-96 h-64 object-cover rounded-lg mb-8 shadow-lg"
          />
          <div className="text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Intelligent Automation</h3>
            <p className="text-gray-300 text-lg">Smart workflow management and optimization</p>
          </div>
        </div>
      ),
    },
    {
      title: "Expand Possibilities with Seamless API Integration",
      description: (
        <div className="space-y-4">
          <p className="text-lg mb-6">Connect and integrate with over 1000+ applications and services through our robust and scalable API ecosystem built for enterprise needs.</p>
          
          <div className="flex items-center gap-3 text-white">
            <Globe className="w-5 h-5 text-blue-400" />
            <div>
              <span className="font-semibold">1000+ Integrations</span>
              <p className="text-gray-300 text-sm mt-1">Connect with popular tools and services including CRM, ERP, marketing platforms, and productivity tools through our comprehensive API ecosystem.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-white">
            <RefreshCw className="w-5 h-5 text-green-400" />
            <div>
              <span className="font-semibold">Real-time Sync</span>
              <p className="text-gray-300 text-sm mt-1">Keep all your systems synchronized with real-time data updates, ensuring consistency across all platforms and applications.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-white">
            <Webhook className="w-5 h-5 text-purple-400" />
            <div>
              <span className="font-semibold">Custom Webhooks</span>
              <p className="text-gray-300 text-sm mt-1">Set up custom webhook endpoints to receive instant notifications and trigger automated actions based on specific events.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-white">
            <Shuffle className="w-5 h-5 text-orange-400" />
            <div>
              <span className="font-semibold">Data Transformation</span>
              <p className="text-gray-300 text-sm mt-1">Automatically transform and map data between different systems using intelligent mapping algorithms and predefined templates.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-white">
            <Shield className="w-5 h-5 text-red-400" />
            <div>
              <span className="font-semibold">Security & Compliance</span>
              <p className="text-gray-300 text-sm mt-1">Enterprise-grade security with OAuth 2.0, API key management, and compliance with industry standards like GDPR and SOC 2.</p>
            </div>
          </div>
        </div>
      ),
      content: (
        <div className="h-full w-full bg-black rounded-lg p-12 flex flex-col justify-center items-center shadow-2xl border border-gray-800">
          <img
            src="/images/ai-healthcare.png"
            alt="API Integration"
            className="w-96 h-64 object-cover rounded-lg mb-8 shadow-lg"
          />
          <div className="text-white text-center">
            <h3 className="text-2xl font-bold mb-4">API Integration Hub</h3>
            <p className="text-gray-300 text-lg">Connect with 1000+ applications seamlessly</p>
          </div>
        </div>
      ),
    },
  ];

  const testimonials = [
    {
      quote: "SalesRocket's AI solutions have completely transformed our business operations. The automation features alone saved us 40% of our daily processing time, and the predictive analytics helped us identify new market opportunities we never knew existed.",
      name: "Sarah Johnson",
      title: "CEO, TechFlow Solutions",
      profileImage: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      quote: "The implementation was seamless and the results were immediate. Our customer satisfaction scores increased by 35% after deploying their intelligent automation system. The AI-driven insights are incredibly accurate and actionable.",
      name: "Michael Chen",
      title: "CTO, Digital Innovations Inc",
      profileImage: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      quote: "We've tried multiple AI platforms, but none compare to the comprehensive approach and user-friendly interface of this solution. The real-time monitoring and advanced analytics have given us unprecedented visibility into our operations.",
      name: "Emily Rodriguez",
      title: "Operations Director, GlobalTech",
      profileImage: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
      quote: "The ROI has been outstanding. Within 6 months, we recovered our investment and continue to see exponential growth. The data integration capabilities are particularly impressive - everything just works together seamlessly.",
      name: "David Thompson",
      title: "Head of Strategy, InnovaCorp",
      profileImage: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    {
      quote: "What sets this apart is the exceptional customer support and continuous innovation. The team is always adding new features and the AI keeps getting smarter. It's like having a dedicated team of data scientists on staff.",
      name: "Lisa Park",
      title: "VP of Analytics, DataDriven LLC",
      profileImage: "https://randomuser.me/api/portraits/women/15.jpg"
    },
    {
      quote: "The predictive intelligence features have revolutionized our decision-making process. We can now forecast trends months in advance and adapt our strategies accordingly. It's been a game-changer for our competitive advantage.",
      name: "James Wilson",
      title: "Chief Data Officer, FutureTech",
      profileImage: "https://randomuser.me/api/portraits/men/45.jpg"
    },
    {
      quote: "Implementation was smooth and the AI insights have dramatically improved our operational efficiency. We're now making data-driven decisions faster than ever before.",
      name: "Anna Martinez",
      title: "VP Operations, TechCorp",
      profileImage: "https://randomuser.me/api/portraits/women/72.jpg"
    },
    {
      quote: "The platform's ability to adapt and learn from our business patterns has been remarkable. It's like having a crystal ball for business intelligence.",
      name: "Robert Kim",
      title: "Director of Analytics, FutureWorks",
      profileImage: "https://randomuser.me/api/portraits/men/55.jpg"
    }
  ];

  return (
    
    <div className="bg-black text-white min-h-screen relative overflow-hidden">
      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        ::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        html {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        
        /* Ensure body and html don't show scrollbars */
        body, html {
          overflow-x: hidden;
        }
      `}</style>
      {/* Hero Section */}
      <section className="min-h-screen flex justify-center items-center relative">
        {/* Silk Background */}
        <div className="absolute inset-0 opacity-70">
          <div className="min-h-screen relative w-full bg-black flex flex-col items-center justify-center overflow-hidden">
            <div className="w-full absolute inset-0 min-h-screen">
              <SparklesCore
                id="tsparticlesfullpage"
                background="transparent"
                minSize={0.6}
                maxSize={1.4}
                particleDensity={100}
                className="w-full h-full min-h-screen"
                particleColor="#FFFFFF"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center gap-9 w-full max-w-6xl mx-auto px-6 relative z-10">
          <h1 className="font-bold text-6xl text-center text-white leading-tight">
            AI-Driven Solutions for Modern <br />
            <span className="text-gray-400">Businesses</span>
          </h1>

          <p className="text-gray-300 text-center text-lg max-w-3xl">
            "Innovate. Automate. Thrive." Our AI-driven solutions empowers
            modern businesses to streamline processes, personalize experiences,
            and stay ahead in the digital age.
          </p>

          <Magnet magnetStrength={2} padding={100}>
            <button className="bg-white text-black no-underline group cursor-pointer relative shadow-2xl shadow-white/20 rounded-full px-8 py-3 text-sm font-semibold leading-6 inline-block transition-all duration-300 hover:scale-105 hover:shadow-white/40">
              <span className="absolute inset-0 overflow-hidden rounded-full">
                <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
              </span>
              <div className="relative flex space-x-2 items-center z-10 rounded-full">
                <span className="text-black font-medium">Book a demo</span>
              </div>
              <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-black/0 via-black/30 to-black/0 transition-opacity duration-500 group-hover:opacity-40"></span>
            </button>
          </Magnet>

          <div className="mt-10 flex flex-col justify-center items-center gap-6">
            <div className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-xl p-px text-xs font-semibold leading-6 text-white inline-block">
              <span className="absolute inset-0 overflow-hidden rounded-xl">
                <span className="absolute inset-0 rounded-xl bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(148,163,184,0.6)_0%,rgba(148,163,184,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
              </span>
              <div className="relative flex space-x-2 items-center justify-center z-10 rounded-xl bg-slate-950 px-6 py-2 ring-1 ring-white/10">
                <span className="text-white text-sm text-center">
                  30k+ Happy Customers
                </span>
              </div>
              <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-slate-400/0 via-slate-400/90 to-slate-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>
            </div>

            <div className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-xl p-px text-xs font-semibold leading-6 text-white inline-block">
              <span className="absolute inset-0 overflow-hidden rounded-xl">
                <span className="absolute inset-0 rounded-xl bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(148,163,184,0.6)_0%,rgba(148,163,184,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
              </span>
              <div className="relative flex gap-4 p-6 rounded-xl bg-zinc-950 ring-1 ring-white/10 z-10">
                <div className="btn-shimmer relative flex flex-col w-52 h-24 items-center justify-center space-x-3 p-4 bg-black/30 text-white border border-gray-700 rounded-xl hover:bg-black/40 transition duration-300 overflow-hidden">
                  <p className="font-bold text-3xl relative z-10">380+</p>
                  <p className="font-normal text-sm relative z-10">Active Users</p>
                </div>
                <div className="btn-shimmer relative flex flex-col w-52 h-24 items-center justify-center space-x-3 p-4 bg-black/30 text-white border border-gray-700 rounded-xl hover:bg-black/40 transition duration-300 overflow-hidden">
                  <p className="font-bold text-3xl relative z-10">230+</p>
                  <p className="font-normal text-sm relative z-10">Trusted by Company</p>
                </div>
                <div className="btn-shimmer relative flex flex-col w-52 h-24 items-center justify-center space-x-3 p-4 bg-black/30 text-white border border-gray-700 rounded-xl hover:bg-black/40 transition duration-300 overflow-hidden">
                  <p className="font-bold text-3xl relative z-10">$230M+</p>
                  <p className="font-normal text-sm relative z-10">Transaction</p>
                </div>
                <div className="btn-shimmer relative flex flex-col w-52 h-24 items-center justify-center space-x-3 p-4 bg-black/30 text-white border border-gray-700 rounded-xl hover:bg-black/40 transition duration-300 overflow-hidden">
                  <p className="font-bold text-3xl relative z-10">10+</p>
                  <p className="font-normal text-sm relative z-10">Years of Experience</p>
                </div>
              </div>
              <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-slate-400/0 via-slate-400/90 to-slate-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>
            </div>
          </div>
        </div>
      </section>

      {/* Container Scroll Animation Section */}
      <section className="bg-black relative">
        <ContainerScroll
          titleComponent={
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Experience AI Solutions <br />
                <span className="text-gray-400">Like Never Before</span>
              </h1>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Discover the power of our AI-driven platform with an interactive preview
              </p>
            </div>
          }
        >
          <img
            src="/images/Mac_Display.webp"
            alt="AI Solutions Dashboard"
            className="h-full w-full object-cover object-left-top rounded-2xl"
            draggable={false}
          />
        </ContainerScroll>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white">
              Drive Business Growth with <br />
              <p className="text-slate-400">"Actionable Insights"</p>
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <CometCard className="w-full">
              <div className="bg-gradient-to-b from-slate-900/80 to-slate-950/90 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-2xl p-0.5 text-xs font-semibold leading-6 text-white inline-block w-full border border-slate-700/50 hover:border-slate-500/70 transition-all duration-300">
                <span className="absolute inset-0 overflow-hidden rounded-2xl">
                  <span className="absolute inset-0 rounded-2xl bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(148,163,184,0.8)_0%,rgba(148,163,184,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
                </span>
                <div className="relative p-8 rounded-2xl bg-gradient-to-b from-slate-900/30 to-black ring-2 ring-slate-700/30 hover:ring-slate-500/50 text-center z-10 h-80 transition-all duration-300">
                  <div className="w-16 h-16 bg-slate-700/30 backdrop-blur-sm rounded-full mb-6 mx-auto flex items-center justify-center ring-2 ring-slate-500/40">
                    <div className="w-8 h-8 bg-slate-500/60 rounded"></div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">
                    Actionable Insights
                  </h3>
                  <p className="text-slate-200 text-sm">
                    Track performance metrics in real-time with comprehensive
                    analytics dashboard and automated reporting.
                  </p>
                </div>
                <span className="absolute -bottom-0 left-[1.125rem] h-0.5 w-[calc(100%-2.25rem)] bg-gradient-to-r from-slate-400/0 via-slate-300/90 to-slate-400/0 transition-opacity duration-500 group-hover:opacity-60"></span>
              </div>
            </CometCard>

            <CometCard className="w-full">
              <div className="bg-gradient-to-b from-slate-900/80 to-slate-950/90 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-2xl p-0.5 text-xs font-semibold leading-6 text-white inline-block w-full border border-slate-700/50 hover:border-slate-500/70 transition-all duration-300">
                <span className="absolute inset-0 overflow-hidden rounded-2xl">
                  <span className="absolute inset-0 rounded-2xl bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(148,163,184,0.8)_0%,rgba(148,163,184,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
                </span>
                <div className="relative p-8 rounded-2xl bg-gradient-to-b  from-slate-900/30 to-black ring-2 ring-slate-700/30 hover:ring-slate-500/50 text-center z-10 h-80 transition-all duration-300">
                  <div className="w-16 h-16 bg-slate-700/30 backdrop-blur-sm rounded-full mb-6 mx-auto flex items-center justify-center ring-2 ring-slate-500/40">
                    <div className="w-8 h-8 bg-slate-500/60 rounded"></div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">
                    Intelligent Automation Platform
                  </h3>
                  <p className="text-slate-200 text-sm">
                    Automate complex workflows and reduce manual tasks with our
                    smart automation engine.
                  </p>
                </div>
                <span className="absolute -bottom-0 left-[1.125rem] h-0.5 w-[calc(100%-2.25rem)] bg-gradient-to-r from-slate-400/0 via-slate-300/90 to-slate-400/0 transition-opacity duration-500 group-hover:opacity-60"></span>
              </div>
            </CometCard>

            <CometCard className="w-full">
              <div className="bg-gradient-to-b from-slate-900/80 to-slate-950/90 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-2xl p-0.5 text-xs font-semibold leading-6 text-white inline-block w-full border border-slate-700/50 hover:border-slate-500/70 transition-all duration-300">
                <span className="absolute inset-0 overflow-hidden rounded-2xl">
                  <span className="absolute inset-0 rounded-2xl bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(148,163,184,0.8)_0%,rgba(148,163,184,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
                </span>
                <div className="relative p-8 rounded-2xl bg-gradient-to-b  from-slate-900/30 to-black ring-2 ring-slate-700/30 hover:ring-slate-500/50 text-center z-10 h-80 transition-all duration-300">
                  <div className="w-16 h-16 bg-slate-700/30 backdrop-blur-sm rounded-full mb-6 mx-auto flex items-center justify-center ring-2 ring-slate-500/40">
                    <div className="w-8 h-8 bg-slate-500/60 rounded"></div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">
                    Personalized Customer Experience
                  </h3>
                  <p className="text-slate-200 text-sm">
                    Deliver tailored experiences that resonate with each customer
                    using machine learning.
                  </p>
                </div>
                <span className="absolute -bottom-0 left-[1.125rem] h-0.5 w-[calc(100%-2.25rem)] bg-gradient-to-r from-slate-400/0 via-slate-300/90 to-slate-400/0 transition-opacity duration-500 group-hover:opacity-60"></span>
              </div>
            </CometCard>
          </div>
        </div>
      </section>

      {/* Horizontal Scroll Sections */}
      <section className="w-full h-screen overflow-hidden relative">
        <HorizontalScroll 
          sections={horizontalSections}
          contentClassName="shadow-2xl border border-gray-700"
        />
      </section>


      {/* Testimonials Section */}
      <section className="py-20 mt-14 bg-black relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Discover what our customers <br />
              say about us
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have transformed their
              business operations with our comprehensive AI solutions
            </p>
          </div>

          {/* Single Row - All Testimonials Moving */}
          <div>
            <InfiniteMovingCards
              items={testimonials}
              direction="left"
              speed="fast"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-slate-400 text-sm mb-2">Pricing</p>
            <h2 className="text-4xl font-bold mb-4 text-white">
              Choose the Perfect Plan for <br />
              Your Business
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto mb-8">
              Flexible pricing options designed to grow with your business needs
              and requirements
            </p>

            <div className="flex justify-center mb-12">
              <div className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block">
                <span className="absolute inset-0 overflow-hidden rounded-full">
                  <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(148,163,184,0.6)_0%,rgba(148,163,184,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
                </span>
                <div className="relative bg-zinc-950 p-1 rounded-full ring-1 ring-white/10 z-10">
                  <button className="bg-white text-black px-6 py-2 rounded-full text-sm font-medium">
                    Monthly
                  </button>
                  <button className="text-white px-6 py-2 rounded-full text-sm font-medium">
                    Yearly
                  </button>
                </div>
                <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-slate-400/0 via-slate-400/90 to-slate-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="p-8 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-gray-600/30 ring-1 ring-white/10">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2 text-white">Starter</h3>
                <p className="text-slate-400 text-sm mb-4">
                  For small businesses
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">$29</span>
                  <span className="text-slate-400">/month</span>
                </div>
                <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-full transition">
                  Get Started
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-slate-400 mr-3" />
                  <span className="text-slate-300 text-sm">
                    Basic analytics
                  </span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-slate-400 mr-3" />
                  <span className="text-slate-300 text-sm">Email support</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-slate-400 mr-3" />
                  <span className="text-slate-300 text-sm">Basic features</span>
                </div>
              </div>
            </div>

            {/* Business Plan */}
            <div className="p-8 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-gray-600/30 ring-1 ring-white/10">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2 text-white">Business</h3>
                <p className="text-slate-400 text-sm mb-4">
                  For growing companies
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">$59</span>
                  <span className="text-slate-400">/month</span>
                </div>
                <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-full transition">
                  Get Started
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-slate-400 mr-3" />
                  <span className="text-slate-300 text-sm">
                    Advanced analytics
                  </span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-slate-400 mr-3" />
                  <span className="text-slate-300 text-sm">
                    Priority support
                  </span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-slate-400 mr-3" />
                  <span className="text-slate-300 text-sm">
                    Team collaboration
                  </span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-slate-400 mr-3" />
                  <span className="text-slate-300 text-sm">
                    Custom integrations
                  </span>
                </div>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="p-8 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-gray-600/30 ring-1 ring-white/10">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2 text-white">
                  Enterprise
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  For large organizations
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">$99</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <button className="w-full bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block">
                  <span className="absolute inset-0 overflow-hidden rounded-full">
                    <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(148,163,184,0.6)_0%,rgba(148,163,184,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
                  </span>
                  <div className="relative flex space-x-2 items-center justify-center z-10 rounded-full bg-zinc-950 py-2 px-4 ring-1 ring-white/10">
                    <span>Get Started</span>
                  </div>
                  <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-slate-400/0 via-slate-400/90 to-slate-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-slate-400 mr-3" />
                  <span className="text-slate-300 text-sm">
                    Everything in Business
                  </span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-slate-400 mr-3" />
                  <span className="text-slate-300 text-sm">
                    Advanced security
                  </span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-slate-400 mr-3" />
                  <span className="text-slate-300 text-sm">
                    Dedicated support
                  </span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-slate-400 mr-3" />
                  <span className="text-slate-300 text-sm">
                    Custom workflows
                  </span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-slate-400 mr-3" />
                  <span className="text-slate-300 text-sm">SLA guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 gap-16">
            <div>
              <p className="text-slate-400 text-sm mb-2">FAQs</p>
              <h2 className="text-4xl font-bold mb-4 text-white">
                Frequently asked <br />
                questions
              </h2>
              <p className="text-slate-300">
                Everything you need to know about the product and billing. Can't
                find the answer you're looking for? Please chat with our
                friendly team.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  What makes your AI solution different?
                </h3>
                <p className="text-slate-300 text-sm">
                  Our platform combines cutting-edge AI technology with
                  user-friendly interfaces, offering seamless integration and
                  superior performance.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  How quickly can I see results?
                </h3>
                <p className="text-slate-300 text-sm">
                  Most clients see significant improvements within 2-4 weeks of
                  implementation, with full optimization achieved within 90
                  days.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  Do you offer custom integrations?
                </h3>
                <p className="text-slate-300 text-sm">
                  Yes, we provide custom API integrations for Enterprise clients
                  and work with existing systems for smooth transitions.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  What kind of support do you provide?
                </h3>
                <p className="text-slate-300 text-sm">
                  We offer comprehensive support including documentation,
                  tutorials, email support, and dedicated account managers for
                  Enterprise clients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-slate-800/50 backdrop-blur-sm p-12 rounded-3xl border border-gray-600/30 ring-1 ring-white/10">
            <h2 className="text-4xl font-bold mb-6 text-white">
              Let's try our service now!
            </h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Everything you need to transform your business with AI. Start your
              journey today and experience the future of intelligent automation.
            </p>
            <button className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block">
              <span className="absolute inset-0 overflow-hidden rounded-full">
                <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(148,163,184,0.6)_0%,rgba(148,163,184,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
              </span>
              <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-3 px-6 ring-1 ring-white/10">
                <span>Get Started</span>
              </div>
              <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-slate-400/0 via-slate-400/90 to-slate-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
