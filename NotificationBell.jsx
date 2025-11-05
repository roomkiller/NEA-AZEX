import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import { Badge } from '@/components/ui/badge';

/**
 * NOTIFICATION BELL
 * Centre de notifications avec badge de compteur
 */
export default function NotificationBell({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onClear,
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);

  useOnClickOutside(panelRef, () => setIsOpen(false));

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'success':
        return <Check className="w-4 h-4 text-green-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-[var(--nea-bg-surface-hover)] rounded-lg transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} non lue(s)` : ''}`}
        aria-expanded={isOpen}
      >
        <Bell className="w-5 h-5 text-[var(--nea-text-primary)]" />
        
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
          >
            <span className="text-white text-xs font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </motion.div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-80 max-h-[500px] overflow-hidden rounded-lg border border-[var(--nea-border-default)] bg-[var(--nea-bg-surface)] shadow-xl z-50"
            role="dialog"
            aria-label="Panneau de notifications"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--nea-border-default)]">
              <h3 className="font-bold text-[var(--nea-text-title)]">
                Notifications
                {unreadCount > 0 && (
                  <Badge className="ml-2 bg-red-500/20 text-red-400 border-0">
                    {unreadCount}
                  </Badge>
                )}
              </h3>
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMarkAllAsRead}
                  className="text-xs"
                >
                  Tout marquer lu
                </Button>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-[400px] styled-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-[var(--nea-text-muted)] mx-auto mb-3" />
                  <p className="text-sm text-[var(--nea-text-secondary)]">
                    Aucune notification
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--nea-border-subtle)]">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={cn(
                        "p-4 hover:bg-[var(--nea-bg-surface-hover)] transition-colors cursor-pointer",
                        !notification.read && "bg-blue-500/5"
                      )}
                      onClick={() => onMarkAsRead?.(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--nea-text-primary)] mb-1">
                            {notification.title}
                          </p>
                          <p className="text-xs text-[var(--nea-text-secondary)]">
                            {notification.message}
                          </p>
                          <p className="text-xs text-[var(--nea-text-muted)] mt-2">
                            {notification.timestamp && new Date(notification.timestamp).toLocaleString('fr-FR')}
                          </p>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onClear?.(notification.id);
                          }}
                          className="p-1 hover:bg-red-500/20 rounded transition-colors"
                        >
                          <X className="w-3 h-3 text-[var(--nea-text-muted)]" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}