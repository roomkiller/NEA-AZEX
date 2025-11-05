
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { BrainCircuit, RefreshCw, Users } from 'lucide-react'; // Added Users icon
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaButton from '../components/ui/NeaButton';
import ScenarioCard from '../components/scenario/ScenarioCard';
import AddScenarioModal from '../components/scenario/AddScenarioModal';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import { toast } from 'sonner';
import { Link } from 'react-router-dom'; // Added Link import
import { createPageUrl } from '@/utils'; // Added createPageUrl import
import NeaCard from '../components/ui/NeaCard'; // Added NeaCard import

export default function ScenarioGenerator() {
    const [scenarios, setScenarios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const { containerVariants, itemVariants } = useStaggerAnimation();

    // For now, filteredScenarios is just scenarios until actual filtering logic is added.
    const filteredScenarios = scenarios; 

    const loadScenarios = async () => {
        setIsLoading(true);
        try {
            const data = await base44.entities.Scenario.list('-created_date');
            setScenarios(data);
        } catch (error) {
            console.error("Erreur chargement scénarios:", error);
            toast.error("Échec du chargement");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (scenarioId) => {
        try {
            await base44.entities.Scenario.delete(scenarioId); // Assuming a delete method exists
            toast.success("Scénario supprimé avec succès.");
            loadScenarios(); // Reload scenarios after deletion
        } catch (error) {
            console.error("Erreur suppression scénario:", error);
            toast.error("Échec de la suppression du scénario.");
        }
    };

    useEffect(() => {
        loadScenarios();
    }, []);

    const handleScenarioCreated = () => {
        setShowAddModal(false);
        loadScenarios();
    };

    if (isLoading) {
        return <LoadingTransition message="Chargement du générateur de scénarios..." />;
    }

    return (
        <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Générateur de Scénarios", href: "ScenarioGenerator" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader 
                    icon={<BrainCircuit className="w-8 h-8 text-purple-400" />}
                    title="Générateur de Scénarios"
                    subtitle="Création et analyse de scénarios stratégiques"
                    actions={
                        <div className="flex gap-2">
                            <NeaButton variant="secondary" onClick={loadScenarios}>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Actualiser
                            </NeaButton>
                            <NeaButton onClick={() => setShowAddModal(true)}>
                                <BrainCircuit className="w-4 h-4 mr-2" />
                                Nouveau Scénario
                            </NeaButton>
                        </div>
                    }
                />
            </motion.div>

            {/* Placeholder for stats cards, if any were to be added */}
            {/* <motion.div variants={itemVariants}>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Stats cards would go here }
                </div>
            </motion.div> */}

            <motion.div variants={itemVariants}>
                <NeaCard className="p-6">
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                        {/* Placeholder for search and filter elements */}
                        {/* <input type="text" placeholder="Rechercher..." className="p-2 border rounded" /> */}
                        {/* <select className="p-2 border rounded">...</select> */}
                    </div>
                </NeaCard>
            </motion.div>

            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-4 border-b border-[var(--nea-border-default)]">
                        <h3 className="font-bold text-gray-900 dark:text-white">
                            {filteredScenarios.length} scénario{filteredScenarios.length > 1 ? 's' : ''}
                        </h3>
                    </div>
                    <div className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredScenarios.map((scenario, index) => (
                            <motion.div
                                key={scenario.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <div className="h-full">
                                    <ScenarioCard scenario={scenario} onDelete={handleDelete} />
                                    
                                    {/* New Collaborative View Link */}
                                    <Link to={`${createPageUrl('CollaborativeScenarioView')}?id=${scenario.id}`}>
                                        <NeaButton
                                            variant="secondary"
                                            size="sm"
                                            className="w-full mt-2"
                                        >
                                            <Users className="w-4 h-4 mr-2" />
                                            Vue Collaborative
                                        </NeaButton>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </NeaCard>
            </motion.div>

            {showAddModal && (
                <AddScenarioModal
                    onClose={() => setShowAddModal(false)}
                    onScenarioCreated={handleScenarioCreated}
                />
            )}
        </motion.div>
    );
}
