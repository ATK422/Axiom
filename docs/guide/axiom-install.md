# Install Axiom

Axiom is an FTC-focused command framework that runs on the Android robot controller. This guide walks through the entire installation process—from prerequisites to a working op mode—while explaining the rationale in plain language. Each step includes pointers for both new builders and experienced software teams.

## Prerequisites

Before you begin, make sure you have the following ready:

- **Android Studio** Flamingo (2022.2.1) or newer with the Android SDK for API level 35 installed.
- **Java 17** (required by the Gradle build). The Android Studio JDK 17 bundle works fine.
- An existing FTC Robot Controller project created from the official [FTC SDK](https://github.com/FIRST-Tech-Challenge/FtcRobotController) or your team's variant.
- Team-shared Git hosting, so everyone installs the framework the same way.

::: tip Why Java 17?
Axiom targets Java/Kotlin 17 language features in `Core/build.gradle.kts`, so older JDKs will fail to compile.【F:Core/build.gradle.kts†L15-L24】
:::

## Step 1 – Add the Maven repository

Axiom artifacts are published under the `io.github.bionictigers.axiom` group. Open your Robot Controller project's **root** `build.gradle` (or `settings.gradle.kts`) file and ensure Maven Central is listed:

```kts
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositories {
        google()
        mavenCentral()
    }
}
```

Most FTC templates already include these repositories—double-check so Gradle knows where to download Axiom.

## Step 2 – Declare the dependency

Inside the module where your op modes live (commonly `TeamCode/build.gradle`), add the Axiom core artifact to the `dependencies` block. Replace `X.Y.Z` with the version your team plans to use (for example `0.1.0`).

```kts
dependencies {
    implementation("io.github.bionictigers.axiom:core:X.Y.Z")
}
```

This pulls in Axiom's command scheduler, system model, input helpers, and built-in web server for live telemetry streaming.【F:Core/src/main/java/io/github/bionictigers/axiom/core/commands/Scheduler.kt†L1-L129】【F:Core/src/main/java/io/github/bionictigers/axiom/core/input/Controls.kt†L1-L103】

## Step 3 – Enable Kotlin (optional but recommended)

Axiom is written in Kotlin, but it works perfectly with Java op modes. If your project does not already use Kotlin, add the Kotlin Android plugin to the module's `build.gradle`:

```kts
plugins {
    id("com.android.library")
    id("org.jetbrains.kotlin.android")
}
```

Gradle will download the Kotlin toolchain during the next sync. Teams that prefer Java can skip this step, but enabling Kotlin makes it easier to copy the official examples.

## Step 4 – Sync and verify the build

Run `./gradlew assembleDebug` (or press **Sync Now** in Android Studio). The build should complete without errors. If Gradle cannot find the dependency, re-check the Maven repository step and confirm the version number.

## Step 5 – Create your first command

Use the sample below to verify Axiom loads correctly. The example uses a subsystem that keeps track of a motor's target RPM and a command that re-schedules itself until the robot is disabled.

```kotlin
import io.github.bionictigers.axiom.core.commands.Command
import io.github.bionictigers.axiom.core.commands.Scheduler
import io.github.bionictigers.axiom.core.commands.System
import io.github.bionictigers.axiom.core.commands.groups.SequentialCommandGroup
import kotlin.time.Duration.Companion.milliseconds

class FlywheelState : BaseCommandState() {
    var targetRpm: Double = 0.0
}

class FlywheelSystem(private val motor: DcMotor) : System() {
    override val name = "flywheel"

    override val beforeRun = Command.continuous("SpinUp", FlywheelState(), 50.milliseconds) {
        action {
            motor.power = state.targetRpm / 6000.0
        }
    }
}

fun startTeleOp() {
    val flywheel = FlywheelSystem(hardwareMap.dcMotor["flywheel"])
    Scheduler.schedule(flywheel)

    val rampUp = Command.continuous("RampUp", FlywheelState()) {
        action {
            state.targetRpm += 250
            if (state.targetRpm >= 4500) stop()
        }
    }

    Scheduler.schedule(SequentialCommandGroup("Flywheel Warmup", rampUp))
}
```

If the code compiles and the command scheduler runs on the robot, you are ready to build more complex autonomous routines.

## Troubleshooting tips

- **Gradle sync fails with signing errors** – Remove any `signing` configuration you copied from sample publishing builds. You only need the dependency line to consume Axiom.
- **`ClassNotFoundException` at runtime** – Ensure your module's `minSdk` is at least 24 (Android 7.0). Axiom sets this requirement in its library manifest.【F:Core/build.gradle.kts†L26-L36】
- **Need offline documentation?** – Run `npm run docs:build` from the `/docs` folder to generate a static site you can host internally.

You now have Axiom installed, configured, and verified. Continue with the Seek installation to visualize what the scheduler is doing while the robot runs.
