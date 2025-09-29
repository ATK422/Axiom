# Getting Started with Axiom

This walkthrough shows how to set up Axiom inside the official FTC Robot Controller project, build your first command, and preview robot data with Seek.

## 1. Install the tools

- Follow the [Axiom install guide](/guide/axiom-install) to prepare your development computer.
- Follow the [Seek install guide](/guide/seek-install) if you want to watch scheduler data on a laptop between matches.

## 2. Create your FTC project

1. Clone or download the latest release of the [FtcRobotController repository](https://github.com/FIRST-Tech-Challenge/FtcRobotController).
2. Open the project in Android Studio and let Gradle finish syncing.
3. Confirm that you can build and run the stock `BasicOpMode_Linear` sample on a Control Hub or Android phone.

## 3. Add Axiom to the Robot Controller app

1. In the Robot Controller module, add the Axiom dependency shown in the install guide.
2. Sync Gradle. Android Studio should now find Axiom classes like `io.github.bionictigers.axiom.core.commands.Command`.
3. Create a new Kotlin or Java package in `TeamCode` for your Axiom systems and commands.

## 4. Build your first command

Create a state data class, mark editable fields, and wire a command with the `Command.create` helper. The examples below echo the approach from the team presentation and use the telemetry object from the op mode.

### Kotlin

```kotlin
import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode
import com.qualcomm.robotcore.eventloop.opmode.TeleOp
import io.github.bionictigers.axiom.core.commands.BaseCommandState
import io.github.bionictigers.axiom.core.commands.Command
import io.github.bionictigers.axiom.core.commands.Scheduler
import io.github.bionictigers.axiom.core.web.Editable
import org.firstinspires.ftc.robotcore.external.Telemetry

class GreetingState(val telemetry: Telemetry) : BaseCommandState() {
    @Editable var message: String = "Hello"
    var ticks: Int = 0
}

@TeleOp
class GreetingOpMode : LinearOpMode() {
    override fun runOpMode() {
        val greeting = Command.create("Greeting", GreetingState(telemetry)) {
            enter {
                it.ticks = 0
            }

            action {
                it.telemetry.addData("Greeting", it.message)
                it.ticks += 1
                false
            }

            exit {
                it.telemetry.addLine("Stopped after ${'$'}{it.ticks} loops")
            }
        }

        waitForStart()
        Scheduler.schedule(greeting)

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
import io.github.bionictigers.axiom.core.commands.BaseCommandState;
import io.github.bionictigers.axiom.core.commands.Command;
import io.github.bionictigers.axiom.core.commands.Scheduler;
import io.github.bionictigers.axiom.core.web.Editable;
import org.firstinspires.ftc.robotcore.external.Telemetry;

final class GreetingState extends BaseCommandState {
    final Telemetry telemetry;
    @Editable
    String message = "Hello";
    int ticks = 0;

    GreetingState(Telemetry telemetry) {
        this.telemetry = telemetry;
    }
}

final class GreetingCommand extends Command<GreetingState> {
    GreetingCommand(Telemetry telemetry) {
        super("Greeting", new GreetingState(telemetry));

        enter(state -> {
            state.ticks = 0;
            return null;
        });

        action(state -> {
            state.telemetry.addData("Greeting", state.message);
            state.ticks += 1;
            return false;
        });

        exit(state -> {
            state.telemetry.addLine("Stopped after " + state.ticks + " loops");
            return null;
        });
    }
}

@TeleOp
public final class GreetingOpMode extends LinearOpMode {
    @Override
    public void runOpMode() {
        GreetingCommand command = new GreetingCommand(telemetry);

        waitForStart();
        Scheduler.schedule(command);

        while (opModeIsActive()) {
            Scheduler.run();
            telemetry.update();
        }
    }
}
```

`@Editable` fields show up in Seek so mentors can change them between runs without touching the code. Access command state values inside your command with `it.variableName` in Kotlin or `state.variableName` in Java, just like the slide demonstrates.

### Next steps

- [Command groups](./command-groups) show how to chain actions for autonomous routines.
- [Driver controls](./controls) explains how to connect gamepad input to commands.
- When you want to pause execution, use `Command.wait` and `CommandGroupBuilder.waitUntil` inside those structures.

## 5. Check your work with Seek

1. Start Seek on a laptop or desktop that is on the same network as the Robot Controller.
2. Connect to the robot and open your op mode.
3. Watch the `Greeting` command update live. Edit `message` between practice runs only. The game manual does not allow mid-match tuning, so keep Seek closed on the competition field.

## 6. Deploy to Android phones

If you switch from a Control Hub to Android phones, follow the official FIRST Tech Challenge guide: [Installing Kotlin and setting up Android Studio](https://ftc-docs.firstinspires.org/en/latest/programming_resources/shared/installing_kotlin/Installing-Kotlin.html). The article covers device setup, driver station pairing, and USB debugging.
