import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Shield, GitMerge, Activity, FileText } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStaggerAnimation } from '../components/navigation/PageTransition';

const protocols = [
    {
        id: 'quadra',
        name: 'QUADRA',
        icon: BrainCircuit,
        color: 'text-purple-400',
        description: 'Système d\'analyse multidimensionnelle',
        content: `
# Protocole QUADRA

## Vue d'ensemble
Le protocole QUADRA est le système central d'analyse et de traitement des données de NEA-AZEX.

## Composantes principales
- **QUADRA-Géo** : Analyse géopolitique
- **QUADRA-Nuc** : Surveillance nucléaire
- **QUADRA-Climat** : Monitoring climatique
- **QUADRA-Bio** : Veille biologique

## Fonctionnement
Le système agrège les données de toutes les sources et produit des analyses corrélées en temps réel.
        `
    },
    {
        id: 'correlation',
        name: 'Corrélation',
        icon: GitMerge,
        color: 'text-cyan-400',
        description: 'Moteur de corrélation multi-sources',
        content: `
# Protocole de Corrélation

## Objectif
Identifier les relations cachées entre événements apparemment non liés.

## Méthodologie
1. Collecte de données multi-sources
2. Normalisation des formats
3. Application d'algorithmes de corrélation
4. Génération d'insights prédictifs

## Applications
- Détection de menaces émergentes
- Prédiction d'événements en cascade
- Analyse de patterns historiques
        `
    },
    {
        id: 'security',
        name: 'Sécurité',
        icon: Shield,
        color: 'text-red-400',
        description: 'Protocoles de sécurité et protection',
        content: `
# Protocole de Sécurité

## Niveaux de Sécurité
- **Niveau 1** : Public - Données non sensibles
- **Niveau 2** : Restreint - Accès contrôlé
- **Niveau 3** : Confidentiel - Chiffrement requis
- **Niveau 4** : Secret - Authentification multi-facteurs
- **Niveau 5** : Top Secret - Isolation complète

## Mesures de Protection
- Chiffrement RSA-4096
- Authentification biométrique
- Logs d'audit complets
- Détection d'intrusion temps réel
        `
    },
    {
        id: 'telemetry',
        name: 'Télémétrie',
        icon: Activity,
        color: 'text-green-400',
        description: 'Monitoring et métriques système',
        content: `
# Protocole de Télémétrie

## Collecte de Données
Le système collecte en continu :
- Métriques de performance
- Logs d'activité
- Événements système
- Interactions utilisateur

## Analyses Automatisées
- Détection d'anomalies
- Optimisation de performance
- Prédiction de pannes
- Recommandations d'amélioration

## Visualisation
Tableaux de bord en temps réel pour tous les niveaux d'utilisateurs.
        `
    }
];

export default function ProtocolDocumentation() {
    const { containerVariants, itemVariants } = useStaggerAnimation();

    return (
        <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Documentation des Protocoles", href: "ProtocolDocumentation" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader 
                    icon={<FileText className="w-8 h-8 text-blue-400" />}
                    title="Documentation des Protocoles"
                    subtitle="Référence complète des protocoles système"
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <Tabs defaultValue="quadra" className="w-full">
                    <TabsList className="bg-[var(--nea-bg-surface)] border border-[var(--nea-border-default)]">
                        {protocols.map(protocol => (
                            <TabsTrigger key={protocol.id} value={protocol.id}>
                                {protocol.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {protocols.map(protocol => {
                        const Icon = protocol.icon;
                        return (
                            <TabsContent key={protocol.id} value={protocol.id} className="mt-6">
                                <NeaCard>
                                    <div className="p-6 border-b border-[var(--nea-border-default)]">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 bg-[var(--nea-bg-surface-hover)] rounded-lg`}>
                                                <Icon className={`w-8 h-8 ${protocol.color}`} />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    Protocole {protocol.name}
                                                </h2>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    {protocol.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="prose prose-sm max-w-none prose-invert">
                                            <pre className="whitespace-pre-wrap text-sm text-gray-900 dark:text-gray-300 leading-relaxed">
                                                {protocol.content}
                                            </pre>
                                        </div>
                                    </div>
                                </NeaCard>
                            </TabsContent>
                        );
                    })}
                </Tabs>
            </motion.div>
        </motion.div>
    );
}