"use client";

import Image from 'next/image';
import { useState, memo } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  quality?: number;
}

const OptimizedImage = memo(({
  src,
  alt,
  width = 600,
  height = 400,
  className = "",
  priority = false,
  fill = false,
  sizes = "100vw",
  placeholder = "empty",
  quality = 80,
  ...props
}: OptimizedImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Generate blur placeholder for better UX
  const shimmer = (w: number, h: number) => `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#7c3aed" offset="20%" />
          <stop stop-color="#a855f7" offset="50%" />
          <stop stop-color="#7c3aed" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#7c3aed" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" opacity="0.5">
        <animateTransform attributeName="transform" type="translate" values="-${w} 0; ${w} 0; ${w} 0" dur="1s" repeatCount="indefinite"/>
      </rect>
    </svg>`

  const toBase64 = (str: string) =>
    typeof window === 'undefined'
      ? Buffer.from(str).toString('base64')
      : window.btoa(str);

  if (imageError) {
    return (
      <div 
        className={`bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 flex items-center justify-center ${className}`}
        style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}
      >
        <div className="text-center text-purple-300">
          <div className="text-2xl mb-2">🖼️</div>
          <p className="text-sm">Image not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 animate-pulse"
          style={{ 
            backgroundImage: `url("data:image/svg+xml;base64,${toBase64(shimmer(width, height))}")` 
          }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImageError(true);
          setIsLoading(false);
        }}
        {...props}
      />
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
