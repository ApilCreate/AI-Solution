import { db } from '../db';
import { events } from '../db/schema';

const sampleEvents = [
  {
    title: "AI-Powered Business Automation Workshop",
    description: "Join us for an intensive hands-on workshop where you'll learn how to implement AI-driven automation solutions in your business. We'll cover process optimization, intelligent workflows, and ROI measurement strategies. Perfect for business leaders and technical teams looking to streamline operations.",
    date: "2025-10-15",
    location: "Tech Innovation Center, San Francisco",
    bannerUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop&crop=center"
  },
  {
    title: "Machine Learning for Customer Intelligence Summit",
    description: "Discover how leading companies are using machine learning to understand customer behavior, predict trends, and drive personalized experiences. Features keynotes from industry experts, case studies, and networking opportunities.",
    date: "2025-10-28",
    location: "Convention Center, New York",
    bannerUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=400&fit=crop&crop=center"
  },
  {
    title: "Future of AI in Healthcare Symposium",
    description: "Explore cutting-edge AI applications in healthcare, from diagnostic imaging to drug discovery. Learn about regulatory compliance, ethical considerations, and implementation strategies from healthcare AI pioneers.",
    date: "2025-11-12", 
    location: "Medical Research Institute, Boston",
    bannerUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop&crop=center"
  },
  {
    title: "AI Ethics and Responsible Innovation Panel",
    description: "A thought-provoking discussion on the ethical implications of AI development and deployment. Join leading ethicists, technologists, and policymakers as they explore frameworks for responsible AI innovation.",
    date: "2025-11-25",
    location: "University Campus, Seattle",
    bannerUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop&crop=center"
  },
  {
    title: "Generative AI for Creative Industries Masterclass",
    description: "Learn how generative AI is revolutionizing creative workflows in design, marketing, and content creation. Hands-on sessions with the latest AI tools and techniques for creative professionals.",
    date: "2025-12-08",
    location: "Creative Hub, Los Angeles",
    bannerUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop&crop=center"
  },
  {
    title: "AI-Driven Financial Analytics Conference",
    description: "Discover how artificial intelligence is transforming financial services through advanced analytics, risk assessment, and automated trading strategies. Network with fintech innovators and AI specialists.",
    date: "2025-12-20",
    location: "Financial District, Chicago",
    bannerUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop&crop=center"
  }
];

async function addSampleEvents() {
  try {
    console.log('Adding sample events...');
    
    for (const event of sampleEvents) {
      await db.insert(events).values(event);
      console.log(`Added event: ${event.title}`);
    }
    
    console.log('All sample events added successfully!');
  } catch (error) {
    console.error('Error adding sample events:', error);
  }
  
  process.exit(0);
}

addSampleEvents();