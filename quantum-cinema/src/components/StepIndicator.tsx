"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Nobel Prize", short: "01" },
  { label: "World Models", short: "02" },
  { label: "Explore", short: "03" },
  { label: "Compare", short: "04" },
];

interface StepIndicatorProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export default function StepIndicator({
  currentStep,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/60 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14 px-4 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5 group">
          <div className="relative size-7 rounded-full border border-accent-cyan/40 flex items-center justify-center">
            <div className="size-2.5 rounded-full bg-accent-cyan/70" />
          </div>
          <span className="text-xs font-mono tracking-[0.25em] text-muted-foreground hidden sm:block">
            QUANTUM CINEMA
          </span>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-1">
          {STEPS.map((step, i) => {
            const isActive = currentStep === i;
            const isCompleted = currentStep > i;

            return (
              <button
                key={i}
                onClick={() => (isCompleted || isActive) && i !== currentStep && onStepClick(i)}
                className={cn(
                  "relative flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10px] tracking-wider transition-all duration-300",
                  isActive &&
                    "bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20",
                  isCompleted &&
                    "text-muted-foreground/60 hover:text-accent-cyan cursor-pointer",
                  !isActive &&
                    !isCompleted &&
                    "text-muted-foreground/30 cursor-default"
                )}
              >
                {/* Step dot */}
                <div
                  className={cn(
                    "size-1.5 rounded-full transition-all duration-300",
                    isActive && "bg-accent-cyan shadow-[0_0_6px_rgba(0,240,255,0.5)]",
                    isCompleted && "bg-accent-green",
                    !isActive && !isCompleted && "bg-muted-foreground/20"
                  )}
                />
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sm:hidden">{step.short}</span>
              </button>
            );
          })}
        </div>

        {/* Progress fraction */}
        <span className="text-[10px] font-mono text-muted-foreground/30">
          {currentStep + 1}/4
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-px bg-border/20">
        <motion.div
          className="h-full bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-gold"
          initial={false}
          animate={{ width: `${((currentStep + 1) / 4) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}
