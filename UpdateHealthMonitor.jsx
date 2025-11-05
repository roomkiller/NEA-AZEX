
import React, { useState, useEffect, useCallback } from "react";
import { UpdateSchedule } from "@/api/entities";
import { UpdateAlert } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, AlertTriangle, CheckCircle, Clock, TrendingUp, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Moniteur de santé du système d'actualisation
 * Affiche l'état en temps réel de toutes les actualisations
 */
export default function UpdateHealthMonitor() {
  const [schedules, setSchedules] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [healthScore, setHealthScore] = useState(100);
  const [isLoading, setIsLoading] = useState(true);

  const calculateHealthScore = useCallback((schedules) => {
    if (schedules.length === 0) {
      setHealthScore(100);
      return;
    }

    const onSchedule = schedules.filter(s => s.update_status === 'On_Schedule').length;
    const score = Math.round((onSchedule / schedules.length) * 100);
    setHealthScore(score);
  }, []); // setHealthScore is stable, so no need to include it.

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true); // Set loading true at the start of loadData
      const [schedulesData, alertsData] = await Promise.all([
        UpdateSchedule.list('-last_update', 50),
        UpdateAlert.filter({ status: 'Active' }, '-triggered_timestamp', 20)
      ]);

      setSchedules(schedulesData || []);
      setAlerts(alertsData || []);
      calculateHealthScore(schedulesData || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Erreur chargement health:", error);
      setIsLoading(false);
    }
  }, [calculateHealthScore]); // Depend on calculateHealthScore

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh toutes les 30s
    return () => clearInterval(interval);
  }, [loadData]); // Depend on loadData

  const getStatusColor = (status) => {
    switch (status) {
      case 'On_Schedule': return 'text-green-400';
      case 'Delayed': return 'text-yellow-400';
      case 'Overdue': return 'text-orange-400';
      case 'Failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'On_Schedule': return CheckCircle;
      case 'Delayed': return Clock;
      case 'Overdue': return AlertTriangle;
      case 'Failed': return AlertTriangle;
      default: return Activity;
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-[#111827] border-[#374151]">
        <CardContent className="p-6 text-center">
          <RefreshCw className="w-8 h-8 text-[#DC2626] animate-spin mx-auto mb-2" />
          <p className="text-[#9CA3AF]">Chargement état système...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Score de santé */}
      <Card className="bg-[#111827] border-[#374151]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#9CA3AF] text-sm mb-1">Santé Système Actualisation</p>
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-4xl font-bold"
                  style={{ color: healthScore >= 90 ? '#10b981' : healthScore >= 70 ? '#f59e0b' : '#ef4444' }}
                >
                  {healthScore}%
                </motion.div>
                <div>
                  <Badge className={`${healthScore >= 90 ? 'bg-green-500/20 text-green-400' : healthScore >= 70 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'} border-0`}>
                    {healthScore >= 90 ? 'Excellent' : healthScore >= 70 ? 'Correct' : 'Critique'}
                  </Badge>
                  <p className="text-xs text-[#6B7280] mt-1">
                    {schedules.filter(s => s.update_status === 'On_Schedule').length}/{schedules.length} À jour
                  </p>
                </div>
              </div>
            </div>
            <TrendingUp className={`w-12 h-12 ${healthScore >= 90 ? 'text-green-400' : 'text-yellow-400'}`} />
          </div>
        </CardContent>
      </Card>

      {/* Alertes actives */}
      {alerts.length > 0 && (
        <Card className="bg-[#111827] border-red-500/30">
          <CardHeader className="border-b border-[#374151] pb-3">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              Alertes Actives ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {alerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex items-start gap-2 p-2 bg-red-500/10 rounded-lg border border-red-500/30">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-red-300 text-xs font-medium truncate">{alert.resource_type}</p>
                    <p className="text-red-400 text-xs truncate">{alert.message}</p>
                  </div>
                  <Badge className="bg-red-500/20 text-red-400 text-[10px] flex-shrink-0">
                    {alert.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* État des ressources */}
      <Card className="bg-[#111827] border-[#374151]">
        <CardHeader className="border-b border-[#374151] pb-3">
          <CardTitle className="text-white text-sm">État Actualisations (Top 10)</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2">
            {schedules.slice(0, 10).map((schedule) => {
              const StatusIcon = getStatusIcon(schedule.update_status);
              const statusColor = getStatusColor(schedule.update_status);
              
              return (
                <div key={schedule.id} className="flex items-center justify-between p-2 bg-[#1F2937] rounded-lg">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <StatusIcon className={`w-4 h-4 ${statusColor} flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium truncate">{schedule.resource_type}</p>
                      <p className="text-[#6B7280] text-[10px] truncate">{schedule.update_frequency}</p>
                    </div>
                  </div>
                  <Badge className={`text-[10px] flex-shrink-0 ${
                    schedule.update_status === 'On_Schedule' ? 'bg-green-500/20 text-green-400' :
                    schedule.update_status === 'Delayed' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  } border-0`}>
                    {schedule.update_status}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <Card className="bg-[#111827] border-[#374151]">
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">
                {schedules.filter(s => s.update_status === 'On_Schedule').length}
              </p>
              <p className="text-xs text-[#9CA3AF]">À jour</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">
                {schedules.filter(s => s.update_status === 'Delayed').length}
              </p>
              <p className="text-xs text-[#9CA3AF]">Retardées</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">
                {schedules.filter(s => s.update_status === 'Failed').length}
              </p>
              <p className="text-xs text-[#9CA3AF]">Échecs</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={loadData}
        variant="outline"
        size="sm"
        className="w-full border-[#374151] text-[#9CA3AF] hover:bg-[#1F2937]"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Rafraîchir
      </Button>
    </div>
  );
}
