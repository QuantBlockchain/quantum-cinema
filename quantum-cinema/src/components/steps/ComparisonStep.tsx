"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RadarChart from "@/components/RadarChart";

// Performance metrics normalized to 0-100 for the radar chart. Axes are the
// platform-agnostic, normalizable, monotonic set recommended for cross-device
// comparison \u2014 see docs/world-models/significance-analysis.md (Q3). Error Rate
// is inverted (higher score = lower error) so every axis reads "higher = better".
// For analog devices, fidelity axes use platform-native (sequence-level/per-atom)
// equivalents reported on the same scale.
const DEVICES = [
  {
    id: "ionq",
    name: "IonQ Aria",
    provider: "IonQ",
    technology: "Trapped Ion",
    paradigm: "gate-based" as const,
    color: "#a855f7",
    rgb: "168, 85, 247",
    scores: {
      "Coherence": 95,
      "2Q Fidelity": 90,
      "Readout": 95,
      "Error Rate": 85,
      "Connectivity": 95,
      "Scale": 12,
    },
    details: {
      coherenceTime: "~1-10 seconds",
      twoQubitFidelity: "99.5%+",
      readoutFidelity: "~99.7%",
      errorRate: "~0.5%",
      connectivity: "Full (all-to-all)",
      qubits: "25",
    },
    limitation:
      "Extremely slow operation speeds limit computational depth despite long coherence",
    bestFor: "Discovering new drugs (small molecules)",
  },
  {
    id: "rigetti",
    name: "Rigetti Ankaa-3",
    provider: "Rigetti",
    technology: "Superconducting",
    paradigm: "gate-based" as const,
    color: "#f59e0b",
    rgb: "245, 158, 11",
    scores: {
      "Coherence": 25,
      "2Q Fidelity": 80,
      "Readout": 70,
      "Error Rate": 70,
      "Connectivity": 30,
      "Scale": 45,
    },
    details: {
      coherenceTime: "~20-100 \u00b5s",
      twoQubitFidelity: "99.0%+",
      readoutFidelity: "~97-99%",
      errorRate: "~1%",
      connectivity: "Limited (nearest-neighbor)",
      qubits: "84",
    },
    limitation:
      "Fragile quantum states decay in microseconds, requiring extremely fast operations",
    bestFor: "Optimizing national power grids",
  },
  {
    id: "quera",
    name: "QuEra Aquila",
    provider: "QuEra",
    technology: "Neutral Atom",
    paradigm: "analog" as const,
    color: "#10b981",
    rgb: "16, 185, 129",
    scores: {
      "Coherence": 20,
      "2Q Fidelity": 65,
      "Readout": 80,
      "Error Rate": 55,
      "Connectivity": 70,
      "Scale": 100,
    },
    details: {
      coherenceTime: "~1-10 \u00b5s",
      twoQubitFidelity: "~97-99% (sequence)",
      readoutFidelity: "~99% (per-atom)",
      errorRate: "~1-3%",
      connectivity: "Programmable geometry",
      qubits: "256",
    },
    limitation:
      'Limited to specific "analog" quantum simulations; cannot run general digital algorithms',
    bestFor: "Designing carbon capture materials",
  },
];

// Tabs filter the comparison by computational paradigm. Gate-based and analog
// devices are benchmarked differently, so they are grouped rather than mixed on
// one chart — see docs/world-models/significance-analysis.md (Q3).
const PARADIGM_VIEWS = [
  { id: "gate-based", label: "Gate-Based" },
  { id: "analog", label: "Analog" },
];

const APPLICATION_MATCHES = [
  {
    problem: "Discover new drugs",
    best: "ionq",
    reason:
      "High fidelity prevents errors in molecular simulation, but limited to ~20-100 qubits",
    icon: "💊",
  },
  {
    problem: "Optimize power grids",
    best: "rigetti",
    reason:
      "Fast gates allow rapid optimization iterations, but coherence limits problem size",
    icon: "⚡",
  },
  {
    problem: "Design carbon capture",
    best: "quera",
    reason:
      "Native analog simulation matches the physics of materials science naturally",
    icon: "🌱",
  },
];

export default function ComparisonStep({ onBack }: { onBack: () => void }) {
  const [view, setView] = useState("gate-based");
  const [deselected, setDeselected] = useState<string[]>([]);

  const toggleDevice = (id: string) => {
    setDeselected((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  // Devices in the active paradigm tab; within those, the ones still selected.
  const paradigmDevices = DEVICES.filter((d) => d.paradigm === view);
  const selectedData = paradigmDevices.filter(
    (d) => !deselected.includes(d.id)
  );

  const radarSeries = selectedData.map((d) => ({
    name: d.name,
    color: d.color,
    rgb: d.rgb,
    data: Object.entries(d.scores).map(([axis, value]) => ({ axis, value })),
  }));

  return (
    <div className="relative min-h-screen px-4 sm:px-6 py-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="text-center mb-10 max-w-4xl mx-auto"
      >
        <Badge
          variant="outline"
          className="mb-4 font-mono text-[10px] tracking-[0.4em] text-accent-gold/60 border-accent-gold/15 bg-accent-gold/[0.03]"
        >
          THE MIRROR
        </Badge>

        <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-3 tracking-tight">
          Quantum Architecture{" "}
          <span className="bg-gradient-to-r from-accent-gold via-accent-purple to-accent-cyan bg-clip-text text-transparent">
            Comparison
          </span>
        </h1>

        <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mx-auto">
          Compare quantum computing architectures across the performance metrics
          that matter for entanglement, grouped by computational paradigm. Each
          technology makes different tradeoffs — there is no single
          &ldquo;best&rdquo; quantum computer.
        </p>
      </motion.div>

      {/* Device selector */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-5xl mx-auto mb-8"
      >
        <Tabs
          value={view}
          onValueChange={setView}
          className="flex justify-center mb-6"
        >
          <TabsList className="bg-secondary/30">
            {PARADIGM_VIEWS.map((v) => (
              <TabsTrigger
                key={v.id}
                value={v.id}
                className="font-mono text-[10px] tracking-wider px-4 data-[state=active]:bg-accent-cyan/10 data-[state=active]:text-accent-cyan"
              >
                {v.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap justify-center gap-2">
          {paradigmDevices.map((d) => {
            const active = !deselected.includes(d.id);
            return (
              <button
                key={d.id}
                onClick={() => toggleDevice(d.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-mono tracking-wider transition-all duration-300"
                style={{
                  borderColor: active
                    ? `rgba(${d.rgb}, 0.4)`
                    : "rgba(255,255,255,0.08)",
                  background: active ? `rgba(${d.rgb}, 0.1)` : "transparent",
                  color: active ? d.color : "var(--muted-foreground)",
                }}
              >
                <div
                  className="size-2 rounded-full"
                  style={{
                    background: active ? d.color : "var(--muted-foreground)",
                  }}
                />
                {d.name}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Radar Chart + Details */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${view}-${selectedData.map((d) => d.id).join(",")}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid lg:grid-cols-2 gap-6 mb-10">
            {/* Radar Chart */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono tracking-wider text-muted-foreground/60">
                  PERFORMANCE METRICS
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="w-[320px] h-[320px]">
                  <RadarChart series={radarSeries} size={320} />
                </div>
              </CardContent>

              {/* Legend */}
              <div className="px-6 pb-5 flex flex-wrap justify-center gap-4">
                {selectedData.map((d) => (
                  <div key={d.id} className="flex items-center gap-1.5">
                    <div
                      className="size-2.5 rounded-full"
                      style={{ background: d.color }}
                    />
                    <span
                      className="text-[10px] font-mono"
                      style={{ color: d.color }}
                    >
                      {d.name}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Detail Cards */}
            <div className="space-y-3">
              {selectedData.map((d) => (
                <Card
                  key={d.id}
                  className="bg-card/50 border-border/50"
                  style={{ borderColor: `rgba(${d.rgb}, 0.1)` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="size-3 rounded-full"
                        style={{ background: d.color }}
                      />
                      <h3 className="text-sm font-semibold text-foreground">
                        {d.name}
                      </h3>
                      <Badge
                        variant="outline"
                        className="ml-auto font-mono text-[9px]"
                        style={{
                          color: d.color,
                          borderColor: `rgba(${d.rgb}, 0.2)`,
                        }}
                      >
                        {d.technology}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {Object.entries(d.details).map(([key, val]) => (
                        <div
                          key={key}
                          className="px-2 py-1.5 rounded bg-secondary/30 border border-border/20"
                        >
                          <div className="text-[8px] font-mono text-muted-foreground/40 uppercase tracking-wider">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </div>
                          <div
                            className="text-[10px] font-mono font-medium"
                            style={{ color: d.color }}
                          >
                            {val}
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
                      <span className="text-accent-cyan font-medium">
                        Best for:
                      </span>{" "}
                      {d.bestFor} —{" "}
                      <span className="text-muted-foreground/40">
                        {d.limitation}
                      </span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Bar chart comparison */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-4xl mx-auto mb-10"
          >
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono tracking-wider text-muted-foreground/60">
                  METRIC BREAKDOWN
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                {Object.keys(paradigmDevices[0].scores).map((metric) => (
                  <div key={metric} className="mb-4 last:mb-0">
                    <div className="text-[9px] font-mono text-muted-foreground/40 tracking-wider mb-1.5 uppercase">
                      {metric}
                    </div>
                    <div className="space-y-1">
                      {selectedData.map((d) => {
                        const val =
                          d.scores[metric as keyof typeof d.scores] || 0;
                        return (
                          <div
                            key={d.id}
                            className="flex items-center gap-2"
                          >
                            <span
                              className="text-[9px] font-mono w-24 truncate"
                              style={{ color: d.color }}
                            >
                              {d.name.split(" ")[0]}
                            </span>
                            <div className="flex-1 h-4 bg-secondary/30 rounded overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${val}%` }}
                                transition={{
                                  duration: 0.4,
                                  delay: 0.1,
                                  ease: "easeOut",
                                }}
                                className="h-full rounded flex items-center justify-end pr-1.5"
                                style={{
                                  background: `linear-gradient(90deg, rgba(${d.rgb}, 0.3), rgba(${d.rgb}, 0.6))`,
                                }}
                              >
                                <span className="text-[8px] font-mono text-white/80">
                                  {val}
                                </span>
                              </motion.div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Application matching */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="max-w-4xl mx-auto mb-10"
      >
        <h3 className="text-center text-sm font-mono tracking-widest text-muted-foreground/40 mb-6">
          MATCHING HARDWARE TO HUMANITY&apos;S CHALLENGES
        </h3>

        <div className="grid sm:grid-cols-2 gap-3">
          {APPLICATION_MATCHES.map((match) => {
            const device = DEVICES.find((d) => d.id === match.best)!;
            return (
              <Card
                key={match.problem}
                className="bg-card/50 border-border/50"
                style={{ borderColor: `rgba(${device.rgb}, 0.08)` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{match.icon}</span>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-0.5">
                        {match.problem}
                      </h4>
                      <p className="text-[10px] font-mono mb-1.5" style={{ color: device.color }}>
                        Best: {device.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
                        {match.reason}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </motion.div>

      {/* Key insight */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="max-w-3xl mx-auto mb-10"
      >
        <Card className="bg-accent-cyan/[0.02] border-accent-cyan/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="7"
                  stroke="#00f0ff"
                  strokeWidth="1"
                  opacity="0.4"
                />
                <path
                  d="M8 5v3M8 10h.01"
                  stroke="#00f0ff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-[10px] font-mono tracking-wider text-accent-cyan/60">
                KEY INSIGHT
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              There is no single &ldquo;best&rdquo; quantum computer.
              Superconducting qubits offer{" "}
              <span className="text-accent-gold font-medium">speed</span> but
              decohere quickly.{" "}
              Trapped ions provide{" "}
              <span className="text-accent-purple font-medium">stability</span>{" "}
              and high fidelity but operate slowly. Neutral atoms scale to{" "}
              <span className="text-accent-green font-medium">
                hundreds of qubits
              </span>{" "}
              through a different, analog paradigm. The choice depends on the
              problem — coherence, fidelity, connectivity, and scale each pull in
              different directions.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Footer */}
      <div className="text-center">
        <Button
          onClick={onBack}
          variant="outline"
          className="font-mono text-xs tracking-wider rounded-full px-6 h-10 text-muted-foreground border-border/50 hover:text-foreground mb-8"
        >
          <svg className="mr-1.5" width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          BACK TO EXPLORE
        </Button>
        <Separator className="max-w-md mx-auto mb-6 bg-border/20" />
        <p className="text-muted-foreground/20 text-[10px] font-mono tracking-wider">
          QUANTUM CINEMA — MAKING THE INVISIBLE VISIBLE THROUGH GENERATIVE
          WORLD MODELS
        </p>
      </div>
    </div>
  );
}
