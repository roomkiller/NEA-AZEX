import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Bot, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function InteractionPanel({ simulation }) {
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Simulation active: ${simulation?.simulation_name || 'Aucune simulation sélectionnée'}. Comment puis-je vous assister?`
    }
  ]);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error("Veuillez entrer un message");
      return;
    }

    const userMessage = message;
    setMessage("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsProcessing(true);

    try {
      // Simulation d'une réponse IA
      // En production, appeler l'agent ou un LLM
      await new Promise(resolve => setTimeout(resolve, 1500));

      const aiResponse = `Analyse en cours de votre demande concernant "${userMessage}". Les données de la simulation indiquent...`;
      
      setMessages(prev => [...prev, { role: "assistant", content: aiResponse }]);
      toast.success("Réponse générée");
    } catch (error) {
      toast.error("Erreur lors du traitement");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <MessageSquare className="w-5 h-5 text-[var(--nea-primary-blue)]" />
          Assistant IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Messages */}
        <div className="space-y-3 max-h-60 overflow-y-auto styled-scrollbar">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-[var(--nea-primary-blue)]/20 flex items-center justify-center shrink-0">
                  <Bot className="w-3 h-3 text-[var(--nea-primary-blue)]" />
                </div>
              )}
              <div
                className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  msg.role === 'user'
                    ? 'bg-[var(--nea-primary-blue)]/20 text-white'
                    : 'bg-[var(--nea-bg-surface-hover)] text-[var(--nea-text-primary)]'
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2 items-center"
            >
              <div className="w-6 h-6 rounded-full bg-[var(--nea-primary-blue)]/20 flex items-center justify-center">
                <Loader2 className="w-3 h-3 text-[var(--nea-primary-blue)] animate-spin" />
              </div>
              <div className="bg-[var(--nea-bg-surface-hover)] p-3 rounded-lg">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-[var(--nea-text-secondary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-[var(--nea-text-secondary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-[var(--nea-text-secondary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Posez une question sur la simulation..."
            className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-white resize-none h-20"
            disabled={isProcessing}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isProcessing || !message.trim()}
            className="bg-[var(--nea-primary-blue)] hover:bg-sky-500"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}