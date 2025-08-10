"use client";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Star, Quote, TrendingUp, Users, Award, CheckCircle } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { StatCard, SectionHeader, Badge, GradientButton, TestimonialCard, PrimaryButton } from "../components/ui";

// Lazy load Spline with proper Next.js import
const Spline = dynamic(() => import("@splinetool/react-spline").then((module) => module.default), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gradient-to-br from-purple-500/20 via-fuchsia-500/30 to-indigo-500/20" />
});

export default function Testimonials() {
  const [splineError, setSplineError] = useState(false);
  const [splineError2, setSplineError2] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fix hydration issue by checking if component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSplineError = useCallback((error: any) => {
    console.warn('Hero Spline loading error:', error);
    setSplineError(true);
  }, []);

  const handleSplineError2 = useCallback((error: any) => {
    console.warn('Testimonials Spline loading error:', error);
    setSplineError2(true);
  }, []);
  const testimonials = [
    {
      name: "Sophia Liu",
      title: "CTO at FinEdge",
      review: "AI Solutions helped us cut analysis time by 60%. Their predictive models are game-changing! The implementation was seamless and delivered exceptional ROI within the first quarter.",
      stars: 5,
      metric: "60% Time Saved",
      impact: "Increased efficiency across all financial operations"
    },
    {
      name: "Ethan Cole",
      title: "Product Manager at MedicoTrack",
      review: "Their chatbot automation transformed our patient engagement experience. Great team! Patient satisfaction increased by 45% and response times improved dramatically.",
      stars: 5,
      metric: "45% Higher Satisfaction",
      impact: "Enhanced patient care and streamlined operations"
    },
    {
      name: "Nora Patel",
      title: "Founder at RetailScope",
      review: "Absolutely loved the way their custom AI tools adapted to our business goals. Seamless onboarding and exceptional support throughout the entire journey.",
      stars: 5,
      metric: "3x Revenue Growth",
      impact: "Transformed retail analytics and customer insights"
    },
    {
      name: "Marcus Chen",
      title: "VP Operations at LogiFlow",
      review: "The AI-powered logistics optimization reduced operational costs by 35% while improving delivery times. Outstanding technical expertise and world-class support.",
      stars: 5,
      metric: "35% Cost Reduction",
      impact: "Revolutionized supply chain management"
    },
    {
      name: "Isabella Rodriguez",
      title: "Head of Marketing at BrandVision",
      review: "Their AI-driven personalization engine increased conversion rates by 120%. The platform is intuitive and provides incredibly valuable business insights.",
      stars: 5,
      metric: "120% Better Conversions",
      impact: "Accelerated digital marketing performance"
    },
    {
      name: "David Kim",
      title: "CEO at DataStream Analytics",
      review: "Working with AI Solutions has been transformative for our business. Their machine learning models helped us identify opportunities we never knew existed.",
      stars: 5,
      metric: "250% Market Insights",
      impact: "Unlocked new revenue streams and opportunities"
    }
  ];

  const stats = [
    { icon: Users, label: "Happy Clients", value: "500+", description: "Businesses transformed" },
    { icon: TrendingUp, label: "Average ROI", value: "340%", description: "Return on investment" },
    { icon: Award, label: "Success Rate", value: "98%", description: "Project completion" },
    { icon: CheckCircle, label: "Industries", value: "25+", description: "Sectors served" }
  ];

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <main className="relative min-h-screen w-full overflow-hidden bg-[#05010D] text-[#e0e0ff]">
        {/* Static fallback during hydration */}
        <div className="absolute inset-0 z-0 overflow-hidden" style={{height: '100vh'}}>
          <div className="absolute right-0 top-0 w-1/2 h-full pointer-events-none">
            <div className="w-full h-full bg-gradient-to-br from-slate-500/10 via-gray-500/20 to-slate-500/10 rounded-full blur-3xl" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#05010D] via-[#05010D]/80 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05010D]/80 via-transparent to-[#05010D]/90 pointer-events-none" />
        </div>
        {/* Loading skeleton for hero content */}
        <section className="relative z-10 min-h-screen flex items-center pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
              <div className="space-y-8 sm:space-y-10">
                <div className="space-y-6 sm:space-y-8">
                  <div className="w-40 sm:w-48 h-6 sm:h-8 bg-white/10 rounded-full animate-pulse mx-auto lg:mx-0" />
                  <div className="space-y-3 sm:space-y-4">
                    <div className="w-80 sm:w-96 h-12 sm:h-16 bg-white/10 rounded animate-pulse mx-auto lg:mx-0" />
                    <div className="w-72 sm:w-80 h-12 sm:h-16 bg-white/10 rounded animate-pulse mx-auto lg:mx-0" />
                  </div>
                  <div className="w-full h-20 sm:h-24 bg-white/10 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#05010D] text-[#e0e0ff] testimonials-page">
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
        .spline-logo,
        [data-spline*="logo"],
        [class*="spline-logo"],
        canvas + div,
        canvas ~ div,
        div[style*="position: absolute"][style*="bottom"],
        div[style*="position: absolute"][style*="right"],
        div[style*="position: fixed"][style*="bottom"],
        div[style*="position: fixed"][style*="right"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
          z-index: -9999 !important;
        }
        
        /* Hide any small positioned elements that might be logos */
        div[style*="width: 40px"],
        div[style*="width: 50px"],
        div[style*="width: 60px"],
        div[style*="height: 40px"],
        div[style*="height: 50px"],
        div[style*="height: 60px"] {
          display: none !important;
        }

        /* Responsive zoom handling */
        @media (max-width: 640px) {
          .testimonials-page {
            font-size: clamp(14px, 4vw, 16px);
          }
          
          .testimonials-page h1 {
            font-size: clamp(1.875rem, 8vw, 3rem) !important;
            line-height: 1.2 !important;
          }
          
          .testimonials-page h2 {
            font-size: clamp(1.5rem, 6vw, 2.5rem) !important;
            line-height: 1.3 !important;
          }
          
          .testimonials-page p {
            font-size: clamp(0.875rem, 3.5vw, 1rem) !important;
          }
        }

        @media (min-width: 641px) and (max-width: 768px) {
          .testimonials-page h1 {
            font-size: clamp(2.5rem, 6vw, 3.5rem) !important;
          }
          
          .testimonials-page h2 {
            font-size: clamp(2rem, 5vw, 3rem) !important;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .testimonials-page h1 {
            font-size: clamp(3rem, 5vw, 4rem) !important;
          }
          
          .testimonials-page h2 {
            font-size: clamp(2.5rem, 4vw, 3.5rem) !important;
          }
        }

        /* Ensure proper scaling for different zoom levels */
        html {
          scroll-behavior: smooth;
        }
        
        /* Prevent horizontal overflow on zoom */
        body {
          overflow-x: hidden;
        }
        
        /* Better text scaling for zoom */
        @media (max-width: 480px) {
          .testimonials-page * {
            word-break: break-word;
            hyphens: auto;
          }
        }

        /* Viewport-based scaling */
        .testimonials-page .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr));
          gap: clamp(1rem, 4vw, 2rem);
        }

        .testimonials-page .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr));
          gap: clamp(1.5rem, 4vw, 2rem);
        }

        /* Handle extreme zoom levels */
        @media (max-width: 320px) {
          .testimonials-page {
            padding: 0.5rem !important;
          }
          
          .testimonials-page h1 {
            font-size: 1.5rem !important;
            margin-bottom: 1rem !important;
          }
          
          .testimonials-page h2 {
            font-size: 1.25rem !important;
            margin-bottom: 0.75rem !important;
          }
          
          .testimonials-page .stats-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 0.75rem !important;
          }
          
          .testimonials-page .testimonials-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
        }

        /* Large screen optimizations */
        @media (min-width: 1920px) {
          .testimonials-page {
            font-size: 18px;
          }
          
          .testimonials-page .container {
            max-width: 1600px;
          }
        }

        /* Ultra-wide screen handling */
        @media (min-width: 2560px) {
          .testimonials-page {
            font-size: 20px;
          }
          
          .testimonials-page .container {
            max-width: 2000px;
          }
        }
      `}</style>
      
      {/* Hero Section with Fullscreen 3D Background */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 z-10 pt-32 pb-20">
        {/* Hero 3D Fullscreen Background */}
        <motion.div 
          className="absolute inset-0 z-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {!splineError ? (
            <Spline 
              scene="https://prod.spline.design/k6ohs7tWmCCFggYS/scene.splinecode"
              onError={handleSplineError}
              style={{
                width: '100%',
                height: '100%'
              }}
            />
          ) : (
            // Fallback gradient background when Spline fails
            <div className="w-full h-full bg-gradient-to-br from-purple-500/20 via-fuchsia-500/30 to-indigo-500/20 animate-pulse" />
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
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#05010D]/20 to-[#05010D] pointer-events-none" />
        </motion.div>

        {/* Centered Hero Content */}
        <motion.div 
          className="relative z-10 max-w-7xl w-full space-y-6 sm:space-y-8 lg:space-y-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 1.2, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3, duration: 1 }}
            className="space-y-6 sm:space-y-8"
          >
            <div className="flex justify-center">
              <Badge 
                variant="purple" 
                icon={<Quote className="w-4 h-4 sm:w-5 sm:h-5" />}
                size="lg"
              >
                Client Success Stories
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight px-4">
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-500 to-indigo-400 bg-clip-text text-transparent">
                What Our
              </span>
              <br />
              <span className="text-white">
                Clients Say
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto px-4">
              Discover how AI Solutions has transformed businesses worldwide. 
              Trusted by professionals across industries for intelligent, scalable, 
              and personalized AI tools that deliver measurable results.
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.5, duration: 1 }}
            className="stats-grid grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-12 sm:mt-16 px-4"
          >
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                icon={<stat.icon className="w-6 h-6 sm:w-8 sm:h-8" />}
                value={stat.value}
                label={stat.label}
                description={stat.description}
                index={index}
              />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4, duration: 1 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8 sm:mt-12 px-4"
          >
            <GradientButton size="lg" className="w-full sm:w-auto">
              Start Your Transformation
            </GradientButton>
            <GradientButton variant="outline" size="lg" className="w-full sm:w-auto">
              View Our Blog
            </GradientButton>
          </motion.div>
        </motion.div>
      </section>

      {/* Section Divider */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
      </div>

      {/* Enhanced Testimonials Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Testimonials Blurred 3D Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {!splineError2 ? (
            <div className="w-full h-full" style={{ filter: 'blur(8px)' }}>
              <Spline 
                scene="https://prod.spline.design/7poRPdTzvef39OJD/scene.splinecode"
                onError={handleSplineError2}
                style={{
                  width: '100%',
                  height: '100%'
                }}
              />
            </div>
          ) : (
            // Fallback gradient background when Spline fails
            <div className="w-full h-full bg-gradient-to-br from-purple-500/10 via-fuchsia-500/20 to-indigo-500/10 animate-pulse" />
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
          <div className="absolute inset-0 bg-gradient-to-b from-[#05010D]/30 via-transparent to-[#05010D]/30 pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16 lg:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 px-4">
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-500 to-indigo-400 bg-clip-text text-transparent">
                Trusted by Industry Leaders
              </span>
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
              Join hundreds of companies that have transformed their operations with our cutting-edge AI solutions
            </p>
          </motion.div>

          <div className="testimonials-grid grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, i) => (
              <TestimonialCard
                key={i}
                name={testimonial.name}
                title={testimonial.title}
                review={testimonial.review}
                stars={testimonial.stars}
                metric={testimonial.metric}
                impact={testimonial.impact}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/*  Call to Action */}
      <section className="relative z-10 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8 sm:space-y-10 lg:space-y-12"
          >
            <div className="space-y-4 sm:space-y-6">
              <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-purple-400" />
                <span className="text-xs sm:text-sm font-medium text-purple-300">Join Our Success Community</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight px-4">
                <span className="bg-gradient-to-r from-purple-400 via-fuchsia-500 to-indigo-400 bg-clip-text text-transparent">
                  Ready to Transform
                </span>
                <br />
                <span className="text-white">Your Business?</span>
              </h2>
              
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
                Transform your business with AI solutions that deliver measurable results. 
                Join industry leaders who have already experienced remarkable growth with our cutting-edge technology.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 my-8 sm:my-10 lg:my-12 max-w-4xl mx-auto">
              <div className="text-center space-y-2 sm:space-y-3 p-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center border border-white/10">
                  <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-white">Proven Results</h3>
                <p className="text-xs sm:text-sm text-gray-400">Average 340% ROI for our clients</p>
              </div>
              <div className="text-center space-y-2 sm:space-y-3 p-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center border border-white/10">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-white">Expert Support</h3>
                <p className="text-xs sm:text-sm text-gray-400">Dedicated team throughout your journey</p>
              </div>
              <div className="text-center space-y-2 sm:space-y-3 p-4 sm:col-span-1 col-span-full max-w-xs mx-auto sm:max-w-none">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center border border-white/10">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-white">Fast Implementation</h3>
                <p className="text-xs sm:text-sm text-gray-400">Get started in just 2 weeks</p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="flex justify-center px-4">
                <PrimaryButton size="lg" className="px-8 sm:px-12 py-3 sm:py-5 w-full sm:w-auto max-w-sm">
                  Schedule Free Consultation
                </PrimaryButton>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 px-4">
                Join 500+ companies already transforming with AI Solutions
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}