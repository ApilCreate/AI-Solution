"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";

const TARGET_ROUTES = new Set(["/", "/solutions", "/testimonials", "/blog", "/events", "/contact"]);

export default function RouteCurtain() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAnimating, setIsAnimating] = useState(false);
  const nextPathRef = useRef<string | null>(null);

  // Intercept navigation requests triggered by router.push from our app
  useEffect(() => {
    const originalPush: any = (router as any).push?.bind(router);
    // augment push to toggle curtain
    (router as any).push = (href: string, opts?: any) => {
      nextPathRef.current = href;
      if (TARGET_ROUTES.has(href)) {
        setIsAnimating(true);
        // Delay push slightly to allow curtain close animation to start
        setTimeout(() => originalPush(href, opts), 50);
      } else {
        originalPush(href, opts);
      }
    };

    return () => {
      // Restore original push
      (router as any).push = originalPush;
    };
  }, [router]);

  // When pathname changes to a target route, open curtain after a brief delay
  useEffect(() => {
    if (isAnimating && nextPathRef.current === pathname && TARGET_ROUTES.has(pathname)) {
      const t = setTimeout(() => setIsAnimating(false), 400);
      return () => clearTimeout(t);
    }
  }, [pathname, isAnimating]);

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          key="route-curtain"
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[9999] pointer-events-none"
        >
          {/* Curtain panel */}
          <div className="absolute inset-0 bg-black" />
          {/* Centered loader content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="pointer-events-none select-none flex flex-col items-center gap-5 px-6 text-center">
              <CenteredVelocity />
              <p className="text-white/85 text-sm md:text-base tracking-wide uppercase">
                Loading... Please Wait While We Polish For Best Experience
              </p>
            </div>
          </div>
          {/* Optional accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const DynamicScrollVelocity = dynamic(() => import("./ScrollVelocity").then(m => m.ScrollVelocity), { ssr: false });

function CenteredVelocity() {
  // Keep the loader compact and centered
  return (
    <div className="w-[90vw] max-w-5xl">
      <DynamicScrollVelocity
        texts={["AI SOLUTION • POLISHING • EXPERIENCE • AI SOLUTION • POLISHING • EXPERIENCE •"]}
        velocity={60}
        numCopies={4}
        className="px-2 text-white"
        parallaxClassName=""
        scrollerClassName="justify-center text-4xl md:text-6xl tracking-wider"
      />
    </div>
  );
}


