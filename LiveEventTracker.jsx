import React, { useState, useEffect } from 'react';
import NeaCard from '../ui/NeaCard';
import { Rss, Flame, TrendingDown, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const initialEvents = [
    { text: "Le hashtag #CobaltCrash émerge sur X/Twitter.", icon: Rss, time: "T-0h:00m" },
    { text: "Grève surprise déclarée dans une mine clé de la RDC.", icon: Flame, time: "T+0h:15m" },
    { text: "Le cours du Cobalt chute de 8% en pré-ouverture.", icon: TrendingDown, time: "T+0h:45m" },
    { text: "Des articles de 'presse' amplifient la rumeur d'une contamination des stocks.", icon: Rss, time: "T+1h:30m" },
];

const newEvents = [
    { text: "Contre-narration #CobaltFacts commence à prendre de l'ampleur.", icon: TrendingUp, time: "T+2h:10m" },
    { text: "Des analystes financiers réputés qualifient les rumeurs de 'hautement spéculatives'.", icon: Rss, time: "T+2h:45m" },
];

const LiveEventTracker = () => {
    const [events, setEvents] = useState(initialEvents);

    useEffect(() => {
        const timer = setTimeout(() => {
            setEvents(currentEvents => [...currentEvents, ...newEvents]);
        }, 5000); // Nouveaux événements après 5 secondes

        return () => clearTimeout(timer);
    }, []);

    return (
        <NeaCard>
            <div className="p-4 border-b border-[var(--nea-border-default)] flex items-center gap-2">
                <Rss className="w-4 h-4 text-[var(--nea-primary-blue)]" />
                <h3 className="font-bold text-white">Flux d'Événements en Direct</h3>
            </div>
            <div className="p-4 space-y-4 h-96 overflow-y-auto styled-scrollbar">
                {events.map((event, index) => {
                    const Icon = event.icon;
                    return (
                        <motion.div
                            key={index}
                            className="flex items-start gap-3"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                        >
                            <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${index >= initialEvents.length ? 'text-green-400' : 'text-orange-400'}`} />
                            <div>
                                <p className="text-sm text-white leading-relaxed">{event.text}</p>
                                <p className="text-xs text-[var(--nea-text-muted)]">{event.time}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </NeaCard>
    );
};

export default LiveEventTracker;