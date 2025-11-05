import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Mail, Plus, Search, Eye, Edit, Loader2 } from 'lucide-react';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import EmptyState from '../components/ui/EmptyState';
import { toast } from 'sonner';

export default function EmailManagement() {
    const [templates, setTemplates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { containerVariants, itemVariants } = useStaggerAnimation();

    const loadTemplates = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await base44.entities.EmailTemplate.list();
            setTemplates(data);
        } catch (error) {
            console.error("Erreur chargement templates:", error);
            toast.error("Échec du chargement");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTemplates();
    }, [loadTemplates]);

    const filteredTemplates = templates.filter(t =>
        t.template_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.subject?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return <LoadingTransition message="Chargement des templates email..." />;
    }

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <PageHeader
                    title="Gestion des Emails"
                    subtitle="Configuration des templates et suivi des envois"
                    icon={<Mail size={28} className="text-blue-400" />}
                    actions={
                        <NeaButton onClick={() => toast.info("Fonctionnalité à venir")}>
                            <Plus className="w-4 h-4 mr-2" />
                            Nouveau Template
                        </NeaButton>
                    }
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-4 border-b border-[var(--nea-border-default)]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <Input
                                placeholder="Rechercher un template..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-gray-900 dark:text-white pl-10"
                            />
                        </div>
                    </div>

                    {filteredTemplates.length > 0 ? (
                        <div className="divide-y divide-[var(--nea-border-subtle)]">
                            {filteredTemplates.map((template, index) => (
                                <motion.div
                                    key={template.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="p-6 hover:bg-[var(--nea-bg-surface-hover)] transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {template.template_name}
                                                </h3>
                                                {template.is_active ? (
                                                    <Badge className="bg-green-500/10 text-green-400 border-green-500/30 border">
                                                        Actif
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-gray-500/10 text-gray-400 border-gray-500/30 border">
                                                        Inactif
                                                    </Badge>
                                                )}
                                                {template.send_automatically && (
                                                    <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30 border">
                                                        Auto
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                Sujet: <span className="text-gray-900 dark:text-white">{template.subject}</span>
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                                                <span>Code: <span className="text-gray-900 dark:text-white">{template.template_code}</span></span>
                                                {template.trigger_event && (
                                                    <span>Déclencheur: <span className="text-gray-900 dark:text-white">{template.trigger_event}</span></span>
                                                )}
                                                {template.total_sent > 0 && (
                                                    <span><span className="text-gray-900 dark:text-white">{template.total_sent}</span> envois</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <NeaButton size="sm" variant="secondary">
                                                <Eye className="w-4 h-4 mr-1" />
                                                Prévisualiser
                                            </NeaButton>
                                            <NeaButton size="sm" variant="secondary">
                                                <Edit className="w-4 h-4 mr-1" />
                                                Modifier
                                            </NeaButton>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8">
                            <EmptyState
                                icon={Mail}
                                title="Aucun template trouvé"
                                description="Aucun template email ne correspond à votre recherche."
                            />
                        </div>
                    )}
                </NeaCard>
            </motion.div>
        </motion.div>
    );
}