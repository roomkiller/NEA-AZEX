import React, { useState, useEffect, useCallback } from "react";
import { NetworkConnection } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wifi, WifiOff, Settings, Trash2, Plus, Loader2, 
  CheckCircle, AlertTriangle, Network, Shield, Lock 
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import ManualNetworkConfig from "./ManualNetworkConfig";

export default function NetworkConnectionManager() {
  const [connections, setConnections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [editingConnection, setEditingConnection] = useState(null);
  const [connectingId, setConnectingId] = useState(null);

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

  const handleConnect = async (connection) => {
    setConnectingId(connection.id);
    try {
      await NetworkConnection.update(connection.id, {
        status: "Connected",
        last_connected: new Date().toISOString()
      });
      toast.success(`Connecté à ${connection.connection_name}`);
      await loadConnections();
    } catch (error) {
      toast.error("Erreur lors de la connexion");
    } finally {
      setConnectingId(null);
    }
  };

  const handleDisconnect = async (connection) => {
    try {
      await NetworkConnection.update(connection.id, {
        status: "Disconnected"
      });
      toast.success(`Déconnecté de ${connection.connection_name}`);
      await loadConnections();
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const handleDelete = async (connection) => {
    if (window.confirm(`Supprimer la connexion "${connection.connection_name}" ?`)) {
      try {
        await NetworkConnection.delete(connection.id);
        toast.success("Connexion supprimée");
        await loadConnections();
      } catch (error) {
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  const handleEdit = (connection) => {
    setEditingConnection(connection);
    setShowConfigModal(true);
  };

  const handleAddNew = () => {
    setEditingConnection(null);
    setShowConfigModal(true);
  };

  const handleModalClose = () => {
    setShowConfigModal(false);
    setEditingConnection(null);
    loadConnections();
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "Connected":
        return { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/20", label: "Connecté" };
      case "Disconnected":
        return { icon: WifiOff, color: "text-gray-400", bg: "bg-gray-500/20", label: "Déconnecté" };
      case "Connecting":
        return { icon: Loader2, color: "text-blue-400", bg: "bg-blue-500/20", label: "Connexion..." };
      case "Error":
        return { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/20", label: "Erreur" };
      default:
        return { icon: WifiOff, color: "text-gray-400", bg: "bg-gray-500/20", label: status };
    }
  };

  const getSecurityLevelColor = (level) => {
    if (!level) return "bg-gray-500/20 text-gray-300";
    if (level.includes("Level_3")) return "bg-red-500/20 text-red-300";
    if (level.includes("Level_2")) return "bg-amber-500/20 text-amber-300";
    return "bg-blue-500/20 text-blue-300";
  };

  if (isLoading) {
    return (
      <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
        <CardContent className="p-12 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[var(--nea-primary-blue)] mx-auto mb-4" />
          <p className="text-[var(--nea-text-secondary)]">Chargement des connexions réseau...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-white">
                <Network className="w-5 h-5 text-[var(--nea-primary-blue)]" />
                Gestionnaire de Connexions Réseau
              </CardTitle>
              <Button
                onClick={handleAddNew}
                className="bg-[var(--nea-primary-blue)] hover:bg-sky-500"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Connexion
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {connections.length === 0 ? (
              <div className="text-center py-12">
                <WifiOff className="w-16 h-16 text-[var(--nea-text-muted)] mx-auto mb-4" />
                <p className="text-[var(--nea-text-secondary)] mb-4">Aucune connexion configurée</p>
                <Button onClick={handleAddNew} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une connexion
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {connections.map((connection, index) => {
                  const statusConfig = getStatusConfig(connection.status);
                  const StatusIcon = statusConfig.icon;
                  const isConnecting = connectingId === connection.id;

                  return (
                    <motion.div
                      key={connection.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-lg border border-[var(--nea-border-default)] ${statusConfig.bg}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <StatusIcon 
                            className={`w-6 h-6 ${statusConfig.color} mt-1 ${
                              (isConnecting || connection.status === 'Connecting') ? 'animate-spin' : ''
                            }`} 
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-white">{connection.connection_name}</h4>
                              <Badge className="bg-[var(--nea-primary-blue)]/20 text-[var(--nea-primary-blue)] border-0">
                                {connection.connection_type}
                              </Badge>
                              {connection.encryption_enabled && (
                                <Lock className="w-4 h-4 text-emerald-400" />
                              )}
                            </div>

                            <div className="space-y-1 text-sm text-[var(--nea-text-secondary)]">
                              {connection.ip_address && (
                                <p>IP: <span className="font-mono">{connection.ip_address}</span></p>
                              )}
                              {connection.gateway && (
                                <p>Passerelle: <span className="font-mono">{connection.gateway}</span></p>
                              )}
                              {connection.security_level && (
                                <div className="flex items-center gap-2 mt-2">
                                  <Shield className="w-4 h-4" />
                                  <Badge className={`${getSecurityLevelColor(connection.security_level)} border-0 text-xs`}>
                                    {connection.security_level.replace(/_/g, ' ')}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          {connection.status === "Connected" ? (
                            <Button
                              onClick={() => handleDisconnect(connection)}
                              variant="outline"
                              size="sm"
                            >
                              <WifiOff className="w-4 h-4 mr-2" />
                              Déconnecter
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleConnect(connection)}
                              disabled={isConnecting}
                              className="bg-[var(--nea-primary-blue)] hover:bg-sky-500"
                              size="sm"
                            >
                              {isConnecting ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Wifi className="w-4 h-4 mr-2" />
                              )}
                              Connecter
                            </Button>
                          )}
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleEdit(connection)}
                              variant="outline"
                              size="sm"
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleDelete(connection)}
                              variant="outline"
                              size="sm"
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {showConfigModal && (
        <ManualNetworkConfig
          isOpen={showConfigModal}
          onClose={handleModalClose}
          existingConnection={editingConnection}
        />
      )}
    </>
  );
}