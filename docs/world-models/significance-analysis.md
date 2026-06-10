# Parameters of Quantum Hardware and Their Role in Teaching Entanglement

We organize the analysis around the complete set of quantitative parameters that AWS Braket exposes for its
quantum processors, then separate those that the current generative world models can already convey
(**Q1**) from those that they cannot yet convey but that are essential to teaching entanglement (**Q2**), and
finally identify the subset suitable as **performance metrics** for clear cross-device comparison (**Q3**).
The three world models correspond to three Braket devices and paradigms: trapped-ion (IonQ, gate-based),
superconducting (Rigetti, gate-based), and neutral-atom (QuEra Aquila, analog Hamiltonian simulation).

## The complete quantitative parameter set

Table 1 lists every device parameter exposed through Braket device properties, grouped by family, with its
symbol or schema field, units, and source.

**Table 1. Quantum-device parameters exposed by AWS Braket.**

| Family | Parameter | Symbol / field | Units | Source |
|---|---|---|---|---|
| **Architecture / paradigm** | Qubit / atom count | — (`numberSitesMax` = 256, Aquila) | integer | [1], [4] |
| | Computational paradigm | gate-based vs. analog Hamiltonian simulation (AHS) | — | [1] |
| | Native gate set | per device | — | [1] |
| | Connectivity / topology | `topology_graph` (directed graph) | graph | [2] |
| **Gate-model calibration** | Relaxation time | `T1` | µs | [3] |
| | Coherence (dephasing) time | `T2` | µs | [3] |
| | Single-qubit gate fidelity | `oneQubitFidelity` (`RANDOMIZED_BENCHMARKING`) | 0–1 | [3] |
| | Readout fidelity | `oneQubitFidelity` (`READOUT`) | 0–1 | [3] |
| | Two-qubit gate fidelity / error | `twoQubitGateFidelity` (e.g. `CNOT`, `INTERLEAVED_RANDOMIZED_BENCHMARKING`) | 0–1 | [3] |
| | Quantum volume | benchmark | — | [5] |
| **Pulse layer** | Frames / ports | `frames`, `ports` | — | [6] |
| | Waveforms, timing resolution, center frequency | waveforms, `dt`, center frequencies | s, Hz | [6] |
| **Neutral-atom AHS** | Global Rabi amplitude | `Ω(t)` (e.g. 15.7 × 10⁶) | rad/s | [4] |
| | Global phase | `φ(t)` | rad | [4] |
| | Global detuning | `Δ_global(t)` (e.g. ±54 × 10⁶) | rad/s | [4] |
| | Local detuning + site factor | `Δ_local(t)`, `h_k` ∈ [0,1] | rad/s, — | [4] |
| | Van der Waals coefficient (fixed) | `C₆` | rad·m⁶/s | [4] |
| | Atom register geometry | site coordinates `x_k, y_k` → distance `d_{k,l}`; minimum spacing ≈ 4 µm | µm | [4] |
| | Sequence time | `timeMax` (µs scale) | s | [4] |
| **Vendor-specific calibration** | Motional-mode frequencies, laser stability (IonQ) | — | Hz | [5] |
| | T1 / T2 emphasis (Rigetti) | — | µs | [5] |
| **Service / resource** | Shots range | `shotsRange` = (1, 1000) | — | [4] |
| | Device cost, execution windows | `deviceCost`, `executionWindows` | $/shot, time | [4] |

The Rydberg-blockade radius is not a stored field but is **derived** from two parameters above,
`R_b = (C₆ / Ω)^{1/6}`; with `C₆` fixed, it is set by the Rabi frequency `Ω` and the chosen atom spacing [4].

## Q1 — Parameters the current world models convey

A subset of the parameters in Table 1 is already conveyed faithfully by the generative world models. These
parameters are **structural** — spatial, topological, or categorical — so a single static 3-D scene can depict
them without rendering any evolving quantity.

**Table 2. Parameters teachable in the current world models.**

| Parameter (Table 1) | Visual encoding | Trapped ion | Superconducting | Neutral atom |
|---|---|---|---|---|
| Connectivity / topology | layout of links | all-to-all radial shared field | square nearest-neighbor lattice with gaps | programmable geometry |
| Paradigm + interaction mechanism | how coupling is drawn | shared motional field (gate) | local coupler arc (gate) | Rydberg blockade halo (analog) |
| Atom register geometry (`x_k, y_k`) | array arrangement | — | — | visible 2-D atom layout |
| Qubit / atom count | number of elements in view | ion orbs | qubit pads | atoms |

The encoding is faithful because each parameter describes *where elements sit* or *what kind of process runs*,
not how a value evolves in time. The deliberate omission of drawn wires (trapped-ion and neutral-atom scenes)
and the use of a short local arc (superconducting scene) directly correct the most common misconception — that
entanglement requires a physical connection. The demonstrated contribution is therefore that the **structural**
parameters of real quantum hardware — connectivity, interaction mechanism, and register geometry — become
perceptible to a non-expert through a single explorable scene, with no mathematics.

## Q2 — Parameters important for teaching entanglement but not yet conveyed

The remaining parameters in Table 1 are central to *entanglement* yet cannot be expressed by a static scene
because they are **dynamical or quantitative** — they describe how strongly, how fast, or how well-verified.
Each defines a direction for the next generation of world models.

**Table 3. Parameters not yet teachable, and the corresponding world-model direction.**

| Parameter group (Table 1) | Why it matters for entanglement | Proposed world-model direction |
|---|---|---|
| Drive: `Ω`, `Δ`, `φ`, gate time, coupling strength | set how and how strongly entanglement forms | **Parameter-conditioned generation**: a control changes the entangled scene; e.g. tuning `Ω` recomputes and redraws the blockade radius `R_b = (C₆/Ω)^{1/6}` |
| Decoherence: `T1`, `T2`, gate fidelity, error rate | determine whether entanglement survives | **Time-resolved generation**: render entanglement degrading as `T2` elapses and fidelity drops |
| Readout fidelity + measurement outcome | how entanglement is *verified* | **Prepare → entangle → measure loop** with an explicit entanglement readout (Bell/CHSH violation, state fidelity, or concurrence) |

The third row is the most significant gap: no quantitative measure of entanglement currently appears in the
system, so a viewer learns *that* qubits are entangled but never *how strongly* or *whether the correlation
survived*. Several parameters also remain named but unexplained, and tie directly to Table 1: the relevant
*motional mode* and laser stability (IonQ's calibration emphasis); the tunable-coupler mechanism and `T1`/`T2`
(Rigetti's emphasis); and the van der Waals origin of the blockade radius together with the Rabi drive `Ω`,
`Δ` (neutral-atom AHS).

## Q3 — Parameters suitable as performance metrics for comparison

Most parameters in Table 1 cannot serve as comparison metrics: some are device-specific control knobs
(`Ω`, `Δ`, `φ`, `C₆`, register coordinates) defined only for one paradigm, and others are operational
(cost, execution windows) rather than measures of capability. A useful performance metric must satisfy three
criteria: it is (i) **platform-agnostic** — defined for gate-based *and* analog devices so a single axis is
meaningful; (ii) **normalizable** to a common scale; and (iii) **monotonic** — higher (or lower) is
unambiguously better. The subset of Table 1 that meets these criteria is given in Table 4.

**Table 4. Recommended performance metrics for cross-device comparison.**

| Metric | Source parameter (Table 1) | Direction | Normalization | What it measures |
|---|---|---|---|---|
| Coherence time | `T2` (and `T1`) | higher is better | log-scaled across s–µs range | how long quantum information survives |
| Two-qubit gate fidelity | `twoQubitGateFidelity` | higher is better | already 0–1 | accuracy of entangling operations |
| Readout fidelity | `oneQubitFidelity` (`READOUT`) | higher is better | already 0–1 | accuracy of measurement |
| Error rate | 1 − gate fidelity | lower is better | invert to 0–1 | frequency of operation errors |
| Connectivity | `topology_graph` degree | higher is better | normalize to all-to-all = 1 | how freely qubits can be entangled |
| Scale | qubit / atom count | higher is better | scale to fleet maximum | size of addressable system |

Two design rules follow. First, for **analog devices** (Aquila) the gate-based fidelities are undefined; report
the platform-native equivalents — sequence-level success fraction and effective coherence over `timeMax` — on
the *same* coherence and error axes so the device is comparable rather than blank. Second, **energy or
environmental cost is best kept on a separate axis** from these capability metrics: it is operational, not a
measure of entanglement quality, so mixing it into the same chart conflates "how good" with "how expensive."
These six metrics are exactly the axes a radar or bar comparison should use, because they are defined for every
device, normalize to a shared 0–1 scale, and each has an unambiguous better direction.

## Summary

In summary, the current world models convey the **structural** parameters of quantum hardware (connectivity,
interaction mechanism, geometry; Q1), while the **dynamical and verification** parameters (drive strength,
decoherence, and entanglement readout; Q2) define the agenda: parameter-conditioned, time-resolved world models
that let these quantities drive the entangled scene and surface a measure that verifies it. For quantitative
comparison across devices, the **platform-agnostic, normalizable, monotonic** subset — coherence time, gate and
readout fidelity, error rate, connectivity, and scale (Q3) — provides a fair and interpretable set of
performance axes.

---

### References

[1] AWS, *Amazon Braket supported regions and devices.* https://docs.aws.amazon.com/braket/latest/developerguide/braket-devices.html

[2] AWS, *Amazon Braket Python SDK — `AwsDevice`.* https://amazon-braket-sdk-python.readthedocs.io/en/latest/_apidoc/braket.aws.aws_device.html

[3] Amazon Braket schemas, *Standardized gate-model QPU device properties (v1).* https://github.com/amazon-braket/amazon-braket-schemas-python/blob/main/src/braket/device_schema/standardized_gate_model_qpu_device_properties_v1.py

[4] AWS, *Submit an analog program using QuEra Aquila.* https://docs.aws.amazon.com/braket/latest/developerguide/braket-quera-submitting-analog-program-aquila.html

[5] AWS, *Quantum device calibration.* https://docs.aws.amazon.com/help-panel/braket/latest/console/hp-device-calibration.html

[6] AWS, *Support for OpenQASM on different Braket devices.* https://docs.aws.amazon.com/braket/latest/developerguide/braket-openqasm-device-support.html
