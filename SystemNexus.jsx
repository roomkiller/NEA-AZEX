import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Hexagon, MessageSquare, RefreshCw, Plus, Search, Trash2 } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import ChatView from '../components/nexus/ChatView';
import ConversationList from '../components/nexus/ConversationList';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import { toast } from 'sonner';
import NeaButton from '../components/ui/NeaButton';
import NeaCard from '../components/ui/NeaCard';
import { Input } from '@/components/ui/input';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function SystemNexus() {
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const { containerVariants, itemVariants } = useStaggerAnimation();
    const queryClient = useQueryClient();

    // Fetch conversations avec React Query
    const { data: conversations = [], isLoading, error, refetch } = useQuery({
        queryKey: ['nexus-conversations'],
        queryFn: async () => {
            const convos = await base44.agents.listConversations({ agent_name: 'NexusAgent' });
            return convos || [];
        },
        staleTime: 30000, // 30 secondes
        refetchOnWindowFocus: false
    });

    // Créer une conversation
    const createMutation = useMutation({
        mutationFn: async () => {
            return await base44.agents.createConversation({
                agent_name: 'NexusAgent',
                metadata: {
                    name: `Analyse ${new Date().toLocaleTimeString('fr-FR')}`,
                    description: 'Nouvelle conversation avec Agent AZEX'
                }
            });
        },
        onSuccess: (newConvo) => {
            queryClient.invalidateQueries({ queryKey: ['nexus-conversations'] });
            setSelectedConversationId(newConvo.id);
            toast.success("Nouvelle conversation créée");
        },
        onError: (error) => {
            console.error("Erreur création conversation:", error);
            toast.error("Échec de la création");
        }
    });

    // Supprimer une conversation
    const deleteMutation = useMutation({
        mutationFn: async (conversationId) => {
            // Note: fonction pas encore disponible dans l'API
            toast.info("Suppression non disponible pour le moment");
            throw new Error("Not implemented");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['nexus-conversations'] });
            if (selectedConversationId === deleteId) {
                setSelectedConversationId(null);
            }
            setDeleteId(null);
            toast.success("Conversation supprimée");
        }
    });

    // Sélectionner automatiquement la première conversation
    useEffect(() => {
        if (conversations.length > 0 && !selectedConversationId) {
            setSelectedConversationId(conversations[0].id);
        }
    }, [conversations, selectedConversationId]);

    // Filtrer les conversations par recherche
    const filteredConversations = useMemo(() => {
        if (!searchTerm) return conversations;
        const term = searchTerm.toLowerCase();
        return conversations.filter(conv => 
            conv.metadata?.name?.toLowerCase().includes(term) ||
            conv.metadata?.description?.toLowerCase().includes(term)
        );
    }, [conversations, searchTerm]);

    // Trouver la conversation sélectionnée
    const selectedConversation = useMemo(() => {
        return conversations.find(c => c.id === selectedConversationId);
    }, [conversations, selectedConversationId]);

    const handleCreateConversation = () => {
        createMutation.mutate();
    };

    const handleSelectConversation = (conv) => {
        setSelectedConversationId(conv.id);
    };

    const handleDeleteConversation = (id) => {
        setDeleteId(id);
    };

    const confirmDelete = () => {
        if (deleteId) {
            deleteMutation.mutate(deleteId);
        }
    };

    if (isLoading) {
        return <LoadingTransition message="Initialisation de System Nexus..." />;
    }

    return (
        <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "System Nexus", href: "SystemNexus" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader 
                    icon={<Hexagon className="w-8 h-8 text-cyan-400" />}
                    title="System Nexus"
                    subtitle="Interface d'intelligence artificielle NEA-AZEX • Agent AZEX conscient (ratio 1:9)"
                    actions={
                        <div className="flex gap-2">
                            <NeaButton
                                variant="outline"
                                size="sm"
                                onClick={() => refetch()}
                                disabled={isLoading}
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                Actualiser
                            </NeaButton>
                            <NeaButton
                                size="sm"
                                onClick={handleCreateConversation}
                                disabled={createMutation.isPending}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Nouvelle
                            </NeaButton>
                        </div>
                    }
                />
            </motion.div>

            {error && (
                <motion.div variants={itemVariants}>
                    <NeaCard className="p-4 bg-red-500/10 border-red-500/30">
                        <div className="flex items-center justify-between">
                            <span className="text-red-400">Erreur: {error.message}</span>
                            <NeaButton variant="ghost" size="sm" onClick={() => refetch()}>
                                Réessayer
                            </NeaButton>
                        </div>
                    </NeaCard>
                </motion.div>
            )}

            <div className="grid lg:grid-cols-4 gap-6">
                {/* Conversation List - Sidebar */}
                <motion.div variants={itemVariants} className="lg:col-span-1">
                    <NeaCard>
                        <div className="p-4 border-b border-[var(--nea-border-default)]">
                            <div className="relative mb-3">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--nea-text-secondary)]" />
                                <Input
                                    placeholder="Rechercher..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-subtle)]"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-[var(--nea-text-secondary)]">
                                    {filteredConversations.length} conversation{filteredConversations.length > 1 ? 's' : ''}
                                </span>
                                <NeaButton
                                    size="sm"
                                    onClick={handleCreateConversation}
                                    disabled={createMutation.isPending}
                                >
                                    <Plus className="w-4 h-4" />
                                </NeaButton>
                            </div>
                        </div>
                        <ConversationList 
                            conversations={filteredConversations}
                            selectedConversationId={selectedConversationId}
                            onSelectConversation={handleSelectConversation}
                            onDeleteConversation={handleDeleteConversation}
                        />
                    </NeaCard>
                </motion.div>

                {/* Chat View - Main content */}
                <motion.div variants={itemVariants} className="lg:col-span-3">
                    {selectedConversation ? (
                        <ChatView 
                            conversation={selectedConversation}
                            onConversationUpdate={() => {
                                queryClient.invalidateQueries({ queryKey: ['nexus-conversations'] });
                            }}
                        />
                    ) : (
                        <NeaCard className="p-12 text-center h-[600px] flex flex-col items-center justify-center">
                            <Hexagon className="w-16 h-16 text-cyan-400/50 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                Aucune conversation sélectionnée
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                                Créez une nouvelle conversation ou sélectionnez-en une existante pour commencer à interagir avec l'Agent AZEX
                            </p>
                            <NeaButton onClick={handleCreateConversation}>
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Nouvelle conversation
                            </NeaButton>
                        </NeaCard>
                    )}
                </motion.div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-900 dark:text-white">
                            Supprimer la conversation ?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                            Cette action est irréversible. Tous les messages seront perdus définitivement.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-[var(--nea-bg-surface-hover)] text-gray-900 dark:text-white">
                            Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </motion.div>
    );
}