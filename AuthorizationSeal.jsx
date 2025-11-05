import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NeaCard from '../ui/NeaCard';
import NeaButton from '../ui/NeaButton';
import { Flame, Shield, Lock, Unlock, AlertTriangle, CheckCircle, KeyRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const AUTHORIZATION_LEVELS = [
    { level: 1, name: 'Technicien', icon: Shield, color: 'text-blue-400', required: false },
    { level: 2, name: 'Développeur', icon: Shield, color: 'text-purple-400', required: false },
    { level: 3, name: 'Administrateur', icon: Shield, color: 'text-orange-400', required: true },
    { level: 4, name: 'Master', icon: Flame, color: 'text-red-400', required: true }
];

export default function AuthorizationSeal({ onAuthorize, isLocked = true }) {
    const [authCode, setAuthCode] = useState('');
    const [biometricVerified, setBiometricVerified] = useState(false);
    const [authorizedLevels, setAuthorizedLevels] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleBiometricScan = async () => {
        setIsProcessing(true);
        // Simulation d'une vérification biométrique
        setTimeout(() => {
            setBiometricVerified(true);
            toast.success('Biométrie vérifiée');
            setIsProcessing(false);
        }, 1500);
    };

    const handleCodeSubmit = (e) => {
        e.preventDefault();
        if (!authCode.trim()) {
            toast.error('Code requis');
            return;
        }

        // Simulation de vérification de code
        if (authCode === 'PROMETHEUS-ALPHA') {
            setAuthorizedLevels([1, 2, 3]);
            toast.success('Code Admin vérifié');
        } else if (authCode === 'PROMETHEUS-OMEGA') {
            setAuthorizedLevels([1, 2, 3, 4]);
            toast.success('Code Master vérifié');
        } else {
            toast.error('Code invalide');
        }
    };

    const handleUnlock = () => {
        const requiredLevels = AUTHORIZATION_LEVELS.filter(l => l.required).map(l => l.level);
        const hasAllRequired = requiredLevels.every(level => authorizedLevels.includes(level));

        if (!biometricVerified) {
            toast.error('Vérification biométrique requise');
            return;
        }

        if (!hasAllRequired) {
            toast.error('Autorisations insuffisantes');
            return;
        }

        if (onAuthorize) {
            onAuthorize();
        }
        toast.success('Protocole Prométhée déverrouillé');
    };

    const allRequirementsMet = biometricVerified && 
        AUTHORIZATION_LEVELS.filter(l => l.required).every(l => authorizedLevels.includes(l.level));

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <NeaCard className={`border-2 ${isLocked ? 'border-red-500/30' : 'border-green-500/30'}`}>
                <div className="p-6 space-y-6">
                    <div className="text-center">
                        <motion.div
                            animate={isLocked ? { scale: [1, 1.05, 1] } : {}}
                            transition={{ repeat: isLocked ? Infinity : 0, duration: 2 }}
                            className="inline-block"
                        >
                            {isLocked ? (
                                <Lock className="w-16 h-16 text-red-400 mx-auto mb-4" />
                            ) : (
                                <Unlock className="w-16 h-16 text-green-400 mx-auto mb-4" />
                            )}
                        </motion.div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Sceau d'Autorisation
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {isLocked ? 'Protocole Prométhée Verrouillé' : 'Protocole Prométhée Déverrouillé'}
                        </p>
                    </div>

                    {isLocked && (
                        <>
                            <div className="space-y-4">
                                <div className="p-4 bg-[var(--nea-bg-surface-hover)] rounded-lg border border-[var(--nea-border-default)]">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <KeyRound className="w-5 h-5 text-purple-400" />
                                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                                Vérification Biométrique
                                            </h4>
                                        </div>
                                        {biometricVerified ? (
                                            <CheckCircle className="w-5 h-5 text-green-400" />
                                        ) : (
                                            <AlertTriangle className="w-5 h-5 text-yellow-400" />
                                        )}
                                    </div>
                                    <NeaButton
                                        onClick={handleBiometricScan}
                                        disabled={biometricVerified || isProcessing}
                                        className="w-full"
                                        variant={biometricVerified ? 'secondary' : 'primary'}
                                    >
                                        {biometricVerified ? 'Vérifiée' : isProcessing ? 'Scan en cours...' : 'Scanner Biométrie'}
                                    </NeaButton>
                                </div>

                                <form onSubmit={handleCodeSubmit} className="space-y-3">
                                    <div>
                                        <Label className="text-gray-900 dark:text-white">
                                            Code d'Autorisation
                                        </Label>
                                        <Input
                                            type="password"
                                            value={authCode}
                                            onChange={(e) => setAuthCode(e.target.value)}
                                            placeholder="Entrez le code d'autorisation"
                                            className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-gray-900 dark:text-white font-mono"
                                        />
                                    </div>
                                    <NeaButton type="submit" className="w-full">
                                        Vérifier Code
                                    </NeaButton>
                                </form>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-[var(--nea-border-subtle)]">
                                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                                    Niveaux d'Autorisation:
                                </h4>
                                <AnimatePresence>
                                    {AUTHORIZATION_LEVELS.map((level, index) => {
                                        const LevelIcon = level.icon;
                                        const isAuthorized = authorizedLevels.includes(level.level);

                                        return (
                                            <motion.div
                                                key={level.level}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className={`flex items-center justify-between p-3 rounded-lg border ${
                                                    isAuthorized
                                                        ? 'bg-green-500/10 border-green-500/30'
                                                        : 'bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-subtle)]'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <LevelIcon className={`w-5 h-5 ${level.color}`} />
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                            Niveau {level.level}: {level.name}
                                                        </p>
                                                        {level.required && (
                                                            <p className="text-xs text-red-400">Requis</p>
                                                        )}
                                                    </div>
                                                </div>
                                                {isAuthorized ? (
                                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                                ) : (
                                                    <Lock className="w-5 h-5 text-gray-400" />
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>

                            <NeaButton
                                onClick={handleUnlock}
                                disabled={!allRequirementsMet}
                                className="w-full"
                                size="lg"
                            >
                                <Flame className="w-5 h-5 mr-2" />
                                Déverrouiller Prométhée
                            </NeaButton>
                        </>
                    )}

                    {!isLocked && (
                        <div className="text-center py-8">
                            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                            <p className="text-lg font-bold text-green-400 mb-2">
                                Protocole Autorisé
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Vous pouvez maintenant accéder aux fonctions de frappe préventive
                            </p>
                        </div>
                    )}
                </div>
            </NeaCard>
        </motion.div>
    );
}