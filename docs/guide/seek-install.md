# Install Seek

Seek is the desktop companion to Axiom. It is an Electron + Svelte application that listens to the robot controller's WebSocket stream and displays the live scheduler state, system data, and telemetry in a driver-friendly interface.【F:Interface/src/main/index.ts†L1-L120】 This guide shows how to install the prebuilt binaries from GitHub Releases and how to connect Seek to a robot.

## Prerequisites

- A Windows, macOS, or Linux laptop that you can bring to the driver station.
- Node.js 18+ **only if** you plan to build from source (not required for the prebuilt releases).
- A robot controller running Axiom with the web server enabled. Scheduler updates are published through the embedded NanoWSD server on port 10464.【F:Core/src/main/java/io/github/bionictigers/axiom/core/web/Server.kt†L1-L120】

::: info About the GitHub releases
Seek binaries are published on the Axiom repository's Releases page. Each tagged version provides `.exe`, `.dmg`, and `.AppImage` builds created by the Electron builder pipeline.
:::

## Step 1 – Download the latest release

1. Navigate to the [Axiom Releases page](https://github.com/bionictigers/axiom/releases).
2. Pick the newest version labeled **Seek**.
3. Download the installer for your platform:
   - `Seek-Setup-X.Y.Z.exe` for Windows 10/11.
   - `Seek-X.Y.Z.dmg` for macOS (Intel and Apple Silicon are both supported).
   - `Seek-X.Y.Z.AppImage` for Linux distributions that support AppImage.

If your school uses managed devices, coordinate with your IT administrator to approve the installer.

## Step 2 – Install Seek

### Windows

1. Double-click the `.exe` installer.
2. Accept the security prompt and follow the guided steps.
3. Launch **Seek** when the installer completes; it will appear in the Start menu.

### macOS

1. Open the `.dmg` file.
2. Drag the **Seek** icon into the **Applications** folder.
3. Open Seek from Launchpad. macOS may warn that the app is from the internet; choose **Open** to confirm.

### Linux (AppImage)

1. Mark the file as executable: `chmod +x Seek-X.Y.Z.AppImage`.
2. Run it from the terminal or double-click the file in your file manager.

Seek remembers its window size and automatically hides the menu bar so it feels native on every platform.【F:Interface/src/main/index.ts†L18-L69】

## Step 3 – Connect to the robot controller

1. Ensure the robot controller and the laptop are on the same Wi-Fi network (the FTC Driver Station hotspot or your pit network).
2. Start Axiom on the robot controller; the scheduler automatically broadcasts data using the built-in NanoWSD server.【F:Core/src/main/java/io/github/bionictigers/axiom/core/web/Server.kt†L53-L108】
3. Launch Seek. The status bar at the bottom shows the current connection state (`Axiom Connected` or `Axiom Disconnected`).【F:Interface/src/main/index.ts†L70-L120】
4. If the status does not change within a few seconds, confirm the IP address and firewall rules. Seek connects over WebSocket port `10464` by default.

## Step 4 – Verify incoming data

When Seek receives data from the scheduler, it displays live command entries, system values, and telemetry updates in the main panel. The renderer listens for `axiom-data` messages from the Electron main process, which buffers any messages that arrive before the UI is ready to avoid data loss.【F:Interface/src/main/index.ts†L8-L67】

If the panel stays empty, check the following:

- The robot is running code that schedules at least one command.
- You can reach `http://<robot-ip>:10464/` from a web browser (the server should respond with "NanoHTTPD on /").
- Any classroom firewall has WebSocket traffic enabled.

## Updating Seek

When a new version releases, repeat the download and installation steps. Windows users can install over the existing copy; macOS users can replace the app bundle. Linux users can delete the old AppImage and mark the new file as executable.

## Building from source (optional)

If you need custom branding or want to contribute:

```bash
cd Interface
npm install
npm run dev
```

This starts a development build with hot reloading. To produce distributables, run `npm run build:<platform>` as described in the Interface README.【F:Interface/README.md†L1-L26】

Seek is ready once you see live command data streaming in. Continue to the feature overview to learn how the app visualizes scheduler state and how non-technical drivers can benefit from the insights.
