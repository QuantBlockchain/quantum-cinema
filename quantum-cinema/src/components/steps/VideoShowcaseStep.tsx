"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { DeviceId } from "@/app/page";

const QUANTUM_VIDEOS = [
  {
    id: "ion-trap",
    title: "IonQ Aria",
    subtitle: "Trapped-Ion Architecture",
    worldName: "Light Suspension",
    description:
      "Ytterbium ions levitated in vacuum and manipulated by lasers. Each ion holds its quantum state for seconds — an eternity in the quantum world.",
    src: "/videos/ion-trap.mp4",
    color: "#a855f7",
    rgb: "168, 85, 247",
    metrics: {
      coherence: "~1-10 s",
      fidelity: "99.5%+",
      qubits: "25",
    },
    entanglement: {
      method: "Shared Chain Motion",
      summary:
        "Ions entangle through the collective vibration of the whole ion chain. Laser pulses couple two ions to the same shared motion — after that, their quantum states are forever linked.",
    },
  },
  {
    id: "superconducting",
    title: "Rigetti Ankaa-3",
    subtitle: "Superconducting Architecture",
    worldName: "Frozen Forge",
    description:
      "Superconducting circuits chilled to ~10mK. Golden circuitry encased in frost, where qubits race against decoherence.",
    src: "/videos/superconducting.mp4",
    color: "#f59e0b",
    rgb: "245, 158, 11",
    metrics: {
      coherence: "~20-100 \u00b5s",
      fidelity: "99.0%+",
      qubits: "84",
    },
    entanglement: {
      method: "Local Chip Couplers",
      summary:
        "Entanglement is created when the chip activates a local quantum bridge between neighboring qubits. Unlike ions, only nearby qubits on the circuit can directly entangle.",
    },
  },
  {
    id: "neutral-atoms",
    title: "QuEra Aquila",
    subtitle: "Neutral-Atom Architecture",
    worldName: "Wave Garden",
    description:
      "Neutral atoms arranged by optical tweezers at room temperature. 256 atoms simulating nature by being nature.",
    src: "/videos/neutral-atoms.mp4",
    color: "#10b981",
    rgb: "16, 185, 129",
    metrics: {
      coherence: "~1-10 \u00b5s",
      fidelity: "~97-99%",
      qubits: "256",
    },
    entanglement: {
      method: "Spatial Rydberg Interactions",
      summary:
        "Exciting one atom into a Rydberg state changes what nearby atoms can do. Distance matters — geometry determines entanglement, making the spatial arrangement itself the computation.",
    },
  },
];

export default function VideoShowcaseStep({
  onSelectDevice,
  onBack,
}: {
  onNext: () => void;
  onSelectDevice: (deviceId: DeviceId) => void;
  onBack: () => void;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="relative min-h-screen px-4 sm:px-6 py-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="text-center mb-10 max-w-3xl mx-auto"
      >
        <Badge
          variant="outline"
          className="mb-4 font-mono text-[10px] tracking-[0.4em] text-accent-purple/60 border-accent-purple/15 bg-accent-purple/[0.03]"
        >
          GENERATIVE WORLD MODELS
        </Badge>

        <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-3 tracking-tight">
          Quantum Worlds{" "}
          <span className="text-glow-purple text-accent-purple">
            Dreamed by AI
          </span>
        </h1>

        <p className="text-muted-foreground text-sm leading-relaxed">
          These are not filmed — they are{" "}
          <span className="text-accent-purple font-medium">predicted</span> by
          generative world models. Each video shows a distinct quantum
          architecture and how it creates{" "}
          <span className="text-accent-cyan font-medium">entanglement</span> —
          the phenomenon that makes quantum computing possible.
        </p>
      </motion.div>

      {/* Quantum Entanglement Section — placed before videos */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12 }}
        className="max-w-5xl mx-auto mb-14"
      >
        <div className="text-center mb-8">
          <Badge
            variant="outline"
            className="mb-3 font-mono text-[10px] tracking-[0.4em] text-accent-cyan/60 border-accent-cyan/15 bg-accent-cyan/[0.03]"
          >
            THE QUANTUM CONNECTION
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-3">
            What is Quantum{" "}
            <span className="text-accent-cyan text-glow-cyan">
              Entanglement
            </span>
            ?
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Entanglement is the phenomenon where two qubits become linked so
            that measuring one instantly determines the state of the other — no
            matter the distance. It is the resource that makes quantum computers
            more powerful than classical ones. But{" "}
            <span className="text-foreground font-medium">
              each architecture creates entanglement in a fundamentally different
              way
            </span>
            :
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {QUANTUM_VIDEOS.map((v) => (
            <Card
              key={v.id}
              className="bg-card/50 border-border/50"
              style={{ borderColor: `rgba(${v.rgb}, 0.1)` }}
            >
              <CardContent className="pt-5">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="size-2 rounded-full"
                    style={{ background: v.color }}
                  />
                  <span
                    className="text-xs font-semibold"
                    style={{ color: v.color }}
                  >
                    {v.title}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="mb-2 font-mono text-[9px] tracking-[0.2em]"
                  style={{
                    color: v.color,
                    borderColor: `rgba(${v.rgb}, 0.2)`,
                  }}
                >
                  {v.entanglement.method.toUpperCase()}
                </Badge>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {v.entanglement.summary}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-xl bg-accent-cyan/[0.03] border border-accent-cyan/10">
          <p className="text-xs text-muted-foreground leading-relaxed text-center">
            <span className="text-accent-cyan font-medium">Same phenomenon, three paths:</span>{" "}
            Ions use shared vibration. Superconductors use local chip couplers.
            Neutral atoms use spatial proximity. The physics is the same — two
            qubits becoming one joint quantum state — but the engineering is
            radically different.
          </p>
        </div>
      </motion.div>

      {/* Three videos side by side */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="max-w-7xl mx-auto mb-14"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {QUANTUM_VIDEOS.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group"
            >
              <Card
                className="bg-card/50 border-border/50 overflow-hidden transition-all duration-500 hover:-translate-y-1 h-full flex flex-col"
                style={{
                  borderColor:
                    hoveredIndex === i
                      ? `rgba(${v.rgb}, 0.3)`
                      : undefined,
                  boxShadow:
                    hoveredIndex === i
                      ? `0 0 30px rgba(${v.rgb}, 0.1)`
                      : undefined,
                }}
              >
                {/* Video */}
                <div className="relative aspect-video overflow-hidden">
                  <video
                    src={v.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(ellipse at center, rgba(${v.rgb}, 0.4), transparent 70%)`,
                    }}
                  />
                  <div className="absolute top-3 left-3 z-10">
                    <Badge
                      variant="outline"
                      className="font-mono text-[9px] tracking-wider bg-background/60 backdrop-blur-sm"
                      style={{
                        color: v.color,
                        borderColor: `rgba(${v.rgb}, 0.3)`,
                      }}
                    >
                      <span
                        className="size-1.5 rounded-full mr-1.5"
                        style={{ background: v.color }}
                      />
                      {v.worldName}
                    </Badge>
                  </div>
                </div>

                {/* Info */}
                <CardContent className="p-4 flex flex-col flex-1">
                  <h3 className="text-base font-semibold text-foreground mb-0.5">
                    {v.title}
                  </h3>
                  <p
                    className="text-[10px] font-mono tracking-wider mb-2"
                    style={{ color: v.color }}
                  >
                    {v.subtitle}
                  </p>
                  <p className="text-xs text-muted-foreground/70 leading-relaxed mb-3 flex-1">
                    {v.description}
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-1.5 mb-3">
                    {Object.entries(v.metrics).map(([key, val]) => (
                      <div
                        key={key}
                        className="px-2 py-1.5 rounded bg-secondary/30 border border-border/20"
                      >
                        <div className="text-[8px] font-mono text-muted-foreground/40 uppercase tracking-wider">
                          {key}
                        </div>
                        <div
                          className="text-[10px] font-mono font-medium"
                          style={{ color: v.color }}
                        >
                          {val}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Select button */}
                  <Button
                    onClick={() => onSelectDevice(v.id as DeviceId)}
                    variant="outline"
                    size="lg"
                    className="w-full font-mono text-xs tracking-wider h-11 rounded-lg transition-all duration-300"
                    style={{
                      color: v.color,
                      borderColor: `rgba(${v.rgb}, 0.35)`,
                      background: `rgba(${v.rgb}, 0.08)`,
                      boxShadow: `0 0 15px rgba(${v.rgb}, 0.1)`,
                    }}
                  >
                    EXPLORE THIS WORLD
                    <svg
                      className="ml-2"
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M3 8h10M9 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <Separator className="max-w-md mx-auto mb-8 bg-border/20" />

      {/* Bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <p className="text-muted-foreground/40 text-xs font-mono tracking-widest mb-4">
          SELECT A QUANTUM WORLD ABOVE TO SEE ENTANGLEMENT IN ACTION
        </p>
        <Button
          onClick={onBack}
          variant="outline"
          className="font-mono text-xs tracking-[0.15em] rounded-full px-6 h-10 text-muted-foreground border-border/50 hover:text-foreground"
        >
          <svg
            className="mr-1.5"
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M13 8H3M7 4L3 8l4 4"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          BACK
        </Button>
      </motion.div>
    </div>
  );
}
