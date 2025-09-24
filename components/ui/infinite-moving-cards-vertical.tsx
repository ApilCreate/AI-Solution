"use client";

import React, { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

export const InfiniteMovingCardsVertical = ({
  items,
  direction = "up",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
    profileImage?: string;
  }[];
  direction?: "up" | "down";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);
  
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "up") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards",
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse",
        );
      }
    }
  };
  
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "30s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "50s");
      }
    }
  };
  
  return (
    <>
      <style jsx>{`
        .scroller-vertical ul {
          animation: scrollVertical var(--animation-duration) var(--animation-direction) linear infinite;
        }
        
        @keyframes scrollVertical {
          to {
            transform: translateY(-50%);
          }
        }
        
        .scroller-vertical:hover ul {
          animation-play-state: ${pauseOnHover ? 'paused' : 'running'};
        }
      `}</style>
      <div
        ref={containerRef}
        className={cn(
          "scroller-vertical relative z-20 h-full overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,white_20%,white_80%,transparent)]",
          className,
        )}
      >
        <ul
          ref={scrollerRef}
          className={cn(
            "flex h-max min-h-full shrink-0 flex-col gap-6 py-4",
            start && "animate-scroll-vertical",
          )}
        >
          {items.map((item, index) => (
            <li
              className="relative w-full max-w-full shrink-0 rounded-2xl border border-zinc-700 bg-gradient-to-b from-zinc-900 to-zinc-950 px-8 py-8 shadow-xl min-h-[300px]"
              key={`${item.name}-${index}`}
            >
              <blockquote>
                <div
                  aria-hidden="true"
                  className="user-select-none pointer-events-none absolute -top-0.5 -left-0.5 -z-1 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
                ></div>
                <span className="relative z-20 text-xl leading-[1.7] font-medium text-gray-100 block mb-6">
                  {item.quote}
                </span>
                <div className="relative z-20 flex flex-row items-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-6 border-2 border-gray-600">
                    {item.profileImage ? (
                      <img
                        src={item.profileImage}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {item.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="flex flex-col gap-2">
                    <span className="text-2xl leading-[1.4] font-semibold text-gray-100">
                      {item.name}
                    </span>
                    <span className="text-lg leading-[1.5] font-normal text-gray-400">
                      {item.title}
                    </span>
                  </span>
                </div>
              </blockquote>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};