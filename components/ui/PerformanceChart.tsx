"use client";

import { useEffect, useRef } from 'react';

interface PerformanceChartProps {
  data: {
    month: string;
    value: number;
  }[];
  className?: string;
}

export default function PerformanceChart({ data, className = "" }: PerformanceChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Chart dimensions
    const padding = 40;
    const chartWidth = rect.width - padding * 2;
    const chartHeight = rect.height - padding * 2;

    // Find max value for scaling
    const maxValue = Math.max(...data.map(d => d.value));
    const scale = chartHeight / maxValue;

    // Draw bars
    const barWidth = chartWidth / data.length;
    const barSpacing = barWidth * 0.2;

    data.forEach((item, index) => {
      const x = padding + index * barWidth + barSpacing / 2;
      const barHeight = item.value * scale;
      const y = padding + chartHeight - barHeight;

      // Bar gradient
      const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
      gradient.addColorStop(0, '#8B5CF6');
      gradient.addColorStop(1, '#6366F1');

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth - barSpacing, barHeight);

      // Bar value label
      ctx.fillStyle = '#374151';
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(item.value.toString(), x + (barWidth - barSpacing) / 2, y - 8);

      // Month label
      ctx.fillStyle = '#6B7280';
      ctx.font = '11px Inter';
      ctx.fillText(item.month, x + (barWidth - barSpacing) / 2, rect.height - 15);
    });

    // Y-axis
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.stroke();

    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding + chartHeight);
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.stroke();

  }, [data]);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Performance Overview
        </h3>
        <a href="/admin/analytics" className="text-purple-600 dark:text-purple-400 text-sm font-medium hover:underline">
          See All
        </a>
      </div>
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-64"
          style={{ maxHeight: '256px' }}
        />
      </div>
    </div>
  );
}
