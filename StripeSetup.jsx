import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, AlertCircle, Key, Settings } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import { toast } from 'sonner';

export default function StripeSetup() {
    const [config, setConfig] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        environment: 'test',
        publishable_key: '',
        secret_key: '',
        webhook_secret: ''
    });
    const { containerVariants, itemVariants } = useStaggerAnimation();

    const loadConfig = useCallback(async () => {
        setIsLoading(true);
        try {
            const configs = await base44.entities.StripeConfig.list();
            if (configs.length > 0) {
                setConfig(configs[0]);
                setFormData({
                    environment: configs[0].environment || 'test',
                    publishable_key: configs[0].publishable_key || '',
                    secret_key: configs[0].secret_key || '',
                    webhook_secret: configs[0].webhook_secret || ''
                });
            }
        } catch (error) {
            console.error("Erreur chargement config:", error);
            toast.error("Échec du chargement");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadConfig();
    }, [loadConfig]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (config) {
                await base44.entities.StripeConfig.update(config.id, formData);
                toast.success("Configuration mise à jour");
            } else {
                await base44.entities.StripeConfig.create({
                    ...formData,
                    is_active: true
                });
                toast.success("Configuration créée");
            }
            await loadConfig();
        } catch (error) {
            console.error("Erreur sauvegarde:", error);
            toast.error("Échec de la sauvegarde");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <LoadingTransition message="Chargement configuration Stripe..." />;
    }

    const statusColors = {
        'success': 'bg-green-500/20 text-green-400 border-green-500/30',
        'failed': 'bg-red-500/20 text-red-400 border-red-500/30',
        'not_tested': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };

    return (
        <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Configuration Stripe", href: "StripeSetup" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader 
                    icon={<CreditCard className="w-8 h-8 text-purple-400" />}
                    title="Configuration Stripe"
                    subtitle="Paramétrage des paiements en ligne"
                />
            </motion.div>

            {config && (
                <motion.div variants={itemVariants}>
                    <NeaCard>
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                        État de la Configuration
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Environnement: {config.environment}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {config.is_active ? (
                                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Actif
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                                            Inactif
                                        </Badge>
                                    )}
                                    {config.test_status && (
                                        <Badge className={statusColors[config.test_status]}>
                                            {config.test_status === 'success' && 'Test Réussi'}
                                            {config.test_status === 'failed' && 'Test Échoué'}
                                            {config.test_status === 'not_tested' && 'Non Testé'}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </NeaCard>
                </motion.div>
            )}

            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-4 border-b border-[var(--nea-border-default)]">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            Paramètres de Connexion
                        </h3>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="environment">Environnement</Label>
                            <Select 
                                value={formData.environment} 
                                onValueChange={(value) => setFormData({...formData, environment: value})}
                            >
                                <SelectTrigger className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-gray-900 dark:text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="test">Test</SelectItem>
                                    <SelectItem value="production">Production</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="publishable_key">
                                <Key className="w-4 h-4 inline mr-2" />
                                Clé Publique
                            </Label>
                            <Input
                                id="publishable_key"
                                type="text"
                                value={formData.publishable_key}
                                onChange={(e) => setFormData({...formData, publishable_key: e.target.value})}
                                placeholder="pk_test_..."
                                className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-gray-900 dark:text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="secret_key">
                                <Key className="w-4 h-4 inline mr-2" />
                                Clé Secrète
                            </Label>
                            <Input
                                id="secret_key"
                                type="password"
                                value={formData.secret_key}
                                onChange={(e) => setFormData({...formData, secret_key: e.target.value})}
                                placeholder="sk_test_..."
                                className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-gray-900 dark:text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="webhook_secret">
                                <Settings className="w-4 h-4 inline mr-2" />
                                Webhook Secret
                            </Label>
                            <Input
                                id="webhook_secret"
                                type="password"
                                value={formData.webhook_secret}
                                onChange={(e) => setFormData({...formData, webhook_secret: e.target.value})}
                                placeholder="whsec_..."
                                className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-gray-900 dark:text-white"
                            />
                        </div>

                        <NeaButton
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full"
                        >
                            {isSaving ? 'Sauvegarde...' : 'Sauvegarder Configuration'}
                        </NeaButton>
                    </div>
                </NeaCard>
            </motion.div>

            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle className="w-6 h-6 text-yellow-400" />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                Informations Importantes
                            </h3>
                        </div>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-disc list-inside">
                            <li>Utilisez l'environnement <strong>test</strong> pour le développement</li>
                            <li>Basculez en <strong>production</strong> uniquement après validation complète</li>
                            <li>Les clés secrètes sont stockées de manière sécurisée</li>
                            <li>Configurez les webhooks dans votre tableau de bord Stripe</li>
                        </ul>
                    </div>
                </NeaCard>
            </motion.div>
        </motion.div>
    );
}