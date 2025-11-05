import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import { createPageUrl } from '@/utils';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';

export default function NotFound() {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-[var(--nea-bg-deep-space)] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full"
            >
                <NeaCard>
                    <div className="p-12 text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                        >
                            <AlertTriangle className="w-24 h-24 text-yellow-400 mx-auto mb-6" />
                        </motion.div>
                        
                        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
                            404
                        </h1>
                        
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Page Non Trouvée
                        </h2>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            La page que vous recherchez n'existe pas ou a été déplacée.
                        </p>

                        {location.pathname && (
                            <div className="bg-[var(--nea-bg-surface-hover)] rounded-lg p-4 mb-8">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Chemin demandé :
                                </p>
                                <code className="text-sm font-mono text-gray-900 dark:text-white">
                                    {location.pathname}
                                </code>
                            </div>
                        )}

                        <div className="flex gap-4 justify-center">
                            <NeaButton
                                variant="secondary"
                                onClick={() => window.history.back()}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Retour
                            </NeaButton>
                            
                            <Link to={createPageUrl('Home')}>
                                <NeaButton>
                                    <Home className="w-4 h-4 mr-2" />
                                    Accueil
                                </NeaButton>
                            </Link>
                        </div>
                    </div>
                </NeaCard>
            </motion.div>
        </div>
    );
}