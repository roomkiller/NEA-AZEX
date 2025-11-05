import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function MetricCard({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  trend, 
  variant = "default",
  className = ""
}) {
  const variantStyles = {
    default: "bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]",
    success: "bg-green-500/10 border-green-500/30",
    warning: "bg-yellow-500/10 border-yellow-500/30",
    danger: "bg-red-500/10 border-red-500/30",
    info: "bg-blue-500/10 border-blue-500/30",
    primary: "bg-blue-500/10 border-blue-500/30"
  };

  const iconVariantStyles = {
    default: "text-[var(--nea-primary-blue)]",
    success: "text-green-400",
    warning: "text-yellow-400",
    danger: "text-red-400",
    info: "text-blue-400",
    primary: "text-blue-400"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Card className={`${variantStyles[variant]} hover:border-[var(--nea-primary-blue)]/50 transition-colors h-full`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--nea-text-secondary)] mb-2">{title}</p>
              <p className="text-3xl font-bold text-[var(--nea-text-title)] mb-1">{value}</p>
              {subtitle && (
                <p className="text-xs text-[var(--nea-text-muted)]">{subtitle}</p>
              )}
              {trend && (
                <p className={`text-xs mt-2 font-semibold ${trend.direction === 'up' ? 'text-green-400' : trend.direction === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
                  {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'} {trend.value}
                </p>
              )}
            </div>
            {Icon && (
              <div className={`p-3 rounded-lg bg-white/5 ${iconVariantStyles[variant]}`}>
                <Icon className="w-6 h-6" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}