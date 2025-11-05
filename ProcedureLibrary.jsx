import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function ProcedureLibrary({ procedures = [] }) {
  if (procedures.length === 0) {
    return (
      <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
        <CardContent className="p-8 text-center">
          <FileText className="w-12 h-12 mx-auto text-[var(--nea-text-muted)] mb-3" />
          <p className="text-[var(--nea-text-secondary)]">Aucune procédure disponible</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <FileText className="w-5 h-5 text-blue-400" />
          Bibliothèque de Procédures
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {procedures.map((procedure, index) => (
            <motion.div
              key={procedure.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)] hover:border-[var(--nea-primary-blue)] transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-white">{procedure.procedure_name}</h4>
                <Badge className="bg-blue-500/20 text-blue-300 border-0">
                  {procedure.category}
                </Badge>
              </div>
              <p className="text-sm text-[var(--nea-text-secondary)] mb-2">
                {procedure.description}
              </p>
              {procedure.estimated_duration && (
                <div className="flex items-center gap-1 text-xs text-[var(--nea-text-muted)]">
                  <Clock className="w-3 h-3" />
                  Durée estimée: {procedure.estimated_duration}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}