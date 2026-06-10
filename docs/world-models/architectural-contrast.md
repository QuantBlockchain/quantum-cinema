# Architectural Contrast: How Entanglement Arises Across Platforms

The three quantum-computing platforms modeled in this project generate entanglement by physically distinct mechanisms. Contrasting them clarifies what is specific to each architecture and what the corresponding world model is built to convey.

| | Trapped Ions | Superconducting | Neutral Atoms |
|---|---|---|---|
| Entanglement medium | Shared collective motion of the ion chain | Local tunable coupler between neighboring qubits | Distance-dependent Rydberg interaction in a spatial array |
| Connectivity | All-to-all through shared motion | Nearest-neighbor through fixed chip wiring | Geometry-dependent — programmable by rearranging atoms |
| Computational model | Gate-based | Gate-based | Primarily analog (continuous Hamiltonian evolution) |
| Key insight | Entanglement through shared motion | Entanglement through local engineering | Entanglement through geometry and proximity |

Per-platform world models and figure discussions:

- **Trapped ions** — [ion-trap/teaching-guide.md](ion-trap/teaching-guide.md)
- **Superconducting** — [superconducting/teaching-guide.md](superconducting/teaching-guide.md)
- **Neutral atoms** — [neutral-atoms/teaching-guide.md](neutral-atoms/teaching-guide.md)
