import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldAlert, Users, MapPin, Route } from "lucide-react";
import { motion } from "framer-motion";

export default function MapLegend() {
  const legendItems = [
    { icon: ShieldAlert, color: "text-red-400", label: "Simulations de crise" },
    { icon: Users, color: "text-cyan-400", label: "Points de ressources" },
    { icon: Route, color: "text-orange-400", label: "Routes d'évacuation" },
    { icon: MapPin, color: "text-blue-400", label: "Zones sécurisées" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-4 right-4 z-10"
    >
      <Card className="bg-[var(--nea-bg-surface)]/90 backdrop-blur-sm border-[var(--nea-border-default)]">
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[var(--nea-primary-blue)]" />
            Légende
          </h3>
          <div className="space-y-2">
            {legendItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-2"
                >
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-xs text-[var(--nea-text-secondary)]">{item.label}</span>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}