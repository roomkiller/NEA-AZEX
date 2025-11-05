import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Bell, Mail } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function ConfigureAlertsModal({ open, onClose, domain }) {
    const [alertConfig, setAlertConfig] = useState({
        enabled: true,
        email_notifications: true,
        email_address: '',
        priority_filter: 'Urgent',
        frequency: 'immediate',
        quiet_hours_enabled: false,
        quiet_hours_start: '22:00',
        quiet_hours_end: '08:00',
        keywords: [],
        regions: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadConfig = async () => {
            try {
                const currentUser = await base44.auth.me();
                setUser(currentUser);

                const configs = await base44.entities.AlertConfiguration.filter({
                    user_email: currentUser.email,
                    domain: domain
                });

                if (configs.length > 0) {
                    const config = configs[0];
                    setAlertConfig({
                        enabled: config.enabled,
                        email_notifications: config.email_notifications,
                        email_address: config.email_address || currentUser.email,
                        priority_filter: config.priority_filter,
                        frequency: config.frequency,
                        quiet_hours_enabled: config.quiet_hours_enabled,
                        quiet_hours_start: config.quiet_hours_start,
                        quiet_hours_end: config.quiet_hours_end,
                        keywords: config.keywords || [],
                        regions: config.regions || []
                    });
                } else {
                    setAlertConfig(prev => ({ ...prev, email_address: currentUser.email }));
                }
            } catch (error) {
                console.error('Erreur chargement config alertes:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (open) {
            loadConfig();
        }
    }, [open, domain]);

    const handleSave = async () => {
        try {
            const configs = await base44.entities.AlertConfiguration.filter({
                user_email: user.email,
                domain: domain
            });

            if (configs.length > 0) {
                await base44.entities.AlertConfiguration.update(configs[0].id, {
                    ...alertConfig,
                    domain: domain,
                    user_email: user.email
                });
            } else {
                await base44.entities.AlertConfiguration.create({
                    ...alertConfig,
                    domain: domain,
                    user_email: user.email
                });
            }

            toast.success('Configuration des alertes sauvegardée');
            onClose();
        } catch (error) {
            console.error('Erreur sauvegarde alertes:', error);
            toast.error('Échec de la sauvegarde');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                <DialogHeader>
                    <DialogTitle className="text-[var(--nea-text-title)] flex items-center gap-2">
                        <Bell className="w-5 h-5 text-blue-400" />
                        Configuration des Alertes - {domain}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="enabled" className="text-base font-semibold">
                            Activer les alertes
                        </Label>
                        <Switch
                            id="enabled"
                            checked={alertConfig.enabled}
                            onCheckedChange={(checked) => setAlertConfig({ ...alertConfig, enabled: checked })}
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-blue-400" />
                            <Label className="font-semibold">Notifications Email</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Switch
                                checked={alertConfig.email_notifications}
                                onCheckedChange={(checked) => setAlertConfig({ ...alertConfig, email_notifications: checked })}
                            />
                            <Input
                                type="email"
                                placeholder="votre@email.com"
                                value={alertConfig.email_address}
                                onChange={(e) => setAlertConfig({ ...alertConfig, email_address: e.target.value })}
                                disabled={!alertConfig.email_notifications}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="font-semibold">Alerter à partir du niveau</Label>
                        <Select 
                            value={alertConfig.priority_filter}
                            onValueChange={(value) => setAlertConfig({ ...alertConfig, priority_filter: value })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Routine">Routine (tous)</SelectItem>
                                <SelectItem value="Attention">Attention et plus</SelectItem>
                                <SelectItem value="Urgent">Urgent et plus</SelectItem>
                                <SelectItem value="Critique">Critique uniquement</SelectItem>
                                <SelectItem value="Flash">Flash uniquement</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-3">
                        <Label className="font-semibold">Fréquence des notifications</Label>
                        <Select 
                            value={alertConfig.frequency}
                            onValueChange={(value) => setAlertConfig({ ...alertConfig, frequency: value })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="immediate">Immédiat</SelectItem>
                                <SelectItem value="hourly">Digest horaire</SelectItem>
                                <SelectItem value="daily">Digest quotidien (9h)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="font-semibold">Heures silencieuses</Label>
                            <Switch
                                checked={alertConfig.quiet_hours_enabled}
                                onCheckedChange={(checked) => setAlertConfig({ ...alertConfig, quiet_hours_enabled: checked })}
                            />
                        </div>
                        {alertConfig.quiet_hours_enabled && (
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label className="text-sm text-[var(--nea-text-secondary)]">Début</Label>
                                    <Input
                                        type="time"
                                        value={alertConfig.quiet_hours_start}
                                        onChange={(e) => setAlertConfig({ ...alertConfig, quiet_hours_start: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label className="text-sm text-[var(--nea-text-secondary)]">Fin</Label>
                                    <Input
                                        type="time"
                                        value={alertConfig.quiet_hours_end}
                                        onChange={(e) => setAlertConfig({ ...alertConfig, quiet_hours_end: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <Label className="font-semibold">Mots-clés d'alerte</Label>
                        <Input
                            placeholder="Séparer par des virgules (ex: cyber, attaque, urgence)"
                            onChange={(e) => setAlertConfig({ ...alertConfig, keywords: e.target.value.split(',').map(k => k.trim()) })}
                        />
                        <p className="text-xs text-[var(--nea-text-muted)]">
                            Recevoir une alerte si un de ces mots apparaît dans un brief
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Label className="font-semibold">Régions d'intérêt</Label>
                        <Input
                            placeholder="Séparer par des virgules (ex: Europe, Asie)"
                            onChange={(e) => setAlertConfig({ ...alertConfig, regions: e.target.value.split(',').map(r => r.trim()) })}
                        />
                        <p className="text-xs text-[var(--nea-text-muted)]">
                            Recevoir une alerte pour les briefs concernant ces régions
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Annuler
                    </Button>
                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                        Sauvegarder
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}