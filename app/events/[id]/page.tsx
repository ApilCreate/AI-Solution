"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  Users,
  Mail,
  Phone,
  ExternalLink
} from "lucide-react";
import { GradientButton } from "../../../components/ui";
import dynamic from "next/dynamic";

// Dynamic import for background effects
const Beams = dynamic(() => import("../../../components/Beams"), { ssr: false });

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  bannerUrl: string;
  status: string;
  created_at: string;
}

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!params.id) return;
      
      try {
        const response = await fetch(`/api/events/${params.id}`);
        if (response.ok) {
          const eventData = await response.json();
          setEvent(eventData);
        } else {
          setError('Event not found');
        }
      } catch (error) {
        console.error('Failed to fetch event:', error);
        setError('Failed to load event details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [params.id]);

  const handleBookEvent = () => {
    router.push('/contact');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="absolute inset-0">
          <Beams />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="absolute inset-0">
          <Beams />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-2xl font-bold text-white mb-6">
            {error || 'Event Not Found'}
          </h1>
          <GradientButton
            onClick={() => router.push('/events')}
            icon={<ArrowLeft className="w-4 h-4" />}
            iconPosition="left"
          >
            Back to Events
          </GradientButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
        {/* Hero Section with Back Button */}
        <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 z-0">
            <Beams />
            {event.bannerUrl && (
              <img
                src={event.bannerUrl}
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover opacity-20"
              />
            )}
            <div className="absolute inset-0 bg-black/60"></div>
          </div>

          {/* Back Button - Floating */}
          <div className="absolute top-8 left-4 sm:left-8 z-20">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/30 rounded-lg text-white transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Events</span>
            </button>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
            {/* Category Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <div className="bg-slate-800 no-underline group cursor-default relative shadow-2xl shadow-slate-900 rounded-xl p-px text-xs font-semibold leading-6 text-white inline-block">
                <span className="absolute inset-0 overflow-hidden rounded-xl">
                  <span className="absolute inset-0 rounded-xl bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_75%)] opacity-100"></span>
                </span>
                <div className="relative flex space-x-2 items-center justify-center z-10 rounded-xl bg-slate-950 px-6 py-2 ring-1 ring-white/10">
                  <span className="text-white text-sm">
                    {event.category || 'Workshop'}
                  </span>
                </div>
                <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-slate-400/0 via-slate-400/90 to-slate-400/0"></span>
              </div>
            </motion.div>

            {/* Event Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight"
            >
              {event.title}
            </motion.h1>

            {/* Event Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-6 text-gray-300"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-white" />
                <span>{formatDate(event.date)}</span>
              </div>

              {event.time && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-white" />
                  <span>{event.time}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-white" />
                <span>{event.location}</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content Section */}
        <div className="relative z-10 -mt-20">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl shadow-slate-900/20"
            >
              {/* Event Description */}
              <div className="p-8 md:p-12">
                <h2 className="text-3xl font-bold mb-8 text-white">
                  About This Event
                </h2>
                
                <div className="prose prose-lg prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                    {event.description || 'No description provided for this event.'}
                  </p>
                </div>
              </div>

              {/* Book Event Section */}
              <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-t border-slate-700/50 p-8 md:p-12">
                <div className="text-center">
                  <div className="mb-8">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                      Ready to Join the Future?
                    </h3>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                      Reserve your spot at this groundbreaking AI event. Connect with industry leaders, learn cutting-edge technologies, and be part of the AI revolution.
                    </p>
                  </div>
                  
                  <GradientButton
                    onClick={handleBookEvent}
                    size="lg"
                    icon={<ExternalLink className="w-5 h-5" />}
                    className="mb-6"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Reserve Your Spot
                  </GradientButton>
                  
                  <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-white" />
                      <span>Instant confirmation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-white" />
                      <span>24/7 support available</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Spacing */}
        <div className="h-20"></div>
    </div>
  );
}