export interface QuantumDevice {
  id: string;
  name: string;
  subtitle: string;
  technology: string;
  provider: string;
  color: string;
  colorRgb: string;
  icon: string;
  worldName: string;
  worldDescription: string;
  metrics: {
    coherenceTime: string;
    gateFidelity: string;
    connectivity: string;
    errorRate: string;
    energyCost: string;
    qubits: string;
  };
  limitation: string;
  bestFor: string;
  bestForDetail: string;
  visualStyle: string;
  documentaryNarrative: string[];
}

export const devices: QuantumDevice[] = [
  {
    id: "ionq",
    name: "IonQ Aria",
    subtitle: "Light Suspension",
    technology: "Ytterbium ions levitated in vacuum and manipulated by lasers",
    provider: "IonQ",
    color: "#a855f7",
    colorRgb: "168, 85, 247",
    icon: "Atom",
    worldName: "Light Suspension",
    worldDescription:
      "Atoms floating in harmonic suspension, pinned by light rather than matter. A serene vacuum chamber where ytterbium ions dance in laser beams, holding quantum secrets for seconds — an eternity in the quantum world.",
    metrics: {
      coherenceTime: "~1-10 seconds",
      gateFidelity: "99.5%+",
      connectivity: "Full (all-to-all)",
      errorRate: "~0.5%",
      energyCost: "High (lasers + vacuum)",
      qubits: "25",
    },
    limitation:
      "Extremely slow operation speeds (gates take ~10-50 microseconds) limit computational depth despite long coherence",
    bestFor: "Discovering new drugs (small molecules)",
    bestForDetail:
      "High fidelity prevents errors in molecular simulation, but limited to ~20-100 qubits — insufficient for complex proteins.",
    visualStyle:
      "Floating luminous orbs in violet void, laser beams as golden threads, slow graceful motion, deep calm",
    documentaryNarrative: [
      "In the vacuum, atoms float like stars — suspended by nothing but light itself.",
      "Each ion holds its quantum state for seconds, an eternity where computations unfold with surgical precision.",
      "But speed is the price of perfection. While ions dream, the clock of decoherence ticks slowly but surely.",
    ],
  },
  {
    id: "rigetti",
    name: "Rigetti Ankaa-3",
    subtitle: "Frozen Forge",
    technology: "Superconducting circuits chilled to near absolute zero (~10mK)",
    provider: "Rigetti",
    color: "#f59e0b",
    colorRgb: "245, 158, 11",
    icon: "Zap",
    worldName: "Frozen Forge",
    worldDescription:
      "Golden circuitry encased in frost, pulsing with frenetic energy. A dilution refrigerator colder than outer space, where superconducting qubits race against time — executing billions of operations before the cold loses its grip.",
    metrics: {
      coherenceTime: "~20-100 microseconds",
      gateFidelity: "99.0%+",
      connectivity: "Limited (nearest-neighbor)",
      errorRate: "~1%",
      energyCost: "Very high (cryogenics)",
      qubits: "84",
    },
    limitation:
      "Fragile quantum states decay in ~20-100 microseconds (1000x faster than ions), requiring extremely fast operations",
    bestFor: "Optimizing national power grids",
    bestForDetail:
      "Fast gates allow rapid optimization iterations, but 100-microsecond coherence limits problem size to toy models.",
    visualStyle:
      "Golden circuits in ice, rapid electrical pulses, frost crystallization, urgent kinetic energy, warm-cold contrast",
    documentaryNarrative: [
      "Deep inside the refrigerator, colder than the void between stars, golden circuits come alive.",
      "Each gate fires in nanoseconds — a million operations crammed into the microsecond window before decoherence strikes.",
      "Energy leaks as light into darkness. The frost fights to hold, but quantum information bleeds away, operation by operation.",
    ],
  },
  {
    id: "quera",
    name: "QuEra Aquila",
    subtitle: "Wave Garden",
    technology:
      "Neutral atoms arranged by optical tweezers at room temperature",
    provider: "QuEra",
    color: "#10b981",
    colorRgb: "16, 185, 129",
    icon: "Waves",
    worldName: "Wave Garden",
    worldDescription:
      "A rippling landscape of interference patterns, where neutral atoms are arranged by beams of light into precise geometric formations. Nature's own quantum simulator, solving physics by being physics.",
    metrics: {
      coherenceTime: "~1-10 microseconds",
      gateFidelity: "~97-99%",
      connectivity: "Programmable geometry",
      errorRate: "~1-3%",
      energyCost: "Moderate",
      qubits: "256",
    },
    limitation:
      'Limited to specific "analog" quantum simulations; cannot easily run general digital algorithms like factoring',
    bestFor: "Designing carbon capture materials",
    bestForDetail:
      "Native analog simulation matches the physics of materials science naturally, but limited to specific Hamiltonians.",
    visualStyle:
      "Emerald wave interference patterns, atomic lattices, organic flowing geometry, bioluminescent glow",
    documentaryNarrative: [
      "No refrigerator needed. At room temperature, atoms are plucked and placed by tweezers made of light.",
      "256 atoms arranged in any geometry imaginable — a living circuit board that simulates nature by being nature.",
      "But this garden grows only certain flowers. Analog simulation excels at materials science, yet cannot crack the code of general algorithms.",
    ],
  },
];

export interface MetricInfo {
  name: string;
  simple: string;
  impact: string;
}

export const metricsInfo: MetricInfo[] = [
  {
    name: "Coherence Time",
    simple:
      'How long a qubit stays "quantum" before environmental noise destroys its superposition',
    impact:
      "Drug simulations require maintaining quantum states across hundreds of operations. Short coherence = simulation crashes before finding the cure.",
  },
  {
    name: "Gate Fidelity",
    simple:
      "Accuracy of quantum operations. 99.9% = 1 error per 1000 operations",
    impact:
      "Accumulated errors from low fidelity produce nonsense molecular structures in drug discovery.",
  },
  {
    name: "Connectivity",
    simple:
      'How many other qubits each qubit can directly "talk to"',
    impact:
      "Protein folding involves long-range molecular interactions; limited connectivity forces inefficient workarounds.",
  },
  {
    name: "Error Rate",
    simple:
      "Frequency of random bit-flips caused by noise",
    impact:
      "High error rates (>1%) require quantum error correction that demands 1000+ physical qubits per logical qubit.",
  },
  {
    name: "Energy Cost",
    simple:
      "Power consumed to maintain quantum states (lasers for ions, cryogenics for superconductors)",
    impact:
      "The carbon footprint of the quantum computer itself must be offset by its optimization gains.",
  },
];
