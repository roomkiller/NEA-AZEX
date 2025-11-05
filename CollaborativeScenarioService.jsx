
import { base44 } from '@/api/base44Client';

/**
 * SERVICE DE COLLABORATION SUR SCÉNARIOS
 * Gère la collaboration multi-utilisateurs sur les scénarios
 * Version control, commentaires, suggestions, éditions temps réel
 */

class CollaborativeScenarioService {
    constructor() {
        this.activeCollaborators = new Map();
        this.versionHistory = new Map();
    }

    /**
     * Crée une nouvelle version d'un scénario
     */
    async createVersion(scenarioId, modifiedData, options = {}) {
        const {
            changeType = 'User_Edit',
            changeSummary = '',
            commitMessage = '',
            isBranch = false,
            branchName = '',
            branchHypothesis = ''
        } = options;

        try {
            // Récupérer le scénario actuel
            const scenario = await base44.entities.Scenario.filter({ id: scenarioId }, null, 1);
            if (!scenario || scenario.length === 0) {
                throw new Error('Scénario introuvable');
            }

            // Récupérer la dernière version
            const versions = await base44.entities.ScenarioVersion.filter(
                { scenario_id: scenarioId },
                '-version_number',
                1
            );

            const lastVersion = versions.length > 0 ? versions[0] : null;
            const newVersionNumber = lastVersion ? lastVersion.version_number + 1 : 1;

            // Calculer le diff
            const diff = lastVersion 
                ? this.calculateDiff(lastVersion.snapshot_data, modifiedData)
                : { added: [], modified: [], deleted: [] };

            // Créer la nouvelle version
            const user = await base44.auth.me();
            const version = await base44.entities.ScenarioVersion.create({
                scenario_id: scenarioId,
                version_number: newVersionNumber,
                version_name: `v${newVersionNumber}.0${isBranch ? `-${branchName}` : ''}`,
                change_type: changeType,
                change_summary: changeSummary,
                modified_by: user.email,
                snapshot_data: modifiedData,
                diff_from_previous: diff,
                is_current: !isBranch,
                is_branch: isBranch,
                branch_name: branchName,
                branch_hypothesis: branchHypothesis,
                parent_version_id: lastVersion?.id,
                commit_message: commitMessage,
                approval_status: 'Draft',
                reviewers: []
            });

            // Si pas une branche, mettre à jour le scénario principal
            if (!isBranch) {
                // Marquer les anciennes versions comme non-courantes
                if (lastVersion) {
                    await base44.entities.ScenarioVersion.update(lastVersion.id, {
                        is_current: false
                    });
                }

                // Mettre à jour le scénario
                await base44.entities.Scenario.update(scenarioId, modifiedData);
            }

            console.log(`[CollaborativeScenario] Version ${newVersionNumber} created`);
            return version;

        } catch (error) {
            console.error('[CollaborativeScenario] Error creating version:', error);
            throw error;
        }
    }

    /**
     * Calcule les différences entre deux versions
     */
    calculateDiff(oldData, newData) {
        const diff = {
            added: [],
            modified: [],
            deleted: []
        };

        // Comparer les propriétés principales
        const allKeys = new Set([
            ...Object.keys(oldData || {}),
            ...Object.keys(newData || {})
        ]);

        for (const key of allKeys) {
            const oldValue = oldData?.[key];
            const newValue = newData?.[key];

            if (oldValue === undefined && newValue !== undefined) {
                diff.added.push({ field: key, value: JSON.stringify(newValue) });
            } else if (oldValue !== undefined && newValue === undefined) {
                diff.deleted.push({ field: key, value: JSON.stringify(oldValue) });
            } else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                diff.modified.push({
                    field: key,
                    old_value: JSON.stringify(oldValue),
                    new_value: JSON.stringify(newValue)
                });
            }
        }

        return diff;
    }

    /**
     * Ajoute un commentaire sur un scénario
     */
    async addComment(scenarioId, content, options = {}) {
        const {
            targetSection = 'General',
            targetElementId = null,
            mentions = []
        } = options;

        const user = await base44.auth.me();

        const comment = await base44.entities.ScenarioCollaboration.create({
            scenario_id: scenarioId,
            collaboration_type: 'Comment',
            user_email: user.email,
            user_name: user.full_name,
            content,
            target_section: targetSection,
            target_element_id: targetElementId,
            mentions,
            status: 'Pending',
            replies: []
        });

        // Notifier les mentions
        for (const mentionedEmail of mentions) {
            await this.notifyUser(mentionedEmail, {
                title: `Vous avez été mentionné dans un scénario`,
                message: `${user.full_name} vous a mentionné: "${content.substring(0, 100)}..."`,
                scenario_id: scenarioId,
                collaboration_id: comment.id
            });
        }

        return comment;
    }

    /**
     * Propose une édition
     */
    async proposeEdit(scenarioId, editProposal, targetSection = 'General') {
        const user = await base44.auth.me();

        const proposal = await base44.entities.ScenarioCollaboration.create({
            scenario_id: scenarioId,
            collaboration_type: 'Edit',
            user_email: user.email,
            user_name: user.full_name,
            content: `Proposition: ${editProposal.field} → ${editProposal.proposed_value}`,
            target_section: targetSection,
            edit_proposal: editProposal,
            status: 'Pending',
            replies: []
        });

        // Notifier le créateur du scénario
        const scenario = await base44.entities.Scenario.filter({ id: scenarioId }, null, 1);
        if (scenario[0] && scenario[0].created_by !== user.email) {
            await this.notifyUser(scenario[0].created_by, {
                title: `Nouvelle proposition d'édition`,
                message: `${user.full_name} propose de modifier "${editProposal.field}"`,
                scenario_id: scenarioId,
                collaboration_id: proposal.id
            });
        }

        return proposal;
    }

    /**
     * Approuve ou rejette une proposition
     */
    async resolveProposal(proposalId, approved, resolutionNotes = '') {
        const user = await base44.auth.me();
        
        const proposal = await base44.entities.ScenarioCollaboration.filter(
            { id: proposalId },
            null,
            1
        );

        if (!proposal || proposal.length === 0) {
            throw new Error('Proposition introuvable');
        }

        const status = approved ? 'Approved' : 'Rejected';

        await base44.entities.ScenarioCollaboration.update(proposalId, {
            status,
            resolved_by: user.email,
            resolved_at: new Date().toISOString(),
            resolution_notes: resolutionNotes
        });

        // Si approuvé et c'est une édition, appliquer les changements
        if (approved && proposal[0].collaboration_type === 'Edit' && proposal[0].edit_proposal) {
            await this.applyEdit(proposal[0]);
        }

        return { status, applied: approved };
    }

    /**
     * Applique une édition approuvée
     */
    async applyEdit(proposal) {
        const { scenario_id, edit_proposal } = proposal;
        
        try {
            const scenario = await base44.entities.Scenario.filter(
                { id: scenario_id },
                null,
                1
            );

            if (scenario && scenario.length > 0) {
                const updates = {};
                updates[edit_proposal.field] = edit_proposal.proposed_value;

                await base44.entities.Scenario.update(scenario_id, updates);

                // Créer une nouvelle version
                await this.createVersion(scenario_id, {
                    ...scenario[0],
                    ...updates
                }, {
                    changeType: 'Collaboration',
                    changeSummary: `Applied: ${edit_proposal.field}`,
                    commitMessage: `Collaborative edit: ${edit_proposal.justification}`
                });

                await base44.entities.ScenarioCollaboration.update(proposal.id, {
                    status: 'Implemented'
                });
            }
        } catch (error) {
            console.error('[CollaborativeScenario] Error applying edit:', error);
            throw error;
        }
    }

    /**
     * Récupère toutes les collaborations pour un scénario
     */
    async getCollaborations(scenarioId, filters = {}) {
        const { section = null, type = null, status = null } = filters;

        let query = { scenario_id: scenarioId };
        
        if (section) query.target_section = section;
        if (type) query.collaboration_type = type;
        if (status) query.status = status;

        const collaborations = await base44.entities.ScenarioCollaboration.filter(
            query,
            '-created_date'
        );

        return collaborations;
    }

    /**
     * Récupère l'historique des versions
     */
    async getVersionHistory(scenarioId) {
        const versions = await base44.entities.ScenarioVersion.filter(
            { scenario_id: scenarioId, is_branch: false },
            '-version_number'
        );

        return versions;
    }

    /**
     * Récupère les branches what-if
     */
    async getBranches(scenarioId) {
        const branches = await base44.entities.ScenarioVersion.filter(
            { scenario_id: scenarioId, is_branch: true },
            '-created_date'
        );

        return branches;
    }

    /**
     * Restaure une version précédente
     */
    async restoreVersion(versionId) {
        const version = await base44.entities.ScenarioVersion.filter(
            { id: versionId },
            null,
            1
        );

        if (!version || version.length === 0) {
            throw new Error('Version introuvable');
        }

        const versionData = version[0];

        // Créer une nouvelle version basée sur cette version
        return await this.createVersion(
            versionData.scenario_id,
            versionData.snapshot_data,
            {
                changeType: 'Major',
                changeSummary: `Restored to version ${versionData.version_number}`,
                commitMessage: `Rollback to v${versionData.version_number}`
            }
        );
    }

    /**
     * Récupère les collaborateurs actifs
     */
    async getActiveCollaborators(scenarioId) {
        // Récupérer tous ceux qui ont collaboré récemment (24h)
        const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        const collaborations = await base44.entities.ScenarioCollaboration.filter({
            scenario_id: scenarioId
        });

        const recentCollabs = collaborations.filter(c => 
            new Date(c.created_date) >= cutoff
        );

        // Déduplication par email
        const uniqueCollaborators = [...new Set(
            recentCollabs.map(c => c.user_email)
        )];

        return uniqueCollaborators;
    }

    /**
     * Notifie un utilisateur
     */
    async notifyUser(userEmail, notification) {
        try {
            await base44.entities.UserNotification.create({
                user_email: userEmail,
                notification_type: 'Info',
                title: notification.title,
                message: notification.message,
                priority: 'Medium',
                category: 'General',
                metadata: {
                    scenario_id: notification.scenario_id,
                    collaboration_id: notification.collaboration_id
                }
            });
        } catch (error) {
            console.error('[CollaborativeScenario] Error notifying user:', error);
        }
    }

    /**
     * Ajoute une réponse à un commentaire
     */
    async addReply(collaborationId, content) {
        const user = await base44.auth.me();
        
        const collaboration = await base44.entities.ScenarioCollaboration.filter(
            { id: collaborationId },
            null,
            1
        );

        if (!collaboration || collaboration.length === 0) {
            throw new Error('Collaboration introuvable');
        }

        const existingReplies = collaboration[0].replies || [];
        
        const newReply = {
            user_email: user.email,
            user_name: user.full_name,
            content,
            timestamp: new Date().toISOString()
        };

        await base44.entities.ScenarioCollaboration.update(collaborationId, {
            replies: [...existingReplies, newReply]
        });

        // Notifier l'auteur original
        if (collaboration[0].user_email !== user.email) {
            await this.notifyUser(collaboration[0].user_email, {
                title: `Nouvelle réponse à votre commentaire`,
                message: `${user.full_name}: "${content.substring(0, 100)}..."`,
                scenario_id: collaboration[0].scenario_id,
                collaboration_id: collaborationId
            });
        }

        return newReply;
    }

    /**
     * Compare deux versions
     */
    async compareVersions(versionId1, versionId2) {
        const [v1, v2] = await Promise.all([
            base44.entities.ScenarioVersion.filter({ id: versionId1 }, null, 1),
            base44.entities.ScenarioVersion.filter({ id: versionId2 }, null, 1)
        ]);

        if (!v1[0] || !v2[0]) {
            throw new Error('Versions introuvables');
        }

        return this.calculateDiff(v1[0].snapshot_data, v2[0].snapshot_data);
    }

    /**
     * Merge une branche dans le scénario principal
     */
    async mergeBranch(branchVersionId, mergeSummary = '') {
        const branchVersion = await base44.entities.ScenarioVersion.filter(
            { id: branchVersionId },
            null,
            1
        );

        if (!branchVersion || branchVersion.length === 0 || !branchVersion[0].is_branch) {
            throw new Error('Branche invalide');
        }

        const branch = branchVersion[0];

        // Créer une nouvelle version principale avec les données de la branche
        const merged = await this.createVersion(
            branch.scenario_id,
            branch.snapshot_data,
            {
                changeType: 'Major',
                changeSummary: mergeSummary || `Merged branch: ${branch.branch_name}`,
                commitMessage: `Merge branch '${branch.branch_name}' into main`
            }
        );

        // Marquer la branche comme intégrée
        await base44.entities.ScenarioVersion.update(branchVersionId, {
            approval_status: 'Published',
            tags: [...(branch.tags || []), 'merged']
        });

        return merged;
    }
}

// Singleton
const collaborativeScenarioService = new CollaborativeScenarioService();

export default collaborativeScenarioService;
