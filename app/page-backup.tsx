"use client";

import { Activity, BarChart3, Bot, Brain, CheckSquare, Clipboard, Clock, Crown, Database, Globe, Link, Mail, Phone, RefreshCw, Rocket, Settings, Shield, Shuffle, Sparkles, Star, TrendingUp, Users, Webhook, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { BackgroundBeams } from "../components/ui/background-beams";
import H1Reveal from "../components/H1Reveal";
import MinimalHero from "../components/MinimalHero";
import { CometCard } from "../components/ui/comet-card";
import { ContainerScroll } from "../components/ui/container-scroll-animation";
import { HorizontalScroll } from "../components/ui/horizontal-scroll-reveal";
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards";
import { PointerHighlight } from "../components/ui/pointer-highlight";

// Dynamic imports for heavy components
const LaserFlow = dynamic(() => import("../components/LaserFlow"), { ssr: false });
const LightRays = dynamic(() => import("../components/LightRays"), { ssr: false });
const LogoLoop = dynamic(() => import("../components/LogoLoop"), { ssr: false });
const Magnet = dynamic(() => import("../components/Magnet"), { ssr: false });

export default function AILandingPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [deferredComponents, setDeferredComponents] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Delay heavy components much longer to prioritize LCP
    const timer = setTimeout(() => {
      setDeferredComponents(true);
    }, 8000); // 8 second delay for heavy components
    return () => clearTimeout(timer);
  }, []);


  type Billing = "monthly" | "yearly";

  const pricing = {
    starter: {
      monthly: { price: "$15", note: "/month", originalPrice: null },
      yearly: { price: "$150", note: "/year", originalPrice: "$180" },
      badge: "Perfect to Start",
      description: "Essential AI tools for individuals and small teams",
      features: [
        { text: "5,000 AI automations per month", icon: Bot },
        { text: "Email support (48hr response)", icon: Mail },
        { text: "Basic analytics dashboard", icon: BarChart3 },
        { text: "10+ pre-built AI templates", icon: Clipboard },
        { text: "Slack & Teams integration", icon: Webhook },
        { text: "GPT-3.5 AI model access", icon: Brain },
        { text: "Community forum support", icon: Users },
      ],
    },
    professional: {
      monthly: { price: "$49", note: "/month", originalPrice: null },
      yearly: { price: "$490", note: "/year", originalPrice: "$588" },
      badge: "Most Popular",
      description: "Advanced AI capabilities for growing businesses",
      features: [
        { text: "50,000 AI automations per month", icon: Bot },
        { text: "Priority support (24hr response)", icon: Phone },
        { text: "Advanced analytics & reporting", icon: BarChart3 },
        { text: "50+ AI workflow templates", icon: Clipboard },
        { text: "All integrations (CRM, ERP, etc.)", icon: Webhook },
        { text: "GPT-4 & Claude AI models", icon: Brain },
        { text: "Team collaboration tools", icon: Users },
        { text: "API access & custom webhooks", icon: Link },
        { text: "Advanced data processing", icon: Database },
        { text: "Custom AI model training", icon: Sparkles },
      ],
    },
    enterprise: {
      monthly: { price: "Custom", note: "pricing", originalPrice: null },
      yearly: { price: "Custom", note: "pricing", originalPrice: null },
      badge: "Maximum Scale",
      description: "Enterprise-grade AI solutions with unlimited scale",
      features: [
        { text: "Unlimited AI automations", icon: Zap },
        { text: "24/7 dedicated support hotline", icon: Phone },
        { text: "Enterprise analytics suite", icon: BarChart3 },
        { text: "Custom AI solution development", icon: Settings },
        { text: "Dedicated account manager", icon: Crown },
        { text: "Private AI model deployment", icon: Brain },
        { text: "SOC 2 & GDPR compliance", icon: Shield },
        { text: "White-label AI solutions", icon: Star },
        { text: "99.9% uptime SLA guarantee", icon: Clock },
        { text: "On-premise deployment option", icon: Database },
        { text: "Custom integration development", icon: Rocket },
      ],
    },
  };

  function PriceCard({
    title,
    tier,
    billing,
    highlight,
  }: {
    title: string;
    tier: keyof typeof pricing;
    billing: Billing;
    highlight?: boolean;
  }) {
    const plan = pricing[tier];
    const savings = billing === "yearly" && plan[billing].originalPrice ? 
      Math.round(((parseInt(plan[billing].originalPrice.replace('$', '')) - 
                   parseInt(plan[billing].price.replace('$', ''))) / 
                   parseInt(plan[billing].originalPrice.replace('$', ''))) * 100) : 0;

    return (
      <div
        className={`group relative rounded-3xl border transition-all duration-300 p-8 flex flex-col justify-between hover:scale-[1.02]
        ${
          highlight
            ? "border-white/20 shadow-2xl shadow-white/10 bg-gradient-to-b from-white/5 to-slate-950 ring-1 ring-white/10"
            : "border-slate-700/50 bg-gradient-to-b from-slate-900/50 to-slate-950 hover:border-slate-600/50"
        }
        backdrop-blur-sm min-h-[600px]`}
      >
        {/* Badge */}
        {plan.badge && (
          <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-xs font-semibold
            ${
              highlight 
                ? "bg-white text-black" 
                : "bg-slate-700 text-white"
            }
          `}>
            {plan.badge}
          </div>
        )}

        <div className="flex-grow">
          {/* Header */}
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2 capitalize text-white">{title}</h3>
            <p className="text-slate-400 text-sm">{plan.description}</p>
          </div>

          {/* Pricing */}
          <div className="text-center mb-8">
            <div className="flex items-baseline justify-center gap-2 mb-2">
              {plan[billing].originalPrice && billing === "yearly" && (
                <span className="text-lg text-slate-500 line-through">
                  {plan[billing].originalPrice}
                </span>
              )}
              <span className="text-5xl md:text-6xl font-bold text-white">
                {plan[billing].price}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-gray-200 text-lg">
                {plan[billing].note}
              </span>
              {billing === "yearly" && savings > 0 && (
                <span className="bg-slate-700 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  Save {savings}%
                </span>
              )}
            </div>
          </div>

          {/* Features */}
          <ul className="space-y-4 text-sm text-slate-300">
            {plan.features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <li key={index} className="flex items-start gap-3">
                  <div className={`mt-0.5 p-1 rounded-full ${
                    highlight ? "bg-white/20 text-white" : "bg-slate-700/50 text-slate-400"
                  }`}>
                    <IconComponent className="w-3 h-3" />
                  </div>
                  <span className="leading-relaxed">{feature.text}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => router.push('/contact')}
          className={`mt-8 w-full py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-[1.02] ${
            highlight
              ? "bg-white text-black hover:bg-slate-200"
              : "border-2 border-slate-600 text-white hover:bg-slate-800/70 hover:border-slate-500"
          }`}
        >
          {tier === "enterprise" ? (
            <>
              <Phone className="w-4 h-4" />
              Contact Sales
            </>
          ) : (
            <>
              <Rocket className="w-4 h-4" />
              Get Started
            </>
          )}
        </button>
      </div>
    );
  }

  function PricingSection() {
    const [billing, setBilling] = useState<Billing>("monthly");

    return (
      <section className="w-full text-white py-24 relative overflow-hidden">
        {/* LightRays Background */}
        <div className="absolute inset-0">
          <LightRays 
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={0.5}
            lightSpread={1.2}
            rayLength={3}
            pulsating={true}
            fadeDistance={1.5}
            saturation={0.3}
            noiseAmount={0}
            className="w-full h-full opacity-80"
          />
        </div>
        <div className="absolute inset-0" />

        <div className="relative z-10">
          {/* Header */}
          <div className="mx-auto max-w-6xl px-6 text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              Transparent Pricing
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Choose Your AI
              <br />
              <div className="flex justify-center">
                <PointerHighlight
                  pointerClassName="text-cyan-400"
                  rectangleClassName="border-cyan-400/50"
                >
                  <span className="bg-gradient-to-r from-[#00FFB7] to-[#0000E0] bg-clip-text text-transparent">
                    Transformation Plan
                  </span>
                </PointerHighlight>
              </div>
            </h2>
            <p className="text-gray-200 text-lg mt-6 max-w-3xl mx-auto leading-relaxed">
              Unlock the power of artificial intelligence for your business. From individuals to enterprises,
              we have the perfect plan to accelerate your AI journey with cutting-edge automation and insights.
            </p>
          </div>

          {/* Toggle */}
          <div className="flex justify-center mb-16">
            <div className="inline-flex items-center rounded-2xl border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm p-1.5 shadow-2xl">
              <button
                type="button"
                onClick={() => setBilling("monthly")}
                className={`px-8 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                  billing === "monthly"
                    ? "bg-white text-black"
                    : "text-slate-300 hover:bg-slate-800/50"
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBilling("yearly")}
                className={`px-8 py-3 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 ${
                  billing === "yearly"
                    ? "bg-white text-black"
                    : "text-slate-300 hover:bg-slate-800/50"
                }`}
              >
                Yearly Billing
                <span className="bg-slate-700 text-white px-2 py-1 rounded-full text-xs font-bold">
                  Save $38-98
                </span>
              </button>
            </div>
          </div>

          {/* Cards */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6">
            <PriceCard title="Starter" tier="starter" billing={billing} />
            <PriceCard title="Professional" tier="professional" billing={billing} highlight />
            <PriceCard title="Enterprise" tier="enterprise" billing={billing} />
          </div>

          {/* Additional Info */}
          <div className="max-w-6xl mx-auto px-6 mt-16">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2 text-white">Enterprise Security</h4>
                <p className="text-slate-400 text-sm">SOC 2 Type II compliant with end-to-end encryption</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2 text-white">99.9% Uptime SLA</h4>
                <p className="text-slate-400 text-sm">Guaranteed availability with 24/7 monitoring</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2 text-white">Expert Support</h4>
                <p className="text-slate-400 text-sm">Dedicated AI specialists to help you succeed</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const horizontalSections = [
    {
      title: "Simplify Intricate business operations with AI",
      description: (
        <div className="space-y-4">
          <p className="text-gray-200 text-lg mb-6">Leverage cutting-edge AI technology to transform your business operations, enhance productivity, and unlock new growth opportunities with our comprehensive solution suite.</p>
          
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
          {/* Deferred image loading */}
          {deferredComponents && (
            <img
              src="/images/ai-finance.png"
              alt="AI Business Operations"
              className="w-96 h-64 object-cover rounded-lg mb-8 shadow-lg"
            />
          )}
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
          <p className="text-gray-200 text-lg mb-6">Transform your business operations with our comprehensive automation suite designed specifically for modern enterprises and growing businesses.</p>
          
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
          {/* Deferred image loading */}
          {deferredComponents && (
            <img
              src="/images/ai-marketing.png"
              alt="Smart Automation"
              className="w-96 h-64 object-cover rounded-lg mb-8 shadow-lg"
            />
          )}
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
          <p className="text-gray-200 text-lg mb-6">Connect and integrate with over 1000+ applications and services through our robust and scalable API ecosystem built for enterprise needs.</p>
          
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
          {/* Deferred image loading */}
          {deferredComponents && (
            <img
              src="/images/ai-healthcare.png"
              alt="API Integration"
              className="w-96 h-64 object-cover rounded-lg mb-8 shadow-lg"
            />
          )}
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
        
        /* Prevent layout shifts during hydration */
        .hero-section {
          min-height: 100vh;
          background-color: #000000;
        }
        
        /* Ensure content is visible during loading */
        .hero-content {
          opacity: 1;
          visibility: visible;
        }
        
        /* Prevent flash of unstyled content */
        .bg-black {
          background-color: #000000 !important;
        }
        
        /* Ensure text is visible during loading */
        .text-white {
          color: #ffffff !important;
        }
      `}</style>
      {/* Minimal Hero Section for LCP Optimization */}
      <MinimalHero />
          
          {/* Title and Description - Positioned above container */}
          <div className="text-center mb-16">
            <H1Reveal>
              <h1 className="font-bold text-3xl sm:text-4xl md:text-6xl text-center text-white leading-tight drop-shadow-2xl mb-6">
                AI-Driven Solutions for Modern <br />
                <div className="flex justify-center">
                  <PointerHighlight
                    pointerClassName="text-cyan-400"
                    rectangleClassName="border-cyan-400/50"
                  >
                    <span className="bg-gradient-to-r from-[#00FFB7] to-[#0000E0] bg-clip-text text-transparent">
                      Businesses
                    </span>
                  </PointerHighlight>
                </div>
              </h1>
            </H1Reveal>

            <motion.p 
              className="text-gray-200 text-center text-sm sm:text-lg max-w-3xl drop-shadow-lg mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              "Innovate. Automate. Thrive." Our AI-driven solutions empower
              modern businesses to streamline processes, personalize experiences,
              and stay ahead in the digital age.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Magnet magnetStrength={2} padding={100}>
                <button 
                  onClick={() => router.push('/contact')}
                  className="bg-white text-black no-underline group cursor-pointer relative shadow-2xl shadow-white/20 rounded-full px-6 sm:px-8 py-2 sm:py-3 text-xs sm:text-sm font-semibold leading-6 inline-block transition-all duration-300 hover:scale-105 hover:shadow-white/40"
                >
                  <span className="absolute inset-0 overflow-hidden rounded-full">
                    <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
                  </span>
                  <div className="relative flex space-x-2 items-center z-10 rounded-full">
                    <span className="text-black font-medium">Book a demo</span>
                  </div>
                  <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-black/0 via-black/30 to-black/0 transition-opacity duration-500 group-hover:opacity-40"></span>
                </button>
              </Magnet>
            </motion.div>
          </div>

          {/* Container exactly like preview - where laser lands */}
          <motion.div 
            className="w-full max-w-5xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {/* Outer container with rounded border - like preview */}
            <div className="p-4 rounded-3xl border-2 border-white/20 bg-gradient-to-b from-white/10 to-transparent backdrop-blur-sm">
              {/* Inner dark container */}
              <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8">
                
                {/* Happy Customers Badge - centered */}
                <motion.div 
                  className="mb-8 flex justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  <div className="bg-black/60 backdrop-blur-xl border border-white/30 rounded-full px-6 py-2">
                    <span className="text-white text-sm font-medium">
                      30k+ Happy Customers
                    </span>
                  </div>
                </motion.div>
                
                {/* Statistics Grid - Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { value: "380+", label: "Active Users" },
                    { value: "230+", label: "Trusted by Company" },
                    { value: "$230M+", label: "Transaction" },
                    { value: "10+", label: "Years of Experience" }
                  ].map((stat, index) => (
                    <motion.div 
                      key={index}
                      className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-xl p-6 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.2 + (index * 0.1) }}
                    >
                      <div className="text-2xl sm:text-3xl font-bold text-white mb-2">{stat.value}</div>
                      <div className="text-xs sm:text-sm text-gray-300">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>


        </div>
      </section>

      {/* Container Scroll Animation Section */}
      <section className="bg-black relative mt-24">
        <ContainerScroll
          titleComponent={
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Experience AI Solutions <br />
                <div className="flex justify-center">
                  <PointerHighlight
                    pointerClassName="text-cyan-400"
                    rectangleClassName="border-cyan-400/50"
                  >
                    <span className="bg-gradient-to-r from-[#00FFB7] to-[#0000E0] bg-clip-text text-transparent">
                      Like Never Before
                    </span>
                  </PointerHighlight>
                </div>
              </h1>
              <p className="text-gray-200 text-lg max-w-2xl mx-auto">
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
              <div className="flex justify-center">
                <PointerHighlight
                  pointerClassName="text-cyan-400"
                  rectangleClassName="border-cyan-400/50"
                >
                  <span className="bg-gradient-to-r from-[#00FFB7] to-[#0000E0] bg-clip-text text-transparent">
                    "Actionable Insights"
                  </span>
                </PointerHighlight>
              </div>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <CometCard className="w-full">
              <div className="bg-gradient-to-b from-slate-900/80 to-slate-950/90 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-2xl p-0.5 text-xs font-semibold leading-6 text-white inline-block w-full border border-slate-700/50 hover:border-slate-500/70 transition-all duration-300">
                <span className="absolute inset-0 overflow-hidden rounded-2xl">
                  <span className="absolute inset-0 rounded-2xl bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(148,163,184,0.8)_0%,rgba(148,163,184,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
                </span>
                <div className="relative p-8 rounded-2xl bg-gradient-to-b from-slate-900/30 to-black ring-2 ring-slate-700/30 hover:ring-slate-500/50 text-center z-10 h-80 transition-all duration-300">
                  <div className="w-16 h-16 bg-slate-700/30 backdrop-blur-sm rounded-full mb-6 mx-auto flex items-center justify-center ring-2 ring-slate-500/40">
                    <BarChart3 className="w-8 h-8 text-white" />
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
                    <Bot className="w-8 h-8 text-white" />
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
                    <Users className="w-8 h-8 text-white" />
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
      )}

      {/* Horizontal Scroll Sections */}
      <section className="w-full h-screen overflow-hidden relative">
        <HorizontalScroll 
          sections={horizontalSections}
          contentClassName="shadow-2xl border border-gray-700"
        />
      </section>


      {/* Trusted Companies Logo Loop */}
      <section className="bg-black py-16 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-gray-400 text-sm font-medium">
              Trusted by leading companies worldwide
            </p>
          </div>
          <LogoLoop
            logos={[
              {
                node: (
                  <svg className="h-8 w-auto" viewBox="0 0 108 24" fill="currentColor">
                    <path d="M44.836 0v24h-7.728V0h7.728zm13.284 10.872c1.224 0 2.22.36 2.988 1.08.768.72 1.152 1.656 1.152 2.808v9.24h-7.416V15.624c0-.528-.132-.936-.396-1.224-.264-.288-.636-.432-1.116-.432-.48 0-.852.144-1.116.432-.264.288-.396.696-.396 1.224V24h-7.416v-9.24c0-1.152.384-2.088 1.152-2.808.768-.72 1.764-1.08 2.988-1.08h9.564zm25.668 0c1.224 0 2.22.36 2.988 1.08.768.72 1.152 1.656 1.152 2.808v9.24h-7.416V15.624c0-.528-.132-.936-.396-1.224-.264-.288-.636-.432-1.116-.432-.48 0-.852.144-1.116.432-.264.288-.396.696-.396 1.224V24h-7.416v-9.24c0-1.152.384-2.088 1.152-2.808.768-.72 1.764-1.08 2.988-1.08h9.564zM13.44 0c7.416 0 13.44 6.024 13.44 13.44S20.856 26.88 13.44 26.88 0 20.856 0 13.44 6.024 0 13.44 0zm0 6.72c-3.696 0-6.72 3.024-6.72 6.72s3.024 6.72 6.72 6.72 6.72-3.024 6.72-6.72-3.024-6.72-6.72-6.72z" className="fill-gray-200"/>
                  </svg>
                ),
                title: "Microsoft"
              },
              {
                node: (
                  <svg className="h-8 w-auto" viewBox="0 0 272 92" fill="currentColor">
                    <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" className="fill-gray-200"/>
                    <path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" className="fill-gray-200"/>
                    <path d="M209.75 26.34v39.82c0 16.38-9.99 23.78-21.89 23.78-11.14 0-17.86-7.5-20.39-13.61l8.48-3.53c1.51 3.61 5.21 7.87 11.91 7.87 7.87 0 12.73-4.87 12.73-14.02v-3.19h-.37c-2.36 2.925-6.835 5.44-12.525 5.44-11.91 0-22.78-10.34-22.78-23.78s10.87-23.78 22.78-23.78c5.69 0 10.165 2.515 12.525 5.44h.37V26.34h8.81zm-8.22 20.84c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" className="fill-gray-200"/>
                    <path d="M225 3v65h-9.5V3h9.5z" className="fill-gray-200"/>
                    <path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" className="fill-gray-200"/>
                    <path d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z" className="fill-gray-200"/>
                  </svg>
                ),
                title: "Google"
              },
              {
                node: (
                  <svg className="h-8 w-auto" viewBox="0 0 200 60" fill="currentColor">
                    <path d="M139.5 19.3c-8.6 0-14.5 6.4-14.5 15.3s5.9 15.3 14.5 15.3c8.7 0 14.6-6.4 14.6-15.3s-5.9-15.3-14.6-15.3zm0 24.6c-4.7 0-8.7-3.9-8.7-9.3s4-9.3 8.7-9.3 8.8 3.9 8.8 9.3-4.1 9.3-8.8 9.3z" className="fill-gray-200"/>
                    <path d="M120.8 19.3c-8.6 0-14.5 6.4-14.5 15.3s5.9 15.3 14.5 15.3c8.7 0 14.6-6.4 14.6-15.3s-5.9-15.3-14.6-15.3zm0 24.6c-4.7 0-8.7-3.9-8.7-9.3s4-9.3 8.7-9.3 8.8 3.9 8.8 9.3-4.1 9.3-8.8 9.3z" className="fill-gray-200"/>
                    <path d="M99.3 22.3v5.6h13.4c-.4 3-1.5 5.2-3.2 6.9-2.1 2.1-5.3 4.4-10.2 4.4-8.1 0-14.5-6.6-14.5-14.7S91.2 10 99.3 10c4.4 0 7.6 1.7 9.9 3.9l4-4c-3.4-3.3-8-5.9-13.9-5.9-11.2 0-20.6 9.1-20.6 20.6s9.4 20.6 20.6 20.6c6 0 10.6-2 14.1-5.7 3.6-3.6 4.8-8.7 4.8-12.8 0-1.3-.1-2.5-.4-3.5H99.3z" className="fill-gray-200"/>
                    <path d="M181.4 27.5c-1.7-4.6-6.9-8.2-13.9-8.2-8.4 0-15.4 6.6-15.4 15.3 0 8.6 6.9 15.3 16.2 15.3 7.5 0 11.8-4.6 13.6-7.3l-5.6-3.7c-1.9 2.7-4.4 4.5-8 4.5-3.6 0-6.2-1.6-7.9-4.8l21.7-9c-1.1-2.6-2.4-5.5-4.7-7.1zm-22.1 5.4c-.3-5.9 4.6-8.9 8-8.9 2.7 0 5 1.4 5.8 3.4l-13.8 5.5z" className="fill-gray-200"/>
                    <path d="M63.7 29.3v-5.8h19.6c.2 1 .3 2.2.3 3.5 0 4.4-1.2 9.8-5.1 13.7-3.8 4-8.7 6.1-14.8 6.1-11.7 0-21.5-9.6-21.5-21.4S51 3.9 62.7 3.9c6.3 0 10.8 2.5 14.2 5.7l-4 4c-2.4-2.3-5.7-4.1-10.2-4.1-8.3 0-14.8 6.7-14.8 15.0s6.5 15.0 14.8 15.0c5.4 0 8.5-2.2 10.5-4.2 1.6-1.6 2.7-3.9 3.1-7.1H63.7v.1z" className="fill-gray-200"/>
                  </svg>
                ),
                title: "Google"
              },
              {
                node: (
                  <svg className="h-8 w-auto" viewBox="0 0 200 60" fill="currentColor">
                    <path d="M139.5 19.3c-8.6 0-14.5 6.4-14.5 15.3s5.9 15.3 14.5 15.3c8.7 0 14.6-6.4 14.6-15.3s-5.9-15.3-14.6-15.3zm0 24.6c-4.7 0-8.7-3.9-8.7-9.3s4-9.3 8.7-9.3 8.8 3.9 8.8 9.3-4.1 9.3-8.8 9.3z" className="fill-gray-200"/>
                    <path d="M120.8 19.3c-8.6 0-14.5 6.4-14.5 15.3s5.9 15.3 14.5 15.3c8.7 0 14.6-6.4 14.6-15.3s-5.9-15.3-14.6-15.3zm0 24.6c-4.7 0-8.7-3.9-8.7-9.3s4-9.3 8.7-9.3 8.8 3.9 8.8 9.3-4.1 9.3-8.8 9.3z" className="fill-gray-200"/>
                    <path d="M99.3 22.3v5.6h13.4c-.4 3-1.5 5.2-3.2 6.9-2.1 2.1-5.3 4.4-10.2 4.4-8.1 0-14.5-6.6-14.5-14.7S91.2 10 99.3 10c4.4 0 7.6 1.7 9.9 3.9l4-4c-3.4-3.3-8-5.9-13.9-5.9-11.2 0-20.6 9.1-20.6 20.6s9.4 20.6 20.6 20.6c6 0 10.6-2 14.1-5.7 3.6-3.6 4.8-8.7 4.8-12.8 0-1.3-.1-2.5-.4-3.5H99.3z" className="fill-gray-200"/>
                    <path d="M181.4 27.5c-1.7-4.6-6.9-8.2-13.9-8.2-8.4 0-15.4 6.6-15.4 15.3 0 8.6 6.9 15.3 16.2 15.3 7.5 0 11.8-4.6 13.6-7.3l-5.6-3.7c-1.9 2.7-4.4 4.5-8 4.5-3.6 0-6.2-1.6-7.9-4.8l21.7-9c-1.1-2.6-2.4-5.5-4.7-7.1zm-22.1 5.4c-.3-5.9 4.6-8.9 8-8.9 2.7 0 5 1.4 5.8 3.4l-13.8 5.5z" className="fill-gray-200"/>
                    <path d="M63.7 29.3v-5.8h19.6c.2 1 .3 2.2.3 3.5 0 4.4-1.2 9.8-5.1 13.7-3.8 4-8.7 6.1-14.8 6.1-11.7 0-21.5-9.6-21.5-21.4S51 3.9 62.7 3.9c6.3 0 10.8 2.5 14.2 5.7l-4 4c-2.4-2.3-5.7-4.1-10.2-4.1-8.3 0-14.8 6.7-14.8 15.0s6.5 15.0 14.8 15.0c5.4 0 8.5-2.2 10.5-4.2 1.6-1.6 2.7-3.9 3.1-7.1H63.7v.1z" className="fill-gray-200"/>
                  </svg>
                ),
                title: "Google"
              },
              {
                node: (
                  <svg className="h-8 w-auto" viewBox="0 0 200 60" fill="currentColor">
                    <path d="M139.5 19.3c-8.6 0-14.5 6.4-14.5 15.3s5.9 15.3 14.5 15.3c8.7 0 14.6-6.4 14.6-15.3s-5.9-15.3-14.6-15.3zm0 24.6c-4.7 0-8.7-3.9-8.7-9.3s4-9.3 8.7-9.3 8.8 3.9 8.8 9.3-4.1 9.3-8.8 9.3z" className="fill-gray-200"/>
                    <path d="M120.8 19.3c-8.6 0-14.5 6.4-14.5 15.3s5.9 15.3 14.5 15.3c8.7 0 14.6-6.4 14.6-15.3s-5.9-15.3-14.6-15.3zm0 24.6c-4.7 0-8.7-3.9-8.7-9.3s4-9.3 8.7-9.3 8.8 3.9 8.8 9.3-4.1 9.3-8.8 9.3z" className="fill-gray-200"/>
                    <path d="M99.3 22.3v5.6h13.4c-.4 3-1.5 5.2-3.2 6.9-2.1 2.1-5.3 4.4-10.2 4.4-8.1 0-14.5-6.6-14.5-14.7S91.2 10 99.3 10c4.4 0 7.6 1.7 9.9 3.9l4-4c-3.4-3.3-8-5.9-13.9-5.9-11.2 0-20.6 9.1-20.6 20.6s9.4 20.6 20.6 20.6c6 0 10.6-2 14.1-5.7 3.6-3.6 4.8-8.7 4.8-12.8 0-1.3-.1-2.5-.4-3.5H99.3z" className="fill-gray-200"/>
                    <path d="M181.4 27.5c-1.7-4.6-6.9-8.2-13.9-8.2-8.4 0-15.4 6.6-15.4 15.3 0 8.6 6.9 15.3 16.2 15.3 7.5 0 11.8-4.6 13.6-7.3l-5.6-3.7c-1.9 2.7-4.4 4.5-8 4.5-3.6 0-6.2-1.6-7.9-4.8l21.7-9c-1.1-2.6-2.4-5.5-4.7-7.1zm-22.1 5.4c-.3-5.9 4.6-8.9 8-8.9 2.7 0 5 1.4 5.8 3.4l-13.8 5.5z" className="fill-gray-200"/>
                    <path d="M63.7 29.3v-5.8h19.6c.2 1 .3 2.2.3 3.5 0 4.4-1.2 9.8-5.1 13.7-3.8 4-8.7 6.1-14.8 6.1-11.7 0-21.5-9.6-21.5-21.4S51 3.9 62.7 3.9c6.3 0 10.8 2.5 14.2 5.7l-4 4c-2.4-2.3-5.7-4.1-10.2-4.1-8.3 0-14.8 6.7-14.8 15.0s6.5 15.0 14.8 15.0c5.4 0 8.5-2.2 10.5-4.2 1.6-1.6 2.7-3.9 3.1-7.1H63.7v.1z" className="fill-gray-200"/>
                  </svg>
                ),
                title: "Google"
              },
              {
                node: (
                  <svg className="h-8 w-auto" viewBox="0 0 200 60" fill="currentColor">
                    <path d="M139.5 19.3c-8.6 0-14.5 6.4-14.5 15.3s5.9 15.3 14.5 15.3c8.7 0 14.6-6.4 14.6-15.3s-5.9-15.3-14.6-15.3zm0 24.6c-4.7 0-8.7-3.9-8.7-9.3s4-9.3 8.7-9.3 8.8 3.9 8.8 9.3-4.1 9.3-8.8 9.3z" className="fill-gray-200"/>
                    <path d="M120.8 19.3c-8.6 0-14.5 6.4-14.5 15.3s5.9 15.3 14.5 15.3c8.7 0 14.6-6.4 14.6-15.3s-5.9-15.3-14.6-15.3zm0 24.6c-4.7 0-8.7-3.9-8.7-9.3s4-9.3 8.7-9.3 8.8 3.9 8.8 9.3-4.1 9.3-8.8 9.3z" className="fill-gray-200"/>
                    <path d="M99.3 22.3v5.6h13.4c-.4 3-1.5 5.2-3.2 6.9-2.1 2.1-5.3 4.4-10.2 4.4-8.1 0-14.5-6.6-14.5-14.7S91.2 10 99.3 10c4.4 0 7.6 1.7 9.9 3.9l4-4c-3.4-3.3-8-5.9-13.9-5.9-11.2 0-20.6 9.1-20.6 20.6s9.4 20.6 20.6 20.6c6 0 10.6-2 14.1-5.7 3.6-3.6 4.8-8.7 4.8-12.8 0-1.3-.1-2.5-.4-3.5H99.3z" className="fill-gray-200"/>
                    <path d="M181.4 27.5c-1.7-4.6-6.9-8.2-13.9-8.2-8.4 0-15.4 6.6-15.4 15.3 0 8.6 6.9 15.3 16.2 15.3 7.5 0 11.8-4.6 13.6-7.3l-5.6-3.7c-1.9 2.7-4.4 4.5-8 4.5-3.6 0-6.2-1.6-7.9-4.8l21.7-9c-1.1-2.6-2.4-5.5-4.7-7.1zm-22.1 5.4c-.3-5.9 4.6-8.9 8-8.9 2.7 0 5 1.4 5.8 3.4l-13.8 5.5z" className="fill-gray-200"/>
                    <path d="M63.7 29.3v-5.8h19.6c.2 1 .3 2.2.3 3.5 0 4.4-1.2 9.8-5.1 13.7-3.8 4-8.7 6.1-14.8 6.1-11.7 0-21.5-9.6-21.5-21.4S51 3.9 62.7 3.9c6.3 0 10.8 2.5 14.2 5.7l-4 4c-2.4-2.3-5.7-4.1-10.2-4.1-8.3 0-14.8 6.7-14.8 15.0s6.5 15.0 14.8 15.0c5.4 0 8.5-2.2 10.5-4.2 1.6-1.6 2.7-3.9 3.1-7.1H63.7v.1z" className="fill-gray-200"/>
                  </svg>
                ),
                title: "Google"
              },
              {
                node: (
                  <svg className="h-8 w-auto" viewBox="0 0 200 60" fill="currentColor">
                    <path d="M139.5 19.3c-8.6 0-14.5 6.4-14.5 15.3s5.9 15.3 14.5 15.3c8.7 0 14.6-6.4 14.6-15.3s-5.9-15.3-14.6-15.3zm0 24.6c-4.7 0-8.7-3.9-8.7-9.3s4-9.3 8.7-9.3 8.8 3.9 8.8 9.3-4.1 9.3-8.8 9.3z" className="fill-gray-200"/>
                    <path d="M120.8 19.3c-8.6 0-14.5 6.4-14.5 15.3s5.9 15.3 14.5 15.3c8.7 0 14.6-6.4 14.6-15.3s-5.9-15.3-14.6-15.3zm0 24.6c-4.7 0-8.7-3.9-8.7-9.3s4-9.3 8.7-9.3 8.8 3.9 8.8 9.3-4.1 9.3-8.8 9.3z" className="fill-gray-200"/>
                    <path d="M99.3 22.3v5.6h13.4c-.4 3-1.5 5.2-3.2 6.9-2.1 2.1-5.3 4.4-10.2 4.4-8.1 0-14.5-6.6-14.5-14.7S91.2 10 99.3 10c4.4 0 7.6 1.7 9.9 3.9l4-4c-3.4-3.3-8-5.9-13.9-5.9-11.2 0-20.6 9.1-20.6 20.6s9.4 20.6 20.6 20.6c6 0 10.6-2 14.1-5.7 3.6-3.6 4.8-8.7 4.8-12.8 0-1.3-.1-2.5-.4-3.5H99.3z" className="fill-gray-200"/>
                    <path d="M181.4 27.5c-1.7-4.6-6.9-8.2-13.9-8.2-8.4 0-15.4 6.6-15.4 15.3 0 8.6 6.9 15.3 16.2 15.3 7.5 0 11.8-4.6 13.6-7.3l-5.6-3.7c-1.9 2.7-4.4 4.5-8 4.5-3.6 0-6.2-1.6-7.9-4.8l21.7-9c-1.1-2.6-2.4-5.5-4.7-7.1zm-22.1 5.4c-.3-5.9 4.6-8.9 8-8.9 2.7 0 5 1.4 5.8 3.4l-13.8 5.5z" className="fill-gray-200"/>
                    <path d="M63.7 29.3v-5.8h19.6c.2 1 .3 2.2.3 3.5 0 4.4-1.2 9.8-5.1 13.7-3.8 4-8.7 6.1-14.8 6.1-11.7 0-21.5-9.6-21.5-21.4S51 3.9 62.7 3.9c6.3 0 10.8 2.5 14.2 5.7l-4 4c-2.4-2.3-5.7-4.1-10.2-4.1-8.3 0-14.8 6.7-14.8 15.0s6.5 15.0 14.8 15.0c5.4 0 8.5-2.2 10.5-4.2 1.6-1.6 2.7-3.9 3.1-7.1H63.7v.1z" className="fill-gray-200"/>
                  </svg>
                ),
                title: "Google"
              },
              {
                node: (
                  <svg className="h-8 w-auto" viewBox="0 0 200 60" fill="currentColor">
                    <path d="M139.5 19.3c-8.6 0-14.5 6.4-14.5 15.3s5.9 15.3 14.5 15.3c8.7 0 14.6-6.4 14.6-15.3s-5.9-15.3-14.6-15.3zm0 24.6c-4.7 0-8.7-3.9-8.7-9.3s4-9.3 8.7-9.3 8.8 3.9 8.8 9.3-4.1 9.3-8.8 9.3z" className="fill-gray-200"/>
                    <path d="M120.8 19.3c-8.6 0-14.5 6.4-14.5 15.3s5.9 15.3 14.5 15.3c8.7 0 14.6-6.4 14.6-15.3s-5.9-15.3-14.6-15.3zm0 24.6c-4.7 0-8.7-3.9-8.7-9.3s4-9.3 8.7-9.3 8.8 3.9 8.8 9.3-4.1 9.3-8.8 9.3z" className="fill-gray-200"/>
                    <path d="M99.3 22.3v5.6h13.4c-.4 3-1.5 5.2-3.2 6.9-2.1 2.1-5.3 4.4-10.2 4.4-8.1 0-14.5-6.6-14.5-14.7S91.2 10 99.3 10c4.4 0 7.6 1.7 9.9 3.9l4-4c-3.4-3.3-8-5.9-13.9-5.9-11.2 0-20.6 9.1-20.6 20.6s9.4 20.6 20.6 20.6c6 0 10.6-2 14.1-5.7 3.6-3.6 4.8-8.7 4.8-12.8 0-1.3-.1-2.5-.4-3.5H99.3z" className="fill-gray-200"/>
                    <path d="M181.4 27.5c-1.7-4.6-6.9-8.2-13.9-8.2-8.4 0-15.4 6.6-15.4 15.3 0 8.6 6.9 15.3 16.2 15.3 7.5 0 11.8-4.6 13.6-7.3l-5.6-3.7c-1.9 2.7-4.4 4.5-8 4.5-3.6 0-6.2-1.6-7.9-4.8l21.7-9c-1.1-2.6-2.4-5.5-4.7-7.1zm-22.1 5.4c-.3-5.9 4.6-8.9 8-8.9 2.7 0 5 1.4 5.8 3.4l-13.8 5.5z" className="fill-gray-200"/>
                    <path d="M63.7 29.3v-5.8h19.6c.2 1 .3 2.2.3 3.5 0 4.4-1.2 9.8-5.1 13.7-3.8 4-8.7 6.1-14.8 6.1-11.7 0-21.5-9.6-21.5-21.4S51 3.9 62.7 3.9c6.3 0 10.8 2.5 14.2 5.7l-4 4c-2.4-2.3-5.7-4.1-10.2-4.1-8.3 0-14.8 6.7-14.8 15.0s6.5 15.0 14.8 15.0c5.4 0 8.5-2.2 10.5-4.2 1.6-1.6 2.7-3.9 3.1-7.1H63.7v.1z" className="fill-gray-200"/>
                  </svg>
                ),
                title: "Google"
              },
              {
                node: (
                  <svg className="h-8 w-auto" viewBox="0 0 200 60" fill="currentColor">
                    <path d="M50.7 30c0-11 8.9-20 19.9-20s19.9 9 19.9 20-8.9 20-19.9 20-19.9-9-19.9-20zm30.6 0c0-5.9-4.8-10.7-10.7-10.7S59.9 24.1 59.9 30s4.8 10.7 10.7 10.7S81.3 35.9 81.3 30z" className="fill-gray-200"/>
                    <path d="M110.8 11.3v6.4c-2.2-4.8-7.4-7.9-13.6-7.9-11 0-19.9 9-19.9 20s8.9 20 19.9 20c6.2 0 11.4-3.1 13.6-7.9v6.4h9.3V11.3h-9.3zm-11.9 28.4c-5.9 0-10.7-4.8-10.7-10.7s4.8-10.7 10.7-10.7S109.6 24.1 109.6 30s-4.8 9.7-10.7 9.7z" className="fill-gray-200"/>
                    <path d="M146.7 9.8c-11 0-19.9 9-19.9 20s8.9 20 19.9 20c6.8 0 12.8-3.4 16.4-8.6l-7.4-4.3c-2.2 3.1-5.8 5.2-9.9 5.2-5.9 0-10.7-4.8-10.7-10.7s4.8-10.7 10.7-10.7c4.1 0 7.7 2.1 9.9 5.2l7.4-4.3c-3.6-5.2-9.6-8.6-16.4-8.6z" className="fill-gray-200"/>
                    <path d="M25.6 30c0-11 8.9-20 19.9-20V0C20.4 0 0 20.4 0 45.5S20.4 91 45.5 91V81c-11 0-19.9-9-19.9-20z" className="fill-gray-200"/>
                  </svg>
                ),
                title: "Adobe"
              },
              {
                node: (
                  <svg className="h-8 w-auto" viewBox="0 0 200 60" fill="currentColor">
                    <path d="M78.4 30c0-8.3-6.7-15-15-15s-15 6.7-15 15 6.7 15 15 15 15-6.7 15-15zm-22.5 0c0-4.1 3.4-7.5 7.5-7.5s7.5 3.4 7.5 7.5-3.4 7.5-7.5 7.5-7.5-3.4-7.5-7.5z" className="fill-gray-200"/>
                    <path d="M120.1 30c0-8.3-6.7-15-15-15s-15 6.7-15 15 6.7 15 15 15 15-6.7 15-15zm-22.5 0c0-4.1 3.4-7.5 7.5-7.5s7.5 3.4 7.5 7.5-3.4 7.5-7.5 7.5-7.5-3.4-7.5-7.5z" className="fill-gray-200"/>
                    <path d="M161.8 30c0-8.3-6.7-15-15-15s-15 6.7-15 15 6.7 15 15 15 15-6.7 15-15zm-22.5 0c0-4.1 3.4-7.5 7.5-7.5s7.5 3.4 7.5 7.5-3.4 7.5-7.5 7.5-7.5-3.4-7.5-7.5z" className="fill-gray-200"/>
                  </svg>
                ),
                title: "Tesla"
              },
              {
                node: (
                  <svg className="h-8 w-auto" viewBox="0 0 200 60" fill="currentColor">
                    <path d="M100 0L0 30l100 30 100-30L100 0zM45 30l55-16.5L155 30 100 46.5 45 30z" className="fill-gray-200"/>
                  </svg>
                ),
                title: "Netflix"
              },
              {
                node: (
                  <svg className="h-8 w-auto" viewBox="0 0 200 60" fill="currentColor">
                    <circle cx="100" cy="30" r="30" className="fill-gray-200"/>
                    <path d="M100 20c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10z" className="fill-black"/>
                  </svg>
                ),
                title: "Spotify"
              }
            ]}
            speed={80}
            direction="left"
            logoHeight={32}
            gap={48}
            pauseOnHover={true}
            fadeOut={true}
            fadeOutColor="rgba(0, 0, 0, 1)"
            className="text-gray-200 opacity-80"
          />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 mt-14 bg-black relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white">
              Discover what our customers say <br />
              <div className="flex justify-center">
                <PointerHighlight
                  pointerClassName="text-cyan-400"
                  rectangleClassName="border-cyan-400/50"
                >
                  <span className="bg-gradient-to-r from-[#00FFB7] to-[#0000E0] bg-clip-text text-transparent text-4xl md:text-6xl">
                    about us
                  </span>
                </PointerHighlight>
              </div>
            </h2>
            <p className="text-gray-200 max-w-2xl mx-auto">
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

      <PricingSection />

      {/* CTA Section */}
      <section className="w-full bg-black text-white py-24 relative overflow-hidden">
        {/* BackgroundBeams */}
        <BackgroundBeams className="absolute inset-0 opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Main CTA Content */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-semibold mb-8">
              <Rocket className="w-4 h-4" />
              Start Your AI Transformation Today
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Ready to Transform Your
              <br />
              <div className="flex justify-center">
                <PointerHighlight
                  pointerClassName="text-cyan-400"
                  rectangleClassName="border-cyan-400/50"
                >
                  <span className="bg-gradient-to-r from-[#00FFB7] to-[#0000E0] bg-clip-text text-transparent">
                    Business with AI?
                  </span>
                </PointerHighlight>
              </div>
            </h2>
            
            <p className="text-gray-200 text-xl max-w-3xl mx-auto leading-relaxed mb-12">
              Join thousands of businesses already using our AI solutions to automate workflows, 
              gain insights, and accelerate growth. Start your free trial today—no credit card required.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button 
              onClick={() => router.push('/contact')}
              className="group bg-white text-black px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:bg-slate-200 hover:scale-105 flex items-center gap-3 shadow-2xl shadow-white/10"
            >
              <Rocket className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Book a Demo
            </button>
            
            <button 
              onClick={() => router.push('/contact')}
              className="group border-2 border-slate-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:bg-white/10 hover:border-slate-400 flex items-center gap-3"
            >
              <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Still confused? Contact us
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-white mb-2">10,000+</div>
              <div className="text-slate-400 text-sm">Businesses Automated</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-white mb-2">99.9%</div>
              <div className="text-slate-400 text-sm">Uptime Guarantee</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-slate-400 text-sm">Expert Support</div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-16 p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-white mb-1">Enterprise Security</h4>
                  <p className="text-slate-400 text-sm">SOC 2 compliant with end-to-end encryption</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-white mb-1">Quick Setup</h4>
                  <p className="text-slate-400 text-sm">Get started in under 5 minutes</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-white mb-1">Expert Onboarding</h4>
                  <p className="text-slate-400 text-sm">Dedicated success manager included</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
