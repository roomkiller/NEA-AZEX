import React from 'react';
import NeaCard from '../ui/NeaCard';
import { ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CorrelationMatrix({ matrix = [] }) {
  if (matrix.length === 0) {
    return (
      <NeaCard className="p-8 text-center">
        <ThumbsUp className="w-12 h-12 mx-auto text-[var(--nea-text-muted)] mb-3" />
        <p className="text-[var(--nea-text-secondary)]">Aucune matrice de corrélation disponible</p>
      </NeaCard>
    );
  }

  return (
    <NeaCard>
      <div className="p-4 border-b border-[var(--nea-border-default)]">
        <h3 className="font-bold text-white flex items-center gap-2">
          <ThumbsUp className="w-5 h-5 text-cyan-400" />
          Matrice de Corrélation
        </h3>
      </div>
      <div className="p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--nea-border-default)]">
              <th className="text-left p-2 text-[var(--nea-text-secondary)]">Variable</th>
              {matrix.map((row, index) => (
                <th key={index} className="text-center p-2 text-[var(--nea-text-secondary)]">
                  {row.name || `V${index + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, rowIndex) => (
              <motion.tr
                key={rowIndex}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: rowIndex * 0.05 }}
                className="border-b border-[var(--nea-border-subtle)] hover:bg-[var(--nea-bg-surface-hover)]"
              >
                <td className="p-2 font-semibold text-white">{row.name || `Variable ${rowIndex + 1}`}</td>
                {row.values?.map((value, colIndex) => {
                  const intensity = Math.abs(value);
                  const color = intensity > 0.7 ? 'bg-red-500' : intensity > 0.4 ? 'bg-yellow-500' : 'bg-blue-500';
                  
                  return (
                    <td key={colIndex} className="p-2 text-center">
                      <div className={`inline-block px-2 py-1 rounded ${color}/20`}>
                        <span className={`text-xs font-semibold ${color.replace('bg-', 'text-')}`}>
                          {value.toFixed(2)}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </NeaCard>
  );
}