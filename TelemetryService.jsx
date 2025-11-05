
import { useEffect, useCallback } from 'react';
import { TelemetryLog } from '@/api/entities';
import { User } from '@/api/entities';

let userCache = null;

// Mock function to get geographic context
const getGeoContext = () => {
    // In a real app, this would use browser geolocation or an IP lookup service
    const locations = [
        { city: 'Montréal', country: 'Canada', lat: 45.50, lng: -73.56 },
        { city: 'Québec', country: 'Canada', lat: 46.81, lng: -71.20 },
        { city: 'Paris', country: 'France', lat: 48.85, lng: 2.35 },
    ];
    return locations[Math.floor(Math.random() * locations.length)];
};

export const useTelemetry = (moduleName) => {

    useEffect(() => {
        const fetchUser = async () => {
            if (!userCache) {
                try {
                    userCache = await User.me();
                } catch {
                    userCache = { email: 'anonymous' };
                }
            }
        };
        fetchUser();
    }, []);

    const logEvent = useCallback((eventType, eventAction, data = {}) => {
        const geo = getGeoContext();
        const payload = {
            module_name: moduleName,
            event_type: eventType,
            event_action: eventAction,
            timestamp: new Date().toISOString(),
            metadata: {
                user_agent: navigator.userAgent,
                screen_resolution: `${window.screen.width}x${window.screen.height}`,
                page_url: window.location.href,
                ...data.metadata,
            },
            geographic_context: {
                ...geo,
                scale: 'city'
            },
            performance_metrics: data.performance || {},
            interaction_data: data.interaction || {},
            created_by: userCache?.email || 'system'
        };

        // Don't await this, let it run in the background
        TelemetryLog.create(payload).catch(console.error);
    }, [moduleName]);

    useEffect(() => {
        // Log page view on component mount
        logEvent('page_view', 'Page Loaded');
    }, [logEvent]);

    return { logEvent };
};
