import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, XCircle, Power } from 'lucide-react';
import { motion } from 'framer-motion';

const systems = [
  { name: 'Moteur de Prédiction', key: 'prediction_engine' },
  { name: 'Interface de Données', key: 'data_interface' },
  { name: 'Réseau Sécurisé', key: 'secure_network' },
  { name: 'Cache d\'Analyse', key: 'analysis_cache' },
  { name: 'Service d\'Authentification', key: 'auth_service' },
];

const getStatusConfig = (status) => {
  const configs = {
    Opérationnel: { color: 'text-green-400', icon: CheckCircle, label: "Opérationnel" },
    Dégradé: { color: 'text-yellow-400', icon: AlertTriangle, label: "Dégradé" },
    Hors_Ligne: { color: 'text-red-400', icon: XCircle, label: "Hors Ligne" },
  };
  return configs[status] || configs.Dégradé;
};

export default function SystemStatus() {
  const [statuses, setStatuses] = useState({});

  useEffect(() => {
    const updateStatuses = () => {
      const newStatuses = {};
      systems.forEach(system => {
        const rand = Math.random();
        if (rand < 0.85) newStatuses[system.key] = 'Opérationnel';
        else if (rand < 0.95) newStatuses[system.key] = 'Dégradé';
        else newStatuses[system.key] = 'Hors_Ligne';
      });
      setStatuses(newStatuses);
    };

    updateStatuses();
    const interval = setInterval(updateStatuses, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-[#111827]/80 border-[#374151] backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Power className="w-5 h-5 text-gray-400" />
          Statut des Systèmes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {systems.map((system, index) => {
            const status = statuses[system.key] || 'Dégradé';
            const config = getStatusConfig(status);
            const Icon = config.icon;

            return (
              <motion.div
                key={system.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-300">{system.name}</span>
                <div className={`flex items-center gap-2 font-semibold ${config.color}`}>
                  <Icon className="w-4 h-4" />
                  <span>{config.label}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}