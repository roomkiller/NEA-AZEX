import React, { useEffect, createContext, useContext, useState, useCallback } from 'react';
import { checkForUpdates } from './UpdateService';
import { toast } from 'sonner';
import { AlertTriangle, Rss, BrainCircuit } from 'lucide-react';

const UpdateContext = createContext(null);

export const useUpdates = () => useContext(UpdateContext);

const UPDATE_INTERVAL = 120000; // 2 minutes au lieu de 30 secondes pour éviter le rate limiting

function GlobalUpdateProvider({ children }) {
    const [systemStatus, setSystemStatus] = useState('operational');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [speechWordBoundary, setSpeechWordBoundary] = useState(0);
    const [isMuted, setIsMuted] = useState(true);

    const toggleMute = useCallback(() => {
        setIsMuted(prev => {
            const newMutedState = !prev;
            if (newMutedState) {
                if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                }
            } else {
                if ('speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(' ');
                    window.speechSynthesis.speak(utterance);
                } else {
                    console.warn("La synthèse vocale n'est pas supportée par ce navigateur.");
                }
            }
            return newMutedState;
        });
    }, []);

    const speak = useCallback((text) => {
        if (isMuted || !('speechSynthesis' in window) || !text?.trim()) {
            return;
        }

        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-CA';
        utterance.rate = 0.9;
        utterance.pitch = 0.8;

        utterance.onstart = () => {
            setIsSpeaking(true);
            setSpeechWordBoundary(0);
        };
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (event) => {
            console.error("Speech synthesis error:", event);
            setIsSpeaking(false);
        };
        
        utterance.onboundary = (event) => {
            if (event.name === 'word') {
                setSpeechWordBoundary(prev => prev + 1);
            }
        };

        window.speechSynthesis.speak(utterance);
    }, [isMuted]);

    useEffect(() => {
        const handleUpdates = (updates) => {
            let newStatus = 'operational';
            let announcements = [];

            if (updates.newIncidents.length > 0) {
                const hasCritical = updates.newIncidents.some(inc => inc.severity === 'Critique' || inc.severity === 'Élevé');
                if (hasCritical) {
                    newStatus = 'critical';
                } else {
                    newStatus = 'warning';
                }
                updates.newIncidents.forEach(incident => {
                    const message = `Nouvel incident de sécurité: ${incident.incident_type}. Sévérité: ${incident.severity}.`;
                    toast.error(message, {
                        description: `Sévérité: ${incident.severity} | IP: ${incident.source_ip}`,
                        icon: <AlertTriangle className="w-5 h-5" />,
                    });
                    announcements.push(message);
                });
            }
            if (updates.newSignals.length > 0 && newStatus === 'operational') {
                 newStatus = 'warning';
                 updates.newSignals.forEach(signal => {
                    const message = `Nouveau signal faible détecté: ${signal.signal_title}.`;
                    toast.info(message, {
                        description: `Source: ${signal.source_platform} | Pertinence: ${signal.relevance_score}%`,
                        icon: <Rss className="w-5 h-5" />,
                    });
                    announcements.push(message);
                });
            }
            if (updates.newPredictions.length > 0 && newStatus === 'operational') {
                newStatus = 'warning';
                updates.newPredictions.forEach(prediction => {
                    const message = `Nouvelle prédiction d'événement: ${prediction.event_name}. Probabilité ${prediction.probability_score} pourcent.`;
                    toast.message(message, {
                        description: `Probabilité: ${prediction.probability_score}% | Confiance: ${prediction.confidence_level}`,
                        icon: <BrainCircuit className="w-5 h-5" />,
                    });
                    announcements.push(message);
                });
            }
            
            if(announcements.length > 0) {
                speak(announcements.join(' '));
            }

            setSystemStatus(newStatus);
        };

        const runCheck = async () => {
            if (isSpeaking) return;

            setSystemStatus('thinking');
            try {
                const updates = await checkForUpdates();
                if (updates.newIncidents.length > 0 || updates.newSignals.length > 0 || updates.newPredictions.length > 0) {
                    handleUpdates(updates);
                } else {
                    setSystemStatus('operational');
                }
            } catch (error) {
                console.error("Erreur lors de la vérification des mises à jour :", error);
                // Ne pas mettre en status critical pour une erreur de rate limiting
                setSystemStatus('operational');
            }
        };

        const intervalId = setInterval(runCheck, UPDATE_INTERVAL);
        // Attendre 10 secondes avant le premier check pour laisser l'app se charger
        const initialCheckTimeout = setTimeout(runCheck, 10000);

        return () => {
            clearInterval(intervalId);
            clearTimeout(initialCheckTimeout);
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, [speak, isSpeaking]);

    const contextValue = { systemStatus, isSpeaking, speechWordBoundary, speak, isMuted, toggleMute };

    return (
        <UpdateContext.Provider value={contextValue}>
            {children}
        </UpdateContext.Provider>
    );
}

export default GlobalUpdateProvider;