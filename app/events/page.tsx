"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Calendar,
  Clock,
  Mail,
  MapPin
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import GradientBlinds from "../../components/GradientBlinds";
import { GradientButton } from "../../components/ui";
import { PointerHighlight } from "../../components/ui/pointer-highlight";
import H1Reveal from "../../components/H1Reveal";



interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  bannerUrl: string;
  status: 'draft' | 'published';
}

// Curated Unsplash images for tech events
const eventGallery = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop&crop=center", // Tech conference presentation
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop&crop=center", // Hackathon coding session
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&crop=center", // Team collaboration
  "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=400&fit=crop&crop=center", // Workshop discussion
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop&crop=center", // Tech meetup networking
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=400&fit=crop&crop=center", // Community event
];

export default function EventsPage() {
  const heroRef = useRef(null);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('🔄 Fetching events...');
        const response = await fetch('/api/events/list');
        
        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const allEvents = await response.json();
            console.log(' Fetched events:', allEvents);
            
            // Filter only published events and sort by date
            const publishedEvents = allEvents
              .filter((event: Event) => event.status === 'published')
              .sort((a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime());
            
            setUpcomingEvents(publishedEvents);
          } else {
            const text = await response.text();
            console.error(' API returned non-JSON response:', text);
          }
        } else {
          const text = await response.text();
          console.error(' API request failed:', response.status, text);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      {/* Hero Section with Gradient Blinds Background */}
      <section ref={heroRef} className="relative z-10 min-h-screen flex items-center pt-32 pb-20">
        {/* Gradient Blinds Background */}
        <div className="absolute inset-0 z-0">
          <GradientBlinds
            className="w-full h-full"
            gradientColors={['#ffffff', '#808080']}
            angle={54}
            noise={0}
            blindCount={14}
            blindMinWidth={60}
            mouseDampening={0.46}
            spotlightRadius={0.3}
            distortAmount={0}
            shineDirection="left"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-gray-900/80 to-black" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex justify-center">
                <span className="px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-lg text-slate-300 border border-white/20">
                  <Bot className="w-5 h-5 inline mr-2" />
                  AI Solutions Events
                </span>
              </div>
              <H1Reveal>
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                <div className="flex justify-center">
                  <PointerHighlight>
                    <span className="bg-gradient-to-r from-[#00FFB7] to-[#0000E0] bg-clip-text text-transparent">
                      AI Innovation Events
                    </span>
                  </PointerHighlight>
                </div>
              </h1>
              </H1Reveal>
              <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                Join our exclusive AI workshops, solution demonstrations, and industry insights sessions designed to showcase the future of intelligent automation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <button className="px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors text-lg">
                  View AI Events
                </button>
                <button className="px-8 py-4 bg-transparent text-white font-semibold rounded-xl border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all text-lg">
                  Request AI Demo
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <div className="flex justify-center">
                <PointerHighlight>
                  <span className="bg-gradient-to-r from-[#00FFB7] to-[#0000E0] bg-clip-text text-transparent">
                    Upcoming Events
                  </span>
                </PointerHighlight>
              </div>
            </h2>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
              Don't miss out on our latest AI workshops, demos, and business strategy sessions designed to showcase intelligent solutions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 animate-pulse">
                  <div className="h-48 bg-slate-700/50 rounded-lg mb-4"></div>
                  <div className="h-6 bg-slate-700/50 rounded mb-2"></div>
                  <div className="h-4 bg-slate-700/50 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-700/50 rounded w-1/2"></div>
                </div>
              ))
            ) : upcomingEvents.length > 0 ? (
              upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 hover:border-slate-600/70 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="relative h-48 overflow-hidden">
                    {event.bannerUrl ? (
                      <img 
                        src={event.bannerUrl}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-white/10 to-slate-500/20 flex items-center justify-center">
                        <Calendar className="w-16 h-16 text-white/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-xs font-medium border border-white/20">
                        {event.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <Link href={`/events/${event.id}`}>
                      <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-slate-200 transition-colors cursor-pointer">
                        {event.title}
                      </h3>
                    </Link>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      
                      {event.time && (
                        <div className="flex items-center gap-2 text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{event.time}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-slate-400">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mb-6 line-clamp-3">
                      {event.description}
                    </p>

                    <Link href={`/events/${event.id}`}>
                      <GradientButton 
                        variant="secondary"
                        size="sm"
                        className="w-full group-hover:bg-white/10 transition-colors"
                      >
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </GradientButton>
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              // No events state
              <div className="col-span-full text-center py-12">
                <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No upcoming events</h3>
                <p className="text-gray-500">Check back soon for new AI events and workshops!</p>
              </div>
            )}
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
              AI Solution Gallery
            </h2>
            <p className="text-gray-200 max-w-2xl mx-auto text-lg">
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
                className="group relative overflow-hidden rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-300"
              >
                <img 
                  src={src} 
                  alt={`AI Event ${index + 1}`} 
                  className="object-cover w-full h-64 transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-sm font-medium border border-white/30">
                    AI Showcase
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Call to Action */}
      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your 
              <div className="flex justify-center">
                <PointerHighlight>
                  <span className="bg-gradient-to-r from-[#00FFB7] to-[#0000E0] bg-clip-text text-transparent">
                    Business with AI?
                  </span>
                </PointerHighlight>
              </div>
            </h2>
            <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
              Whether you want to attend our AI workshops, discuss custom solutions, or explore partnership opportunities, we'd love to connect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-slate-100 transition-colors text-lg flex items-center justify-center gap-2">
                <Mail className="w-5 h-5" />
                Get In Touch
              </button>
              <button className="px-8 py-4 bg-transparent text-white font-semibold rounded-xl border border-white/20 hover:border-white/40 transition-colors text-lg">
                Schedule a Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}