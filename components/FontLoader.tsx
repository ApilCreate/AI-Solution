"use client";

import { useEffect } from "react";

export default function FontLoader() {
  useEffect(() => {
    // Check if font stylesheet already exists
    const existingLink = document.querySelector('link[href*="fonts.googleapis.com"]');
    if (existingLink) return;

    // Dynamically load Google Fonts stylesheet (non-blocking)
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    link.media = "print";
    link.onload = () => {
      link.media = "all";
    };
    document.head.appendChild(link);

    // No cleanup needed - fonts should persist
  }, []);

  return null;
}

