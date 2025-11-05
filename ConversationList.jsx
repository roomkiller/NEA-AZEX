import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Trash2, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import NeaButton from '../ui/NeaButton';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ConversationList({ 
    conversations = [], 
    selectedConversationId, 
    onSelectConversation, 
    onDeleteConversation 
}) {
    if (!conversations || conversations.length === 0) {
        return (
            <div className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-600 dark:text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Aucune conversation
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                    Créez une conversation pour commencer
                </p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-[var(--nea-border-subtle)] max-h-[600px] overflow-y-auto styled-scrollbar">
            <AnimatePresence mode="popLayout">
                {conversations.map((conv, index) => {
                    const isSelected = selectedConversationId === conv.id;
                    const messageCount = conv.messages?.length || 0;
                    const lastMessage = conv.messages?.[conv.messages.length - 1];
                    const timeAgo = conv.created_date ? 
                        formatDistanceToNow(new Date(conv.created_date), { 
                            addSuffix: true, 
                            locale: fr 
                        }) : '';

                    return (
                        <motion.div
                            key={conv.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20, height: 0 }}
                            transition={{ 
                                delay: index * 0.03,
                                layout: { duration: 0.2 }
                            }}
                            className={`p-4 cursor-pointer transition-all group ${
                                isSelected
                                    ? 'bg-[var(--nea-primary-blue)]/10 border-l-4 border-[var(--nea-primary-blue)]'
                                    : 'hover:bg-[var(--nea-bg-surface-hover)] border-l-4 border-transparent'
                            }`}
                            onClick={() => onSelectConversation(conv)}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    {/* Title */}
                                    <h4 className={`font-semibold text-sm truncate mb-1 transition-colors ${
                                        isSelected 
                                            ? 'text-[var(--nea-primary-blue)]' 
                                            : 'text-gray-900 dark:text-white group-hover:text-[var(--nea-primary-blue)]'
                                    }`}>
                                        {conv.metadata?.name || 'Sans titre'}
                                    </h4>
                                    
                                    {/* Last message preview */}
                                    {lastMessage && (
                                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate mb-2">
                                            {lastMessage.role === 'user' ? '👤 ' : '🤖 '}
                                            {lastMessage.content?.substring(0, 50) || '...'}
                                        </p>
                                    )}
                                    
                                    {/* Metadata */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Badge className={`border-0 text-xs ${
                                            isSelected 
                                                ? 'bg-[var(--nea-primary-blue)]/30 text-[var(--nea-primary-blue)]'
                                                : 'bg-[var(--nea-primary-blue)]/20 text-[var(--nea-primary-blue)]'
                                        }`}>
                                            <MessageSquare className="w-3 h-3 mr-1" />
                                            {messageCount}
                                        </Badge>
                                        {timeAgo && (
                                            <span className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {timeAgo}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Delete button */}
                                <NeaButton
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteConversation(conv.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                    title="Supprimer"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </NeaButton>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}