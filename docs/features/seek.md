# Seek Capabilities

Seek complements Axiom by visualizing everything the scheduler knows in an approachable desktop UI. Here is a tour of the major capabilities and why they matter to both technical and non-technical teammates.

## Resilient connection handling

- **Buffered startup** – The Electron main process queues incoming `axiom-data` messages until the renderer reports that it is ready. This prevents the first burst of command events from disappearing during window loads.【F:Interface/src/main/index.ts†L8-L67】
- **Friendly status feedback** – Main process IPC forwards connection events to the renderer, letting the UI display "Axiom Connected" or "Axiom Disconnected" so drivers know when telemetry is available.【F:Interface/src/main/index.ts†L68-L120】

To the drive coach, this means Seek clearly communicates when it is safe to hand controllers to the drivers.

## Interactive state explorer

- **Hierarchical viewer** – Command state objects render as collapsible trees, automatically sorting lists and guarding against circular references so complex subsystems stay readable.【F:Interface/src/renderer/src/components/StateValue.svelte†L1-L132】
- **In-line editing** – Non-readonly values display as text inputs; pressing Enter publishes edits back to the scheduler so tuning parameters can change on the fly.【F:Interface/src/renderer/src/components/StateValue.svelte†L88-L123】

From a strategist's perspective, Seek provides a dashboard you can tweak mid-match without digging through code.

## Extensible event system

- **Network registry** – Utility helpers register callbacks for incoming network events, making it simple to bolt on additional panels or analytics without rewriting the core connection logic.【F:Interface/src/renderer/src/lib/networkRegistry.ts†L1-L11】

Because the registry abstracts message routing, mentors can prototype new visualization modules without touching low-level sockets.

## Cross-platform polish

- **Unified window behavior** – Seek sets consistent window dimensions, hides the menu bar, and adapts icons per operating system, so the app looks native on Windows, macOS, and Linux.【F:Interface/src/main/index.ts†L18-L55】

Non-technical volunteers appreciate that Seek "just works" on whatever laptop the team brings to events.
