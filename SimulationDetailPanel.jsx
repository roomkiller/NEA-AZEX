import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NeaCard from '../ui/NeaCard';
import { X, MapPin, Users, AlertTriangle, Calendar, Info } from 'lucide-react';
import NeaButton from '../ui/NeaButton';
import { Badge } from '@/components/ui/badge';

const SEVERITY_CONFIG = {
  'Faible': { color: 'text-blue-400', bg: 'bg-blue-500/20' },
  'Modéré': { color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  'Élevé': { color: 'text-orange-400', bg: 'bg-orange-500/20' },
  'Critique': { color: 'text-red-400', bg: 'bg-red-500/20' },
  'Catastrophique': { color: 'text-purple-400', bg: 'bg-purple-500/20' }
};

export default function SimulationDetailPanel({ simulation, onClose }) {
  if (!simulation) return null;

  const severityConfig = SEVERITY_CONFIG[simulation.severity_level] || SEVERITY_CONFIG['Modéré'];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl"
        >
          <NeaCard>
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{simulation.simulation_name}</h2>
                  <Badge className={`${severityConfig.bg} ${severityConfig.color} border-0`}>
                    {simulation.severity_level}
                  </Badge>
                </div>
                <button
                  onClick={onClose}
                  className="text-[var(--nea-text-secondary)] hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-5 h-5 text-[var(--nea-primary-blue)]" />
                    <h3 className="font-semibold text-white">Informations</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-[var(--nea-text-secondary)]">Type de crise</p>
                      <p className="text-white font-medium">{simulation.crisis_type}</p>
                    </div>
                    <div>
                      <p className="text-[var(--nea-text-secondary)]">Statut</p>
                      <p className="text-white font-medium">{simulation.status}</p>
                    </div>
                  </div>
                </div>

                {simulation.location && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-5 h-5 text-[var(--nea-primary-blue)]" />
                      <h3 className="font-semibold text-white">Localisation</h3>
                    </div>
                    <div className="text-sm space-y-1">
                      <p className="text-white">{simulation.location.country}</p>
                      {simulation.location.region && (
                        <p className="text-[var(--nea-text-secondary)]">{simulation.location.region}</p>
                      )}
                      {simulation.location.coordinates && (
                        <p className="text-[var(--nea-text-secondary)] font-mono text-xs">
                          {simulation.location.coordinates.lat.toFixed(4)}, {simulation.location.coordinates.lng.toFixed(4)}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-5 h-5 text-[var(--nea-primary-blue)]" />
                    <h3 className="font-semibold text-white">Impact Humain</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {simulation.affected_population && (
                      <div>
                        <p className="text-[var(--nea-text-secondary)]">Population affectée</p>
                        <p className="text-white font-medium">{simulation.affected_population.toLocaleString()}</p>
                      </div>
                    )}
                    {simulation.displaced_population && (
                      <div>
                        <p className="text-[var(--nea-text-secondary)]">Population déplacée</p>
                        <p className="text-white font-medium">{simulation.displaced_population.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>

                {(simulation.start_date || simulation.end_date) && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-5 h-5 text-[var(--nea-primary-blue)]" />
                      <h3 className="font-semibold text-white">Chronologie</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {simulation.start_date && (
                        <div>
                          <p className="text-[var(--nea-text-secondary)]">Début</p>
                          <p className="text-white font-medium">
                            {new Date(simulation.start_date).toLocaleDateString('fr-CA')}
                          </p>
                        </div>
                      )}
                      {simulation.end_date && (
                        <div>
                          <p className="text-[var(--nea-text-secondary)]">Fin prévue</p>
                          <p className="text-white font-medium">
                            {new Date(simulation.end_date).toLocaleDateString('fr-CA')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {simulation.notes && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-5 h-5 text-[var(--nea-primary-blue)]" />
                      <h3 className="font-semibold text-white">Notes</h3>
                    </div>
                    <p className="text-sm text-[var(--nea-text-secondary)]">{simulation.notes}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--nea-border-default)] flex justify-end">
                <NeaButton onClick={onClose}>
                  Fermer
                </NeaButton>
              </div>
            </div>
          </NeaCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}