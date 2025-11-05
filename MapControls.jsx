import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ZoomIn, ZoomOut, Home, Layers, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function MapControls({ 
  onZoomIn, 
  onZoomOut, 
  onResetView, 
  showSimulations = true,
  showResources = true,
  onToggleSimulations,
  onToggleResources
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute top-4 left-4 z-10 flex flex-col gap-2"
    >
      {/* Zoom controls */}
      <div className="bg-[var(--nea-bg-surface)]/90 backdrop-blur-sm border border-[var(--nea-border-default)] rounded-lg p-2 space-y-2">
        <Button
          onClick={onZoomIn}
          size="icon"
          variant="ghost"
          className="w-8 h-8 hover:bg-[var(--nea-bg-surface-hover)]"
          title="Zoom avant"
        >
          <ZoomIn className="w-4 h-4 text-white" />
        </Button>
        <Button
          onClick={onZoomOut}
          size="icon"
          variant="ghost"
          className="w-8 h-8 hover:bg-[var(--nea-bg-surface-hover)]"
          title="Zoom arrière"
        >
          <ZoomOut className="w-4 h-4 text-white" />
        </Button>
        <Button
          onClick={onResetView}
          size="icon"
          variant="ghost"
          className="w-8 h-8 hover:bg-[var(--nea-bg-surface-hover)]"
          title="Réinitialiser la vue"
        >
          <Home className="w-4 h-4 text-white" />
        </Button>
      </div>

      {/* Layer toggles */}
      <div className="bg-[var(--nea-bg-surface)]/90 backdrop-blur-sm border border-[var(--nea-border-default)] rounded-lg p-3 space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="w-4 h-4 text-[var(--nea-primary-blue)]" />
          <span className="text-xs font-semibold text-white">Couches</span>
        </div>

        <button
          onClick={onToggleSimulations}
          className="flex items-center justify-between w-full text-xs text-left hover:bg-[var(--nea-bg-surface-hover)] p-2 rounded transition-colors"
        >
          <span className={showSimulations ? "text-white" : "text-[var(--nea-text-secondary)]"}>
            Simulations
          </span>
          {showSimulations ? (
            <Eye className="w-3 h-3 text-emerald-400" />
          ) : (
            <EyeOff className="w-3 h-3 text-gray-500" />
          )}
        </button>

        <button
          onClick={onToggleResources}
          className="flex items-center justify-between w-full text-xs text-left hover:bg-[var(--nea-bg-surface-hover)] p-2 rounded transition-colors"
        >
          <span className={showResources ? "text-white" : "text-[var(--nea-text-secondary)]"}>
            Ressources
          </span>
          {showResources ? (
            <Eye className="w-3 h-3 text-emerald-400" />
          ) : (
            <EyeOff className="w-3 h-3 text-gray-500" />
          )}
        </button>
      </div>

      {/* Status badge */}
      <Badge className="bg-[var(--nea-bg-surface)]/90 backdrop-blur-sm border border-[var(--nea-border-default)] text-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
        Carte Active
      </Badge>
    </motion.div>
  );
}