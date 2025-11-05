import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { FileText, Search, Book, Shield, Download } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import ReactMarkdown from 'react-markdown';

export default function Documentation() {
    const [docs, setDocs] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const { containerVariants, itemVariants } = useStaggerAnimation();

    useEffect(() => {
        const loadDocs = async () => {
            try {
                const data = await base44.entities.Documentation.list('-created_date');
                setDocs(data);
                if (data.length > 0) {
                    setSelectedDoc(data[0]);
                }
            } catch (error) {
                console.error("Erreur chargement documentation:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadDocs();
    }, []);

    const filteredDocs = useMemo(() => {
        let filtered = docs;

        if (searchTerm) {
            filtered = filtered.filter(d => 
                d.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.content?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterCategory !== 'all') {
            filtered = filtered.filter(d => d.category === filterCategory);
        }

        return filtered;
    }, [docs, searchTerm, filterCategory]);

    const stats = useMemo(() => ({
        total: docs.length,
        protocols: docs.filter(d => d.category === 'Protocole').length,
        modules: docs.filter(d => d.category === 'Module').length,
        procedures: docs.filter(d => d.category === 'Procédure').length
    }), [docs]);

    if (isLoading) {
        return <LoadingTransition message="Chargement de la documentation..." />;
    }

    const categoryColors = {
        'Protocole': 'bg-red-500/20 text-red-400',
        'Module': 'bg-blue-500/20 text-blue-400',
        'Procédure': 'bg-green-500/20 text-green-400',
        'Tutoriel': 'bg-purple-500/20 text-purple-400',
        'Architecture': 'bg-yellow-500/20 text-yellow-400'
    };

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[
                    { name: "Documentation" },
                    { name: "Documentation Système", href: "Documentation" }
                ]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<Book className="w-8 h-8 text-blue-400" />}
                    title="Documentation Système"
                    subtitle="Guides et références techniques NEA-AZEX"
                />
            </motion.div>

            <motion.div variants={itemVariants} className="grid md:grid-cols-4 gap-4">
                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Book className="w-5 h-5 text-blue-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-400">{stats.total}</p>
                </NeaCard>
                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-5 h-5 text-red-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Protocoles</p>
                    </div>
                    <p className="text-3xl font-bold text-red-400">{stats.protocols}</p>
                </NeaCard>
                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-5 h-5 text-green-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Procédures</p>
                    </div>
                    <p className="text-3xl font-bold text-green-400">{stats.procedures}</p>
                </NeaCard>
                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Book className="w-5 h-5 text-purple-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Modules</p>
                    </div>
                    <p className="text-3xl font-bold text-purple-400">{stats.modules}</p>
                </NeaCard>
            </motion.div>

            <motion.div variants={itemVariants}>
                <NeaCard className="p-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--nea-text-secondary)]" />
                            <Input
                                placeholder="Rechercher dans la documentation..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={filterCategory} onValueChange={setFilterCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="Catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes les catégories</SelectItem>
                                <SelectItem value="Protocole">Protocole</SelectItem>
                                <SelectItem value="Module">Module</SelectItem>
                                <SelectItem value="Procédure">Procédure</SelectItem>
                                <SelectItem value="Tutoriel">Tutoriel</SelectItem>
                                <SelectItem value="Architecture">Architecture</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </NeaCard>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6">
                <motion.div variants={itemVariants}>
                    <NeaCard>
                        <div className="p-4 border-b border-[var(--nea-border-default)]">
                            <h3 className="font-bold text-gray-900 dark:text-white">
                                Documents ({filteredDocs.length})
                            </h3>
                        </div>
                        <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto styled-scrollbar">
                            {filteredDocs.map((doc, index) => (
                                <motion.div
                                    key={doc.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    onClick={() => setSelectedDoc(doc)}
                                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                                        selectedDoc?.id === doc.id 
                                            ? 'bg-[var(--nea-primary-blue)]/20 border border-[var(--nea-primary-blue)]' 
                                            : 'bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)] hover:border-[var(--nea-primary-blue)]'
                                    }`}
                                >
                                    <div className="flex items-start gap-2 mb-2">
                                        <FileText className="w-4 h-4 text-[var(--nea-text-secondary)] mt-0.5" />
                                        <h4 className="text-sm font-semibold text-[var(--nea-text-title)] flex-1">
                                            {doc.title}
                                        </h4>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className={`${categoryColors[doc.category] || 'bg-gray-500/20 text-gray-400'} border-0 text-xs`}>
                                            {doc.category}
                                        </Badge>
                                        <span className="text-xs text-[var(--nea-text-secondary)]">
                                            v{doc.version}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </NeaCard>
                </motion.div>

                <motion.div variants={itemVariants} className="lg:col-span-2">
                    {selectedDoc ? (
                        <NeaCard>
                            <div className="p-6 border-b border-[var(--nea-border-default)]">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                            {selectedDoc.title}
                                        </h2>
                                        <div className="flex items-center gap-2">
                                            <Badge className={`${categoryColors[selectedDoc.category]} border-0`}>
                                                {selectedDoc.category}
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                Version {selectedDoc.version}
                                            </Badge>
                                            {selectedDoc.related_module && (
                                                <Badge variant="outline" className="text-xs">
                                                    Module: {selectedDoc.related_module}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 prose prose-sm dark:prose-invert max-w-none styled-scrollbar max-h-[600px] overflow-y-auto">
                                <ReactMarkdown>{selectedDoc.content}</ReactMarkdown>
                            </div>
                        </NeaCard>
                    ) : (
                        <NeaCard className="p-12 text-center">
                            <Book className="w-16 h-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                Sélectionnez un document
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Choisissez un document dans la liste pour afficher son contenu
                            </p>
                        </NeaCard>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
}