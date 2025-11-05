import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NetworkConnection } from "@/api/entities";
import { toast } from "sonner";
import { Network, Save, X } from "lucide-react";
import { motion } from "framer-motion";

export default function ManualNetworkConfig({ isOpen, onClose, existingConnection = null }) {
  const [formData, setFormData] = useState(
    existingConnection || {
      connection_name: "",
      connection_type: "Ethernet",
      status: "Disconnected",
      ip_address: "",
      mac_address: "",
      gateway: "",
      dns_servers: [],
      security_level: "Level_1_Public",
      auto_connect: true,
      encryption_enabled: true,
      bandwidth_limit_mbps: null,
      authorization_volet_1: false,
      authorization_volet_2: false,
      authorization_volet_3: false,
    }
  );

  const [dnsInput, setDnsInput] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.connection_name || !formData.ip_address) {
      toast.error("Veuillez remplir les champs requis");
      return;
    }

    try {
      if (existingConnection) {
        await NetworkConnection.update(existingConnection.id, formData);
        toast.success("Connexion mise à jour");
      } else {
        await NetworkConnection.create(formData);
        toast.success("Connexion créée");
      }
      onClose();
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const handleAddDNS = () => {
    if (dnsInput && !formData.dns_servers.includes(dnsInput)) {
      setFormData({
        ...formData,
        dns_servers: [...formData.dns_servers, dnsInput],
      });
      setDnsInput("");
    }
  };

  const handleRemoveDNS = (dns) => {
    setFormData({
      ...formData,
      dns_servers: formData.dns_servers.filter((d) => d !== dns),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)] text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Network className="w-6 h-6 text-[var(--nea-primary-blue)]" />
            {existingConnection ? "Modifier la Connexion" : "Nouvelle Connexion"}
          </DialogTitle>
        </DialogHeader>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Informations de base */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[var(--nea-primary-blue)]">Informations de Base</h3>
            
            <div>
              <Label htmlFor="connection_name">Nom de la Connexion *</Label>
              <Input
                id="connection_name"
                value={formData.connection_name}
                onChange={(e) => setFormData({ ...formData, connection_name: e.target.value })}
                className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-white mt-1"
                placeholder="Ex: Bureau Principal"
              />
            </div>

            <div>
              <Label htmlFor="connection_type">Type de Connexion</Label>
              <Select
                value={formData.connection_type}
                onValueChange={(value) => setFormData({ ...formData, connection_type: value })}
              >
                <SelectTrigger className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                  <SelectItem value="Ethernet" className="text-white">Ethernet</SelectItem>
                  <SelectItem value="Wi-Fi" className="text-white">Wi-Fi</SelectItem>
                  <SelectItem value="Cellular" className="text-white">Cellulaire</SelectItem>
                  <SelectItem value="Unknown" className="text-white">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Configuration Réseau */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[var(--nea-primary-blue)]">Configuration Réseau</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ip_address">Adresse IP *</Label>
                <Input
                  id="ip_address"
                  value={formData.ip_address}
                  onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                  className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-white mt-1"
                  placeholder="192.168.1.10"
                />
              </div>

              <div>
                <Label htmlFor="mac_address">Adresse MAC</Label>
                <Input
                  id="mac_address"
                  value={formData.mac_address}
                  onChange={(e) => setFormData({ ...formData, mac_address: e.target.value })}
                  className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-white mt-1"
                  placeholder="00:1B:44:11:3A:B7"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="gateway">Passerelle</Label>
              <Input
                id="gateway"
                value={formData.gateway}
                onChange={(e) => setFormData({ ...formData, gateway: e.target.value })}
                className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-white mt-1"
                placeholder="192.168.1.1"
              />
            </div>

            <div>
              <Label>Serveurs DNS</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={dnsInput}
                  onChange={(e) => setDnsInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddDNS())}
                  className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-white"
                  placeholder="8.8.8.8"
                />
                <Button type="button" onClick={handleAddDNS} variant="outline" size="sm">
                  Ajouter
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.dns_servers.map((dns, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[var(--nea-primary-blue)]/20 text-[var(--nea-primary-blue)] rounded-full text-sm flex items-center gap-2"
                  >
                    {dns}
                    <button type="button" onClick={() => handleRemoveDNS(dns)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sécurité */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[var(--nea-primary-blue)]">Sécurité</h3>
            
            <div>
              <Label htmlFor="security_level">Niveau de Sécurité</Label>
              <Select
                value={formData.security_level}
                onValueChange={(value) => setFormData({ ...formData, security_level: value })}
              >
                <SelectTrigger className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                  <SelectItem value="Level_1_Public" className="text-white">Niveau 1 - Public</SelectItem>
                  <SelectItem value="Level_2_Secured" className="text-white">Niveau 2 - Sécurisé</SelectItem>
                  <SelectItem value="Level_3_Classified" className="text-white">Niveau 3 - Classifié</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="encryption">Chiffrement Activé</Label>
                <Switch
                  id="encryption"
                  checked={formData.encryption_enabled}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, encryption_enabled: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="auto_connect">Connexion Automatique</Label>
                <Switch
                  id="auto_connect"
                  checked={formData.auto_connect}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, auto_connect: checked })
                  }
                />
              </div>
            </div>
          </div>

          {/* Autorisations */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[var(--nea-primary-blue)]">Autorisations</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="volet1">Volet 1: Détection réseau</Label>
                  <p className="text-xs text-[var(--nea-text-secondary)]">Détection automatique des périphériques</p>
                </div>
                <Switch
                  id="volet1"
                  checked={formData.authorization_volet_1}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, authorization_volet_1: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="volet2">Volet 2: Configuration automatique</Label>
                  <p className="text-xs text-[var(--nea-text-secondary)]">Configuration DHCP automatique</p>
                </div>
                <Switch
                  id="volet2"
                  checked={formData.authorization_volet_2}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, authorization_volet_2: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="volet3">Volet 3: Transmission données sensibles</Label>
                  <p className="text-xs text-[var(--nea-text-secondary)]">Autoriser les données classifiées</p>
                </div>
                <Switch
                  id="volet3"
                  checked={formData.authorization_volet_3}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, authorization_volet_3: checked })
                  }
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--nea-border-default)]">
            <Button type="button" onClick={onClose} variant="outline">
              Annuler
            </Button>
            <Button type="submit" className="bg-[var(--nea-primary-blue)] hover:bg-sky-500">
              <Save className="w-4 h-4 mr-2" />
              {existingConnection ? "Mettre à jour" : "Créer"}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}