"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GsapScrollReveal = ({ children }: { children: React.ReactNode }) => {
  const revealRef = useRef(null);

  useEffect(() => {
    const elem = revealRef.current;
    gsap.fromTo(
      elem,
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        scrollTrigger: {
          trigger: elem,
          start: "top 85%",
        },
      }
    );
  }, []);

  return <div ref={revealRef}>{children}</div>;
};

export default GsapScrollReveal;
