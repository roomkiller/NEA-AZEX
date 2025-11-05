import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NeaCard from '../ui/NeaCard';
import NeaButton from '../ui/NeaButton';
import MessageBubble from './MessageBubble';
import { Send, Loader2, Paperclip, X, AlertCircle, MessageSquare, Download, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function ChatView({ conversation, onConversationUpdate }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const inputRef = useRef(null);

    // Subscribe to conversation updates
    useEffect(() => {
        if (!conversation) {
            setMessages([]);
            return;
        }

        setError(null);
        
        try {
            const unsubscribe = base44.agents.subscribeToConversation(
                conversation.id,
                (data) => {
                    if (data && data.messages) {
                        setMessages(data.messages);
                    }
                }
            );

            return () => {
                if (unsubscribe && typeof unsubscribe === 'function') {
                    unsubscribe();
                }
            };
        } catch (err) {
            console.error("Erreur souscription conversation:", err);
            setError("Impossible de charger la conversation");
        }
    }, [conversation]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when conversation changes
    useEffect(() => {
        if (conversation && inputRef.current) {
            inputRef.current.focus();
        }
    }, [conversation]);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            // Limit to 5 files
            if (selectedFiles.length + files.length > 5) {
                toast.error("Maximum 5 fichiers autorisés");
                return;
            }
            setSelectedFiles(prev => [...prev, ...files]);
            toast.success(`${files.length} fichier(s) ajouté(s)`);
        }
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSend = useCallback(async () => {
        if ((!input.trim() && selectedFiles.length === 0) || isSending || !conversation) return;

        const messageContent = input.trim();
        setIsSending(true);
        setError(null);

        try {
            let fileUrls = [];
            
            // Upload files if any
            if (selectedFiles.length > 0) {
                const uploadPromises = selectedFiles.map(async (file) => {
                    try {
                        const result = await base44.integrations.Core.UploadFile({ file });
                        return result.file_url;
                    } catch (err) {
                        console.error("Erreur upload fichier:", err);
                        throw new Error(`Échec upload: ${file.name}`);
                    }
                });
                
                fileUrls = await Promise.all(uploadPromises);
            }

            // Send message
            await base44.agents.addMessage(conversation, {
                role: 'user',
                content: messageContent || '(fichiers attachés)',
                file_urls: fileUrls.length > 0 ? fileUrls : undefined
            });

            // Clear inputs
            setInput('');
            setSelectedFiles([]);
            
            // Notify parent
            if (onConversationUpdate) {
                onConversationUpdate();
            }
        } catch (error) {
            console.error("Erreur envoi message:", error);
            const errorMessage = error.message || "Échec de l'envoi";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsSending(false);
        }
    }, [input, selectedFiles, isSending, conversation, onConversationUpdate]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const exportConversation = () => {
        const exportData = {
            conversation: conversation.metadata,
            messages: messages,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nexus-${conversation.id}-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Conversation exportée");
    };

    // Filter messages by search
    const filteredMessages = searchTerm 
        ? messages.filter(m => m.content?.toLowerCase().includes(searchTerm.toLowerCase()))
        : messages;

    if (!conversation) {
        return (
            <NeaCard className="flex items-center justify-center h-[600px]">
                <div className="text-center">
                    <MessageSquare className="w-16 h-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                        Sélectionnez une conversation pour commencer
                    </p>
                </div>
            </NeaCard>
        );
    }

    return (
        <NeaCard className="flex flex-col h-[600px]">
            {/* Header */}
            <div className="p-4 border-b border-[var(--nea-border-default)] bg-[var(--nea-bg-surface-hover)]">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white">
                            {conversation.metadata?.name || 'Conversation'}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            Agent AZEX • {messages.length} messages
                            {isSending && <span className="ml-2 text-cyan-400">• En cours d'analyse...</span>}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <NeaButton
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            title="Rechercher dans la conversation"
                        >
                            <Search className="w-4 h-4" />
                        </NeaButton>
                        <NeaButton
                            variant="ghost"
                            size="icon"
                            onClick={exportConversation}
                            title="Exporter la conversation"
                        >
                            <Download className="w-4 h-4" />
                        </NeaButton>
                    </div>
                </div>

                {/* Search bar */}
                <AnimatePresence>
                    {isSearchOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-3 overflow-hidden"
                        >
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--nea-text-secondary)]" />
                                <Input
                                    placeholder="Rechercher dans les messages..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-[var(--nea-bg-surface)] border-[var(--nea-border-subtle)]"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Error banner */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-3 bg-red-500/10 border-b border-red-500/30 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-400" />
                            <span className="text-sm text-red-400 flex-1">{error}</span>
                            <button 
                                onClick={() => setError(null)}
                                className="text-red-400 hover:text-red-300"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 styled-scrollbar">
                {filteredMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <MessageSquare className="w-12 h-12 text-gray-600 dark:text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                {searchTerm ? 'Aucun message trouvé' : 'Commencez la conversation avec l\'Agent AZEX'}
                            </p>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="text-cyan-400 text-sm mt-2 hover:underline"
                                >
                                    Effacer la recherche
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filteredMessages.map((message, index) => (
                            <motion.div
                                key={index}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <MessageBubble message={message} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Selected files preview */}
            <AnimatePresence>
                {selectedFiles.length > 0 && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 py-2 border-t border-[var(--nea-border-subtle)] bg-[var(--nea-bg-surface-hover)] overflow-hidden"
                    >
                        <div className="flex flex-wrap gap-2">
                            {selectedFiles.map((file, index) => (
                                <motion.div
                                    key={index}
                                    layout
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="flex items-center gap-2 bg-[var(--nea-bg-surface)] px-3 py-1.5 rounded-lg border border-[var(--nea-border-default)]"
                                >
                                    <Paperclip className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                                    <span className="text-xs text-gray-900 dark:text-white truncate max-w-[150px]">
                                        {file.name}
                                    </span>
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Input */}
            <div className="p-4 border-t border-[var(--nea-border-default)]">
                <div className="flex gap-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                    <NeaButton
                        variant="ghost"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isSending}
                        title="Attacher un fichier"
                    >
                        <Paperclip className="w-4 h-4" />
                    </NeaButton>
                    <Input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Message à l'Agent AZEX..."
                        disabled={isSending}
                        className="flex-1 bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-gray-900 dark:text-white"
                    />
                    <NeaButton
                        onClick={handleSend}
                        disabled={(!input.trim() && selectedFiles.length === 0) || isSending}
                        title="Envoyer le message"
                    >
                        {isSending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </NeaButton>
                </div>
            </div>
        </NeaCard>
    );
}