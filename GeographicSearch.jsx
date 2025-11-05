import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Loader2, Navigation } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function GeographicSearch({ onLocationSelect }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Veuillez entrer une localisation");
      return;
    }

    setIsSearching(true);

    try {
      // Simulation de recherche géographique
      // En production, utiliser une vraie API de géocodage (Nominatim, Google Maps, etc.)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResults = [
        { name: searchQuery, lat: 46.8139, lng: -71.2080, country: "Canada" },
        { name: `${searchQuery} Centre`, lat: 46.8200, lng: -71.2150, country: "Canada" },
        { name: `${searchQuery} Est`, lat: 46.8100, lng: -71.1950, country: "Canada" }
      ];

      setResults(mockResults);
      toast.success(`${mockResults.length} résultats trouvés`);
    } catch (error) {
      toast.error("Erreur lors de la recherche");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (location) => {
    onLocationSelect(location);
    toast.success(`Localisation sélectionnée: ${location.name}`);
  };

  return (
    <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <MapPin className="w-5 h-5 text-[var(--nea-primary-blue)]" />
          Recherche Géographique
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Ville, région, coordonnées..."
            className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-white"
          />
          <Button
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-[var(--nea-primary-blue)] hover:bg-sky-500"
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-[var(--nea-text-secondary)] font-semibold">Résultats:</p>
            {results.map((result, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSelectLocation(result)}
                className="w-full text-left p-3 rounded-lg bg-[var(--nea-bg-surface-hover)] hover:bg-[var(--nea-bg-deep-space)] border border-[var(--nea-border-subtle)] transition-colors"
              >
                <div className="flex items-start gap-2">
                  <Navigation className="w-4 h-4 text-[var(--nea-primary-blue)] mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{result.name}</p>
                    <p className="text-xs text-[var(--nea-text-secondary)]">
                      {result.country} • {result.lat.toFixed(4)}, {result.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}