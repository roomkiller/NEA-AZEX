import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function UpdateAnalytics({ analytics = {} }) {
  const defaultAnalytics = {
    totalUpdates: 0,
    successRate: 0,
    avgDuration: 0,
    pendingUpdates: 0,
    ...analytics
  };

  const metrics = [
    {
      label: "Mises à jour Totales",
      value: defaultAnalytics.totalUpdates,
      icon: TrendingUp,
      color: "text-blue-400",
      bg: "bg-blue-500/10"
    },
    {
      label: "Taux de Réussite",
      value: `${defaultAnalytics.successRate}%`,
      icon: CheckCircle,
      color: "text-green-400",
      bg: "bg-green-500/10"
    },
    {
      label: "Durée Moyenne",
      value: `${defaultAnalytics.avgDuration}ms`,
      icon: Clock,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10"
    },
    {
      label: "En Attente",
      value: defaultAnalytics.pendingUpdates,
      icon: AlertTriangle,
      color: "text-orange-400",
      bg: "bg-orange-500/10"
    }
  ];

  return (
    <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
      <CardContent className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border border-[var(--nea-border-subtle)] ${metric.bg}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-5 h-5 ${metric.color}`} />
                  <span className="text-xs text-[var(--nea-text-secondary)] font-medium">
                    {metric.label}
                  </span>
                </div>
                <p className="text-2xl font-bold text-white">{metric.value}</p>
              </motion.div>
            );
          })}
        </div>

        {defaultAnalytics.recentTrends && (
          <div className="mt-4 pt-4 border-t border-[var(--nea-border-default)]">
            <h4 className="text-sm font-semibold text-white mb-2">Tendances Récentes</h4>
            <div className="flex flex-wrap gap-2">
              {defaultAnalytics.recentTrends.map((trend, index) => (
                <Badge key={index} className="bg-purple-500/20 text-purple-300 border-0">
                  {trend}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}