
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Users, MessageSquare, History, Lightbulb, FileText, Download } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import CollaborationPanel from '../components/collaboration/CollaborationPanel';
import VersionHistoryPanel from '../components/collaboration/VersionHistoryPanel';
import WhatIfAnalyzer from '../components/collaboration/WhatIfAnalyzer';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-hot-toast'; // Added import for toast notifications

export default function CollaborativeScenarioView() {
    const [searchParams] = useSearchParams();
    const scenarioId = searchParams.get('id');
    const [scenario, setScenario] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { containerVariants, itemVariants } = useStaggerAnimation();

    useEffect(() => {
        if (scenarioId) {
            loadScenario();
        }
    }, [scenarioId]);

    const loadScenario = async () => {
        try {
            const data = await base44.entities.Scenario.filter({ id: scenarioId }, null, 1);
            if (data && data.length > 0) {
                setScenario(data[0]);
            }
        } catch (error) {
            console.error('Error loading scenario:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = () => {
        setIsLoading(true);
        loadScenario();
    };

    const handleBranchCreated = (branch) => {
        toast.success(`Branche créée: ${branch.branch_name}`);
        // Reload scenario to refresh version history
        loadScenario();
    };

    if (isLoading) {
        return <LoadingTransition message="Chargement du scénario collaboratif..." />;
    }

    if (!scenario) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <NeaCard className="p-8 text-center">
                    <FileText className="w-16 h-16 text-[var(--nea-text-secondary)] mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-[var(--nea-text-title)] mb-2">
                        Scénario introuvable
                    </h3>
                    <p className="text-[var(--nea-text-secondary)]">
                        Le scénario demandé n'existe pas ou n'est pas accessible
                    </p>
                </NeaCard>
            </div>
        );
    }

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[
                    { name: "Scénarios" },
                    { name: "Vue Collaborative", href: "CollaborativeScenarioView" }
                ]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<Users className="w-8 h-8 text-purple-400" />}
                    title={scenario.scenario_name}
                    subtitle="Édition et analyse collaborative"
                />
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Scenario Content */}
                <motion.div variants={itemVariants} className="lg:col-span-2">
                    <NeaCard>
                        <div className="p-4 border-b border-[var(--nea-border-default)] bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                            <h3 className="font-bold text-[var(--nea-text-title)]">
                                Contenu du Scénario
                            </h3>
                        </div>
                        <div className="p-6 max-h-[800px] overflow-y-auto styled-scrollbar">
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <ReactMarkdown>
                                    {scenario.generated_content?.strategic_brief || scenario.description}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </NeaCard>
                </motion.div>

                {/* Collaboration Tools */}
                <motion.div variants={itemVariants}>
                    <Tabs defaultValue="collaboration" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-[var(--nea-bg-surface)]">
                            <TabsTrigger value="collaboration" className="text-xs">
                                <MessageSquare className="w-4 h-4 mr-1" />
                                Collaboration
                            </TabsTrigger>
                            <TabsTrigger value="versions" className="text-xs">
                                <History className="w-4 h-4 mr-1" />
                                Versions
                            </TabsTrigger>
                            <TabsTrigger value="whatif" className="text-xs">
                                <Lightbulb className="w-4 h-4 mr-1" />
                                What-If
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="collaboration" className="mt-4">
                            <CollaborationPanel
                                scenarioId={scenarioId}
                                onUpdate={handleRefresh} // Changed to handleRefresh
                            />
                        </TabsContent>

                        <TabsContent value="versions" className="mt-4">
                            <VersionHistoryPanel
                                scenarioId={scenarioId}
                                onRestore={handleRefresh} // Changed to handleRefresh
                            />
                        </TabsContent>

                        <TabsContent value="whatif" className="mt-4">
                            <WhatIfAnalyzer
                                scenarioId={scenarioId}
                                scenario={scenario}
                                onBranchCreated={handleBranchCreated} // Changed to handleBranchCreated
                            />
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>
        </motion.div>
    );
}
