"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Star, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface RatingFormProps {
  className?: string;
}

export default function RatingForm({ className = "" }: RatingFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 0,
    comment: "",
  });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStarClick = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating,
    }));
  };

  const handleStarHover = (rating: number) => {
    setHoveredStar(rating);
  };

  const handleStarLeave = () => {
    setHoveredStar(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || formData.rating === 0 || !formData.comment) {
      setSubmitStatus("error");
      toast.error("Please fill in all fields and select a rating.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }

      setSubmitStatus("success");
      toast.success("Thank you for your feedback! Your rating has been submitted successfully.");
      setFormData({
        name: "",
        email: "",
        rating: 0,
        comment: "",
      });
    } catch (error) {
      setSubmitStatus("error");
      toast.error("Failed to submit your rating. Please try again.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1;
      const isActive = starNumber <= (hoveredStar || formData.rating);
      
      return (
        <motion.button
          key={index}
          type="button"
          onClick={() => handleStarClick(starNumber)}
          onMouseEnter={() => handleStarHover(starNumber)}
          onMouseLeave={handleStarLeave}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="focus:outline-none transition-all duration-200"
        >
          <Star
            className={`w-8 h-8 transition-colors duration-200 ${
              isActive
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 hover:text-yellow-300'
            }`}
          />
        </motion.button>
      );
    });
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#00FFB7]/20 to-[#0000E0]/20 rounded-2xl blur opacity-75" />
        <div className="relative p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
          <motion.div
            className="flex items-center gap-3 mb-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="p-2 rounded-lg bg-[#00FFB7]/20">
              <Star className="w-5 h-5 text-[#00FFB7]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Rate Your Experience
              </h2>
              <p className="text-gray-400 text-sm">
                Share your feedback and help us improve
              </p>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.form
              key="rating-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Rating Stars */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Your Rating *
                </label>
                <div className="flex items-center gap-2 mb-2">
                  {renderStars()}
                </div>
                <p className="text-xs text-gray-400">
                  {formData.rating > 0 && (
                    <>
                      {formData.rating === 1 && "Poor"}
                      {formData.rating === 2 && "Fair"}
                      {formData.rating === 3 && "Good"}
                      {formData.rating === 4 && "Very Good"}
                      {formData.rating === 5 && "Excellent"}
                    </>
                  )}
                </p>
              </motion.div>

              {/* Name & Email */}
              <motion.div
                className="grid md:grid-cols-2 gap-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <div>
                  <label
                    htmlFor="rating-name"
                    className="block text-sm font-medium text-gray-300 mb-3"
                  >
                    Full Name *
                  </label>
                  <motion.input
                    type="text"
                    id="rating-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-[#00FFB7]/50 focus:bg-white/10 focus:outline-none transition-all duration-200"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="rating-email"
                    className="block text-sm font-medium text-gray-300 mb-3"
                  >
                    Email Address *
                  </label>
                  <motion.input
                    type="email"
                    id="rating-email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-[#00FFB7]/50 focus:bg-white/10 focus:outline-none transition-all duration-200"
                    placeholder="your@email.com"
                    autoComplete="email"
                  />
                </div>
              </motion.div>

              {/* Comment */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <label
                  htmlFor="rating-comment"
                  className="block text-sm font-medium text-gray-300 mb-3"
                >
                  Your Feedback *
                </label>
                <motion.textarea
                  id="rating-comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-yellow-400/50 focus:bg-white/10 focus:outline-none transition-all duration-200 resize-none"
                  placeholder="Tell us about your experience with our services..."
                />
              </motion.div>

              {/* Submit Status */}
              <AnimatePresence>
                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3 text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg p-4"
                  >
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">
                      Thank you for your feedback! We appreciate your rating.
                    </span>
                  </motion.div>
                )}

                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3 text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-4"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">
                      Something went wrong. Please check the form and try again.
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.div
                className="pt-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <motion.button
                  type="submit"
                  disabled={isSubmitting || formData.rating === 0}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className="w-full group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-[#00FFB7] to-[#0000E0] text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-[#00FFB7]/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00FFB7]/80 to-[#0000E0]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting Rating...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                        Submit Rating
                      </>
                    )}
                  </div>
                </motion.button>
              </motion.div>
            </motion.form>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
