import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NeaCard from '../ui/NeaCard';

/**
 * ERROR BOUNDARY
 * Capture les erreurs React et affiche une UI de fallback élégante
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            errorCount: 0
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        
        this.setState(prevState => ({
            error,
            errorInfo,
            errorCount: prevState.errorCount + 1
        }));

        // Log to telemetry service if available
        if (window.telemetryBase44) {
            try {
                window.telemetryBase44.entities.TelemetryLog.create({
                    module_name: 'ErrorBoundary',
                    event_type: 'error',
                    event_action: 'react_error_caught',
                    metadata: {
                        error_message: error.toString(),
                        component_stack: errorInfo.componentStack,
                        error_count: this.state.errorCount + 1
                    },
                    timestamp: new Date().toISOString()
                });
            } catch (e) {
                console.error('Failed to log error to telemetry:', e);
            }
        }
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[var(--nea-bg-deep-space)] flex items-center justify-center p-4">
                    <NeaCard className="max-w-2xl w-full">
                        <div className="p-8">
                            {/* Icon & Title */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-red-500/20 rounded-lg">
                                    <AlertTriangle className="w-8 h-8 text-red-400" aria-hidden="true" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-[var(--nea-text-title)]">
                                        Une erreur s'est produite
                                    </h1>
                                    <p className="text-[var(--nea-text-secondary)] mt-1">
                                        NEA-AZEX a rencontré un problème inattendu
                                    </p>
                                </div>
                            </div>

                            {/* Error Message */}
                            {this.state.error && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    <p className="text-sm font-mono text-red-400">
                                        {this.state.error.toString()}
                                    </p>
                                </div>
                            )}

                            {/* Developer Info - Toujours afficher les détails */}
                            {this.state.errorInfo && (
                                <details className="mb-6 p-4 bg-[var(--nea-bg-surface-hover)] rounded-lg">
                                    <summary className="text-sm font-semibold text-[var(--nea-text-primary)] cursor-pointer hover:text-[var(--nea-primary-blue)] transition-colors">
                                        Détails techniques
                                    </summary>
                                    <pre className="mt-3 text-xs text-[var(--nea-text-secondary)] overflow-auto max-h-64 styled-scrollbar">
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                </details>
                            )}

                            {/* Actions */}
                            <div className="flex flex-wrap gap-3">
                                <Button
                                    onClick={this.handleReset}
                                    className="bg-[var(--nea-primary-blue)] hover:bg-blue-600"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Réessayer
                                </Button>
                                <Button
                                    onClick={this.handleReload}
                                    variant="outline"
                                    className="border-[var(--nea-border-default)]"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Recharger la page
                                </Button>
                                <Button
                                    onClick={this.handleGoHome}
                                    variant="outline"
                                    className="border-[var(--nea-border-default)]"
                                >
                                    <Home className="w-4 h-4 mr-2" />
                                    Retour à l'accueil
                                </Button>
                            </div>

                            {/* Error Count Warning */}
                            {this.state.errorCount > 2 && (
                                <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                    <p className="text-sm text-yellow-400">
                                        ⚠️ Cette erreur s'est produite {this.state.errorCount} fois. 
                                        Si le problème persiste, veuillez contacter le support.
                                    </p>
                                </div>
                            )}

                            {/* Footer */}
                            <div className="mt-6 pt-6 border-t border-[var(--nea-border-subtle)] text-center">
                                <p className="text-xs text-[var(--nea-text-muted)]">
                                    Error ID: {Date.now().toString(36)} • 
                                    NEA-AZEX v1.0 • 
                                    <a 
                                        href="/SystemStatus" 
                                        className="text-[var(--nea-primary-blue)] hover:underline ml-1"
                                    >
                                        Vérifier le statut système
                                    </a>
                                </p>
                            </div>
                        </div>
                    </NeaCard>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;