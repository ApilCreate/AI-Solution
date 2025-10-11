"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  Zap, 
  Home, 
  Briefcase, 
  MessageSquare, 
  FileText, 
  Calendar,
  Mail
} from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [heroSectionPassed, setHeroSectionPassed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 20);
      setHeroSectionPassed(scrollY > window.innerHeight * 0.8);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Solutions", href: "/solutions", icon: Briefcase },
    { label: "Testimonials", href: "/testimonials", icon: MessageSquare },
    { label: "Blog", href: "/blog", icon: FileText },
    { label: "Events", href: "/events", icon: Calendar },
  ];

  useEffect(() => {
    // Prefetch common routes to reduce navigation latency
    const routesToPrefetch = ['/', '/solutions', '/testimonials', '/blog', '/events', '/contact'];
    routesToPrefetch.forEach((route) => {
      try { router.prefetch(route); } catch {}
    });
  }, [router]);

  const handleItemClick = (href: string) => {
    setMenuOpen(false);
    router.push(href);
  };

  return (
    <>

      {/* Full Navbar - Top Position */}
      <AnimatePresence>
        {!heroSectionPassed && (
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 pt-4"
            style={{ fontFamily: 'Manrope, sans-serif' }}
          >
            <div
              className={`w-full max-w-7xl mx-auto rounded-xl border transition-all ring-1 ring-white/10 duration-300 ease-out ${
                scrolled 
                  ? "bg-black/98 border-black/70 shadow-2xl shadow-black/40 backdrop-blur-xl" 
                  : "bg-black/90 border-black/60 backdrop-blur-md"
              }`}
            >
              <div className="flex items-center justify-between px-6 lg:px-8 py-3 lg:py-4">
                {/* Logo Section */}
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 group w-fit cursor-pointer">
                    <motion.div 
                      className="relative"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      <Zap className="w-6 h-6 text-white group-hover:text-slate-300 transition-colors duration-200" />
                    </motion.div>
                    <span className="font-bold text-xl lg:text-2xl text-white group-hover:text-gray-200 transition-colors duration-200">
                      AI SOLUTION
                    </span>
                  </div>
                </div>

                {/* Navigation Links Section */}
                <div className="hidden lg:flex flex-1 justify-center">
                  <ul className="flex items-center gap-1 text-sm font-medium">
                    {navItems.map((item, index) => (
                      <motion.li 
                        key={item.href} 
                        className="relative"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08, duration: 0.4 }}
                      >
                        <button
                          onClick={() => handleItemClick(item.href)}
                          className={`relative block px-4 py-2.5 rounded-lg transition-all duration-200 ${
                            pathname === item.href 
                              ? "text-white bg-slate-800/50" 
                              : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                          }`}
                        >
                          <span className="relative z-10">{item.label}</span>
                          {pathname === item.href && (
                            <motion.div
                              layoutId="activeTab"
                              className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/10 to-slate-300/10 border border-slate-400/20"
                              transition={{ 
                                type: "spring", 
                                stiffness: 500, 
                                damping: 30,
                                duration: 0.3 
                              }}
                            />
                          )}
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Contact Button Section */}
                <div className="hidden lg:flex flex-1 justify-end">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    <button
                      onClick={() => handleItemClick('/contact')}
                      className="group bg-white text-black no-underline cursor-pointer relative shadow-2xl shadow-white/20 rounded-full px-6 py-2.5 text-sm font-semibold leading-6 inline-block transition-all duration-300 hover:scale-105 hover:shadow-white/40"
                    >
                      <span className="absolute inset-0 overflow-hidden rounded-lg">
                        <span className="absolute inset-0 rounded-lg bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
                      </span>
                      <div className="relative z-10 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>Contact Us</span>
                      </div>
                      <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-black/0 via-black/30 to-black/0 transition-opacity duration-500 group-hover:opacity-40"></span>
                    </button>
                  </motion.div>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                  className="lg:hidden relative p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-200"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={menuOpen ? 'close' : 'menu'}
                      initial={{ rotate: -45, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 45, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {menuOpen ? <X size={18} /> : <Menu size={18} />}
                    </motion.div>
                  </AnimatePresence>
                </button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Compact Navbar - Bottom Position */}
      <AnimatePresence>
        {heroSectionPassed && (
          <motion.nav
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 30,
              duration: 0.5 
            }}
            className="fixed bottom-6 inset-x-0 z-50 flex justify-center"
            style={{ fontFamily: 'Manrope, sans-serif' }}
          >
            <div className="bg-black/95 backdrop-blur-md border border-black/70 rounded-2xl shadow-2xl shadow-black/40 px-4 py-3">
              <ul className="flex items-center gap-2">
                {navItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <motion.li
                      key={item.href}
                      className="relative group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <button
                        onClick={() => handleItemClick(item.href)}
                        className={`relative p-3 rounded-xl transition-all duration-300 ${
                          pathname === item.href
                            ? "text-white bg-gradient-to-r from-white/10 to-slate-300/10 scale-110 shadow-lg shadow-white/25"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/50 hover:scale-105"
                        }`}
                      >
                        <IconComponent size={20} />
                        
                        {/* Hover Label - Appears Above */}
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.8 }}
                          animate={{ 
                            opacity: 0, 
                            y: 10, 
                            scale: 0.8,
                            transition: { duration: 0.2 }
                          }}
                          whileHover={{ 
                            opacity: 1, 
                            y: -8, 
                            scale: 1,
                            transition: { duration: 0.2, delay: 0.1 }
                          }}
                          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-semibold rounded-lg shadow-lg whitespace-nowrap pointer-events-none border border-pink-400/20"
                        >
                          {item.label}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-pink-500"></div>
                        </motion.div>
                      </button>
                      
                      {pathname === item.href && (
                        <motion.div
                          layoutId="compactActiveTab"
                          className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/10 to-slate-300/10 border border-slate-400/20"
                          transition={{ 
                            type: "spring", 
                            stiffness: 500, 
                            damping: 30 
                          }}
                        />
                      )}
                    </motion.li>
                  );
                })}
                
                {/* Contact Icon */}
                <motion.li
                  className="relative group ml-2 pl-2 border-l border-slate-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navItems.length * 0.1, duration: 0.3 }}
                >
                  <button
                    onClick={() => handleItemClick('/contact')}
                    className="group bg-white text-black no-underline cursor-pointer relative shadow-2xl shadow-white/20 rounded-xl p-3 transition-all duration-300 hover:scale-105 hover:shadow-white/40"
                  >
                    <span className="absolute inset-0 overflow-hidden rounded-xl">
                      <span className="absolute inset-0 rounded-xl bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
                    </span>
                    <div className="relative z-10 flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                    <span className="absolute -bottom-0 left-[0.75rem] h-px w-[calc(100%-1.5rem)] bg-gradient-to-r from-black/0 via-black/30 to-black/0 transition-opacity duration-500 group-hover:opacity-40"></span>
                    
                    {/* Hover Label - Appears Above */}
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ 
                        opacity: 0, 
                        y: 10, 
                        scale: 0.8,
                        transition: { duration: 0.2 }
                      }}
                      whileHover={{ 
                        opacity: 1, 
                        y: -8, 
                        scale: 1,
                        transition: { duration: 0.2, delay: 0.1 }
                      }}
                      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-white text-black text-xs font-semibold rounded-lg shadow-lg whitespace-nowrap pointer-events-none border border-slate-400/20"
                    >
                      Contact Us
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                    </motion.div>
                  </button>
                </motion.li>
              </ul>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && !heroSectionPassed && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 30,
                duration: 0.3 
              }}
              className="lg:hidden fixed top-20 left-4 right-4 z-50 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700/60 shadow-2xl shadow-white/20 overflow-hidden"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              <div className="p-4">
                <ul className="space-y-1">
                  {navItems.map((item, index) => (
                    <motion.li 
                      key={item.href}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04, duration: 0.3 }}
                    >
                      <button
                        onClick={() => handleItemClick(item.href)}
                        className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                          pathname === item.href
                            ? "text-white bg-gradient-to-r from-white/10 to-slate-300/10 border border-slate-400/20"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                        }`}
                      >
                        {item.label}
                      </button>
                    </motion.li>
                  ))}
                </ul>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-slate-700"
                >
                  <button
                    onClick={() => handleItemClick('/contact')}
                    className="group bg-white text-black no-underline cursor-pointer relative shadow-2xl shadow-white/20 block w-full px-4 py-3 text-center font-medium rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-white/40"
                  >
                    <span className="absolute inset-0 overflow-hidden rounded-lg">
                      <span className="absolute inset-0 rounded-lg bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
                    </span>
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>Contact Us</span>
                    </div>
                    <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-black/0 via-black/30 to-black/0 transition-opacity duration-500 group-hover:opacity-40"></span>
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;