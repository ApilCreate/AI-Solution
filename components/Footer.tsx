"use client";

import Link from "next/link";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-950 text-white border-t border-slate-800/60 relative ring-1 ring-white/20">
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 grid gap-10 md:grid-cols-3 text-sm md:text-base">
        
        {/* Brand Column */}
        <div className="group">
          <div className="bg-slate-800 no-underline cursor-pointer relative shadow-2xl shadow-slate-900 rounded-xl p-px text-xs font-semibold leading-6 text-white inline-block mb-4">
            <span className="absolute inset-0 overflow-hidden rounded-xl">
              <span className="absolute inset-0 rounded-xl bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
            </span>
            <div className="relative flex space-x-2 items-center justify-center z-10 rounded-xl bg-slate-950 px-4 py-2 ring-1 ring-white/20">
              <span className="text-white text-lg font-bold">
                AI SOLUTION
              </span>
            </div>
            <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-slate-400/0 via-slate-400/90 to-slate-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Building intelligent futures through advanced AI. Crafted with innovation, powered by technology.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg mb-4 text-white">Quick Links</h3>
          <ul className="space-y-3 text-slate-400">
            <li><Link href="/" className="hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block">Home</Link></li>
            <li><Link href="/solutions" className="hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block">Solutions</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block">Contact</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Social & Contact */}
        <div>
          <h3 className="font-semibold text-lg mb-4 text-white">Connect</h3>
          <div className="flex space-x-4 text-xl">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800/50 rounded-lg flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 hover:scale-110">
              <FaGithub />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800/50 rounded-lg flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 hover:scale-110">
              <FaLinkedin />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800/50 rounded-lg flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 hover:scale-110">
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="relative z-10 text-center py-6 text-sm text-slate-500 border-t border-slate-800/60">
        © {new Date().getFullYear()} AI SOLUTION. All rights reserved.
      </div>
    </footer>
  );
}
