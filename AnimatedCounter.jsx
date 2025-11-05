import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

/**
 * ANIMATED COUNTER
 * Compteur animé pour les métriques
 */
export default function AnimatedCounter({
  value = 0,
  duration = 1000,
  className = '',
  prefix = '',
  suffix = '',
  decimals = 0,
  delimiter = ' '
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function (easeOutExpo)
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentValue = easeOutExpo * value;
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  const formatNumber = (num) => {
    const fixed = num.toFixed(decimals);
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, delimiter);
    return parts.join('.');
  };

  return (
    <span className={className}>
      {prefix}
      {formatNumber(displayValue)}
      {suffix}
    </span>
  );
}

/**
 * ANIMATED PERCENTAGE
 * Pourcentage animé avec couleur dynamique
 */
export function AnimatedPercentage({
  value = 0,
  className = '',
  colorByValue = true
}) {
  const getColor = (val) => {
    if (!colorByValue) return 'text-[var(--nea-text-title)]';
    if (val >= 90) return 'text-green-400';
    if (val >= 70) return 'text-yellow-400';
    if (val >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <AnimatedCounter
      value={value}
      suffix="%"
      className={`${getColor(value)} ${className}`}
    />
  );
}