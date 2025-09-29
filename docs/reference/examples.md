# Code Examples

The snippets below show how to assemble an Axiom tele-op loop in both Kotlin and Java. Each example highlights the same ideas—declaring systems, scheduling commands, and wiring driver controls—so teams can choose whichever language they are most comfortable with.

## Kotlin walkthrough

```kotlin
import com.qualcomm.robotcore.hardware.DcMotor
import com.qualcomm.robotcore.hardware.Gamepad
import com.qualcomm.robotcore.hardware.HardwareMap
import io.github.bionictigers.axiom.core.commands.BaseCommandState
import io.github.bionictigers.axiom.core.commands.Command
import io.github.bionictigers.axiom.core.commands.Scheduler
import io.github.bionictigers.axiom.core.commands.System
import io.github.bionictigers.axiom.core.input.Controllable
import io.github.bionictigers.axiom.core.input.Controls
import io.github.bionictigers.axiom.core.input.Gamepads
import io.github.bionictigers.axiom.core.input.types.Digital
import kotlin.time.Duration.Companion.milliseconds

class DrivetrainState : BaseCommandState() {
    var throttle = 0.0
}

class Drivetrain(private val left: DcMotor, private val right: DcMotor) : System() {
    override val name = "drivetrain"
    val state = DrivetrainState()

    override val beforeRun = Command.continuous("DriveLoop", state, 20.milliseconds) { commandState ->
        left.power = commandState.throttle
        right.power = commandState.throttle
    }
}

fun initTeleOp(hardwareMap: HardwareMap, gamepad1: Gamepad, gamepad2: Gamepad) {
    val drive = Drivetrain(
        hardwareMap.dcMotor["left"],
        hardwareMap.dcMotor["right"]
    )

    val controls = Controls(
        gamepad1,
        gamepad2,
        profile1 = object {},
        profile2 = object {},
        controllables = listOf(
            object : Controllable<Any> {
                override fun bindControls(profile: Any, gamepad: Gamepads, builder: Controls.Builder) {
                    builder.register(Digital.a) { pressed ->
                        Command.instant("Boost", drive.state) { state ->
                            state.throttle = if (pressed) 1.0 else 0.4
                        }
                    }
                }
            }
        )
    )

    Scheduler.schedule(drive, controls)
}
```

- `Command.continuous` produces a looping command that runs every 20 ms and updates the drivetrain motors.【F:Core/src/main/java/io/github/bionictigers/axiom/core/commands/Command.kt†L98-L152】
- The `Controls` system maps the A button to a boost command so drivers can change speeds without extra wiring.【F:Core/src/main/java/io/github/bionictigers/axiom/core/input/Controls.kt†L5-L103】
- Scheduling both the system and controls registers them with the central scheduler, which handles update order and dependencies.【F:Core/src/main/java/io/github/bionictigers/axiom/core/commands/Scheduler.kt†L55-L94】

## Java walkthrough

```java
import com.qualcomm.robotcore.hardware.DcMotor;
import com.qualcomm.robotcore.hardware.Gamepad;
import com.qualcomm.robotcore.hardware.HardwareMap;
import io.github.bionictigers.axiom.core.commands.BaseCommandState;
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

public final class ArmState extends BaseCommandState {
    public double holdPower = 0.3;
}

public final class ArmSystem extends System {
    private final DcMotor arm;
    private final ArmState state = new ArmState();
    private final CommandBuilder commands = new CommandBuilder(this);

    public ArmSystem(DcMotor arm) {
        this.arm = arm;
    }

    @Override
    public String getName() {
        return "arm";
    }

    public ArmState getState() {
        return state;
    }

    @Override
    public Command<ArmState> getBeforeRun() {
        return commands.continuous("ArmHold", state, s -> {
            arm.setPower(s.holdPower);
            return Unit.INSTANCE;
        });
    }
}

public void initArm(HardwareMap hardwareMap, Gamepad gp1, Gamepad gp2) {
    ArmSystem arm = new ArmSystem(hardwareMap.dcMotor.get("arm"));
    CommandBuilder commandFactory = new CommandBuilder();

    Controllable<Object> presetControls = new Controllable<>() {
        @Override
        public void bindControls(Object profile, Gamepads pad, Controls.Builder builder) {
            builder.register(Digital.b, pressed -> commandFactory.instant("TogglePreset", arm.getState(), state -> {
                arm.getState().holdPower = pressed ? 0.6 : 0.3;
                return Unit.INSTANCE;
            }));
        }
    };

    Controls<Object> controls = new Controls<>(gp1, gp2, new Object(), new Object(), List.of(presetControls));

    Scheduler.schedule(List.of(arm, controls));
}
```

- `CommandBuilder` gives Java teams the same fluent factory methods that Kotlin users access through the companion object.【F:Core/src/main/java/io/github/bionictigers/axiom/core/commands/CommandBuilder.kt†L1-L33】
- The `Controls.Builder` API works identically in Java because it only relies on interfaces and functional types.【F:Core/src/main/java/io/github/bionictigers/axiom/core/input/Controls.kt†L5-L103】
- Scheduling a list ensures Axiom registers both the system and the controls module in one call.【F:Core/src/main/java/io/github/bionictigers/axiom/core/commands/Scheduler.kt†L55-L94】

Feel free to copy these snippets into your project as a starting point. Swap in your team's motor names, tweak the command logic, and use Seek to observe the resulting state changes live.
