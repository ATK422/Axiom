# Command Groups

Command groups let you run several commands in order or at the same time. They match the flow described in the presentation slide: build a block of steps, then let the scheduler advance once each step finishes.

## Sequential groups

Sequential groups run commands one after another. Use them for autonomous paths where each action must complete before the next begins.

### Kotlin

```kotlin
import io.github.bionictigers.axiom.core.commands.Command
import io.github.bionictigers.axiom.core.commands.groups.sequential
import kotlin.time.Duration.Companion.seconds

val autoScore = Command.instant("Auto Score") {
    println("Scoring sample")
}

val park = Command.instant("Park") {
    println("Parking")
}

val autoRoutine = sequential("Score Routine") {
    add(autoScore)
    wait(1.seconds)
    add(park)
}
```

### Java

```java
import io.github.bionictigers.axiom.core.commands.Command;
import io.github.bionictigers.axiom.core.commands.CommandBuilder;
import io.github.bionictigers.axiom.core.commands.groups.CommandGroupBuilder;
import io.github.bionictigers.axiom.core.commands.groups.SequentialCommandGroup;
import kotlin.Unit;
import kotlin.time.Duration;

CommandBuilder commands = new CommandBuilder();
Command<?> autoScore = commands.instant("Auto Score", state -> {
    System.out.println("Scoring sample");
    return Unit.INSTANCE;
});

Command<?> park = commands.instant("Park", state -> {
    System.out.println("Parking");
    return Unit.INSTANCE;
});

CommandGroupBuilder group = new CommandGroupBuilder();
group.add(autoScore);
group.wait(Duration.Companion.seconds(1));
group.add(park);
SequentialCommandGroup autoRoutine = new SequentialCommandGroup("Score Routine", group.getCommands());
```

`wait` pauses the group for the duration you provide. Use `waitUntil` when you need to block until a sensor reading or state flag becomes true.

## Concurrent groups

Concurrent groups let multiple commands run side by side. This is useful for actions that can overlap, such as driving forward while spinning up an intake.

### Kotlin

```kotlin
import io.github.bionictigers.axiom.core.commands.Command
import io.github.bionictigers.axiom.core.commands.groups.concurrent

val drive = Command.continuous("Drive Forward") {
    println("Driving forward")
}

val intake = Command.continuous("Spin Intake") {
    println("Spinning intake")
}

val concurrentAuto = concurrent("Drive and Intake") {
    add(drive)
    add(intake)
}
```

### Java

```java
import io.github.bionictigers.axiom.core.commands.Command;
import io.github.bionictigers.axiom.core.commands.CommandBuilder;
import io.github.bionictigers.axiom.core.commands.groups.CommandGroupBuilder;
import io.github.bionictigers.axiom.core.commands.groups.ConcurrentCommandGroup;
import kotlin.Unit;

CommandBuilder commands = new CommandBuilder();
Command<?> drive = commands.continuous("Drive Forward", state -> {
    System.out.println("Driving forward");
    return Unit.INSTANCE;
});

Command<?> intake = commands.continuous("Spin Intake", state -> {
    System.out.println("Spinning intake");
    return Unit.INSTANCE;
});

CommandGroupBuilder group = new CommandGroupBuilder();
group.add(drive);
group.add(intake);
ConcurrentCommandGroup concurrentAuto = new ConcurrentCommandGroup("Drive and Intake", group.getCommands());
```

Concurrent groups finish when every child command stops. If you want the group to end when one command completes, call `stop()` inside that command's action block.

## Tips

- Name each group so telemetry and Seek logs stay readable.
- Combine sequential and concurrent groups to mirror your autonomous script: build a sequential group, then add concurrent blocks inside when tasks overlap.
- Reuse the same commands inside different groups. The scheduler will manage the dependencies and lifecycles for you.
