import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { UpdateAlert } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle, Clock, CheckCircle, RefreshCw, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const SEVERITY_CONFIG = {
  'Critical': { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/20', label: 'Critique' },
  'High': { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/20', label: 'Élevée' },
  'Medium': { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Moyenne' },
  'Low': { icon: CheckCircle, color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'Faible' }
};

const STATUS_CONFIG = {
  'Active': { color: 'text-red-300', bg: 'bg-red-500/20', label: 'Active' },
  'Acknowledged': { color: 'text-yellow-300', bg: 'bg-yellow-500/20', label: 'Acquittée' },
  'Resolved': { color: 'text-green-300', bg: 'bg-green-500/20', label: 'Résolue' },
  'Ignored': { color: 'text-gray-300', bg: 'bg-gray-500/20', label: 'Ignorée' }
};

export default function AlertDashboard() {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
    const interval = setInterval(loadAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAlerts = useCallback(async () => {
    try {
      const data = await UpdateAlert.list({ sort: '-triggered_timestamp', limit: 20 });
      setAlerts(data);
    } catch (error) {
      console.error('Erreur chargement alertes:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAcknowledge = useCallback(async (alertId) => {
    try {
      await UpdateAlert.update(alertId, {
        status: 'Acknowledged',
        acknowledged_timestamp: new Date().toISOString()
      });
      toast.success('Alerte acquittée');
      loadAlerts();
    } catch (error) {
      toast.error('Échec de l\'acquittement');
    }
  }, [loadAlerts]);

  const handleResolve = useCallback(async (alertId) => {
    try {
      await UpdateAlert.update(alertId, {
        status: 'Resolved'
      });
      toast.success('Alerte résolue');
      loadAlerts();
    } catch (error) {
      toast.error('Échec de la résolution');
    }
  }, [loadAlerts]);

  const stats = useMemo(() => ({
    total: alerts.length,
    active: alerts.filter(a => a.status === 'Active').length,
    critical: alerts.filter(a => a.severity === 'Critical').length,
    resolved: alerts.filter(a => a.status === 'Resolved').length
  }), [alerts]);

  if (isLoading) {
    return (
      <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
        <CardContent className="p-8 text-center">
          <p className="text-[var(--nea-text-secondary)]">Chargement des alertes...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <span className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-400" />
            Tableau de Bord des Alertes
          </span>
          <Button onClick={loadAlerts} size="sm" variant="outline">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-[var(--nea-bg-surface-hover)]">
            <p className="text-xs text-[var(--nea-text-secondary)]">Total</p>
            <p className="text-xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="p-3 rounded-lg bg-red-500/10">
            <p className="text-xs text-red-400">Actives</p>
            <p className="text-xl font-bold text-red-400">{stats.active}</p>
          </div>
          <div className="p-3 rounded-lg bg-orange-500/10">
            <p className="text-xs text-orange-400">Critiques</p>
            <p className="text-xl font-bold text-orange-400">{stats.critical}</p>
          </div>
          <div className="p-3 rounded-lg bg-green-500/10">
            <p className="text-xs text-green-400">Résolues</p>
            <p className="text-xl font-bold text-green-400">{stats.resolved}</p>
          </div>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto styled-scrollbar">
          {alerts.map((alert, index) => {
            const severityConfig = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG['Medium'];
            const statusConfig = STATUS_CONFIG[alert.status] || STATUS_CONFIG['Active'];
            const SeverityIcon = severityConfig.icon;

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-2 flex-1">
                    <SeverityIcon className={`w-5 h-5 mt-0.5 ${severityConfig.color}`} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{alert.alert_type.replace(/_/g, ' ')}</h4>
                      <p className="text-sm text-[var(--nea-text-secondary)] mt-1">{alert.message}</p>
                      {alert.resource_name && (
                        <p className="text-xs text-[var(--nea-text-muted)] mt-1">
                          Ressource: <span className="text-white">{alert.resource_name}</span>
                        </p>
                      )}
                      <p className="text-xs text-[var(--nea-text-muted)] mt-1">
                        {new Date(alert.triggered_timestamp).toLocaleString('fr-CA')}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-2">
                      <Badge className={`${severityConfig.bg} ${severityConfig.color} border-0`}>
                        {severityConfig.label}
                      </Badge>
                      <Badge className={`${statusConfig.bg} ${statusConfig.color} border-0`}>
                        {statusConfig.label}
                      </Badge>
                    </div>
                    {alert.status === 'Active' && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAcknowledge(alert.id)}
                        >
                          Acquitter
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleResolve(alert.id)}
                        >
                          Résoudre
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}