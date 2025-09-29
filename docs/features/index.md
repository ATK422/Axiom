# Axiom Capabilities

Axiom extends the FTC SDK with a reusable command architecture that keeps robot code predictable and testable. This page lists the headline features and explains what they mean for both programmers and the rest of the drive team.

## Command scheduling that scales

- **Deterministic lifecycle hooks** – Commands expose `enter`, `action`, and `exit` stages so you can prepare hardware, run iterative logic, and clean up without wiring conditionals everywhere.【F:Core/src/main/java/io/github/bionictigers/axiom/core/commands/Command.kt†L40-L110】
- **Automatic dependency management** – Commands and systems declare what other systems they depend on; the scheduler resolves order and prevents conflicting access to hardware.【F:Core/src/main/java/io/github/bionictigers/axiom/core/commands/Command.kt†L48-L89】【F:Core/src/main/java/io/github/bionictigers/axiom/core/commands/Scheduler.kt†L37-L94】
- **Persistent state tracking** – The scheduler stores state objects between runs, making it easy to remember calibration data or loop timing without global singletons.【F:Core/src/main/java/io/github/bionictigers/axiom/core/commands/Scheduler.kt†L96-L129】

For non-technical readers: think of commands as recipe cards. Axiom makes sure each recipe starts at the right time, shares ingredients politely, and keeps notes so you can resume later.

## System-oriented structure

- **Systems as first-class citizens** – Subsystems wrap recurring behaviors (like drivetrain updates or shooter control) and expose `beforeRun`/`afterRun` commands that are scheduled automatically.【F:Core/src/main/java/io/github/bionictigers/axiom/core/commands/Scheduler.kt†L55-L78】
- **Flexible command groups** – Sequential and concurrent groups let you string together autonomous actions without manually managing timers or threads.【F:Core/src/main/java/io/github/bionictigers/axiom/core/commands/groups/SequentialCommandGroup.kt†L1-L60】【F:Core/src/main/java/io/github/bionictigers/axiom/core/commands/groups/ConcurrentCommandGroup.kt†L1-L74】

To everyone else: systems are like LEGO bricks. You build them once, then snap them together for each match.

## Comprehensive input handling

- **Digital and analog abstractions** – The `Controls` system maps gamepad buttons, triggers, and sticks to commands with configurable dead zones and press/hold semantics.【F:Core/src/main/java/io/github/bionictigers/axiom/core/input/Controls.kt†L1-L103】
- **Profile-based layouts** – Multiple driver profiles can share the same command logic with different control mappings, enabling fast swaps between tele-op roles.【F:Core/src/main/java/io/github/bionictigers/axiom/core/input/Controls.kt†L5-L43】

From the stands, that means new drivers can inherit proven control schemes instantly.

## Live telemetry and editing

- **Built-in WebSocket server** – Axiom broadcasts command state, scheduler order, and editable values over port 10464 so tools like Seek can observe the robot in real time.【F:Core/src/main/java/io/github/bionictigers/axiom/core/web/Server.kt†L1-L118】
- **Structured serialization** – Only annotated properties are exposed, so teams choose exactly which values drivers can watch or modify mid-match.【F:Core/src/main/java/io/github/bionictigers/axiom/core/commands/Scheduler.kt†L130-L212】

Non-programmers can think of Seek as a live scoreboard fed by these data streams.

## Built for reliability

- **Thread-safe queues** – Scheduler updates use concurrent collections to avoid race conditions between command scheduling and the update loop.【F:Core/src/main/java/io/github/bionictigers/axiom/core/commands/Scheduler.kt†L29-L57】
- **High-resolution timing** – Commands record monotonic timestamps to compute delta time and enforce execution intervals, keeping loops responsive regardless of hardware jitter.【F:Core/src/main/java/io/github/bionictigers/axiom/core/commands/Command.kt†L30-L71】

In practice, this means your tele-op commands stay responsive even when the robot is under heavy load.
