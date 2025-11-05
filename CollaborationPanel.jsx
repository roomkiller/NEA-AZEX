
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Edit, CheckCircle, XCircle, Reply, Pin, User, Clock } from 'lucide-react';
import NeaCard from '../ui/NeaCard';
import NeaButton from '../ui/NeaButton';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import collaborativeScenarioService from '../ai/CollaborativeScenarioService';

export default function CollaborationPanel({ scenarioId, onUpdate }) {
    const [collaborations, setCollaborations] = useState([]);
    const [activeCollaborators, setActiveCollaborators] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [selectedSection, setSelectedSection] = useState('General');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');

    useEffect(() => {
        loadCollaborations();
        loadActiveCollaborators();
        
        const interval = setInterval(() => {
            loadCollaborations();
            loadActiveCollaborators();
        }, 10000); // Refresh every 10s

        return () => clearInterval(interval);
    }, [scenarioId, filterType, filterStatus]);

    const loadCollaborations = async () => {
        try {
            const filters = {};
            if (filterType !== 'all') filters.type = filterType;
            if (filterStatus !== 'all') filters.status = filterStatus;

            const data = await collaborativeScenarioService.getCollaborations(
                scenarioId,
                filters
            );
            setCollaborations(data);
        } catch (error) {
            console.error('Error loading collaborations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadActiveCollaborators = async () => {
        try {
            const collaborators = await collaborativeScenarioService.getActiveCollaborators(scenarioId);
            setActiveCollaborators(collaborators);
        } catch (error) {
            console.error('Error loading collaborators:', error);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            await collaborativeScenarioService.addComment(scenarioId, newComment, {
                targetSection: selectedSection
            });
            setNewComment('');
            toast.success('Commentaire ajouté');
            loadCollaborations();
            if (onUpdate) onUpdate();
        } catch (error) {
            toast.error('Erreur lors de l\'ajout du commentaire');
        }
    };

    const handleResolve = async (collaborationId, approved) => {
        try {
            await collaborativeScenarioService.resolveProposal(collaborationId, approved);
            toast.success(approved ? 'Proposition approuvée' : 'Proposition rejetée');
            loadCollaborations();
            if (onUpdate) onUpdate();
        } catch (error) {
            toast.error('Erreur lors de la résolution');
        }
    };

    const handleAddReply = async (collaborationId) => {
        if (!replyContent.trim()) return;

        try {
            await collaborativeScenarioService.addReply(collaborationId, replyContent);
            setReplyContent('');
            setReplyingTo(null);
            toast.success('Réponse ajoutée');
            loadCollaborations();
        } catch (error) {
            console.error('Error adding reply:', error);
            toast.error('Erreur lors de l\'ajout de la réponse');
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'Comment': return MessageSquare;
            case 'Edit': return Edit;
            case 'Suggestion': return MessageSquare;
            default: return MessageSquare;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'Comment': return 'text-blue-400';
            case 'Edit': return 'text-purple-400';
            case 'Suggestion': return 'text-cyan-400';
            case 'Question': return 'text-yellow-400';
            default: return 'text-gray-400';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-500/20 text-yellow-400';
            case 'Approved': return 'bg-green-500/20 text-green-400';
            case 'Rejected': return 'bg-red-500/20 text-red-400';
            case 'Implemented': return 'bg-blue-500/20 text-blue-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    return (
        <div className="space-y-4">
            {/* Active Collaborators */}
            <NeaCard className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-purple-400" />
                        <div>
                            <p className="text-sm font-semibold text-[var(--nea-text-primary)]">
                                Collaborateurs Actifs
                            </p>
                            <p className="text-xs text-[var(--nea-text-secondary)]">
                                {activeCollaborators.length} utilisateur(s) récent(s)
                            </p>
                        </div>
                    </div>
                    <div className="flex -space-x-2">
                        {activeCollaborators.slice(0, 5).map((email, i) => (
                            <div
                                key={i}
                                className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 border-2 border-[var(--nea-bg-surface)] flex items-center justify-center"
                                title={email}
                            >
                                <span className="text-xs font-bold text-purple-400">
                                    {email.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </NeaCard>

            {/* New Comment */}
            <NeaCard className="p-4">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-blue-400" />
                        <h4 className="font-semibold text-[var(--nea-text-primary)]">
                            Ajouter un Commentaire
                        </h4>
                    </div>
                    <Select value={selectedSection} onValueChange={setSelectedSection}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="General">Général</SelectItem>
                            <SelectItem value="Phase_1">Phase 1</SelectItem>
                            <SelectItem value="Phase_2">Phase 2</SelectItem>
                            <SelectItem value="Phase_3">Phase 3</SelectItem>
                            <SelectItem value="Phase_4">Phase 4</SelectItem>
                            <SelectItem value="Phase_5">Phase 5</SelectItem>
                            <SelectItem value="Actors">Acteurs</SelectItem>
                            <SelectItem value="Risk_Assessment">Évaluation Risques</SelectItem>
                            <SelectItem value="Cascade_Effects">Effets Cascade</SelectItem>
                        </SelectContent>
                    </Select>
                    <Textarea
                        placeholder="Votre commentaire ou suggestion... (utilisez @email pour mentionner)"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                    />
                    <NeaButton onClick={handleAddComment} disabled={!newComment.trim()}>
                        Publier le Commentaire
                    </NeaButton>
                </div>
            </NeaCard>

            {/* Filters */}
            <div className="flex gap-3">
                <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-40">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous types</SelectItem>
                        <SelectItem value="Comment">Commentaires</SelectItem>
                        <SelectItem value="Edit">Éditions</SelectItem>
                        <SelectItem value="Suggestion">Suggestions</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous statuts</SelectItem>
                        <SelectItem value="Pending">En attente</SelectItem>
                        <SelectItem value="Approved">Approuvé</SelectItem>
                        <SelectItem value="Rejected">Rejeté</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Collaborations List */}
            <div className="space-y-3">
                <AnimatePresence>
                    {collaborations.map((collab, index) => {
                        const TypeIcon = getTypeIcon(collab.collaboration_type);
                        
                        return (
                            <motion.div
                                key={collab.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <NeaCard className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg bg-[var(--nea-bg-surface)] ${getTypeColor(collab.collaboration_type)}`}>
                                            <TypeIcon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <span className="font-semibold text-[var(--nea-text-primary)] text-sm">
                                                    {collab.user_name}
                                                </span>
                                                <Badge className={`${getStatusColor(collab.status)} border-0 text-xs`}>
                                                    {collab.status}
                                                </Badge>
                                                <Badge variant="outline" className="text-xs">
                                                    {collab.target_section.replace(/_/g, ' ')}
                                                </Badge>
                                                <span className="text-xs text-[var(--nea-text-secondary)] flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(collab.created_date).toLocaleString('fr-FR')}
                                                </span>
                                                {collab.is_pinned && (
                                                    <Pin className="w-3 h-3 text-yellow-400" />
                                                )}
                                            </div>

                                            <p className="text-sm text-[var(--nea-text-primary)] mb-2">
                                                {collab.content}
                                            </p>

                                            {/* Edit Proposal */}
                                            {collab.edit_proposal && (
                                                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 mb-2">
                                                    <p className="text-xs font-semibold text-purple-400 mb-1">
                                                        Proposition d'Édition
                                                    </p>
                                                    <div className="text-xs text-[var(--nea-text-secondary)] space-y-1">
                                                        <p><strong>Champ:</strong> {collab.edit_proposal.field}</p>
                                                        <p><strong>Actuel:</strong> {collab.edit_proposal.original_value}</p>
                                                        <p><strong>Proposé:</strong> {collab.edit_proposal.proposed_value}</p>
                                                        <p><strong>Justification:</strong> {collab.edit_proposal.justification}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Replies */}
                                            {collab.replies && collab.replies.length > 0 && (
                                                <div className="ml-4 pl-4 border-l-2 border-[var(--nea-border-subtle)] space-y-2 mb-2">
                                                    {collab.replies.map((reply, idx) => (
                                                        <div key={idx} className="text-xs">
                                                            <span className="font-semibold text-[var(--nea-text-primary)]">
                                                                {reply.user_name}:
                                                            </span>
                                                            <span className="text-[var(--nea-text-secondary)] ml-2">
                                                                {reply.content}
                                                            </span>
                                                            <span className="text-[var(--nea-text-muted)] ml-2">
                                                                {new Date(reply.timestamp).toLocaleTimeString('fr-FR')}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Reply Form */}
                                            {replyingTo === collab.id && (
                                                <div className="mt-2 space-y-2">
                                                    <Textarea
                                                        placeholder="Votre réponse..."
                                                        value={replyContent}
                                                        onChange={(e) => setReplyContent(e.target.value)}
                                                        rows={2}
                                                        className="text-sm"
                                                    />
                                                    <div className="flex gap-2">
                                                        <NeaButton
                                                            size="sm"
                                                            onClick={() => handleAddReply(collab.id)}
                                                        >
                                                            Envoyer
                                                        </NeaButton>
                                                        <NeaButton
                                                            size="sm"
                                                            variant="secondary"
                                                            onClick={() => {
                                                                setReplyingTo(null);
                                                                setReplyContent('');
                                                            }}
                                                        >
                                                            Annuler
                                                        </NeaButton>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="flex gap-2 mt-3">
                                                <NeaButton
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setReplyingTo(collab.id)}
                                                >
                                                    <Reply className="w-3 h-3 mr-1" />
                                                    Répondre
                                                </NeaButton>

                                                {collab.collaboration_type === 'Edit' && collab.status === 'Pending' && (
                                                    <>
                                                        <NeaButton
                                                            size="sm"
                                                            variant="success"
                                                            onClick={() => handleResolve(collab.id, true)}
                                                        >
                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                            Approuver
                                                        </NeaButton>
                                                        <NeaButton
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleResolve(collab.id, false)}
                                                        >
                                                            <XCircle className="w-3 h-3 mr-1" />
                                                            Rejeter
                                                        </NeaButton>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </NeaCard>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {collaborations.length === 0 && !isLoading && (
                    <NeaCard className="p-8 text-center">
                        <MessageSquare className="w-12 h-12 text-[var(--nea-text-secondary)] mx-auto mb-3" />
                        <p className="text-[var(--nea-text-secondary)]">
                            Aucune collaboration pour le moment
                        </p>
                    </NeaCard>
                )}
            </div>
        </div>
    );
}
