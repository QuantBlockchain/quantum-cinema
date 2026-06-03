"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const NOBEL_LAUREATES = [
  {
    name: "John Clarke",
    affiliation: "UC Berkeley",
    contribution:
      "Demonstrated macroscopic quantum tunneling in superconducting circuits and invented the SQUID",
    bio: "British-American physicist. Pioneer of superconducting quantum devices since the 1960s. His invention of the SQUID (Superconducting Quantum Interference Device) remains the most sensitive magnetic-flux detector ever built, enabling applications from brain imaging to gravitational wave detection.",
    photo: "/laureates/clarke.jpg",
    color: "#00f0ff",
    rgb: "0, 240, 255",
  },
  {
    name: "Michel Devoret",
    affiliation: "Yale University",
    contribution:
      "Proved that electrical circuits can behave quantum-mechanically and demonstrated energy quantization",
    bio: "French-American physicist. In the 1980s-90s, his experiments at CEA-Saclay showed that macroscopic superconducting circuits obey quantum mechanics, exhibiting discrete energy levels just like atoms. This breakthrough established the field of circuit quantum electrodynamics (circuit QED).",
    photo: "/laureates/devoret.webp",
    color: "#a855f7",
    rgb: "168, 85, 247",
  },
  {
    name: "John Martinis",
    affiliation: "UC Santa Barbara",
    contribution:
      "Built the first high-fidelity superconducting qubit and led the 2019 Google quantum supremacy experiment",
    bio: "American physicist. Transformed superconducting circuits from lab curiosities into practical quantum processors. At Google, his team demonstrated quantum supremacy in 2019 — a 53-qubit Sycamore processor solved a problem in 200 seconds that would take classical supercomputers 10,000 years.",
    photo: "/laureates/martinis.jpg",
    color: "#f59e0b",
    rgb: "245, 158, 11",
  },
];

const QUANTUM_MILESTONES = [
  {
    year: "1900",
    event: "Planck's Quantum Hypothesis",
    desc: "Max Planck proposes energy is quantized, launching quantum theory",
  },
  {
    year: "1927",
    event: "Uncertainty Principle",
    desc: "Heisenberg establishes fundamental limits of measurement",
  },
  {
    year: "1981",
    event: "Feynman's Vision",
    desc: 'Richard Feynman proposes "simulating physics with computers" — quantum computers',
  },
  {
    year: "1994",
    event: "Shor's Algorithm",
    desc: "Peter Shor proves quantum computers can break RSA encryption",
  },
  {
    year: "2019",
    event: "Quantum Supremacy",
    desc: "Google Sycamore performs a computation impossible for classical machines",
  },
  {
    year: "2025",
    event: "Nobel Prize",
    desc: "Recognition of superconducting circuit quantum foundations",
  },
];

export default function NobelPrizeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="relative min-h-screen px-4 sm:px-6 py-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="text-center mb-12 max-w-4xl mx-auto"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="8" r="6" />
            <path d="M9 14l-3 8 6-3 6 3-3-8" />
          </svg>
        </div>

        <Badge
          variant="outline"
          className="mb-4 font-mono text-[10px] tracking-[0.4em] text-accent-gold/60 border-accent-gold/15 bg-accent-gold/[0.03]"
        >
          WHERE IT ALL BEGAN
        </Badge>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold mb-4 tracking-tight">
          2025 Nobel Prize in{" "}
          <span className="bg-gradient-to-r from-accent-gold via-accent-purple to-accent-cyan bg-clip-text text-transparent">
            Physics
          </span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Awarded for pioneering experiments that demonstrated{" "}
          <span className="text-accent-gold font-medium">
            macroscopic quantum tunneling and energy quantization
          </span>{" "}
          in superconducting circuits — the foundation of today&apos;s quantum
          computers.
        </p>
      </motion.div>

      {/* Laureates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto mb-12">
        {NOBEL_LAUREATES.map((laureate, i) => (
          <motion.div
            key={laureate.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
          >
            <Card
              className="bg-card/50 border-border/50 h-full hover:border-border transition-all duration-300 group"
              style={{ borderColor: `rgba(${laureate.rgb}, 0.1)` }}
            >
              <CardContent className="pt-6 pb-5">
                <div
                  className="w-16 h-16 rounded-full mb-4 overflow-hidden"
                  style={{
                    border: `2px solid rgba(${laureate.rgb}, 0.3)`,
                  }}
                >
                  <Image
                    src={laureate.photo}
                    alt={laureate.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-0.5">
                  {laureate.name}
                </h3>
                <p
                  className="text-xs font-mono mb-3"
                  style={{ color: laureate.color }}
                >
                  {laureate.affiliation}
                </p>

                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {laureate.contribution}
                </p>

                <Separator
                  className="mb-3"
                  style={{
                    background: `rgba(${laureate.rgb}, 0.1)`,
                  }}
                />

                <p className="text-xs text-muted-foreground/60 leading-relaxed">
                  {laureate.bio}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Significance callout */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="max-w-4xl mx-auto mb-14"
      >
        <Card className="bg-accent-gold/[0.03] border-accent-gold/10 border-l-4 border-l-accent-gold/40">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Their work proved that a macroscopic electrical circuit — cooled to
              near absolute zero — can behave like a single quantum particle.
              This made it possible to engineer{" "}
              <span className="text-accent-gold font-medium">
                artificial atoms from superconducting circuits
              </span>
              , which today form the qubits inside quantum computers from Google,
              IBM, and others. This is the bridge between{" "}
              <span className="text-accent-cyan font-medium">
                quantum theory
              </span>{" "}
              and{" "}
              <span className="text-accent-purple font-medium">
                quantum technology
              </span>
              .
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, delay: 0.4 }}
        className="max-w-4xl mx-auto mb-14"
      >
        <h2 className="text-center text-sm font-mono tracking-widest text-muted-foreground/40 mb-8">
          THE QUANTUM TIMELINE
        </h2>

        <div className="relative">
          {/* Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent-cyan/20 via-accent-purple/20 to-accent-gold/20" />

          <div className="space-y-6">
            {QUANTUM_MILESTONES.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
                className={`flex items-center gap-4 ${
                  i % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
              >
                <div
                  className={`flex-1 ${
                    i % 2 === 0 ? "text-right" : "text-left"
                  }`}
                >
                  <span className="text-xs font-mono text-accent-cyan/60">
                    {m.year}
                  </span>
                  <h4 className="text-sm font-semibold text-foreground">
                    {m.event}
                  </h4>
                  <p className="text-xs text-muted-foreground/60">{m.desc}</p>
                </div>

                <div className="relative z-10 size-3 rounded-full bg-accent-cyan/40 border-2 border-background shrink-0" />

                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="text-center"
      >
        <p className="text-muted-foreground/40 text-xs font-mono tracking-widest mb-4">
          SEE THE QUANTUM WORLD THROUGH AI EYES
        </p>
        <Button
          onClick={onNext}
          variant="outline"
          size="lg"
          className="font-mono text-xs tracking-[0.2em] rounded-full px-8 h-11 text-accent-cyan border-accent-cyan/30 bg-accent-cyan/5 hover:bg-accent-cyan/10 hover:text-accent-cyan glow-cyan"
        >
          EXPLORE QUANTUM WORLDS
          <svg className="ml-2" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </Button>
      </motion.div>
    </div>
  );
}
