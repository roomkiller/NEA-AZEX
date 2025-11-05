import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ShieldAlert, Users, Pin, Route, ShieldCheck } from 'lucide-react';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const getIcon = (type) => {
    const iconHtml = `<div style="background-color: #161C2D; border: 2px solid #2E8EFF; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; color: white;">${type}</div>`;
    return L.divIcon({
        html: iconHtml,
        className: '',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
};

const CrisisMap = ({ simulations = [], resources = [], center }) => {
    const defaultCenter = center || [46.8139, -71.2080];

    const routeOptions = { color: 'orange', weight: 4, dashArray: '10, 10' };
    const zoneOptions = { color: '#2E8EFF', fillColor: '#2E8EFF', fillOpacity: 0.3 };

    return (
        <MapContainer center={defaultCenter} zoom={8} scrollWheelZoom={true} style={{ height: '100%', width: '100%', backgroundColor: '#0a0a0a' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {simulations.map(sim => (
                <React.Fragment key={sim.id}>
                    {sim.location?.coordinates && (
                        <Marker position={[sim.location.coordinates.lat, sim.location.coordinates.lng]} icon={getIcon('<ShieldAlert class="w-4 h-4 text-red-400"/>')}>
                            <Popup>
                                <div className="text-white bg-gray-800 p-1 rounded">
                                    <h3 className="font-bold">{sim.simulation_name}</h3>
                                    <p>{sim.crisis_type}</p>
                                    <p>Sévérité: {sim.severity_level}</p>
                                </div>
                            </Popup>
                        </Marker>
                    )}
                    {sim.evacuation_routes?.map((route, index) => (
                        <Polyline
                            key={`${sim.id}-route-${index}`}
                            positions={[[route.from_coordinates.lat, route.from_coordinates.lng], [route.to_coordinates.lat, route.to_coordinates.lng]]}
                            pathOptions={routeOptions}
                        />
                    ))}
                    {sim.security_zones?.map((zone, index) => {
                         const polygonCoords = zone.coordinates.map(c => [c.lat, c.lng]);
                         return (
                            <Polygon
                                key={`${sim.id}-zone-${index}`}
                                positions={polygonCoords}
                                pathOptions={zoneOptions}
                            />
                         );
                    })}
                </React.Fragment>
            ))}

            {resources.map(res => (
                res.location?.coordinates && (
                    <Marker key={res.id} position={[res.location.coordinates.lat, res.location.coordinates.lng]} icon={getIcon('<Users class="w-4 h-4 text-cyan-400"/>')}>
                        <Popup>
                           <div className="text-white bg-gray-800 p-1 rounded">
                                <h3 className="font-bold">{res.resource_name}</h3>
                                <p>{res.resource_type}</p>
                                <p>Statut: {res.status}</p>
                            </div>
                        </Popup>
                    </Marker>
                )
            ))}
        </MapContainer>
    );
};

export default CrisisMap;