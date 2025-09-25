"use client";

import { motion } from "framer-motion";
import { ArrowRight, Award, Quote, TrendingUp, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import H1Reveal from "../../components/H1Reveal";
const GlobeDemo = dynamic(() => import("../../components/GlobeDemo").then(m => m.GlobeDemo), { ssr: false });
const Magnet = dynamic(() => import("../../components/Magnet"), { ssr: false });
const InfiniteMovingCardsVertical = dynamic(() => import("../../components/ui/infinite-moving-cards-vertical").then(m => m.InfiniteMovingCardsVertical), { ssr: false });
const PointerHighlight = dynamic(() => import("../../components/ui/pointer-highlight").then(m => m.PointerHighlight), { ssr: false });
const SparklesCore = dynamic(() => import("../../components/ui/sparkles").then(m => m.SparklesCore), { ssr: false });

interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  testimonial: string;
  rating: number;
  createdAt: string;
}


export default function TestimonialsPage() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials');
      if (response.ok) {
        const dynamicTestimonials = await response.json();
        // Mix static and dynamic testimonials, removing duplicates
        const allTestimonials = [...staticTestimonials, ...dynamicTestimonials];
        
        // Remove duplicates based on testimonial content
        const uniqueTestimonials = allTestimonials.filter((testimonial, index, self) => 
          index === self.findIndex(t => t.testimonial === testimonial.testimonial)
        );
        
        // Shuffle the testimonials for random display
        const shuffledTestimonials = uniqueTestimonials.sort(() => Math.random() - 0.5);
        setTestimonials(shuffledTestimonials);
      } else {
        // Fallback to static data if API fails
        setTestimonials(staticTestimonials);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      // Fallback to static data
      setTestimonials(staticTestimonials);
    } finally {
      setIsLoading(false);
    }
  };

  // Static testimonials as fallback
  const staticTestimonials = [
    {
      id: "1",
      name: "Sarah Chen",
      role: "Chief Technology Officer",
      company: "TechFlow Solutions",
      testimonial: "It's always a pleasure working with AI Solution, they are good at communicating and delivering results. They bring 100% to each project and get work done when it's needed the most.",
      rating: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Marcus Rodriguez",
      role: "Head of Operations",
      company: "DataMind Analytics",
      testimonial: "We engaged AI Solution in Q4 of 2023 with the goal of telling a better story to our users for our AI platform. AI Solution was extraordinary in extrapolating user personas and the right narrative for each of our primary and secondary audiences.",
      rating: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Dr. Emily Watson",
      role: "Research Director",
      company: "MedTech Innovations",
      testimonial: "AI Solution is an amazing AI consultant. They have a deep understanding about their sphere, and deliver great results.",
      rating: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: "4",
      name: "James Thompson",
      role: "VP of Sales",
      company: "Global Commerce Inc.",
      testimonial: "The recommendation engine increased our conversion rates by 43% and average order value by 28%. Their team delivered exceptional results with outstanding support.",
      rating: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: "5",
      name: "Lisa Park",
      role: "Chief Financial Officer",
      company: "FinanceForward",
      testimonial: "Their fraud detection AI caught 15 potentially costly security breaches that our previous system missed. The ROI was immediate and substantial.",
      rating: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: "6",
      name: "Alex Johnson",
      role: "Head of Marketing",
      company: "BrandVision",
      testimonial: "The sentiment analysis tool transformed how we understand our customers. Campaign effectiveness increased by 65% within the first quarter.",
      rating: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: "7",
      name: "Dr. Michael Chang",
      role: "Director of Research",
      company: "BioTech Labs",
      testimonial: "AI-powered drug discovery shortened our research cycles from 3 years to 8 months with 95% accuracy. Revolutionary technology.",
      rating: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: "8",
      name: "Rachel Martinez",
      role: "Chief Operating Officer",
      company: "LogisticsPro",
      testimonial: "Their supply chain optimization AI reduced our delivery times by 40% and cut operational costs by $2M annually. Exceptional results.",
      rating: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: "9",
      name: "David Kim",
      role: "Product Manager",
      company: "InnovateTech",
      testimonial: "Working with AI Solution was seamless. They delivered beyond expectations with exceptional support and innovative solutions.",
      rating: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: "10",
      name: "Jennifer Walsh",
      role: "VP of Customer Success",
      company: "RetailMax",
      testimonial: "Customer satisfaction scores improved by 50% after implementing their personalization engine. The results exceeded all expectations.",
      rating: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: "11",
      name: "Dr. Robert Kim",
      role: "Head of Data Science",
      company: "QuantumTech",
      testimonial: "Their machine learning models helped us predict market trends with 92% accuracy. It completely transformed our investment strategy.",
      rating: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: "12",
      name: "Maria Santos",
      role: "Chief Marketing Officer",
      company: "GrowthLabs",
      testimonial: "The AI-powered content generation tool increased our marketing productivity by 300%. We can now create personalized campaigns at scale.",
      rating: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: "13",
      name: "Thomas Anderson",
      role: "Operations Director",
      company: "Manufacturing Pro",
      testimonial: "Predictive maintenance AI reduced our equipment downtime by 60% and saved us over $1.5M in repair costs annually.",
      rating: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: "14",
      name: "Dr. Linda Zhang",
      role: "Research Lead",
      company: "HealthTech Solutions",
      testimonial: "Their computer vision system for medical imaging achieved 98% diagnostic accuracy, significantly improving patient outcomes.",
      rating: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: "15",
      name: "Carlos Rodriguez",
      role: "VP of Engineering",
      company: "CloudStream",
      testimonial: "The natural language processing solution automated 80% of our customer support tickets while maintaining high satisfaction rates.",
      rating: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: "16",
      name: "Amanda Foster",
      role: "Head of Analytics",
      company: "InsightCorp",
      testimonial: "Real-time analytics dashboard powered by AI gave us actionable insights that increased revenue by 25% in just six months.",
      rating: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: "17",
      name: "Dr. Kevin Liu",
      role: "CTO",
      company: "FutureTech",
      testimonial: "Their autonomous AI agents handle complex workflows seamlessly. It's like having a team of expert analysts working 24/7.",
      rating: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: "18",
      name: "Sophie Williams",
      role: "Digital Transformation Lead",
      company: "NextGen Industries",
      testimonial: "The AI implementation strategy was flawless. We achieved digital transformation goals 18 months ahead of schedule.",
      rating: 5,
      createdAt: new Date().toISOString(),
    }
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-24">
        {/* Background */}
        <div className="absolute inset-0">
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
                <Quote className="w-4 h-4 text-white" />
                <span className="text-white text-sm">
                  Client Success Stories
                </span>
              </div>
              <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-slate-400/0 via-slate-400/90 to-slate-400/0"></span>
            </div>
            
            {/* Main Title */}
            <H1Reveal>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              <div className="flex justify-center">
                <PointerHighlight>
                  <span className="bg-gradient-to-r from-[#00FFB7] to-[#0000E0] bg-clip-text text-transparent">
                    Testimonials
                  </span>
                </PointerHighlight>
              </div>
            </h1>
            </H1Reveal>
            
            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto mb-12 leading-relaxed">
              Discover how our AI solutions have transformed businesses across industries. 
              Read real stories from clients who achieved remarkable results with our cutting-edge 
              artificial intelligence technologies.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="bg-slate-900/30 backdrop-blur-sm rounded-xl p-6 border border-slate-800/50"
              >
                <Users className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">500+</div>
                <div className="text-sm text-slate-400">Happy Clients</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="bg-slate-900/30 backdrop-blur-sm rounded-xl p-6 border border-slate-800/50"
              >
                <Award className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">99.2%</div>
                <div className="text-sm text-slate-400">Success Rate</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="bg-slate-900/30 backdrop-blur-sm rounded-xl p-6 border border-slate-800/50"
              >
                <TrendingUp className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">340%</div>
                <div className="text-sm text-slate-400">Average ROI</div>
              </motion.div>
            </div>

            {/* CTA Button */}
            <Magnet magnetStrength={2} padding={100}>
              <button 
                onClick={() => router.push('/contact')}
                className="bg-white text-black no-underline group cursor-pointer relative shadow-2xl shadow-white/20 rounded-full px-8 py-4 text-lg font-semibold leading-6 inline-block transition-all duration-300 hover:scale-105 hover:shadow-white/40"
              >
                <span className="absolute inset-0 overflow-hidden rounded-full">
                  <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
                </span>
                <div className="relative flex space-x-2 items-center z-10 rounded-full">
                  <span className="text-black font-medium">Start Your Project</span>
                  <ArrowRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" />
                </div>
                <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-black/0 via-black/30 to-black/0 transition-opacity duration-500 group-hover:opacity-40"></span>
              </button>
            </Magnet>
          </motion.div>
        </div>
      </section>

      {/* References Section Header */}
      <section className="relative py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <p className="text-gray-200 text-lg mb-4">References</p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
              Read what our
              <div className="inline-flex">
                <PointerHighlight>
                  <span className="bg-gradient-to-r from-[#00FFB7] to-[#0000E0] bg-clip-text text-transparent">
                    clients and colleagues
                  </span>
                </PointerHighlight>
              </div>
              <br />
              have to say about our work.
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Infinite Moving Section */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-[800px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="flex items-center justify-center h-[400px]">
              <div className="text-center">
                <p className="text-gray-400 text-lg mb-4">No testimonials available yet.</p>
                <button 
                  onClick={() => router.push('/contact')}
                  className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Be the first to share your experience
                </button>
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-[800px]">
                {/* First Column - Moving Down */}
                <div className="relative h-full overflow-hidden">
                  <InfiniteMovingCardsVertical
                    items={testimonials.slice(0, Math.ceil(testimonials.length / 3)).map((testimonial, index) => ({
                      quote: testimonial.testimonial,
                      name: testimonial.name,
                      title: `${testimonial.role || 'Client'} at ${testimonial.company || 'Client Company'}`,
                      profileImage: `https://picsum.photos/seed/testimonial-a-${index}/400/400`
                    }))}
                    direction="down"
                    speed="slow"
                    className="h-full"
                  />
                </div>

                {/* Second Column - Moving Up */}
                <div className="relative h-full overflow-hidden">
                  <InfiniteMovingCardsVertical
                    items={testimonials.slice(Math.ceil(testimonials.length / 3), Math.ceil(testimonials.length * 2 / 3)).map((testimonial, index) => ({
                      quote: testimonial.testimonial,
                      name: testimonial.name,
                      title: `${testimonial.role || 'Client'} at ${testimonial.company || 'Client Company'}`,
                      profileImage: `https://picsum.photos/seed/testimonial-b-${index}/400/400`
                    }))}
                    direction="up"
                    speed="slow"
                    className="h-full"
                  />
                </div>

                {/* Third Column - Moving Down */}
                <div className="relative h-full overflow-hidden lg:block hidden">
                  <InfiniteMovingCardsVertical
                    items={testimonials.slice(Math.ceil(testimonials.length * 2 / 3)).map((testimonial, index) => ({
                      quote: testimonial.testimonial,
                      name: testimonial.name,
                      title: `${testimonial.role || 'Client'} at ${testimonial.company || 'Client Company'}`,
                      profileImage: `https://picsum.photos/seed/testimonial-c-${index}/400/400`
                    }))}
                    direction="down"
                    speed="slow"
                    className="h-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Globe Section */}
      <GlobeDemo />
    </main>
  );
}
