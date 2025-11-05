import { base44 } from '@/api/base44Client';

/**
 * CACHE SERVICE AVANCÉ - VERSION OPTIMISÉE
 * Système de cache avec gestion des rate limits
 */

class CacheService {
    constructor() {
        this.memoryCache = new Map();
        this.writeQueue = [];
        this.isProcessingQueue = false;
        this.writeDelay = 5000; // 5 secondes entre chaque écriture batch
        this.maxQueueSize = 50;
        this.lastWriteTime = 0;
        this.minTimeBetweenWrites = 3000; // Minimum 3 secondes entre écritures
        this.rateLimitRetryDelay = 10000; // 10 secondes avant retry après rate limit
        this.consecutiveErrors = 0;
        this.maxConsecutiveErrors = 3;
        
        // Démarrer le traitement de la queue
        this.startQueueProcessor();
    }

    /**
     * Génère une clé de cache unique
     */
    generateKey(prefix, params = {}) {
        const paramString = JSON.stringify(params);
        return `${prefix}_${paramString}`;
    }

    /**
     * Obtenir depuis le cache (mémoire d'abord, puis DB)
     */
    async get(cacheKey) {
        // 1. Vérifier le cache mémoire
        const memCached = this.memoryCache.get(cacheKey);
        if (memCached && !this.isExpired(memCached)) {
            console.log(`[CacheService] Memory HIT: ${cacheKey}`);
            return memCached.data;
        }

        // 2. Vérifier le cache DB (avec rate limit protection)
        try {
            const dbCached = await this.getFromDB(cacheKey);
            if (dbCached && !this.isExpired(dbCached)) {
                console.log(`[CacheService] DB HIT: ${cacheKey}`);
                // Mettre en cache mémoire
                this.memoryCache.set(cacheKey, dbCached);
                return dbCached.data;
            }
        } catch (error) {
            console.warn(`[CacheService] DB read error for ${cacheKey}:`, error.message);
            // Continue avec cache miss si erreur DB
        }

        console.log(`[CacheService] MISS: ${cacheKey}`);
        return null;
    }

    /**
     * Écrire dans le cache (mémoire immédiatement, DB en queue)
     */
    async set(cacheKey, data, options = {}) {
        const {
            ttlHours = 24,
            cacheType = 'General',
            priority = 'Normal'
        } = options;

        const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);
        
        const cacheEntry = {
            cache_key: cacheKey,
            cache_type: cacheType,
            cached_data: data,
            expires_at: expiresAt.toISOString(),
            priority,
            ttl_hours: ttlHours,
            metadata: {
                cache_size_kb: JSON.stringify(data).length / 1024,
                created_at: new Date().toISOString()
            }
        };

        // 1. Écriture immédiate en mémoire
        this.memoryCache.set(cacheKey, {
            data,
            expiresAt: expiresAt.getTime()
        });

        // 2. Ajouter à la queue pour écriture DB (non bloquante)
        this.addToWriteQueue(cacheEntry);

        return true;
    }

    /**
     * Ajouter à la queue d'écriture
     */
    addToWriteQueue(cacheEntry) {
        // Éviter la queue trop grande
        if (this.writeQueue.length >= this.maxQueueSize) {
            console.warn('[CacheService] Write queue full, skipping DB write for:', cacheEntry.cache_key);
            return;
        }

        // Vérifier si déjà en queue
        const existingIndex = this.writeQueue.findIndex(
            item => item.cache_key === cacheEntry.cache_key
        );

        if (existingIndex >= 0) {
            // Remplacer l'entrée existante
            this.writeQueue[existingIndex] = cacheEntry;
        } else {
            this.writeQueue.push(cacheEntry);
        }

        console.log(`[CacheService] Added to queue: ${cacheEntry.cache_key} (Queue size: ${this.writeQueue.length})`);
    }

    /**
     * Processeur de queue avec rate limiting
     */
    startQueueProcessor() {
        setInterval(async () => {
            if (this.isProcessingQueue || this.writeQueue.length === 0) {
                return;
            }

            // Vérifier le délai minimum entre écritures
            const timeSinceLastWrite = Date.now() - this.lastWriteTime;
            if (timeSinceLastWrite < this.minTimeBetweenWrites) {
                return;
            }

            // Vérifier si on est en backoff suite à des erreurs
            if (this.consecutiveErrors >= this.maxConsecutiveErrors) {
                const backoffDelay = this.rateLimitRetryDelay * Math.pow(2, this.consecutiveErrors - this.maxConsecutiveErrors);
                console.warn(`[CacheService] In error backoff, waiting ${backoffDelay}ms before retry`);
                
                // Reset après un certain temps
                if (timeSinceLastWrite > backoffDelay) {
                    this.consecutiveErrors = 0;
                } else {
                    return;
                }
            }

            this.isProcessingQueue = true;

            try {
                // Traiter par batch de 5 maximum
                const batch = this.writeQueue.splice(0, 5);
                
                if (batch.length === 0) {
                    this.isProcessingQueue = false;
                    return;
                }

                console.log(`[CacheService] Processing batch of ${batch.length} items`);

                // Écrire en série avec délai
                for (const entry of batch) {
                    try {
                        await this.writeToDB(entry);
                        await this.sleep(200); // 200ms entre chaque écriture
                    } catch (error) {
                        console.error(`[CacheService] Failed to write ${entry.cache_key}:`, error.message);
                        
                        if (error.message && error.message.includes('Rate limit')) {
                            // Remettre dans la queue
                            this.writeQueue.unshift(entry);
                            this.consecutiveErrors++;
                            console.warn(`[CacheService] Rate limit hit, consecutive errors: ${this.consecutiveErrors}`);
                            break; // Arrêter le batch
                        }
                    }
                }

                // Succès - reset erreurs
                if (this.consecutiveErrors > 0) {
                    this.consecutiveErrors = Math.max(0, this.consecutiveErrors - 1);
                }

                this.lastWriteTime = Date.now();
            } catch (error) {
                console.error('[CacheService] Queue processor error:', error);
                this.consecutiveErrors++;
            } finally {
                this.isProcessingQueue = false;
            }
        }, this.writeDelay);
    }

    /**
     * Lire depuis la DB
     */
    async getFromDB(cacheKey) {
        try {
            const results = await base44.entities.AnalysisCache.filter({ 
                cache_key: cacheKey 
            });

            if (results && results.length > 0) {
                const cached = results[0];
                
                // Mettre à jour hit count (en queue, non bloquant)
                this.addToWriteQueue({
                    ...cached,
                    hit_count: (cached.hit_count || 0) + 1,
                    last_hit: new Date().toISOString()
                });

                return {
                    data: cached.cached_data,
                    expiresAt: new Date(cached.expires_at).getTime()
                };
            }
        } catch (error) {
            throw error;
        }

        return null;
    }

    /**
     * Écrire en DB
     */
    async writeToDB(cacheEntry) {
        try {
            // Vérifier si existe déjà
            const existing = await base44.entities.AnalysisCache.filter({
                cache_key: cacheEntry.cache_key
            });

            if (existing && existing.length > 0) {
                // Update
                await base44.entities.AnalysisCache.update(existing[0].id, cacheEntry);
            } else {
                // Create
                await base44.entities.AnalysisCache.create(cacheEntry);
            }

            console.log(`[CacheService] DB write SUCCESS: ${cacheEntry.cache_key}`);
        } catch (error) {
            console.error(`[CacheService] DB write FAILED: ${cacheEntry.cache_key}`, error);
            throw error;
        }
    }

    /**
     * Vérifier expiration
     */
    isExpired(cacheEntry) {
        return Date.now() > cacheEntry.expiresAt;
    }

    /**
     * Wrapper pour utiliser le cache facilement
     */
    async withCache(cacheKey, fetchFn, options = {}) {
        // Tenter de récupérer depuis le cache
        const cached = await this.get(cacheKey);
        
        if (cached !== null) {
            return cached;
        }

        // Cache miss - exécuter la fonction
        console.log(`[CacheService] Fetching fresh data for: ${cacheKey}`);
        const freshData = await fetchFn();

        // Mettre en cache
        await this.set(cacheKey, freshData, options);

        return freshData;
    }

    /**
     * Invalider un cache
     */
    async invalidate(cacheKey) {
        // Supprimer de la mémoire
        this.memoryCache.delete(cacheKey);

        // Supprimer de la queue si présent
        this.writeQueue = this.writeQueue.filter(
            item => item.cache_key !== cacheKey
        );

        // Supprimer de la DB (non bloquant)
        try {
            const existing = await base44.entities.AnalysisCache.filter({
                cache_key: cacheKey
            });

            if (existing && existing.length > 0) {
                await base44.entities.AnalysisCache.delete(existing[0].id);
            }
        } catch (error) {
            console.error(`[CacheService] Invalidation error for ${cacheKey}:`, error);
        }

        console.log(`[CacheService] Invalidated: ${cacheKey}`);
    }

    /**
     * Nettoyer tous les caches
     */
    async clearAll() {
        this.memoryCache.clear();
        this.writeQueue = [];
        console.log('[CacheService] All caches cleared');
    }

    /**
     * Obtenir les statistiques
     */
    getStats() {
        return {
            memoryCacheSize: this.memoryCache.size,
            writeQueueSize: this.writeQueue.length,
            isProcessing: this.isProcessingQueue,
            consecutiveErrors: this.consecutiveErrors,
            lastWriteTime: this.lastWriteTime
        };
    }

    /**
     * Helper sleep
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export singleton
const cacheService = new CacheService();
export default cacheService;