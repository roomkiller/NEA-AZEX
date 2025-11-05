import React, { useState, useEffect, useCallback } from 'react';
import { NetworkConnection } from '@/api/entities';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, Loader2, RefreshCw, Settings, CheckCircle, AlertTriangle } from 'lucide-react';
import NeaCard from '../ui/NeaCard';
import NeaButton from '../ui/NeaButton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function SystemConnectionControl() {
  const [connections, setConnections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadConnections = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await NetworkConnection.list();
      setConnections(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des connexions");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConnections();
  }, [loadConnections]);

  const toggleConnection = async (connection) => {
    try {
      const newStatus = connection.status === 'Connected' ? 'Disconnected' : 'Connected';
      await NetworkConnection.update(connection.id, {
        status: newStatus,
        last_connected: newStatus === 'Connected' ? new Date().toISOString() : connection.last_connected
      });
      toast.success(`Connexion ${newStatus === 'Connected' ? 'établie' : 'fermée'}`);
      await loadConnections();
    } catch (error) {
      toast.error("Erreur lors de la modification de la connexion");
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Connected':
        return { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'Connecté' };
      case 'Disconnected':
        return { icon: WifiOff, color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/30', label: 'Déconnecté' };
      case 'Connecting':
        return { icon: Loader2, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', label: 'Connexion...' };
      case 'Error':
        return { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', label: 'Erreur' };
      default:
        return { icon: WifiOff, color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/30', label: status };
    }
  };

  if (isLoading) {
    return (
      <NeaCard className="p-12 text-center">
        <Loader2 className="w-12 h-12 animate-spin text-[var(--nea-primary-blue)] mx-auto mb-4" />
        <p className="text-[var(--nea-text-secondary)]">Chargement des connexions...</p>
      </NeaCard>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <NeaCard>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Wifi className="w-5 h-5 text-[var(--nea-primary-blue)]" />
              Contrôle des Connexions ({connections.length})
            </h3>
            <NeaButton onClick={loadConnections} variant="secondary" size="sm">
              <RefreshCw className="w-4 h-4" />
            </NeaButton>
          </div>

          {connections.length === 0 ? (
            <div className="text-center py-8">
              <WifiOff className="w-12 h-12 text-[var(--nea-text-muted)] mx-auto mb-4" />
              <p className="text-[var(--nea-text-secondary)]">Aucune connexion configurée</p>
            </div>
          ) : (
            <div className="space-y-3">
              {connections.map((connection, index) => {
                const statusConfig = getStatusConfig(connection.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <motion.div
                    key={connection.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-lg border ${statusConfig.bg} ${statusConfig.border}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        <StatusIcon className={`w-5 h-5 ${statusConfig.color} ${connection.status === 'Connecting' ? 'animate-spin' : ''}`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-white">{connection.connection_name}</p>
                            <Badge className="bg-[var(--nea-primary-blue)]/20 text-[var(--nea-primary-blue)] border-0 text-xs">
                              {connection.connection_type}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs text-[var(--nea-text-secondary)]">
                            {connection.ip_address && <span>IP: {connection.ip_address}</span>}
                            {connection.security_level && (
                              <span className="flex items-center gap-1">
                                <Settings className="w-3 h-3" />
                                {connection.security_level}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <NeaButton
                        onClick={() => toggleConnection(connection)}
                        disabled={connection.status === 'Connecting'}
                        size="sm"
                        variant={connection.status === 'Connected' ? 'destructive' : 'primary'}
                      >
                        {connection.status === 'Connected' ? 'Déconnecter' : 'Connecter'}
                      </NeaButton>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </NeaCard>
    </motion.div>
  );
}