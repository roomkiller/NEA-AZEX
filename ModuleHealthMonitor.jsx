import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TacticalLog } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';

const STATUS_CONFIG = {
  'Success': { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20' },
  'Warning': { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  'Error': { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20' },
  'Processing': { icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/20' }
};

export default function ModuleHealthMonitor({ moduleName }) {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLogs();
    const interval = setInterval(loadLogs, 10000);
    return () => clearInterval(interval);
  }, [moduleName]);

  const loadLogs = async () => {
    try {
      const data = await TacticalLog.filter({ module_name: moduleName }, '-timestamp', 10);
      setLogs(data);
    } catch (error) {
      console.error('Erreur chargement logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = {
    total: logs.length,
    success: logs.filter(l => l.status === 'Success').length,
    warnings: logs.filter(l => l.status === 'Warning').length,
    errors: logs.filter(l => l.status === 'Error').length
  };

  if (isLoading) {
    return (
      <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
        <CardContent className="p-8 text-center">
          <p className="text-[var(--nea-text-secondary)]">Chargement des logs...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Activity className="w-5 h-5 text-green-400" />
          Santé du Module
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-[var(--nea-bg-surface-hover)]">
            <p className="text-xs text-[var(--nea-text-secondary)]">Total</p>
            <p className="text-xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="p-3 rounded-lg bg-green-500/10">
            <p className="text-xs text-green-400">Succès</p>
            <p className="text-xl font-bold text-green-400">{stats.success}</p>
          </div>
          <div className="p-3 rounded-lg bg-yellow-500/10">
            <p className="text-xs text-yellow-400">Alertes</p>
            <p className="text-xl font-bold text-yellow-400">{stats.warnings}</p>
          </div>
          <div className="p-3 rounded-lg bg-red-500/10">
            <p className="text-xs text-red-400">Erreurs</p>
            <p className="text-xl font-bold text-red-400">{stats.errors}</p>
          </div>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto styled-scrollbar">
          {logs.map((log, index) => {
            const statusConfig = STATUS_CONFIG[log.status] || STATUS_CONFIG['Processing'];
            const StatusIcon = statusConfig.icon;
            
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2 flex-1">
                    <StatusIcon className={`w-4 h-4 mt-0.5 ${statusConfig.color}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{log.operation_type.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-[var(--nea-text-secondary)] mt-1">{log.message}</p>
                      <p className="text-xs text-[var(--nea-text-muted)] mt-1">
                        {new Date(log.timestamp).toLocaleString('fr-CA')}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${statusConfig.bg} ${statusConfig.color} border-0`}>
                    {log.status}
                  </Badge>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}