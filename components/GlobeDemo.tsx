"use client";
import React from "react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { BackgroundBeams } from "./ui/background-beams";
 
const World = dynamic(() => import("./ui/globe").then((m) => m.World), {
  ssr: false,
});
 
export function GlobeDemo() {
  const globeConfig = {
    pointSize: 4,
    globeColor: "#062056",
    showAtmosphere: true,
    atmosphereColor: "#FFFFFF",
    atmosphereAltitude: 0.1,
    emissive: "#062056",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    ambientLight: "#38bdf8",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };
  const colors = ["#06b6d4", "#3b82f6", "#6366f1"];
  
  // Use deterministic color assignment to prevent hydration mismatch
  const getColor = (index: number) => colors[index % colors.length];
  
  const sampleArcs = [
    { order: 1, startLat: -19.885592, startLng: -43.951191, endLat: -22.9068, endLng: -43.1729, arcAlt: 0.1, color: getColor(0) },
    { order: 1, startLat: 28.6139, startLng: 77.209, endLat: 3.139, endLng: 101.6869, arcAlt: 0.2, color: getColor(1) },
    { order: 1, startLat: -19.885592, startLng: -43.951191, endLat: -1.303396, endLng: 36.852443, arcAlt: 0.5, color: getColor(2) },
    { order: 2, startLat: 1.3521, startLng: 103.8198, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.2, color: getColor(0) },
    { order: 2, startLat: 51.5072, startLng: -0.1276, endLat: 3.139, endLng: 101.6869, arcAlt: 0.3, color: getColor(1) },
    { order: 2, startLat: -15.785493, startLng: -47.909029, endLat: 36.162809, endLng: -115.119411, arcAlt: 0.3, color: getColor(2) },
    { order: 3, startLat: -33.8688, startLng: 151.2093, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.3, color: getColor(0) },
    { order: 3, startLat: 21.3099, startLng: -157.8581, endLat: 40.7128, endLng: -74.006, arcAlt: 0.3, color: getColor(1) },
    { order: 3, startLat: -6.2088, startLng: 106.8456, endLat: 51.5072, endLng: -0.1276, arcAlt: 0.3, color: getColor(2) },
    { order: 4, startLat: 11.986597, startLng: 8.571831, endLat: -15.595412, endLng: -56.05918, arcAlt: 0.5, color: getColor(0) },
    { order: 4, startLat: -34.6037, startLng: -58.3816, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.7, color: getColor(1) },
    { order: 4, startLat: 51.5072, startLng: -0.1276, endLat: 48.8566, endLng: -2.3522, arcAlt: 0.1, color: getColor(2) },
    { order: 5, startLat: 14.5995, startLng: 120.9842, endLat: 51.5072, endLng: -0.1276, arcAlt: 0.3, color: getColor(0) },
    { order: 5, startLat: 1.3521, startLng: 103.8198, endLat: -33.8688, endLng: 151.2093, arcAlt: 0.2, color: getColor(1) },
    { order: 5, startLat: 34.0522, startLng: -118.2437, endLat: 48.8566, endLng: -2.3522, arcAlt: 0.2, color: getColor(2) }
  ];
 
  return (
    <div className="min-h-screen bg-black text-white relative w-full overflow-hidden">
      <BackgroundBeams />
      
      {/* Content Section */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 pt-20 pb-10">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
          }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Empowering Businesses Worldwide with
             <br />
             <span className="text-gray-400 mt-4 block">AI Solutions</span>
          </h2>
          <p className="text-base md:text-lg font-normal text-neutral-300 mt-6 mb-8 mx-auto max-w-3xl">
            Our AI platform connects global enterprises, delivering innovative solutions that transform industries and drive growth across continents.
          </p>
          
          {/* Contact Us Button */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1,
              delay: 0.3,
            }}
            className="flex justify-center mt-8 mb-16"
          >
            <Link href="/contact">
              <button className="text-black bg-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl z-30 relative">
                Contact Us
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Globe Section */}
      <div className="relative z-10 w-full h-[600px] md:h-[800px] flex items-center justify-center">
        <div className="w-full h-full scale-125 md:scale-150">
          <World data={sampleArcs} globeConfig={globeConfig} />
        </div>
      </div>
      
      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none z-30" />
    </div>
  );
}
