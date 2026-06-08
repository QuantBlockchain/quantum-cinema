"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RadarChart from "@/components/RadarChart";

// Normalized scores 0-100 for radar chart
// Based on actual device characteristics from design document
const DEVICES = [
  {
    id: "ionq",
    name: "IonQ Aria",
    provider: "IonQ",
    technology: "Trapped Ion",
    color: "#a855f7",
    rgb: "168, 85, 247",
    scores: {
      "Coherence": 95,
      "Gate Fidelity": 90,
      "Connectivity": 95,
      "Error Rate": 85,
      "Energy Eff.": 35,
      "Qubits": 12,
    },
    envImpact: {
      "Carbon Footprint": 70,
      "Energy Usage": 75,
      "Cooling Req.": 40,
      "Material Use": 50,
      "E-Waste": 45,
      "Water Usage": 35,
    },
    details: {
      coherenceTime: "~1-10 seconds",
      gateFidelity: "99.5%+",
      connectivity: "Full (all-to-all)",
      errorRate: "~0.5%",
      energyCost: "High (lasers + vacuum)",
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
    color: "#f59e0b",
    rgb: "245, 158, 11",
    scores: {
      "Coherence": 25,
      "Gate Fidelity": 80,
      "Connectivity": 30,
      "Error Rate": 70,
      "Energy Eff.": 20,
      "Qubits": 45,
    },
    envImpact: {
      "Carbon Footprint": 90,
      "Energy Usage": 95,
      "Cooling Req.": 95,
      "Material Use": 70,
      "E-Waste": 65,
      "Water Usage": 80,
    },
    details: {
      coherenceTime: "~20-100 \u00b5s",
      gateFidelity: "99.0%+",
      connectivity: "Limited (nearest-neighbor)",
      errorRate: "~1%",
      energyCost: "Very high (cryogenics)",
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
    color: "#10b981",
    rgb: "16, 185, 129",
    scores: {
      "Coherence": 20,
      "Gate Fidelity": 65,
      "Connectivity": 70,
      "Error Rate": 55,
      "Energy Eff.": 65,
      "Qubits": 100,
    },
    envImpact: {
      "Carbon Footprint": 45,
      "Energy Usage": 50,
      "Cooling Req.": 20,
      "Material Use": 35,
      "E-Waste": 30,
      "Water Usage": 25,
    },
    details: {
      coherenceTime: "~1-10 \u00b5s",
      gateFidelity: "~97-99%",
      connectivity: "Programmable geometry",
      errorRate: "~1-3%",
      energyCost: "Moderate",
      qubits: "256",
    },
    limitation:
      'Limited to specific "analog" quantum simulations; cannot run general digital algorithms',
    bestFor: "Designing carbon capture materials",
  },
];

const COMPARISON_VIEWS = [
  { id: "performance", label: "Performance" },
  { id: "environment", label: "Environmental Impact" },
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
  const [view, setView] = useState("performance");
  const [selectedDevices, setSelectedDevices] = useState<string[]>([
    "ionq",
    "rigetti",
    "quera",
  ]);

  const toggleDevice = (id: string) => {
    setSelectedDevices((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev; // Keep at least 1
        return prev.filter((d) => d !== id);
      }
      return [...prev, id];
    });
  };

  const selectedData = DEVICES.filter((d) => selectedDevices.includes(d.id));

  const radarSeries = selectedData.map((d) => ({
    name: d.name,
    color: d.color,
    rgb: d.rgb,
    data: Object.entries(
      view === "performance" ? d.scores : d.envImpact
    ).map(([axis, value]) => ({ axis, value })),
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
          Compare quantum computing architectures across performance metrics and
          environmental impact. Each technology makes different tradeoffs — there
          is no single &ldquo;best&rdquo; quantum computer.
        </p>
      </motion.div>

      {/* Device selector */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-5xl mx-auto mb-8"
      >
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {DEVICES.map((d) => (
            <button
              key={d.id}
              onClick={() => toggleDevice(d.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-mono tracking-wider transition-all duration-300"
              style={{
                borderColor: selectedDevices.includes(d.id)
                  ? `rgba(${d.rgb}, 0.4)`
                  : "rgba(255,255,255,0.08)",
                background: selectedDevices.includes(d.id)
                  ? `rgba(${d.rgb}, 0.1)`
                  : "transparent",
                color: selectedDevices.includes(d.id)
                  ? d.color
                  : "var(--muted-foreground)",
              }}
            >
              <div
                className="size-2 rounded-full"
                style={{
                  background: selectedDevices.includes(d.id)
                    ? d.color
                    : "var(--muted-foreground)",
                }}
              />
              {d.name}
            </button>
          ))}
        </div>

        <Tabs
          value={view}
          onValueChange={setView}
          className="flex justify-center"
        >
          <TabsList className="bg-secondary/30">
            {COMPARISON_VIEWS.map((v) => (
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
      </motion.div>

      {/* Radar Chart + Details */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${view}-${selectedDevices.join(",")}`}
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
                  {view === "performance"
                    ? "PERFORMANCE METRICS"
                    : "ENVIRONMENTAL IMPACT"}
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
                  {view === "performance"
                    ? "METRIC BREAKDOWN"
                    : "ENVIRONMENTAL IMPACT BREAKDOWN"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                {Object.keys(
                  view === "performance"
                    ? DEVICES[0].scores
                    : DEVICES[0].envImpact
                ).map((metric) => (
                  <div key={metric} className="mb-4 last:mb-0">
                    <div className="text-[9px] font-mono text-muted-foreground/40 tracking-wider mb-1.5 uppercase">
                      {metric}
                    </div>
                    <div className="space-y-1">
                      {selectedData.map((d) => {
                        const scores =
                          view === "performance" ? d.scores : d.envImpact;
                        const val =
                          scores[metric as keyof typeof scores] || 0;
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
              require extreme cooling.{" "}
              Trapped ions provide{" "}
              <span className="text-accent-purple font-medium">stability</span>{" "}
              but operate slowly. Neutral atoms scale to{" "}
              <span className="text-accent-green font-medium">
                hundreds of qubits
              </span>{" "}
              with lower environmental impact. The choice depends on the
              problem — and the environmental cost we&apos;re willing to accept.
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
