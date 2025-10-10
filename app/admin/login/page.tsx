"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from 'react-hot-toast';
import { 
  Eye, 
  EyeOff, 
  Shield, 
  AlertCircle, 
  Loader2,
  ArrowLeft
} from "lucide-react";
import dynamic from "next/dynamic";

// Dynamic import for Spline
const Spline = dynamic(() => import("@splinetool/react-spline").then(mod => ({ default: mod.default })), {
  ssr: false
});

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [showSpline, setShowSpline] = useState(false);

  // Check if user is already authenticated
  useEffect(() => {
    // Skip session check on initial load to avoid URL errors
    // Session will be checked after first successful login
  }, [router]);

  // Handle Spline loading
  const handleSplineLoad = useCallback(() => {
    setSplineLoaded(true);
    // Small delay to ensure smooth transition
    setTimeout(() => setShowSpline(true), 300);
  }, []);

  const handleSplineError = useCallback(() => {
    console.warn('Spline failed to load');
    setShowSpline(true); // Show fallback
  }, []);

  useEffect(() => {
    // Fallback timeout in case onLoad doesn't fire
    const timeout = setTimeout(() => {
      if (!splineLoaded) {
        setShowSpline(true);
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [splineLoaded]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate input
      if (!formData.email || !formData.password) {
        const errorMsg = "Please enter both email and password.";
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store user session data that dashboard expects
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminLoginTime', Date.now().toString());
        
        toast.success("Login successful! Redirecting to dashboard...");
        
        // Small delay to show the toast before redirecting
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 500);
      } else {
        const errorMsg = data.error || "Invalid credentials";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMsg = "An error occurred during login. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4 lg:p-8" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-6xl mx-auto"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex min-h-[700px]">
            {/* Left Side - Spline Animation */}
            <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
              {/* Initial Loading Screen */}
              <AnimatePresence>
                {!showSpline && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50"
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6 }}
                      className="text-center"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 mx-auto mb-4 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
                      />
                      <p className="text-indigo-600 font-medium text-sm">Loading Experience...</p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Spline Container */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showSpline ? 1 : 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="w-full h-full"
              >
                <Spline 
                  scene="https://prod.spline.design/w5fFsr-DhE5IYJ4Z/scene.splinecode"
                  className="w-full h-full"
                  style={{ width: '100%', height: '100%' }}
                  onLoad={handleSplineLoad}
                  onError={handleSplineError}
                />
                {/* Strong dark overlay to completely hide Spline logo */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Bottom overlay - larger and darker */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/95 via-black/70 to-transparent"></div>
                  {/* Right overlay - larger coverage */}
                  <div className="absolute bottom-0 right-0 w-48 h-32 bg-gradient-to-tl from-black/95 via-black/70 to-transparent"></div>
                  {/* Additional corner coverage with blur for seamless blending */}
                  <div className="absolute bottom-0 right-0 w-40 h-28 bg-black/85 blur-sm"></div>
                  {/* Extra edge coverage */}
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/60 to-transparent"></div>
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/60 to-transparent"></div>
                  <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/60 to-transparent"></div>
                </div>
              </motion.div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center bg-white">
              <div className="max-w-md mx-auto w-full">
                {/* Back Button */}
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  onClick={() => router.push("/")}
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 mb-8 group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                  <span className="text-sm font-medium">Back to Home</span>
                </motion.button>

                {/* Header */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-center mb-10"
                >
                  <div className="flex items-center justify-end mb-8">
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                      <Shield className="w-4 h-4" />
                      Secure Admin Access
                    </div>
                  </div>
                  
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                    Welcome Back
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Enter your credentials to access the admin dashboard
                  </p>
                </motion.div>

                {/* Login Form */}
                <motion.form
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-4 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 outline-none text-lg"
                      placeholder="admin@aisolutions.com"
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-4 pr-12 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 outline-none text-lg"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700"
                    >
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{error}</span>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5" />
                        <span>Sign In</span>
                      </>
                    )}
                  </motion.button>
                </motion.form>

                {/* Security Notice */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="mt-8 p-4 rounded-xl bg-amber-50 border border-amber-200"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-amber-800 font-semibold text-sm mb-1">Security Notice</h3>
                      <p className="text-amber-700 text-xs leading-relaxed">
                        This is a secure admin portal. All access attempts are monitored. 
                        Sessions expire after 24 hours for security purposes.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
