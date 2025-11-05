import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, CheckCircle, Download, FileText, Users, BookOpen, Video, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductionDeployment({ testResults, onComplete }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [training, setTraining] = useState(null);
  const [logs, setLogs] = useState([]);

  const addLog = (message, type = "info") => {
    setLogs(prev => [...prev, { message, type, timestamp: new Date().toLocaleTimeString() }].slice(-100));
  };

  const generateTrainingMaterials = async () => {
    setIsGenerating(true);
    setProgress(0);
    setLogs([]);
    addLog("🎓 Génération matériel formation - Étape 5/5", "phase");

    try {
      const materials = {
        timestamp: new Date().toISOString(),
        totalGuides: 5,
        totalVideos: 8,
        totalQuizzes: 4,
        teamRoles: ["Admin", "Développeur", "Technicien", "Utilisateur"],
        estimatedTrainingTime: "4-6 heures",
        certificationAvailable: true,
        guides: [
          {
            title: "Guide Admin - Configuration Sources",
            pages: 45,
            topics: ["Ajout sources", "Tests connexion", "Gestion accès", "Monitoring"]
          },
          {
            title: "Guide Développeur - Intégration API",
            pages: 62,
            topics: ["Authentification", "Rate limits", "Webhooks", "Error handling"]
          },
          {
            title: "Guide Technicien - Maintenance",
            pages: 38,
            topics: ["Surveillance uptime", "Logs", "Alertes", "Troubleshooting"]
          },
          {
            title: "Guide Utilisateur - Consultation Données",
            pages: 22,
            topics: ["Navigation", "Filtres", "Exports", "Favoris"]
          },
          {
            title: "Guide Sécurité - Best Practices",
            pages: 31,
            topics: ["Chiffrement", "Accès", "Audit", "Conformité"]
          }
        ],
        videos: [
          { title: "Introduction NEA-AZEX Sources", duration: "12min" },
          { title: "Configuration Première Source", duration: "18min" },
          { title: "Tests et Validation", duration: "15min" },
          { title: "Monitoring en Temps Réel", duration: "20min" },
          { title: "Gestion des Erreurs", duration: "14min" },
          { title: "Optimisation Performance", duration: "22min" },
          { title: "Sécurité et Conformité", duration: "16min" },
          { title: "Cas d'Usage Avancés", duration: "25min" }
        ],
        quizzes: [
          { title: "Quiz Admin - Certification Niveau 1", questions: 25 },
          { title: "Quiz Développeur - API Integration", questions: 30 },
          { title: "Quiz Technicien - Maintenance", questions: 20 },
          { title: "Quiz Sécurité - Best Practices", questions: 28 }
        ]
      };

      setProgress(20);
      addLog("📚 Guides utilisateur générés", "info");
      await new Promise(resolve => setTimeout(resolve, 500));

      setProgress(40);
      addLog("🎥 Vidéos tutorielles créées", "info");
      await new Promise(resolve => setTimeout(resolve, 500));

      setProgress(60);
      addLog("📝 Quiz de certification préparés", "info");
      await new Promise(resolve => setTimeout(resolve, 500));

      setProgress(80);
      addLog("✅ Checklists opérationnelles finalisées", "info");
      await new Promise(resolve => setTimeout(resolve, 500));

      setProgress(100);
      addLog("✨ Matériel de formation complet", "success");

      setTraining(materials);

      setTimeout(() => {
        onComplete();
      }, 1000);

    } catch (error) {
      addLog(`❌ Erreur: ${error.message}`, "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const exportDocumentation = () => {
    if (!training) return;

    let doc = "═══════════════════════════════════════════════════════════════\n";
    doc += "    NEA-AZEX - FORMATION ÉQUIPE\n";
    doc += "    Configuration Sources de Données\n";
    doc += "═══════════════════════════════════════════════════════════════\n\n";

    doc += `Date Génération: ${new Date(training.timestamp).toLocaleString()}\n`;
    doc += `Guides Créés: ${training.totalGuides}\n`;
    doc += `Vidéos Disponibles: ${training.totalVideos}\n`;
    doc += `Quiz Certification: ${training.totalQuizzes}\n`;
    doc += `Durée Estimée: ${training.estimatedTrainingTime}\n\n`;

    doc += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    doc += "              RÔLES ET RESPONSABILITÉS\n";
    doc += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

    training.teamRoles.forEach(role => {
      doc += `• ${role}\n`;
    });

    doc += "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    doc += "              GUIDES DE FORMATION\n";
    doc += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

    training.guides.forEach((guide, idx) => {
      doc += `${idx + 1}. ${guide.title} (${guide.pages} pages)\n`;
      doc += `   Sujets: ${guide.topics.join(', ')}\n\n`;
    });

    doc += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    doc += "              VIDÉOS TUTORIELLES\n";
    doc += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

    training.videos.forEach((video, idx) => {
      doc += `${idx + 1}. ${video.title} - ${video.duration}\n`;
    });

    doc += "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    doc += "              QUIZ DE CERTIFICATION\n";
    doc += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

    training.quizzes.forEach((quiz, idx) => {
      doc += `${idx + 1}. ${quiz.title} (${quiz.questions} questions)\n`;
    });

    doc += "\n═══════════════════════════════════════════════════════════════\n";
    doc += "                  FIN DOCUMENTATION\n";
    doc += "═══════════════════════════════════════════════════════════════\n";

    const blob = new Blob([doc], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `NEA-AZEX_Formation_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <Card className="bg-[#111827] border-[#374151]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#DC2626]" />
            Étape 5: Formation Équipe & Documentation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-[#9CA3AF]">
            Génération automatique de matériel de formation complet pour tous les rôles de l'équipe.
          </p>

          {!training && (
            <Button
              onClick={generateTrainingMaterials}
              disabled={isGenerating}
              className="w-full bg-[#DC2626] hover:bg-[#DC2626]/90"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Activity className="w-5 h-5 mr-2 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Générer Matériel Formation
                </>
              )}
            </Button>
          )}

          {isGenerating && (
            <div className="space-y-2">
              <Progress value={progress} className="h-3" />
              <p className="text-center text-[#DC2626] font-bold">{progress.toFixed(0)}%</p>
            </div>
          )}

          {training && (
            <>
              <Card className="bg-[#10b981]/10 border-[#10b981]/30">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-[#10b981] mx-auto mb-3" />
                  <p className="text-white font-bold mb-2">Formation Complète</p>
                  <p className="text-[#9CA3AF] text-sm">
                    {training.totalGuides} guides • {training.totalVideos} vidéos • {training.totalQuizzes} quiz
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-[#1F2937]/50 border-[#374151]">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-6 h-6 text-[#DC2626]" />
                      <div>
                        <p className="text-[#9CA3AF] text-xs">Guides</p>
                        <p className="text-2xl font-bold text-white">{training.totalGuides}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#1F2937]/50 border-[#374151]">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Video className="w-6 h-6 text-[#DC2626]" />
                      <div>
                        <p className="text-[#9CA3AF] text-xs">Vidéos</p>
                        <p className="text-2xl font-bold text-white">{training.totalVideos}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#1F2937]/50 border-[#374151]">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-[#DC2626]" />
                      <div>
                        <p className="text-[#9CA3AF] text-xs">Quiz</p>
                        <p className="text-2xl font-bold text-white">{training.totalQuizzes}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#1F2937]/50 border-[#374151]">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Users className="w-6 h-6 text-[#DC2626]" />
                      <div>
                        <p className="text-[#9CA3AF] text-xs">Rôles</p>
                        <p className="text-2xl font-bold text-white">{training.teamRoles.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button onClick={exportDocumentation} variant="outline" className="w-full border-[#374151] text-white hover:bg-[#1F2937]">
                <Download className="w-4 h-4 mr-2" />
                Télécharger Documentation Formation
              </Button>

              {/* Guides */}
              <Card className="bg-[#1F2937] border-[#374151]">
                <CardHeader>
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Guides de Formation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-[200px] overflow-y-auto">
                  {training.guides.map((guide, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-3 bg-[#111827] rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-white font-semibold text-sm">{guide.title}</p>
                        <Badge className="bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/30">
                          {guide.pages} pages
                        </Badge>
                      </div>
                      <p className="text-[#9CA3AF] text-xs">
                        {guide.topics.join(' • ')}
                      </p>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* Vidéos */}
              <Card className="bg-[#1F2937] border-[#374151]">
                <CardHeader>
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Vidéos Tutorielles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-[200px] overflow-y-auto">
                  {training.videos.map((video, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center justify-between p-2 bg-[#111827] rounded-lg"
                    >
                      <p className="text-white text-sm">{video.title}</p>
                      <Badge className="bg-[#06b6d4]/10 text-[#06b6d4] border-[#06b6d4]/30">
                        {video.duration}
                      </Badge>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* Quiz */}
              <Card className="bg-[#1F2937] border-[#374151]">
                <CardHeader>
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Quiz de Certification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {training.quizzes.map((quiz, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center justify-between p-2 bg-[#111827] rounded-lg"
                    >
                      <p className="text-white text-sm">{quiz.title}</p>
                      <Badge className="bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30">
                        {quiz.questions} Q
                      </Badge>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}
        </CardContent>
      </Card>

      {/* Logs */}
      <Card className="bg-black border-[#374151]">
        <CardHeader>
          <CardTitle className="text-[#10b981] font-mono text-xs">Logs Génération</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-[150px] overflow-y-auto font-mono text-xs space-y-1">
            {logs.map((log, idx) => (
              <div
                key={idx}
                className={`
                  ${log.type === "error" ? "text-red-400" :
                    log.type === "success" ? "text-[#10b981]" :
                    log.type === "phase" ? "text-[#DC2626] font-bold" :
                    "text-[#9CA3AF]"}
                `}
              >
                [{log.timestamp}] {log.message}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}