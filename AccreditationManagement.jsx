import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { ShieldCheck, Plus, RefreshCw, Search } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Input } from '@/components/ui/input';
import AccreditationCard from '../components/accreditation/AccreditationCard';
import CreateAccreditationModal from '../components/accreditation/CreateAccreditationModal';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import { toast } from 'sonner';

export default function AccreditationManagement() {
    const [accreditations, setAccreditations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { containerVariants, itemVariants } = useStaggerAnimation();

    const loadAccreditations = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await base44.entities.AccreditationCredential.list();
            setAccreditations(data);
        } catch (error) {
            console.error("Erreur chargement accréditations:", error);
            toast.error("Échec du chargement");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAccreditations();
    }, [loadAccreditations]);

    const handleAccreditationCreated = () => {
        setShowCreateModal(false);
        loadAccreditations();
    };

    const filteredAccreditations = accreditations.filter(acc =>
        acc.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.accreditation_number?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: accreditations.length,
        active: accreditations.filter(a => a.status === 'Active').length,
        pending: accreditations.filter(a => a.status === 'Pending').length,
        revoked: accreditations.filter(a => a.status === 'Revoked').length
    };

    if (isLoading) {
        return <LoadingTransition message="Chargement des accréditations..." />;
    }

    return (
        <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Gestion des Accréditations", href: "AccreditationManagement" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader 
                    icon={<ShieldCheck className="w-8 h-8 text-green-400" />}
                    title="Gestion des Accréditations"
                    subtitle="Gestion des autorisations d'accès sécurisées"
                    actions={
                        <div className="flex gap-2">
                            <NeaButton variant="secondary" onClick={loadAccreditations}>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Actualiser
                            </NeaButton>
                            <NeaButton onClick={() => setShowCreateModal(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Nouvelle Accréditation
                            </NeaButton>
                        </div>
                    }
                />
            </motion.div>

            <motion.div variants={itemVariants} className="grid md:grid-cols-4 gap-4">
                <NeaCard className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </NeaCard>
                <NeaCard className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Actives</p>
                    <p className="text-3xl font-bold text-green-400">{stats.active}</p>
                </NeaCard>
                <NeaCard className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">En Attente</p>
                    <p className="text-3xl font-bold text-yellow-400">{stats.pending}</p>
                </NeaCard>
                <NeaCard className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Révoquées</p>
                    <p className="text-3xl font-bold text-red-400">{stats.revoked}</p>
                </NeaCard>
            </motion.div>

            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-4 border-b border-[var(--nea-border-default)]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <Input
                                placeholder="Rechercher une accréditation..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-gray-900 dark:text-white pl-10"
                            />
                        </div>
                    </div>
                </NeaCard>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAccreditations.map((accreditation, index) => (
                    <motion.div
                        key={accreditation.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <AccreditationCard 
                            accreditation={accreditation}
                            onUpdate={loadAccreditations}
                        />
                    </motion.div>
                ))}
            </div>

            {showCreateModal && (
                <CreateAccreditationModal
                    onClose={() => setShowCreateModal(false)}
                    onAccreditationCreated={handleAccreditationCreated}
                />
            )}
        </motion.div>
    );
}