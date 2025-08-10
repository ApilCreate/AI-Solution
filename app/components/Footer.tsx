"use client";

import Link from "next/link";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-[#05010D] text-white border-t border-white/10 ">
      <div className="max-w-6xl mx-auto px-6 py-16 grid gap-10 md:grid-cols-3 text-sm md:text-base">
        
        {/* Brand Column */}
        <div>
          <h2 className="text-2xl font-bold text-purple-400 mb-3">AI Solutions</h2>
          <p className="text-gray-400">
            Building intelligent futures through advanced AI. Crafted with innovation, powered by technology.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-purple-300">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/solutions">Solutions</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Social & Contact */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-purple-300">Connect</h3>
          <div className="flex space-x-5 text-xl">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition">
              <FaGithub />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition">
              <FaLinkedin />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition">
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center py-6 text-sm text-gray-500 border-t border-white/10">
        © {new Date().getFullYear()} AI Solutions. All rights reserved.
      </div>
    </footer>
  );
}
