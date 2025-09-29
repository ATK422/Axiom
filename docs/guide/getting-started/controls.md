# Driver Controls

Axiom's `Controls` system turns gamepad input into commands. This section breaks down how to mirror the control mappings shown in the presentation slide.

## Map buttons to commands

Create a `Controllable` object that binds buttons to command factories. Register the controls with the scheduler so they update every loop.

### Kotlin

```kotlin
import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode
import com.qualcomm.robotcore.eventloop.opmode.TeleOp
import io.github.bionictigers.axiom.core.commands.Command
import io.github.bionictigers.axiom.core.commands.Scheduler
import io.github.bionictigers.axiom.core.commands.System
import io.github.bionictigers.axiom.core.input.Controllable
import io.github.bionictigers.axiom.core.input.Controls
import io.github.bionictigers.axiom.core.input.Gamepads
import io.github.bionictigers.axiom.core.input.types.Analog
import io.github.bionictigers.axiom.core.input.types.Digital
import kotlin.time.Duration.Companion.milliseconds

class DriveSystem : System() {
    override val name = "drive"

    val driveLoop = Command.continuous("DriveLoop", interval = 20.milliseconds) {
        // Update drivetrain power here.
    }

    override val beforeRun = driveLoop
}

@TeleOp
class ControlsOpMode : LinearOpMode() {
    override fun runOpMode() {
        val drive = DriveSystem()

        val driverControls = object : Controllable<Unit> {
            override fun bindControls(profile: Unit, gamepads: Gamepads, builder: Controls.Builder) {
                builder.register(Digital.a) { pressed ->
                    Command.instant("Toggle Boost") {
                        if (pressed) {
                            println("Boost on")
                        } else {
                            println("Boost off")
                        }
                    }
                }
            }
        }

        val controls = Controls(
            gamepad1,
            gamepad2,
            profile1 = Unit,
            profile2 = Unit,
            controllables = listOf(driverControls)
        )

        waitForStart()
        Scheduler.schedule(drive)
        Scheduler.schedule(controls)

        while (opModeIsActive()) {
            Scheduler.run()
            telemetry.update()
        }
    }
}
```

### Java

```java
import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import io.github.bionictigers.axiom.core.commands.Command;
import io.github.bionictigers.axiom.core.commands.CommandBuilder;
import io.github.bionictigers.axiom.core.commands.Scheduler;
import io.github.bionictigers.axiom.core.commands.System;
import io.github.bionictigers.axiom.core.input.Controllable;
import io.github.bionictigers.axiom.core.input.Controls;
import io.github.bionictigers.axiom.core.input.Gamepads;
import io.github.bionictigers.axiom.core.input.types.Digital;
import java.util.List;
import kotlin.Unit;

final class DriveSystem extends System {
    private final CommandBuilder commands = new CommandBuilder(this);

    @Override
    public String getName() {
        return "drive";
    }

    @Override
    public Command<?> getBeforeRun() {
        return commands.continuous("DriveLoop", null, state -> {
            // Update drivetrain power here.
            return Unit.INSTANCE;
        });
    }
}

@TeleOp
public final class ControlsOpMode extends LinearOpMode {
    @Override
    public void runOpMode() {
        DriveSystem drive = new DriveSystem();

        Controllable<Unit> driverControls = new Controllable<>() {
            @Override
            public void bindControls(Unit profile, Gamepads pads, Controls.Builder builder) {
                builder.register(Digital.a, pressed -> Command.instant("Toggle Boost", state -> {
                    if (pressed) {
                        System.out.println("Boost on");
                    } else {
                        System.out.println("Boost off");
                    }
                    return Unit.INSTANCE;
                }));
            }
        };

        Controls<Unit> controls = new Controls<>(gamepad1, gamepad2, Unit.INSTANCE, Unit.INSTANCE, List.of(driverControls));

        waitForStart();
        Scheduler.schedule(drive);
        Scheduler.schedule(controls);

        while (opModeIsActive()) {
            Scheduler.run();
            telemetry.update();
        }
    }
}
```

## Use analog inputs

Use `Analog` types for triggers and sticks. Dead zones and scaling live in the builder so you can tune them easily.

```kotlin
builder.register(Analog.leftTrigger) { value ->
    Command.instant("Adjust Intake") {
        println("Trigger value: $value")
    }
}
```

## Profiles and safety

- Profiles let two drivers share the same `Controls` instance with different mappings.
- Only register commands that follow the game manual. Keep any field-sensitive edits behind an `@Editable` flag so they show up in Seek during practice, not on the competition field.
- Remember to schedule both the systems and the `Controls` object. The scheduler keeps them synchronized with the FTC loop from the Robot Controller app.
