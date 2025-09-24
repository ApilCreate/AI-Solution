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
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { GradientButton } from "../../../components/ui";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  banner_url: string;
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
      <>
        <Navbar />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading event details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !event) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
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
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section with Back Button */}
        <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 z-0">
            {event.banner_url ? (
              <img
                src={event.banner_url}
                alt={event.title}
                className="w-full h-full object-cover opacity-30"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90"></div>
          </div>

          {/* Back Button - Floating */}
          <div className="absolute top-8 left-8 z-20">
            <GradientButton
              onClick={() => router.push('/events')}
              variant="outline"
              size="sm"
              icon={<ArrowLeft className="w-4 h-4" />}
              iconPosition="left"
              className="backdrop-blur-md"
            >
              Back to Events
            </GradientButton>
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
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-sm border border-purple-500/30 text-purple-300 text-sm font-medium rounded-full">
                {event.category || 'Workshop'}
              </span>
            </motion.div>

            {/* Event Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-100 to-indigo-100 bg-clip-text text-transparent"
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
                <Calendar className="w-5 h-5 text-purple-400" />
                <span>{formatDate(event.date)}</span>
              </div>

              {event.time && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <span>{event.time}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-400" />
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
              className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
            >
              {/* Event Description */}
              <div className="p-8 md:p-12">
                <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  About This Event
                </h2>
                
                <div className="prose prose-lg prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                    {event.description || 'No description provided for this event.'}
                  </p>
                </div>
              </div>

              {/* Book Event Section */}
              <div className="bg-gradient-to-r from-purple-600/10 via-indigo-600/10 to-purple-600/10 border-t border-white/10 p-8 md:p-12">
                <div className="text-center">
                  <div className="mb-8">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                      Ready to Join the Future?
                    </h3>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
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
                      <Mail className="w-4 h-4 text-purple-400" />
                      <span>Instant confirmation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-purple-400" />
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
      <Footer />
    </>
  );
}