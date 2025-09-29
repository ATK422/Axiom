# Code Examples

These snippets show how to assemble an Axiom tele-op loop in Kotlin and Java. Swap in your team's hardware names and command logic as needed.

## Kotlin walkthrough

```kotlin
import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode
import com.qualcomm.robotcore.eventloop.opmode.TeleOp
import com.qualcomm.robotcore.hardware.DcMotor
import io.github.bionictigers.axiom.core.commands.BaseCommandState
import io.github.bionictigers.axiom.core.commands.Command
import io.github.bionictigers.axiom.core.commands.Scheduler
import io.github.bionictigers.axiom.core.commands.System
import io.github.bionictigers.axiom.core.input.Controllable
import io.github.bionictigers.axiom.core.input.Controls
import io.github.bionictigers.axiom.core.input.Gamepads
import io.github.bionictigers.axiom.core.input.types.Digital
import io.github.bionictigers.axiom.core.web.Editable
import kotlin.time.Duration.Companion.milliseconds

class DrivetrainState : BaseCommandState() {
    @Editable var throttle = 0.4
}

class Drivetrain(private val left: DcMotor, private val right: DcMotor) : System() {
    override val name = "drivetrain"
    val state = DrivetrainState()

    override val beforeRun = Command.continuous("DriveLoop", state, 20.milliseconds) {
        left.power = it.throttle
        right.power = it.throttle
    }
}

@TeleOp
class DriveOpMode : LinearOpMode() {
    override fun runOpMode() {
        val drive = Drivetrain(
            hardwareMap.dcMotor["left"],
            hardwareMap.dcMotor["right"]
        )

        val controls = Controls(
            gamepad1,
            gamepad2,
            profile1 = Unit,
            profile2 = Unit,
            controllables = listOf(object : Controllable<Unit> {
                override fun bindControls(profile: Unit, gamepads: Gamepads, builder: Controls.Builder) {
                    builder.register(Digital.a) { pressed ->
                        Command.instant("Boost") {
                            drive.state.throttle = if (pressed) 0.8 else 0.4
                        }
                    }
                }
            })
        )

        waitForStart()
        Scheduler.schedule(drive)
        Scheduler.schedule(controls)

        while (opModeIsActive()) {
            Scheduler.run()
            telemetry.addData("Throttle", drive.state.throttle)
            telemetry.update()
        }
    }
}
```

## Java walkthrough

```java
import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;
import io.github.bionictigers.axiom.core.commands.BaseCommandState;
import io.github.bionictigers.axiom.core.commands.Command;
import io.github.bionictigers.axiom.core.commands.CommandBuilder;
import io.github.bionictigers.axiom.core.commands.Scheduler;
import io.github.bionictigers.axiom.core.commands.System;
import io.github.bionictigers.axiom.core.input.Controllable;
import io.github.bionictigers.axiom.core.input.Controls;
import io.github.bionictigers.axiom.core.input.Gamepads;
import io.github.bionictigers.axiom.core.input.types.Digital;
import io.github.bionictigers.axiom.core.web.Editable;
import java.util.List;
import kotlin.Unit;

final class ArmState extends BaseCommandState {
    @Editable
    double holdPower = 0.3;
}

final class ArmSystem extends System {
    private final DcMotor arm;
    private final CommandBuilder commands = new CommandBuilder(this);
    private final ArmState state = new ArmState();

    ArmSystem(DcMotor arm) {
        this.arm = arm;
    }

    ArmState getState() {
        return state;
    }

    @Override
    public String getName() {
        return "arm";
    }

    @Override
    public Command<?> getBeforeRun() {
        return commands.continuous("ArmHold", null, s -> {
            arm.setPower(state.holdPower);
            return Unit.INSTANCE;
        });
    }
}

@TeleOp
public final class ArmOpMode extends LinearOpMode {
    @Override
    public void runOpMode() {
        ArmSystem arm = new ArmSystem(hardwareMap.dcMotor.get("arm"));
        CommandBuilder commandFactory = new CommandBuilder();

        Controllable<Unit> presets = new Controllable<>() {
            @Override
            public void bindControls(Unit profile, Gamepads pads, Controls.Builder builder) {
                builder.register(Digital.b, pressed -> commandFactory.instant("TogglePreset", state -> {
                    arm.getState().holdPower = pressed ? 0.6 : 0.3;
                    return Unit.INSTANCE;
                }));
            }
        };

        Controls<Unit> controls = new Controls<>(gamepad1, gamepad2, Unit.INSTANCE, Unit.INSTANCE, List.of(presets));

        waitForStart();
        Scheduler.schedule(arm);
        Scheduler.schedule(controls);

        while (opModeIsActive()) {
            Scheduler.run();
            telemetry.addData("Hold Power", arm.getState().holdPower);
            telemetry.update();
        }
    }
}
```

Feel free to copy these snippets into your project as a starting point. Update the motor names, tweak command logic, and use Seek to observe the resulting state changes during practice.
