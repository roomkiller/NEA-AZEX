
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Power, TestTube, Save, AlertTriangle, CheckCircle } from 'lucide-react';
import NeaCard from '../ui/NeaCard';
import NeaButton from '../ui/NeaButton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ModulePerformanceMonitor from './ModulePerformanceMonitor';
import ModuleDependencyGraph from './ModuleDependencyGraph';
import ModuleVersionHistory from './ModuleVersionHistory';

export default function ModuleDetailsModal({ module, modules, onClose, onUpdate, onAction }) {
    const [editedModule, setEditedModule] = useState({ ...module });
    const [hasChanges, setHasChanges] = useState(false);
    const [activeTab, setActiveTab] = useState('general');

    const handleChange = (field, value) => {
        setEditedModule(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const handleSave = () => {
        onUpdate(module.id, editedModule);
        setHasChanges(false);
    };

    // Analyse des dépendances (modules du même domaine)
    const relatedModules = useMemo(() => {
        return modules.filter(m => 
            m.id !== module.id && 
            m.category === module.category
        );
    }, [modules, module]);

    // Recommandations basées sur le statut
    const recommendations = useMemo(() => {
        const recs = [];
        if (module.status === 'Disabled') {
            recs.push({
                type: 'warning',
                message: 'Ce module est désactivé. Les fonctionnalités associées ne sont pas disponibles.'
            });
        }
        if (module.status === 'Testing') {
            recs.push({
                type: 'info',
                message: 'Mode test activé. Les données peuvent être instables.'
            });
        }
        if (relatedModules.some(m => m.status === 'Disabled')) {
            recs.push({
                type: 'warning',
                message: `${relatedModules.filter(m => m.status === 'Disabled').length} module(s) connexe(s) désactivé(s) dans ${module.category}.`
            });
        }
        const lastAudit = new Date(module.last_audit);
        const daysSinceAudit = (Date.now() - lastAudit.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceAudit > 30) {
            recs.push({
                type: 'warning',
                message: `Dernier audit: ${Math.floor(daysSinceAudit)} jours. Audit recommandé.`
            });
        }
        return recs;
    }, [module, relatedModules]);

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-6xl max-h-[90vh] overflow-y-auto styled-scrollbar"
                >
                    <NeaCard className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-[var(--nea-text-title)] mb-2">
                                    {module.name}
                                </h2>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-blue-500/20 text-blue-400 border-0">
                                        {module.category}
                                    </Badge>
                                    <Badge className={`border-0 ${
                                        module.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                                        module.status === 'Standby' ? 'bg-yellow-500/20 text-yellow-400' :
                                        module.status === 'Testing' ? 'bg-orange-500/20 text-orange-400' :
                                        'bg-gray-500/20 text-gray-400'
                                    }`}>
                                        {module.status}
                                    </Badge>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2 mb-6 border-b border-[var(--nea-border-default)]">
                            <button
                                onClick={() => setActiveTab('general')}
                                className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
                                    activeTab === 'general'
                                        ? 'border-cyan-500 text-cyan-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                Général
                            </button>
                            <button
                                onClick={() => setActiveTab('performance')}
                                className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
                                    activeTab === 'performance'
                                        ? 'border-cyan-500 text-cyan-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                Performance
                            </button>
                            <button
                                onClick={() => setActiveTab('dependencies')}
                                className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
                                    activeTab === 'dependencies'
                                        ? 'border-cyan-500 text-cyan-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                Dépendances
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
                                    activeTab === 'history'
                                        ? 'border-cyan-500 text-cyan-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                Historique
                            </button>
                        </div>

                        {/* Tab Content */}
                        <AnimatePresence mode="wait">
                            {activeTab === 'general' && (
                                <motion.div
                                    key="general"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    {/* Recommendations */}
                                    {recommendations.length > 0 && (
                                        <div className="space-y-2 mb-6">
                                            {recommendations.map((rec, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`p-3 rounded-lg border ${
                                                        rec.type === 'warning' 
                                                            ? 'bg-yellow-500/10 border-yellow-500/30' 
                                                            : 'bg-blue-500/10 border-blue-500/30'
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-2">
                                                        {rec.type === 'warning' ? (
                                                            <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
                                                        ) : (
                                                            <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5" />
                                                        )}
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {rec.message}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Actions rapides */}
                                    <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-[var(--nea-border-default)]">
                                        {module.status !== 'Active' && (
                                            <NeaButton
                                                size="sm"
                                                onClick={() => onAction('activate', module)}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                <Play className="w-4 h-4 mr-2" />
                                                Activer
                                            </NeaButton>
                                        )}
                                        {module.status !== 'Standby' && (
                                            <NeaButton
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onAction('pause', module)}
                                            >
                                                <Pause className="w-4 h-4 mr-2" />
                                                Pause
                                            </NeaButton>
                                        )}
                                        {module.status !== 'Testing' && (
                                            <NeaButton
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onAction('test', module)}
                                            >
                                                <TestTube className="w-4 h-4 mr-2" />
                                                Mode Test
                                            </NeaButton>
                                        )}
                                        {module.status !== 'Disabled' && (
                                            <NeaButton
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onAction('deactivate', module)}
                                                className="text-red-400 border-red-400 hover:bg-red-500/10"
                                            >
                                                <Power className="w-4 h-4 mr-2" />
                                                Désactiver
                                            </NeaButton>
                                        )}
                                    </div>

                                    {/* Form fields */}
                                    <div className="space-y-4 mb-6">
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--nea-text-primary)] mb-2">
                                                Nom du module
                                            </label>
                                            <Input
                                                value={editedModule.name}
                                                onChange={(e) => handleChange('name', e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[var(--nea-text-primary)] mb-2">
                                                Description
                                            </label>
                                            <Textarea
                                                value={editedModule.description}
                                                onChange={(e) => handleChange('description', e.target.value)}
                                                rows={3}
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-[var(--nea-text-primary)] mb-2">
                                                    Catégorie
                                                </label>
                                                <Select
                                                    value={editedModule.category}
                                                    onValueChange={(value) => handleChange('category', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="GÉOPOLITIQUE">Géopolitique</SelectItem>
                                                        <SelectItem value="NUCLÉAIRE">Nucléaire</SelectItem>
                                                        <SelectItem value="CLIMAT">Climat</SelectItem>
                                                        <SelectItem value="BIOLOGIE">Biologie</SelectItem>
                                                        <SelectItem value="CYBERNÉTIQUE">Cybernétique</SelectItem>
                                                        <SelectItem value="SUPERVISION">Supervision</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-[var(--nea-text-primary)] mb-2">
                                                    Version
                                                </label>
                                                <Input
                                                    value={editedModule.version}
                                                    onChange={(e) => handleChange('version', e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-[var(--nea-text-primary)] mb-2">
                                                    Statut
                                                </label>
                                                <Select
                                                    value={editedModule.status}
                                                    onValueChange={(value) => handleChange('status', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Active">Actif</SelectItem>
                                                        <SelectItem value="Standby">En pause</SelectItem>
                                                        <SelectItem value="Testing">En test</SelectItem>
                                                        <SelectItem value="Disabled">Désactivé</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Related modules */}
                                    {relatedModules.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="text-lg font-bold text-[var(--nea-text-title)] mb-3">
                                                Modules connexes ({relatedModules.length})
                                            </h3>
                                            <div className="grid md:grid-cols-2 gap-2">
                                                {relatedModules.map(rm => (
                                                    <div
                                                        key={rm.id}
                                                        className="p-3 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-medium text-[var(--nea-text-primary)]">
                                                                {rm.name}
                                                            </span>
                                                            <Badge className={`text-xs border-0 ${
                                                                rm.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                                                                rm.status === 'Standby' ? 'bg-yellow-500/20 text-yellow-400' :
                                                                'bg-gray-500/20 text-gray-400'
                                                            }`}>
                                                                {rm.status}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'performance' && (
                                <motion.div
                                    key="performance"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <ModulePerformanceMonitor module={module} modules={modules} />
                                </motion.div>
                            )}

                            {activeTab === 'dependencies' && (
                                <motion.div
                                    key="dependencies"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <ModuleDependencyGraph module={module} allModules={modules} />
                                </motion.div>
                            )}

                            {activeTab === 'history' && (
                                <motion.div
                                    key="history"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <ModuleVersionHistory 
                                        module={module} 
                                        onRestore={(version) => {
                                            onUpdate(module.id, version);
                                        }}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Footer actions */}
                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-[var(--nea-border-default)]">
                            <NeaButton
                                variant="outline"
                                onClick={onClose}
                            >
                                Fermer
                            </NeaButton>
                            {hasChanges && activeTab === 'general' && (
                                <NeaButton onClick={handleSave}>
                                    <Save className="w-4 h-4 mr-2" />
                                    Enregistrer
                                </NeaButton>
                            )}
                        </div>
                    </NeaCard>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
