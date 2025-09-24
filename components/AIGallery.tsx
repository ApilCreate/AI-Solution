"use client";
import { motion } from "motion/react";

// AI Solution Gallery Images
const galleryImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    title: "AI-Powered Analytics Dashboard",
    category: "Business Intelligence"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop",
    title: "Machine Learning Automation",
    category: "Process Optimization"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
    title: "Neural Network Visualization",
    category: "Deep Learning"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop",
    title: "Computer Vision Solutions",
    category: "Image Recognition"
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    title: "Predictive Analytics Engine",
    category: "Forecasting"
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    title: "Customer Intelligence Platform",
    category: "CRM Integration"
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop",
    title: "Automated Workflow System",
    category: "Process Automation"
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=800&h=600&fit=crop",
    title: "Natural Language Processing",
    category: "Text Analysis"
  },
  {
    id: 9,
    url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
    title: "Intelligent Data Processing",
    category: "Data Engineering"
  },
  {
    id: 10,
    url: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&h=600&fit=crop",
    title: "AI-Driven Decision Making",
    category: "Strategic Planning"
  },
  {
    id: 11,
    url: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&h=600&fit=crop",
    title: "Robotic Process Automation",
    category: "RPA Solutions"
  },
  {
    id: 12,
    url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
    title: "Smart IoT Integration",
    category: "Connected Devices"
  },
  {
    id: 13,
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    title: "Cloud AI Infrastructure",
    category: "Scalable Solutions"
  },
  {
    id: 14,
    url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop",
    title: "Real-time Monitoring",
    category: "Performance Analytics"
  },
  {
    id: 15,
    url: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop",
    title: "Advanced Algorithm Development",
    category: "Custom AI Models"
  }
];

export function GlobeDemo() {
  return (
    <section className="relative w-full py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.1),transparent_50%)]" />
      
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#00FFB7] to-[#0000E0] bg-clip-text text-transparent">
              AI Solutions Gallery
            </span>
          </h2>
          <p className="text-lg text-gray-200 max-w-3xl mx-auto">
            Discover our comprehensive portfolio of AI-powered solutions designed to transform your business operations
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, staggerChildren: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-[200px]"
        >
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`
                group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm border border-slate-600/30
                hover:border-[#00FFB7]/50 transition-all duration-300 hover:scale-105
                ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}
                ${index === 4 ? 'lg:col-span-2' : ''}
                ${index === 7 ? 'md:row-span-2' : ''}
                ${index === 11 ? 'lg:col-span-2' : ''}
                ${index === 14 ? 'md:col-span-2' : ''}
              `}
            >
              {/* Image */}
              <div className="absolute inset-0">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="inline-block px-2 py-1 text-xs bg-[#00FFB7]/20 text-[#00FFB7] rounded-full mb-2 backdrop-blur-sm">
                    {image.category}
                  </span>
                  <h3 className="text-white font-semibold text-sm md:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {image.title}
                  </h3>
                </div>
              </div>

              {/* Hover Gradient Border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#00FFB7] to-[#0000E0] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-gray-300 mb-6">
            Ready to implement AI solutions for your business?
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-[#00FFB7] to-[#0000E0] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#00FFB7]/25 transition-all duration-300 hover:scale-105">
            Get Started Today
          </button>
        </motion.div>
      </div>
    </section>
  );
}