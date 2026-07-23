# Send Mail

I'd like to propose we replace the architecture-comparison figure (Fig. 8, and the related Fig. 5 in the main text) with the new paradigm-grouped version. The current chart plots IonQ Aria, Rigetti Ankaa-3, and QuEra Aquila as three polygons on one radar, and I don't think that comparison is scientifically sound. The reasoning is it compares two different kinds of machine on one yardstick. IonQ and Rigetti are gate-based processors; QuEra Aquila is an analog Hamiltonian-simulation (AHS) device.

Full list of edits needed for consistency

### 1. Fig. 8 — Appendix A, Act IV screenshot

- **Current:** old dashboard — one radar, 3 architectures, 5 metrics including energy.
- **Change:** replace the image with new image(paradigm tabs, 6 metrics, no energy axis).

### 2. Fig. 8 caption

- **Current:** "The radar chart compares three architectures across five metrics…"
- **Change:**

> **Fig. 8:** Act IV: Architecture comparison dashboard. Architectures are **grouped by computational paradigm** — gate-based (IonQ Aria, Rigetti Ankaa-3) versus analog Hamiltonian simulation (QuEra Aquila) — and the radar chart compares them across **six** metrics (coherence time, two-qubit gate fidelity, readout fidelity, error rate, connectivity, and qubit count), with use-case matching recommendations. Grouping by paradigm avoids placing gate-model and analog devices on a single yardstick, since gate fidelities are undefined for analog hardware.

### 3. Fig. 5 — main text, §V-B (the standalone radar)

- **Current:** standalone radar, all 3 on one chart, 5 axes, 0–5 scale.
- **Change:** : gate-based (IonQ vs Rigetti) as the primary comparison, QuEra shown separately. If only Fig. 8 is replaced, the main text (mixed) contradicts the appendix (grouped).

### 4. Fig. 5 caption

- **Current:** "…three quantum architectures across five key metrics… Values normalized 0–5."
- **Change** (also reconciles the 0–5 vs 0–100 scale — app uses 0–100):

> **Fig. 5:** Radar chart comparing quantum architectures **grouped by computational paradigm** across **six** key metrics. Within the **gate-based** group, trapped-ion (IonQ) and superconducting (Rigetti) devices are compared directly: trapped ions excel in coherence, fidelity, and connectivity, while superconducting devices offer faster gates and larger qubit counts. The **analog** device (QuEra Aquila) is reported separately with platform-native equivalents on the same axes, since two-qubit gate fidelity is undefined for Hamiltonian-simulation hardware. Values normalized to 0–100; Error Rate is inverted (higher = better) [28], [32]–[34].

### 5. §III-B, Act IV description (p.6)

- **Current:** "…radar charts plotting each platform across **five** quantitative metrics: coherence time, gate fidelity, connectivity topology, error rate, and qubit count."
- **Change* (add readout fidelity → six; note grouping; drop the "all on one chart" implication):

> *Act IV—Compare* (Section D) provides an interactive comparison across architectures, **grouped by computational paradigm**. Users view animated radar charts plotting each platform across six quantitative metrics: coherence time, two-qubit gate fidelity, readout fidelity, error rate, connectivity topology, and qubit count. Gate-based devices (trapped-ion and superconducting) are compared directly, while the analog device is reported with platform-native equivalents on the same axes, so the comparison never places gate-model and analog hardware on a single, misleading yardstick. This act transforms the qualitative impressions gathered during exploration into directly comparable technical data, reinforcing the learning outcomes of the experience.

### 6. Table III — row Act 4, "Key Content" cell

- **Current:** "Radar charts (**5 metrics × 3 architectures**) + use-case matching."
- **Change:**

> Radar charts grouped by paradigm (6 metrics: coherence, 2-qubit fidelity, readout fidelity, error rate, connectivity, qubit count) + use-case matching

### 7. §V-B, Use Case 2 (p.9), opening paragraph

- **Current:** "plots **all three architectures** across five quantitative metrics… coherence time, two-qubit gate fidelity, qubit count, and error rate" (lists 4, says 5).
- **Change** (compare gate-based directly; report analog with platform-native equivalents; fix the metric list — now six, currently omits connectivity/readout while claiming "five"):

> A quantum computing researcher evaluating hardware platforms for a specific algorithmic workload can access *Act 4* directly, bypassing the narrative Acts 1–3. The interactive radar chart comparison, shown in Fig. 5, **groups platforms by computational paradigm** and plots them across six quantitative metrics derived from AWS Braket device specifications [28]: coherence time, two-qubit gate fidelity, readout fidelity, error rate, connectivity, and qubit count. Within the gate-based group, the researcher compares trapped-ion (IonQ) and superconducting (Rigetti) devices directly; the analog device (QuEra Aquila) is presented separately, because its Hamiltonian-simulation paradigm has no discrete two-qubit gates, so the corresponding fidelity is reported as a platform-native, sequence-level equivalent rather than a gate fidelity.

### 8. Appendix D, Act IV (p.11)

- **Current:** "evaluate all three architectures across **five** metrics (Figure 8)… coherence time, gate fidelity, connectivity, error rate, and qubit count."
- **Change:**

> Act IV provides the synthesis: an interactive comparison dashboard where users evaluate architectures across six metrics (Figure 8), **grouped by computational paradigm**. The screen displays a radar chart comparing coherence time, two-qubit gate fidelity, readout fidelity, error rate, connectivity, and qubit count, alongside a use-case matching panel that suggests optimal architectures for specific algorithms. For example, Shor's algorithm (requiring high coherence) is matched to trapped-ion platforms, while QAOA (requiring many qubits) is matched to neutral atoms. Grouping the radar by paradigm ensures the comparison never scores a gate-model device and an analog device on the same axis where the underlying quantity is undefined for one of them.

# Question to answer

Consistency Issue raised by Dongping "1. The numbers need to be consistent. Table IV (main text) and Table X (appendix) disagree on the core device
specs — IonQ qubits (20–64 vs 25), superconducting qubits (80 vs 84), ion fidelity (99.8% vs 99.5%) — and the
radar normalizations in Appendix I don't recompute to the scores shown. This is the one thing a reviewer can
check with a calculator, so it's worth fixing properly: I'd drive Table IV, Figure 5, and the appendix from
one shared data file so they can't drift again"

## Verification notes

Checked every claim against the PDF (`Quantum_Cinema.pdf`). **Dongping is correct on all counts — no fix needed to his statement; it can be sent as written.** Details:

**Table IV (main text, p.7) vs Table X (Appendix H, p.15) — confirmed disagreements:**

| Spec | Table IV | Table X | Status |
|---|---|---|---|
| IonQ qubits | 20–64 | 25 | ✅ confirmed |
| Superconducting qubits | 80 | 84 | ✅ confirmed |
| Ion 2-qubit fidelity | 99.8% | 99.5% | ✅ confirmed |
| QuEra 2-qubit fidelity | 99.5% | 97–99% | ⚠️ additional (not in his list) |
| Rigetti 2-qubit fidelity | 95–99% | 99.0% | ⚠️ additional (not in his list) |

His three examples are all accurate; the list is **incomplete, not wrong** — there are two further fidelity disagreements worth mentioning to reinforce the "one shared data file" argument.

**Normalizations don't recompute (Appendix I formulas → Appendix J, Table XI scores) — confirmed.** Recomputing the published formulas does not reproduce the shown scores, even for rows carrying no "adjusted" asterisk:
- Fidelity, IonQ: `5 × 4.5/4.9 ≈ 4.6`, table shows **4.8**.
- Fidelity, Rigetti: `5 × 4.0/4.9 ≈ 4.1`, table shows **3.5**.
- Connectivity: IonQ `5 × 24/24 = 5.0` → shown **4.5**; Rigetti `5 × 4/83 ≈ 0.24` → shown **1.5**; QuEra `5 × 7/255 ≈ 0.14` → shown **2.5**.

(The Table XI mean row is internally self-consistent with the *shown* scores — Ion 3.86, Atom 3.90, SC 2.30 — but not with the recomputed ones.)

**Minor precision note (optional, not an error):** the *scores* live in Table XI (Appendix **J**); the *formulas* are Appendix **I**. His phrasing "normalizations in Appendix I don't recompute to the scores shown" is accurate as written.

**Out-of-scope but related:** the deployed app (`quantum-cinema/src/lib/data.ts`) lists QuEra coherence as **~1–10 µs**, while both paper tables say **1–10 s**. The proposed single-shared-data-file fix would resolve this too — and `data.ts` is already effectively that canonical source.

## Modification suggestions

Standardize on **Table X / `data.ts`** as the single canonical source (per Dongping's "one shared data file" recommendation) and reconcile the main text to it.

### C1. Table IV — Qubits row

- **Current:** IonQ **20–64**, Superconducting **80**, QuEra 256.
- **Change:** IonQ **25**, Superconducting **84**, QuEra 256 (matches Table X and `data.ts`).

### C2. Table IV — 2-Qubit Fidelity row

- **Current:** IonQ **99.8%**, QuEra **99.5%**, Superconducting **95–99%**.
- **Change:** IonQ **99.5%**, QuEra **97–99%**, Superconducting **99.0%** (matches Table X and `data.ts`). Note the QuEra value is a platform-native, sequence-level equivalent — the analog paradigm has no discrete two-qubit gates.

### C3. Table IV — Connectivity row (wording drift)

- **Current:** IonQ All-to-all, QuEra **Nearest + long-range**, Superconducting **Lattice (limited)**.
- **Change:** IonQ All-to-all, QuEra **Programmable**, Superconducting **Nearest-neighbor** (matches Table X and `data.ts`).

### C4. Table IV — Coherence Time row (align units/precision with Table X)

- **Current:** IonQ ~seconds, QuEra ~seconds, Superconducting **~100 µs**.
- **Change:** IonQ **1–10 s**, QuEra **1–10 s**, Superconducting **20–100 µs** (matches Table X). Also fix the app: `data.ts` QuEra coherence reads **~1–10 µs** and must become **~1–10 s** to agree with both tables.

### C5. Appendix I / Table XI — normalizations that don't recompute

- **Current:** several Table XI scores do not follow from the published formulas even without an "adjusted" asterisk (e.g. Fidelity IonQ `5 × 4.5/4.9 ≈ 4.6` shown as **4.8**; Fidelity Rigetti `5 × 4.0/4.9 ≈ 4.1` shown as **3.5**; Connectivity IonQ `5 × 24/24 = 5.0` shown as **4.5**, Rigetti `≈ 0.24` shown as **1.5**, QuEra `≈ 0.14` shown as **2.5**).
- **Change:** recompute every Table XI score directly from the Appendix I formulas and the canonical Table X inputs, and **remove the ad-hoc manual nudges**. If any visual adjustment must be retained, state the exact transform (e.g. the sigmoid) as the *definition* of that axis so the printed number recomputes from a written rule. The internally consistent means (Ion 3.86, Atom 3.90, SC 2.30) must be regenerated from whatever final scores result.

### C6. Add a note that Table IV, Fig. 5/8, and the appendix share one source

- **Current:** no statement of provenance linking the tables/figure.
- **Change:** add a one-line note (Table IV caption or Appendix H): "Table IV, Fig. 5, and Appendices H–J are generated from a single device-parameter file (`quantum-cinema/src/lib/data.ts`), preventing drift between the main text and the appendix."


