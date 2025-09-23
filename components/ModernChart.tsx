"use client";

import { motion } from 'framer-motion';
import { useTheme } from '../app/contexts/ThemeContext';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface ModernChartProps {
  data: DataPoint[];
  type: 'pie' | 'bar' | 'line';
  title: string;
  height?: number;
}

export default function ModernChart({ data, type, title, height = 300 }: ModernChartProps) {
  const { theme } = useTheme();
  const validData = data.filter(d => d && typeof d.value === 'number' && !isNaN(d.value));
  const maxValue = validData.length > 0 ? Math.max(...validData.map(d => d.value)) : 1;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
    let currentAngle = 0;

    if (total === 0 || !data.length) {
      return (
        <div className="flex items-center justify-center h-48">
          <p className="text-muted-foreground">No data available</p>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center gap-8">
        <motion.div 
          className="relative"
          variants={itemVariants}
        >
          <svg width="200" height="200" viewBox="0 0 200 200">
            <defs>
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.3)"/>
              </filter>
            </defs>
            {data.map((item, index) => {
              const value = item.value || 0;
              const percentage = total > 0 ? (value / total) * 100 : 0;
              const angle = (percentage / 100) * 360;
              
              // Ensure angles are valid numbers
              const startAngle = isNaN(currentAngle) ? 0 : currentAngle;
              const endAngle = isNaN(startAngle + angle) ? 0 : startAngle + angle;
              
              const x1 = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180);
              const y1 = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180);
              const x2 = 100 + 80 * Math.cos((endAngle - 90) * Math.PI / 180);
              const y2 = 100 + 80 * Math.sin((endAngle - 90) * Math.PI / 180);
              
              // Validate coordinates
              const validX1 = isNaN(x1) ? 100 : x1;
              const validY1 = isNaN(y1) ? 20 : y1;
              const validX2 = isNaN(x2) ? 100 : x2;
              const validY2 = isNaN(y2) ? 20 : y2;
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = [
                "M", 100, 100,
                "L", validX1, validY1,
                "A", 80, 80, 0, largeArcFlag, 1, validX2, validY2,
                "Z"
              ].join(" ");

              const color = item.color || `hsl(${index * 60 + 200}, 70%, 50%)`;
              currentAngle += angle;

              return (
                <motion.path
                  key={index}
                  d={pathData}
                  fill={color}
                  stroke={theme === 'dark' ? '#1f2937' : 'white'}
                  strokeWidth="2"
                  filter="url(#shadow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              );
            })}
            <circle
              cx="100"
              cy="100"
              r="40"
              fill={theme === 'dark' ? '#111827' : '#f9fafb'}
              stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
              strokeWidth="2"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>
        </motion.div>
        
        <div className="space-y-3">
          {data.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-3"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <div
                className="w-4 h-4 rounded-full shadow-sm"
                style={{ backgroundColor: item.color || `hsl(${index * 60 + 200}, 70%, 50%)` }}
              />
              <span className="text-sm font-medium text-foreground">{item.label}</span>
              <span className="text-sm text-muted-foreground ml-auto">{item.value}</span>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderBarChart = () => {
    if (!validData.length || maxValue === 0) {
      return (
        <div className="flex items-center justify-center h-48">
          <p className="text-muted-foreground">No data available</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {validData.map((item, index) => {
          const value = Math.max(0, item.value || 0);
          const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
          const validPercentage = isNaN(percentage) ? 0 : Math.min(100, percentage);
          
          return (
            <motion.div
              key={index}
              className="space-y-2"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">{item.label}</span>
                <span className="text-sm font-bold text-foreground">{value}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 shadow-inner">
                <motion.div
                  className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-sm"
                  style={{
                    background: item.color || 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${validPercentage}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderLineChart = () => (
    <div className="relative" style={{ height }}>
      <svg width="100%" height="100%" viewBox="0 0 400 200" className="overflow-visible">
        <defs>
          <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Grid lines */}
        {Array.from({ length: 5 }).map((_, i) => (
          <line
            key={i}
            x1="40"
            y1={40 + (i * 32)}
            x2="360"
            y2={40 + (i * 32)}
            stroke={theme === 'dark' ? 'rgba(75,85,99,0.3)' : 'rgba(209,213,219,0.5)'}
            strokeWidth="1"
          />
        ))}
        
        {/* Area fill */}
        <motion.polygon
          fill={`url(#gradient-${title})`}
          points={`40,180 ${data.map((item, index) => {
            const x = 40 + (index * (320 / (data.length - 1)));
            const y = 180 - ((item.value / maxValue) * 140);
            return `${x},${y}`;
          }).join(' ')} 360,180`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
        
        {/* Data line */}
        <motion.polyline
          fill="none"
          stroke="rgb(59, 130, 246)"
          strokeWidth="3"
          filter="url(#glow)"
          points={data.map((item, index) => {
            const x = 40 + (index * (320 / (data.length - 1)));
            const y = 180 - ((item.value / maxValue) * 140);
            return `${x},${y}`;
          }).join(' ')}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        
        {/* Data points */}
        {data.map((item, index) => {
          const x = 40 + (index * (320 / (data.length - 1)));
          const y = 180 - ((item.value / maxValue) * 140);
          return (
            <motion.circle
              key={index}
              cx={x}
              cy={y}
              r="5"
              fill="rgb(59, 130, 246)"
              stroke="white"
              strokeWidth="2"
              filter="url(#glow)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 1 }}
              whileHover={{ scale: 1.5 }}
            />
          );
        })}
        
        {/* Labels */}
        {data.map((item, index) => {
          const x = 40 + (index * (320 / (data.length - 1)));
          return (
            <text
              key={index}
              x={x}
              y={200}
              textAnchor="middle"
              className="fill-muted-foreground text-xs"
            >
              {item.label}
            </text>
          );
        })}
      </svg>
    </div>
  );

  return (
    <motion.div
      className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 shadow-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <motion.h3 
        className="text-lg font-semibold text-foreground mb-6"
        variants={itemVariants}
      >
        {title}
      </motion.h3>
      
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-muted-foreground">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-4xl mb-2">📊</div>
            <div>No data available</div>
          </motion.div>
        </div>
      ) : (
        <>
          {type === 'pie' && renderPieChart()}
          {type === 'bar' && renderBarChart()}
          {type === 'line' && renderLineChart()}
        </>
      )}
    </motion.div>
  );
}
