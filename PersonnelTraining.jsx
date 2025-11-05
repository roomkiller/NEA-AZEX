import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Loader2, CheckCircle, Users, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function PersonnelTraining({ productionStatus }) {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState([]);
  const [currentModule, setCurrentModule] = useState(0);

  const trainingModules = [
    { name: "Introduction à l'Autonomisation", duration: 2000, participants: 15 },
    { name: "Protocoles Auto-Réparation", duration: 2500, participants: 12 },
    { name: "Monitoring et Diagnostic", duration: 3000, participants: 10 },
    { name: "Intervention d'Urgence", duration: 2000, participants: 8 },
    { name: "Certification Finale", duration: 1500, participants: 15 }
  ];

  const handleStartTraining = async () => {
    if (!productionStatus || !productionStatus.every(s => s.status === 'completed')) {
      toast.error("Veuillez d'abord compléter la production");
      return;
    }

    setIsTraining(true);
    setTrainingProgress([]);
    setCurrentModule(0);

    const progress = [];

    for (let i = 0; i < trainingModules.length; i++) {
      setCurrentModule(i);
      const module = trainingModules[i];

      progress.push({ ...module, status: 'in_progress', completion: 0 });
      setTrainingProgress([...progress]);

      for (let p = 0; p <= 100; p += 5) {
        progress[i].completion = p;
        setTrainingProgress([...progress]);
        await new Promise(resolve => setTimeout(resolve, module.duration / 20));
      }

      progress[i].status = 'completed';
      progress[i].completion = 100;
      setTrainingProgress([...progress]);
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    toast.success(`Formation complétée: ${trainingModules.reduce((sum, m) => sum + m.participants, 0)} participants certifiés`);
    setIsTraining(false);
  };

  const completedModules = trainingProgress.filter(m => m.status === 'completed').length;
  const totalParticipants = trainingModules.reduce((sum, m) => sum + m.participants, 0);
  const certifiedParticipants = trainingProgress
    .filter(m => m.status === 'completed')
    .reduce((sum, m) => sum + m.participants, 0);

  return (
    <div className="space-y-6">
      <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <span className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-400" />
              Phase 5: Formation du Personnel
            </span>
            <Button
              onClick={handleStartTraining}
              disabled={isTraining || !productionStatus}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isTraining ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Formation...
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Démarrer Formation
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {isTraining && (
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold text-white">
                  Module {currentModule + 1}/{trainingModules.length} en cours
                </span>
              </div>
              <p className="text-xs text-[var(--nea-text-secondary)]">
                {certifiedParticipants}/{totalParticipants} participants certifiés
              </p>
            </div>
          )}

          <div className="space-y-3">
            {trainingModules.map((module, index) => {
              const moduleProgress = trainingProgress.find((p, i) => i === index);
              const isCompleted = moduleProgress?.status === 'completed';
              const isInProgress = moduleProgress?.status === 'in_progress';

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${
                    isCompleted ? 'bg-green-500/10 border-green-500/30' :
                    isInProgress ? 'bg-blue-500/10 border-blue-500/30' :
                    'bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-subtle)]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`p-2 rounded-lg ${
                          isCompleted ? 'bg-green-500/20' :
                          isInProgress ? 'bg-blue-500/20' :
                          'bg-gray-500/20'
                        }`}>
                          {isCompleted && <CheckCircle className="w-5 h-5 text-green-400" />}
                          {isInProgress && <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />}
                          {!moduleProgress && <BookOpen className="w-5 h-5 text-gray-400" />}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-white">{module.name}</h5>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-[var(--nea-text-muted)]">
                              <Users className="w-3 h-3 inline mr-1" />
                              {module.participants} participants
                            </span>
                          </div>
                        </div>
                      </div>
                      {isCompleted && (
                        <Badge className="bg-green-500/20 text-green-300 border-0">
                          Complété
                        </Badge>
                      )}
                      {isInProgress && (
                        <Badge className="bg-blue-500/20 text-blue-300 border-0">
                          {moduleProgress.completion}%
                        </Badge>
                      )}
                    </div>

                    {isInProgress && moduleProgress && (
                      <Progress value={moduleProgress.completion} className="h-2" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {!isTraining && trainingProgress.length > 0 && trainingProgress.every(m => m.status === 'completed') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <h4 className="text-lg font-bold text-white">Formation Complétée</h4>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-[var(--nea-text-secondary)]">
                    Tous les modules de formation ont été complétés avec succès.
                  </p>
                  <div className="flex items-center gap-6 mt-4">
                    <div className="p-3 rounded-lg bg-green-500/10">
                      <p className="text-xs text-green-400">Modules Complétés</p>
                      <p className="text-2xl font-bold text-green-400">{completedModules}/{trainingModules.length}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-500/10">
                      <p className="text-xs text-blue-400">Participants Certifiés</p>
                      <p className="text-2xl font-bold text-blue-400">{certifiedParticipants}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}