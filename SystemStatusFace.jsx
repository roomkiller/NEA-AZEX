import React, { useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useUpdates } from '../updates/GlobalUpdateProvider';

const faceVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "backOut" } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3, ease: "backIn" } },
};

const eyeVariants = {
  open: { scaleY: 1 },
  blinking: { scaleY: 0.1, transition: { duration: 0.05, repeat: 3, yoyo: true, repeatType: "mirror" } },
};

const Expressions = {
  operational: {
    mouth: "M 18 32 Q 25 36 32 32",
    eyes: { cy: 22 },
    color: "hsl(210, 80%, 65%)",
    label: "Système Opérationnel"
  },
  thinking: {
    mouth: "M 18 32 L 32 32",
    eyes: { cy: 22 },
    color: "hsl(187, 70%, 55%)",
    label: "Analyse en cours..."
  },
  warning: {
    mouth: "M 18 32 Q 25 29 32 32",
    eyes: { cy: 23 },
    color: "hsl(45, 80%, 60%)",
    label: "Avertissement Détecté"
  },
  critical: {
    mouth: "M 18 34 Q 25 26 32 34",
    eyes: { cy: 24 },
    color: "hsl(0, 70%, 60%)",
    label: "Incident Critique"
  },
  speaking: {
    mouth: "M 20 33 C 22 38, 28 38, 30 33",
    eyes: { cy: 22 },
    color: "hsl(187, 80%, 75%)",
    label: "Communication en cours..."
  }
};

export default function SystemStatusFace({ status = 'operational', size = 32 }) {
  const { isSpeaking, speechWordBoundary } = useUpdates() || {};
  const mouthControls = useAnimation();

  const finalStatus = isSpeaking ? 'speaking' : status;
  const currentExpression = Expressions[finalStatus] || Expressions.operational;
  const uniqueKey = finalStatus;
  
  useEffect(() => {
    if (isSpeaking) {
      mouthControls.start({ 
        scaleY: [1, 0.4, 1], 
        transition: { duration: 0.15, ease: "easeInOut" } 
      });
    } else {
      mouthControls.start({ scaleY: 1, transition: { duration: 0.2 } });
    }
  }, [speechWordBoundary, isSpeaking, mouthControls]);

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center justify-center cursor-pointer" style={{ width: size, height: size }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.svg
                key={uniqueKey}
                width={size}
                height={size}
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                variants={faceVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <motion.circle 
                    cx="25" cy="25" r="24" 
                    stroke={currentExpression.color} 
                    strokeWidth="1.5"
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: [0.3, 0.8, 0.3], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
                />
                <motion.circle cx="25" cy="25" r="22" fill="var(--nea-bg-surface-hover)" />
                <motion.g animate={finalStatus === 'thinking' ? "blinking" : "open"} variants={eyeVariants}>
                   <motion.circle
                        cx="18"
                        cy={currentExpression.eyes.cy}
                        r="2.5"
                        fill={currentExpression.color}
                        transition={{ duration: 0.2 }}
                    />
                    <motion.circle
                        cx="32"
                        cy={currentExpression.eyes.cy}
                        r="2.5"
                        fill={currentExpression.color}
                        transition={{ duration: 0.2 }}
                    />
                </motion.g>
                <motion.g animate={mouthControls} style={{ transformOrigin: "50% 100%" }}>
                    <motion.path
                      d={currentExpression.mouth}
                      stroke={currentExpression.color}
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1, transition: { duration: 0.5, delay: 0.2 } }}
                    />
                </motion.g>
              </motion.svg>
            </AnimatePresence>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)] text-[var(--nea-text-primary)]">
          <p>{currentExpression.label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}