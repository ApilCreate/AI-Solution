"use client";

import dynamic from 'next/dynamic';
import { Suspense, memo, useState, useCallback, useEffect } from 'react';

// Optimized Spline loader with React 19 compatibility and better error handling
const SplineComponent = dynamic(
  () => import("@splinetool/react-spline").catch((error) => {
    console.warn('Failed to load Spline:', error);
    // Return a fallback component if Spline fails to load
    return {
      default: ({ scene, onError, ...props }: any) => {
        useEffect(() => {
          onError?.(new Error('Spline component failed to load'));
        }, [onError]);
        
        return (
          <div className="w-full h-full bg-gradient-to-br from-purple-500/20 via-fuchsia-500/30 to-indigo-500/20" />
        );
      }
    };
  }), 
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gradient-to-br from-purple-500/20 via-fuchsia-500/30 to-indigo-500/20 animate-pulse flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-purple-300">Loading 3D Scene...</p>
        </div>
      </div>
    )
  }
);

interface OptimizedSplineWrapperProps {
  scene: string;
  onError?: (error: any) => void;
  onLoad?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const OptimizedSplineWrapper = memo(({ 
  scene, 
  onError, 
  onLoad, 
  className = "w-full h-full",
  style = {}
}: OptimizedSplineWrapperProps) => {
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback((error: any) => {
    console.warn('Spline error:', error);
    setHasError(true);
    onError?.(error);
  }, [onError]);

  const handleLoad = useCallback(() => {
    console.log('Spline loaded successfully');
    onLoad?.();
  }, [onLoad]);

  if (hasError) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-purple-500/20 via-fuchsia-500/30 to-indigo-500/20" />
    );
  }

  return (
    <Suspense fallback={
      <div className="w-full h-full bg-gradient-to-br from-purple-500/20 via-fuchsia-500/30 to-indigo-500/20 animate-pulse flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-purple-300">Loading 3D Scene...</p>
        </div>
      </div>
    }>
      <SplineComponent
        scene={scene}
        onError={handleError}
        onLoad={handleLoad}
        className={className}
        style={{
          background: 'transparent',
          pointerEvents: 'none',
          ...style
        }}
      />
    </Suspense>
  );
});

OptimizedSplineWrapper.displayName = 'OptimizedSplineWrapper';

export default OptimizedSplineWrapper;