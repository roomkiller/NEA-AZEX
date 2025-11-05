import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { UpdateSchedule } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, AlertCircle, CheckCircle, Pause, RefreshCw, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const STATUS_CONFIG = {
  'On_Schedule': { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20', label: 'À jour' },
  'Delayed': { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Retardé' },
  'Overdue': { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/20', label: 'En retard' },
  'Failed': { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/20', label: 'Échoué' },
  'Paused': { icon: Pause, color: 'text-gray-400', bg: 'bg-gray-500/20', label: 'Pause' }
};

export default function UpdateScheduleManager() {
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = useCallback(async () => {
    try {
      const data = await UpdateSchedule.list({ sort: '-priority_level' });
      setSchedules(data);
    } catch (error) {
      console.error('Erreur chargement planifications:', error);
      toast.error('Échec du chargement des planifications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleToggleAutoUpdate = useCallback(async (scheduleId, currentState) => {
    try {
      await UpdateSchedule.update(scheduleId, {
        auto_update_enabled: !currentState
      });
      toast.success(`Mise à jour automatique ${!currentState ? 'activée' : 'désactivée'}`);
      loadSchedules();
    } catch (error) {
      toast.error('Échec de la modification');
    }
  }, [loadSchedules]);

  const stats = useMemo(() => ({
    total: schedules.length,
    onSchedule: schedules.filter(s => s.update_status === 'On_Schedule').length,
    delayed: schedules.filter(s => s.update_status === 'Delayed' || s.update_status === 'Overdue').length,
    autoEnabled: schedules.filter(s => s.auto_update_enabled).length
  }), [schedules]);

  if (isLoading) {
    return (
      <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
        <CardContent className="p-8 text-center">
          <p className="text-[var(--nea-text-secondary)]">Chargement des planifications...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <span className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            Gestionnaire de Planifications
          </span>
          <div className="flex items-center gap-2">
            <Button onClick={loadSchedules} size="sm" variant="outline">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-[var(--nea-bg-surface-hover)]">
            <p className="text-xs text-[var(--nea-text-secondary)]">Total</p>
            <p className="text-xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="p-3 rounded-lg bg-green-500/10">
            <p className="text-xs text-green-400">À jour</p>
            <p className="text-xl font-bold text-green-400">{stats.onSchedule}</p>
          </div>
          <div className="p-3 rounded-lg bg-yellow-500/10">
            <p className="text-xs text-yellow-400">Retardés</p>
            <p className="text-xl font-bold text-yellow-400">{stats.delayed}</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/10">
            <p className="text-xs text-blue-400">Auto</p>
            <p className="text-xl font-bold text-blue-400">{stats.autoEnabled}</p>
          </div>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto styled-scrollbar">
          {schedules.map((schedule, index) => {
            const statusConfig = STATUS_CONFIG[schedule.update_status] || STATUS_CONFIG['On_Schedule'];
            const StatusIcon = statusConfig.icon;

            return (
              <motion.div
                key={schedule.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                      <h4 className="font-semibold text-white">{schedule.resource_type.replace(/_/g, ' ')}</h4>
                    </div>
                    <div className="space-y-1 text-sm text-[var(--nea-text-secondary)]">
                      {schedule.resource_name && (
                        <p>Ressource: <span className="text-white">{schedule.resource_name}</span></p>
                      )}
                      <p>Fréquence: <span className="text-white">{schedule.update_frequency}</span></p>
                      {schedule.next_update_due && (
                        <p className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Prochaine: <span className="text-white">{new Date(schedule.next_update_due).toLocaleString('fr-CA')}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Badge className={`${statusConfig.bg} ${statusConfig.color} border-0`}>
                      {statusConfig.label}
                    </Badge>
                    <Button
                      size="sm"
                      variant={schedule.auto_update_enabled ? "default" : "outline"}
                      onClick={() => handleToggleAutoUpdate(schedule.id, schedule.auto_update_enabled)}
                      className={schedule.auto_update_enabled ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      {schedule.auto_update_enabled ? 'Auto ON' : 'Auto OFF'}
                    </Button>
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