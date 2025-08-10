"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ShowcaseCard } from "./ui";

const showcaseData = [
  {
    id: 1,
    title: "AI Healthcare Diagnosis System",
    description: "Advanced machine learning platform that assists doctors in early disease detection and diagnosis with 95% accuracy rate, revolutionizing patient care.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=300&fit=crop",
    stats: "95% Accuracy",
    category: "Healthcare"
  },
  {
    id: 2,
    title: "Smart Education Platform",
    description: "Personalized learning AI that adapts to individual student needs, improving learning outcomes by 40% across all subjects and grade levels.",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&h=300&fit=crop",
    stats: "40% Improvement",
    category: "Education"
  },
  {
    id: 3,
    title: "Financial Fraud Detection",
    description: "Real-time AI system that identifies suspicious transactions and prevents financial fraud with 99.2% accuracy, saving millions in losses.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&h=300&fit=crop",
    stats: "99.2% Detection",
    category: "Finance"
  },
  {
    id: 4,
    title: "Automated Customer Service",
    description: "Intelligent chatbot system that handles customer inquiries 24/7, reducing response time by 80% and improving customer satisfaction scores.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&h=300&fit=crop",
    stats: "80% Faster",
    category: "Service"
  },
  {
    id: 5,
    title: "Supply Chain Optimization",
    description: "AI-powered logistics system that optimizes delivery routes and inventory management, reducing operational costs by 35% while improving efficiency.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&h=300&fit=crop",
    stats: "35% Cost Reduction",
    category: "Logistics"
  },
  {
    id: 6,
    title: "Smart City Management",
    description: "IoT and AI integration for urban planning, traffic management, and resource allocation in modern smart cities, enhancing quality of life.",
    image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=500&h=300&fit=crop",
    stats: "Smart Integration",
    category: "Urban Tech"
  }
];

export default function Showcase() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Smooth scroll-based animations
  const headerY = useTransform(scrollYProgress, [0, 0.2], [80, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

  return (
    <section 
      ref={sectionRef}
      className="relative bg-black py-24 px-6 text-white overflow-hidden" 
      id="showcase"
    >
      {/* Simple Background Elements */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 opacity-5"
      >
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </motion.div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="h-full w-full" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <motion.div 
        style={{ scale }}
        className="relative max-w-7xl mx-auto"
      >
        {/* Clean Header */}
        <motion.div 
          style={{ y: headerY, opacity: headerOpacity }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium">
              Our Work
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-300 to-white bg-clip-text text-transparent"
          >
            Explore Our Work
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Real-world AI solutions built by our team across industries like healthcare, education, and finance.
          </motion.p>
        </motion.div>

        {/* Project Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {showcaseData.map((project, index) => (
            <ShowcaseCard
              key={project.id}
              id={project.id}
              title={project.title}
              description={project.description}
              image={project.image}
              stats={project.stats}
              category={project.category}
              index={index}
            />
          ))}
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="text-center mt-16"
        >
          <motion.a
            href="#"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 8px 25px rgba(168, 85, 247, 0.3)"
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center px-8 py-4 border border-purple-400 text-purple-400 rounded-full hover:bg-purple-500/10 hover:border-purple-300 hover:text-purple-300 transition-all duration-300 font-medium"
          >
            <span>View All Projects</span>
            <motion.svg 
              className="w-5 h-5 ml-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </motion.svg>
          </motion.a>
        </motion.div>
        </motion.div>
    </section>
  );
}