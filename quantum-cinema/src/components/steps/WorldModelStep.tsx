"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { DeviceId } from "@/app/page";

interface DeviceConfig {
  name: string;
  worldName: string;
  url: string;
  color: string;
  rgb: string;
  entanglement: {
    headline: string;
    coreIdea: string;
    visualMap: { element: string; meaning: string }[];
    classroomScript: string;
    beginnerVersion: string;
    bestFor: string;
    bestForDetail: string;
  };
}

const DEVICE_CONFIGS: Record<DeviceId, DeviceConfig> = {
  "ion-trap": {
    name: "IonQ Aria",
    worldName: "Light Suspension",
    url: "https://marble.worldlabs.ai/world/7f7dcf51-4c04-407d-9000-eb3321432fb3",
    color: "#a855f7",
    rgb: "168, 85, 247",
    entanglement: {
      headline: "Entanglement Through Shared Chain Motion",
      coreIdea:
        "These bright ions are separate qubits, but they are not isolated. They all sit in one shared motional system. Laser pulses pick out two ions, shake that shared motion in a controlled way, and leave them in a joint state. After that, you can no longer fully describe one ion without the other. That is entanglement.",
      visualMap: [
        { element: "Blue glowing dots", meaning: "The ions, each carrying a qubit" },
        { element: "Pink/gold beams", meaning: "Control lasers selecting particular ions" },
        { element: "Golden wave structure in the center", meaning: "The shared collective motion of the ion chain — the key mechanism" },
      ],
      classroomScript:
        "Each blue point is an ion qubit. By default, they are separate qubits in the same trap. The laser beams target specific ions and couple their internal qubit states to the shared vibration of the whole ion chain, shown here as the golden field. Because both ions interact with the same collective motion, they can become entangled. After that, the quantum state belongs to the pair together, not to each ion separately.",
      beginnerVersion:
        "Imagine a row of balls on a trampoline. When you bounce one ball, the trampoline itself connects it to the ball next to it. In a trapped-ion computer, the shared 'trampoline' is the collective motion of the whole ion chain.",
      bestFor: "Drug Discovery",
      bestForDetail:
        "High fidelity (99.5%+) and long coherence (seconds) make ion traps ideal for deep molecular simulations. Entanglement through shared motion provides all-to-all connectivity, naturally mapping to long-range molecular interactions.",
    },
  },
  superconducting: {
    name: "Rigetti Ankaa-3",
    worldName: "Frozen Forge",
    url: "https://marble.worldlabs.ai/world/cfbff551-edf3-4a85-8ad3-a7b909ca0048",
    color: "#f59e0b",
    rgb: "245, 158, 11",
    entanglement: {
      headline: "Entanglement Through Local Chip Couplers",
      coreIdea:
        "Here, entanglement is created when two nearby qubits are connected by a controlled interaction on the chip. Instead of using the motion of a whole ion chain, this hardware opens a local quantum bridge between neighboring sites, so the two qubits evolve together into one joint state.",
      visualMap: [
        { element: "Square pads / nodes", meaning: "The superconducting qubits" },
        { element: "Glowing lines and pathways", meaning: "Control and coupling routes on the chip" },
        { element: "Bright circular region", meaning: "Where a local two-qubit interaction is activated" },
      ],
      classroomScript:
        "Each square site in this chip-like world represents a superconducting qubit. They sit on an engineered circuit, so they do not all interact equally with every other qubit. Instead, entanglement is created locally, when control signals turn on a precise interaction between nearby qubits. The glowing region marks that interaction zone. Once that coupling is activated for the right amount of time, the two qubits no longer behave as separate objects.",
      beginnerVersion:
        "Think of a circuit board where each component can only talk to its immediate neighbors. To connect distant components, you have to chain messages through the ones in between — like a game of telephone, but quantum.",
      bestFor: "Power Grid Optimization",
      bestForDetail:
        "Ultra-fast gates (~20-50 ns) allow thousands of shallow optimization iterations within the short coherence window. The nearest-neighbor entanglement topology maps well to grid-like optimization problems.",
    },
  },
  "neutral-atoms": {
    name: "QuEra Aquila",
    worldName: "Wave Garden",
    url: "https://marble.worldlabs.ai/world/510dff36-2d42-4686-9651-a9a9d2a65074",
    color: "#10b981",
    rgb: "16, 185, 129",
    entanglement: {
      headline: "Entanglement Through Spatial Rydberg Interactions",
      coreIdea:
        "Here, entanglement happens because exciting one atom changes what nearby atoms are allowed to do, so the quantum state starts belonging to the group rather than to each atom separately. Distance matters — the spatial arrangement of atoms is itself the computational resource.",
      visualMap: [
        { element: "Green dots", meaning: "Atom qubits in a programmable 2D array" },
        { element: "Square/geometric arrangement", meaning: "The intentionally chosen geometry — not decoration, but physics" },
        { element: "Two brighter atoms near center", meaning: "Atoms being excited into strongly interacting Rydberg states" },
      ],
      classroomScript:
        "Each green point is a neutral-atom qubit held in an optical trap. What makes this architecture special is that atoms can be arranged into different geometries, and that geometry affects how they interact. The brighter atoms represent atoms driven into a strongly interacting Rydberg state. Once that happens, nearby atoms can no longer behave independently. Their possible states become constrained by one another. That is how entanglement emerges here — not through a wire, but through distance-dependent interactions.",
      beginnerVersion:
        "This is like a field of tiny lights where turning one light into a special high-energy mode changes the rules for the lights nearby. Instead of each light making its own independent choice, the local group starts behaving as one linked quantum system.",
      bestFor: "Carbon Capture Materials",
      bestForDetail:
        "256-atom programmable arrays can directly simulate material properties. The analog Rydberg interactions naturally map to the Hamiltonians of materials science, making Aquila uniquely suited for designing carbon capture and battery materials.",
    },
  },
};

export default function WorldModelStep({
  deviceId,
  onNext,
  onBack,
}: {
  deviceId: DeviceId;
  onNext: () => void;
  onBack: () => void;
}) {
  const [worldOpened, setWorldOpened] = useState(false);
  const device = DEVICE_CONFIGS[deviceId];
  const { entanglement } = device;

  const openWorld = useCallback(() => {
    window.open(device.url, "_blank", "noopener,noreferrer");
    setWorldOpened(true);
  }, [device.url]);

  return (
    <div className="relative min-h-screen px-4 sm:px-6 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center mb-10"
        >
          <Badge
            variant="outline"
            className="mb-4 font-mono text-[10px] tracking-[0.4em]"
            style={{
              color: `${device.color}99`,
              borderColor: `${device.color}26`,
              background: `${device.color}08`,
            }}
          >
            {device.name.toUpperCase()} — {device.worldName.toUpperCase()}
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-3 tracking-tight">
            <span style={{ color: device.color }}>{entanglement.headline}</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Explore how{" "}
            <span style={{ color: device.color }} className="font-medium">
              {device.name}
            </span>{" "}
            creates quantum entanglement — and see it visualized in a
            generative world model.
          </p>
        </motion.div>

        {/* Explore World Link */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mb-8"
        >
          <button
            onClick={openWorld}
            className="w-full flex items-center gap-4 p-5 rounded-xl border transition-all duration-300 hover:scale-[1.005] group"
            style={{
              borderColor: `${device.color}25`,
              background: `${device.color}08`,
            }}
          >
            <div
              className="size-12 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: `${device.color}15`,
                border: `1px solid ${device.color}30`,
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke={device.color}
                strokeWidth="1.5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-semibold text-foreground">
                Explore {device.worldName} in 3D
              </p>
              <p className="text-[11px] text-muted-foreground/60">
                Navigate the AI-generated world model — see the entanglement
                mechanisms visualized in an immersive environment
              </p>
            </div>
            <div
              className="px-4 py-2 rounded-lg text-xs font-mono tracking-wider shrink-0 transition-all duration-300 group-hover:scale-105"
              style={{
                color: device.color,
                background: `${device.color}15`,
                border: `1px solid ${device.color}30`,
              }}
            >
              OPEN
              <svg
                className="ml-1.5 inline-block"
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M5 3h8v8M13 3L3 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </button>
        </motion.div>

        {/* Core Idea */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <Card
            className="bg-card/50 border-border/50 mb-6"
            style={{ borderColor: `${device.color}15` }}
          >
            <CardContent className="p-6">
              <h3
                className="text-sm font-semibold mb-3 font-mono tracking-wider"
                style={{ color: device.color }}
              >
                HOW IT WORKS
              </h3>
              <p className="text-sm text-foreground/90 leading-relaxed mb-5">
                {entanglement.coreIdea}
              </p>

              {/* Visual mapping table */}
              <div className="space-y-2">
                <p className="text-[10px] font-mono text-muted-foreground/40 tracking-wider">
                  WHAT YOU SEE IN THE WORLD MODEL
                </p>
                {entanglement.visualMap.map((item) => (
                  <div
                    key={item.element}
                    className="flex gap-3 p-3 rounded-lg bg-secondary/20 border border-border/20"
                  >
                    <span
                      className="text-xs font-medium shrink-0 w-[140px]"
                      style={{ color: device.color }}
                    >
                      {item.element}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      → {item.meaning}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Classroom Script & Beginner Version */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="grid md:grid-cols-2 gap-4 mb-6"
        >
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-5">
              <h4 className="text-[10px] font-mono tracking-wider text-muted-foreground/50 mb-2">
                DETAILED EXPLANATION
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                &ldquo;{entanglement.classroomScript}&rdquo;
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-5">
              <h4 className="text-[10px] font-mono tracking-wider text-muted-foreground/50 mb-2">
                SIMPLE ANALOGY
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                &ldquo;{entanglement.beginnerVersion}&rdquo;
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Real-world application */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mb-10"
        >
          <Card
            className="border-l-4"
            style={{
              background: `${device.color}05`,
              borderColor: `${device.color}15`,
              borderLeftColor: `${device.color}60`,
            }}
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-foreground">
                  Best For:{" "}
                  <span style={{ color: device.color }}>
                    {entanglement.bestFor}
                  </span>
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {entanglement.bestForDetail}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <Separator className="max-w-md mx-auto mb-8 bg-border/20" />

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-3"
        >
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
            TRY ANOTHER DEVICE
          </Button>
          <Button
            onClick={onNext}
            variant="outline"
            className="font-mono text-xs tracking-[0.2em] rounded-full px-8 h-11 text-accent-gold border-accent-gold/25 bg-accent-gold/5 hover:bg-accent-gold/10 hover:text-accent-gold glow-gold"
          >
            COMPARE ARCHITECTURES
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
        </motion.div>
      </div>
    </div>
  );
}
