"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface H1RevealProps {
  children: ReactNode;
  delay?: number;
}

export default function H1Reveal({ children, delay = 0.15 }: H1RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
}


