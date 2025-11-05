import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Key, Lock, AlertTriangle } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import { useStaggerAnimation } from '../components/navigation/PageTransition';

const protectionMeasures = [
    {
        icon: Key,
        title: "Authentification Multi-Facteurs",
        description: "Système d'authentification renforcé avec validation biométrique",
        status: "Actif",
        level: "Maximum"
    },
    {
        icon: Lock,
        title: "Chiffrement RSA-4096",
        description: "Chiffrement de bout en bout pour toutes les communications",
        status: "Actif",
        level: "Maximum"
    },
    {
        icon: ShieldCheck,
        title: "Vérification d'Intégrité",
        description: "Contrôle continu de l'intégrité du code source",
        status: "Actif",
        level: "Élevé"
    },
    {
        icon: AlertTriangle,
        title: "Détection d'Intrusion",
        description: "Surveillance en temps réel des tentatives d'accès non autorisées",
        status: "Actif",
        level: "Maximum"
    }
];

export default function AntiPiracy() {
    const { containerVariants, itemVariants } = useStaggerAnimation();

    return (
        <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Anti-Piratage", href: "AntiPiracy" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader 
                    icon={<ShieldCheck className="w-8 h-8 text-red-400" />}
                    title="Protocoles Anti-Piratage"
                    subtitle="Protection avancée de la propriété intellectuelle"
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <NeaCard className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/30">
                    <div className="p-8 text-center">
                        <ShieldCheck className="w-16 h-16 text-red-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Protection Maximale Activée
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Tous les systèmes de protection sont opérationnels. Toute tentative d'accès non autorisé 
                            sera détectée et neutralisée.
                        </p>
                    </div>
                </NeaCard>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
                {protectionMeasures.map((measure, index) => {
                    const Icon = measure.icon;
                    return (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <NeaCard>
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-red-500/20 rounded-lg">
                                                <Icon className="w-6 h-6 text-red-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {measure.title}
                                                </h3>
                                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mt-1">
                                                    {measure.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        {measure.description}
                                    </p>
                                    <div className="flex items-center gap-2 pt-4 border-t border-[var(--nea-border-subtle)]">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Niveau:</span>
                                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                                            {measure.level}
                                        </Badge>
                                    </div>
                                </div>
                            </NeaCard>
                        </motion.div>
                    );
                })}
            </div>

            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Avertissement Légal
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            Ce logiciel est protégé par les lois internationales sur le droit d'auteur et la propriété intellectuelle. 
                            Toute tentative de copie, modification, distribution ou utilisation non autorisée constitue une violation 
                            de ces lois et sera poursuivie avec la rigueur maximale prévue par la loi. Les systèmes de détection 
                            enregistrent toutes les tentatives d'accès et les transmettent automatiquement aux autorités compétentes.
                        </p>
                    </div>
                </NeaCard>
            </motion.div>
        </motion.div>
    );
}