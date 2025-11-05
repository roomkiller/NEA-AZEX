import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CheckCircle, AlertTriangle, XCircle, Loader2, Database, BrainCircuit, ShieldCheck, Zap } from 'lucide-react';

const getStatusConfig = (status) => {
  const configs = {
    Success: { color: 'text-green-400', icon: CheckCircle },
    Warning: { color: 'text-yellow-400', icon: AlertTriangle },
    Error: { color: 'text-red-400', icon: XCircle },
    Processing: { color: 'text-blue-400', icon: Loader2 },
  };
  return configs[status] || { color: 'text-gray-400', icon: Zap };
};

const getOperationIcon = (type) => {
    const icons = {
        Analyse: BrainCircuit,
        Prédiction: Zap,
        Surveillance: ShieldCheck,
        Transmission: Database,
    };
    return icons[type] || Zap;
};

export default function LiveActivityFeed({ activities = [] }) {
  if (!activities || activities.length === 0) {
    return <div className="text-center py-10 text-gray-500">Aucune activité à afficher. En attente de données...</div>;
  }

  return (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4 styled-scrollbar">
      <AnimatePresence initial={false}>
        {activities.map((activity) => {
          const statusConfig = getStatusConfig(activity.status);
          const StatusIcon = statusConfig.icon;
          const OperationIcon = getOperationIcon(activity.operation_type);

          return (
            <motion.div
              key={activity.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-4 p-3 bg-gray-500/5 rounded-lg border border-transparent hover:border-gray-500/20 transition-colors"
            >
              <div className={`mt-1 ${statusConfig.color}`}>
                <StatusIcon className={`w-5 h-5 ${activity.status === 'Processing' ? 'animate-spin' : ''}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                    <p className="text-white font-semibold flex items-center gap-2">
                        <OperationIcon className="w-4 h-4 text-gray-400"/>
                        {activity.module_name}
                    </p>
                    <p className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(activity.created_date), { addSuffix: true, locale: fr })}
                    </p>
                </div>
                <p className="text-sm text-gray-300 mt-1">{activity.message}</p>
                <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="border-gray-700 text-gray-400 text-xs">{activity.operation_type}</Badge>
                    {activity.metrics?.duration_ms && (
                        <Badge variant="outline" className="border-gray-700 text-gray-400 text-xs font-mono">
                            {activity.metrics.duration_ms}ms
                        </Badge>
                    )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}