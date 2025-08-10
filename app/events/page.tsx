"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { 
  Bot, 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Plus,
  Mail,
  MessageCircle,
  Users,
  ChevronDown
} from "lucide-react";
import { GradientButton, SectionHeader, Badge, FAQItem } from "../components/ui";
import FAQSection from "../components/FAQSection";

// Dynamically import Spline to improve loading performance
const Spline = dynamic(() => import("@splinetool/react-spline"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-purple-500/20 via-fuchsia-500/30 to-indigo-500/20 animate-pulse" />
  )
});

// Curated Unsplash images for tech events
const eventGallery = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop&crop=center", // Tech conference presentation
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop&crop=center", // Hackathon coding session
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&crop=center", // Team collaboration
  "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=400&fit=crop&crop=center", // Workshop discussion
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop&crop=center", // Tech meetup networking
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=400&fit=crop&crop=center", // Community event
];

const upcomingEvents = [
  {
    title: "AI Innovation Workshop",
    date: "Dec 15, 2024",
    time: "2:00 PM - 6:00 PM",
    location: "Tech Hub, Downtown",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop&crop=center",
    description: "Hands-on workshop exploring the latest AI technologies including machine learning, neural networks, and their practical business applications.",
    category: "Workshop"
  },
  {
    title: "AI Solutions Demo Day",
    date: "Jan 20, 2025",
    time: "9:00 AM - 5:00 PM",
    location: "Virtual Event",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=250&fit=crop&crop=center",
    description: "Showcase of cutting-edge AI solutions featuring live demonstrations of chatbots, computer vision, and automation tools.",
    category: "Demo"
  },
  {
    title: "AI Business Strategy Summit",
    date: "Feb 5, 2025",
    time: "6:00 PM - 8:00 PM",
    location: "Innovation Center",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop&crop=center",
    description: "Industry experts share insights on implementing AI strategies, ROI optimization, and digital transformation through intelligent automation.",
    category: "Summit"
  }
];

export default function EventsPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6">
        {/* Hero Background with Tech Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop&crop=center"
            alt="Tech Conference"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90"></div>
        </div>

        {/* Simple Background Elements */}
        <motion.div 
          style={{ y: heroY }}
          className="absolute inset-0 opacity-10 z-10"
        >
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500 rounded-full blur-3xl"></div>
        </motion.div>

        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative z-20 text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium backdrop-blur-sm">
              <Bot className="w-4 h-4 inline mr-2" />
              AI Solutions Events
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-300 to-white bg-clip-text text-transparent"
          >
            AI Innovation Events
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Join our exclusive AI workshops, solution demonstrations, and industry insights sessions 
            designed to showcase the future of intelligent automation and business transformation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <GradientButton size="lg" className="rounded-full">
              View AI Events
            </GradientButton>
            
            <GradientButton variant="outline" size="lg" className="rounded-full">
              Request AI Demo
            </GradientButton>
          </motion.div>
        </motion.div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-300 to-white bg-clip-text text-transparent">
              Upcoming AI Events
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Don't miss out on our latest AI workshops, demos, and business strategy sessions designed to showcase intelligent solutions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
                whileHover={{ y: -4 }}
                className="group bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/30 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* AI Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 backdrop-blur-sm text-purple-300 text-xs font-medium border border-purple-500/30">
                      {event.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-purple-300 transition-colors">
                    {event.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    {event.description}
                  </p>
                  
                  <div className="space-y-2 mb-6 text-gray-400 text-sm">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                      {event.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-purple-400" />
                      {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-purple-400" />
                      {event.location}
                    </div>
                  </div>
                  
                  <motion.button 
                    whileHover={{ x: 4 }}
                    className="text-purple-400 font-medium text-sm hover:text-purple-300 transition-colors flex items-center"
                  >
                    Register for Event
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Gallery */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-300 to-white bg-clip-text text-transparent">
              AI Solution Gallery
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Take a look at moments from our AI demonstrations, client presentations, and innovative solution showcases.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {eventGallery.map((src, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all duration-300"
              >
                <img 
                  src={src} 
                  alt={`AI Event ${index + 1}`} 
                  className="object-cover w-full h-64 transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-sm font-medium border border-purple-500/30">
                    AI Showcase
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection 
        title="AI Solutions FAQ"
        subtitle="Common questions about our AI solutions and services"
      />

      {/* Call to Action */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop&crop=center"
              alt="Team Collaboration"
              className="w-full h-64 object-cover rounded-2xl opacity-20 mb-8"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent rounded-2xl"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-300 to-white bg-clip-text text-transparent">
                  Ready to Transform Your Business with AI?
                </h3>
                <p className="text-gray-300 mb-6 max-w-xl mx-auto text-lg">
                  Whether you want to attend our AI workshops, discuss custom solutions, or explore partnership opportunities, we'd love to connect.
                </p>
                
                <motion.a
                  href="/contact"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(168, 85, 247, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold text-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  <span>Get In Touch</span>
                  <motion.div
                    whileHover={{ x: 2 }}
                    className="ml-2"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}