"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { GlassCard, SectionHeader } from "./ui";

const faqData = [
  {
    question: "What AI solutions does your company specialize in?",
    answer: "We specialize in developing custom AI solutions including intelligent chatbots, automated document processing, computer vision systems, predictive analytics, business process automation, and voice AI technologies. Our solutions are tailored to meet the specific needs of various industries including healthcare, finance, retail, and manufacturing."
  },
  {
    question: "How can AI solutions benefit my business?",
    answer: "Our AI solutions deliver measurable business value by automating repetitive tasks to improve operational efficiency, enhancing decision-making through advanced predictive analytics, reducing operational costs by up to 40%, improving customer satisfaction with 24/7 intelligent support, and providing actionable insights from your existing data to drive strategic growth."
  },
  {
    question: "What is the typical timeline for implementing an AI solution?",
    answer: "Implementation timelines vary based on project complexity and requirements. Simple chatbot integrations typically take 2-4 weeks, mid-complexity automation solutions require 6-12 weeks, while comprehensive enterprise AI systems may need 3-6 months. We provide detailed project roadmaps and milestones during our initial consultation phase."
  },
  {
    question: "Do you provide ongoing support and maintenance?",
    answer: "Yes, we offer comprehensive support packages that include 24/7 system monitoring, regular performance optimization, security updates, feature enhancements, and dedicated technical support. Our maintenance ensures your AI solutions continue to deliver optimal results and adapt to your evolving business needs."
  },
  {
    question: "How do you ensure data security and privacy?",
    answer: "We implement enterprise-grade security protocols including end-to-end data encryption, secure API architectures, and compliance with industry standards such as GDPR, HIPAA, and SOC 2. We offer flexible deployment options including on-premise, cloud, and hybrid solutions to meet your specific security requirements and regulatory compliance needs."
  },
  {
    question: "What industries do you serve?",
    answer: "We serve a diverse range of industries including healthcare, financial services, retail and e-commerce, manufacturing, education, logistics, and professional services. Our team has deep expertise in understanding industry-specific challenges and regulatory requirements to deliver compliant and effective AI solutions."
  },
  {
    question: "How do you measure the success of AI implementations?",
    answer: "We establish clear KPIs and success metrics before implementation, including efficiency gains, cost savings, accuracy improvements, and ROI measurements. We provide regular performance reports and analytics dashboards to track progress and demonstrate the tangible value of your AI investment."
  },
  {
    question: "Can AI solutions integrate with existing business systems?",
    answer: "Absolutely. Our AI solutions are designed for seamless integration with your existing technology stack including CRM systems, ERP platforms, databases, and third-party applications. We use industry-standard APIs and protocols to ensure smooth data flow and minimal disruption to your current operations."
  }
];

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function FAQSection({ 
  title = "Frequently Asked Questions",
  subtitle = "Everything you need to know about our AI solutions and services",
  className = ""
}: FAQSectionProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <section className={`py-24 px-6 ${className}`}>
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
            <HelpCircle className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-gray-300">Support & Information</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>
        
        {/* FAQ Items */}
        <div className="space-y-3">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.6 }}
              className="group"
            >
              <div className="relative p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-200 hover:bg-white/8">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between text-left group"
                  aria-expanded={activeFaq === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <h3 className="font-semibold text-white text-lg pr-4 group-hover:text-purple-100 transition-colors duration-200">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 transition-all duration-200">
                    <motion.div
                      animate={{ rotate: activeFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {activeFaq === index ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </motion.div>
                  </div>
                </button>
                
                <motion.div
                  id={`faq-answer-${index}`}
                  initial={false}
                  animate={{
                    height: activeFaq === index ? "auto" : 0,
                    opacity: activeFaq === index ? 1 : 0
                  }}
                  transition={{ 
                    duration: 0.3, 
                    ease: "easeInOut",
                    opacity: { delay: activeFaq === index ? 0.1 : 0 }
                  }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 mt-4 border-t border-white/10">
                    <p className="text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center mt-16"
        >
          <div className="p-8 rounded-2xl bg-gradient-to-r from-purple-600/10 to-indigo-600/10 border border-white/10 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-3">
              Still have questions?
            </h3>
            <p className="text-gray-300 mb-6 max-w-md mx-auto">
              Our team is here to help you understand how AI can transform your business. 
              Get personalized answers to your specific questions.
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold transition-all duration-200 shadow-lg">
              <HelpCircle className="w-4 h-4" />
              Contact Our Experts
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}