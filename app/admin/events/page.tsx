"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Calendar,
  Plus,
  Users,
  MapPin,
  Clock,
  Edit,
  Trash2,
  Eye
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  bannerUrl?: string;
  description?: string;
  createdAt: string;
  rsvpCount: number;
}

export default function EventsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Check authentication
    const checkAuth = () => {
      const authStatus = localStorage.getItem("adminAuthenticated");
      const loginTime = localStorage.getItem("adminLoginTime");
      
      if (authStatus === "true" && loginTime) {
        const loginTimestamp = parseInt(loginTime);
        const currentTime = Date.now();
        const sessionDuration = currentTime - loginTimestamp;
        
        if (sessionDuration < 86400000) {
          setIsAuthenticated(true);
          fetchEvents();
        } else {
          localStorage.removeItem("adminAuthenticated");
          localStorage.removeItem("adminLoginTime");
          router.push("/admin/login");
        }
      } else {
        router.push("/admin/login");
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const fetchEvents = async () => {
    try {
      // For now, we'll use sample data
      // TODO: Implement actual API call
      const sampleEvents: Event[] = [
        {
          id: '1',
          title: 'AI Solutions Conference 2024',
          date: '2024-03-15',
          location: 'Sunderland University',
          description: 'Join us for the biggest AI conference in the North East',
          createdAt: '2024-01-15',
          rsvpCount: 45
        },
        {
          id: '2',
          title: 'Tech Meetup: Machine Learning',
          date: '2024-02-28',
          location: 'Digital Catapult',
          description: 'Learn about the latest in machine learning',
          createdAt: '2024-01-10',
          rsvpCount: 23
        }
      ];
      
      setEvents(sampleEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading events...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Event Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage events and track RSVPs
            </p>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200">
            <Plus className="w-4 h-4" />
            Create Event
          </button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-200">
              {event.bannerUrl && (
                <div className="h-48 bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                  <Calendar className="w-16 h-16 text-white opacity-80" />
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {event.title}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    {event.rsvpCount} RSVPs
                  </div>
                </div>
                
                {event.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {event.description}
                  </p>
                )}
                
                <div className="flex items-center gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors duration-200">
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button className="p-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Events */}
        {events.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No events created yet</p>
            <p className="text-sm">Create your first event to get started</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
