# Axiom Capabilities

Axiom extends the FTC SDK with a command-based structure that keeps robot code organized and easy to tune.

## Reliable command scheduling

- Commands include clear `enter`, `action`, and `exit` blocks so you can set up hardware, run loop logic, and clean up without extra state machines.
- Dependencies prevent two commands from driving the same subsystem at the same time.
- Scheduler state remembers timing information between loops so telemetry stays consistent.

## System-oriented design

- Systems wrap shared behavior like drivetrain updates or shooter control and expose default commands that run automatically.
- Sequential and concurrent command groups let you script complex autonomous paths using the same building blocks shown in the getting started guide.

## Flexible controls

- The `Controls` API maps buttons, triggers, and sticks to commands with friendly helper methods.
- Driver profiles allow quick layout swaps when you change who is on each gamepad.

## Live telemetry and editing

- Axiom broadcasts command state, scheduler order, and editable fields over the built-in WebSocket server so Seek can view them in real time.
- Mark values with `@Editable` to expose them for between-match tuning without touching code.

## Built for events

- Thread-safe queues handle scheduling inside the FTC loop.
- Commands track monotonic timestamps so delay-sensitive routines keep running smoothly even when the control loop jitters.
