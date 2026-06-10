# Telegramonic Mobile Client (`apps/mobile/`)

The mobile client for **Telegramonic**—a React-based user interface wrapped in a **Tauri** mobile shell for iOS and Android. It shares state management, screens, logic, and assets with the web and desktop clients using the `shared/client-common` and `shared/common` workspaces.

---

## Prerequisites

Before running or building the mobile applications, ensure your machine is configured with the necessary native build tools:

### iOS Prerequisites
1. **Xcode**: Install Xcode from the Mac App Store and ensure Xcode Command Line Tools are active:
   ```bash
   xcode-select --install
   ```
2. **CocoaPods**: Required for managing native iOS dependencies:
   ```bash
   brew install cocoapods
   ```
3. **Rust Targets**: Add iOS cross-compilation targets:
   ```bash
   rustup target add aarch64-apple-ios x86_64-apple-ios aarch64-apple-ios-sim
   ```

### Android Prerequisites
*Assuming **Android Studio** is already installed (which manages the SDK and emulator), the following additional configuration steps are required:*

1. **Android NDK**: Open Android Studio's SDK Manager (Tools > SDK Manager > SDK Tools), check **NDK (Side by side)**, and install NDK version `26.3.11579264`.
2. **Rust Targets**: Add the Android targets for cross-compilation:
   ```bash
   rustup target add aarch64-linux-android x86_64-linux-android
   ```
3. **Environment Variables**: Add the SDK and NDK paths to your shell configuration profile (e.g., `~/.zshrc`):
   ```bash
   export ANDROID_HOME="$HOME/Library/Android/sdk"
   export NDK_HOME="$ANDROID_HOME/ndk/26.3.11579264"
   ```

> [!TIP]
> You can automatically install the Rust iOS targets, CocoaPods, and JavaScript dependencies by running the setup script from the monorepo root:
> ```bash
> bash scripts/setup.sh
> ```

---

## Running the iOS App in Simulator

Follow these steps to build and launch the iOS application on the local simulator:

### 1. Boot the Simulator
The Simulator must be active and booted before Tauri can deploy the application.
1. Launch the macOS Simulator application:
   ```bash
   open -a Simulator
   ```
2. Check available simulators and boot one if needed (for example, **iPhone 16**):
   * *List devices:* `xcrun simctl list devices`
   * *Boot device:* `xcrun simctl boot <SIMULATOR_UDID>`

### 2. Start the Development Build
Run the following command from the monorepo root:
```bash
yarn workspace telegramonic-mobile run tauri ios dev
```

* **Interactive Mode**: If you do not specify a device, the CLI will output a list of detected simulators. Enter the index number corresponding to your booted simulator.
* **Targeted Mode**: You can directly target a booted simulator by passing its name or UDID:
  ```bash
  yarn workspace telegramonic-mobile run tauri ios dev "iPhone 16"
  ```

Once launched, the Tauri dev runner will boot your Craco development server, compile the Rust crate, assemble the Xcode workspace under `src-tauri/gen/apple`, install the `.app` package on your booted simulator, and automatically open it.

---

## Running and Building the Android App

### Initialize Android Project
If compiling Android for the first time, make sure the project structure is initialized:
```bash
yarn workspace telegramonic-mobile run tauri android init
```

### Run on Emulator or Connected Device
Make sure an Android Virtual Device (AVD) is running or a physical device with USB debugging enabled is connected, then run:
```bash
yarn workspace telegramonic-mobile run tauri android dev
```

### Build APK (Debug or Release)
To compile a debug APK for testing:
```bash
yarn workspace telegramonic-mobile run tauri android build --apk --debug
```

The compiled APK will be output to:
`apps/mobile/src-tauri/gen/android/app/build/outputs/apk/universal/debug/app-universal-debug.apk`

---

## Essential Commands

Execute these commands from the monorepo root:

| Command | Description |
| :--- | :--- |
| `yarn mobile:dev` | Start the development server (web browser preview). |
| `yarn mobile:ios` | Compile and run the iOS app on a Simulator (interactive selector). |
| `yarn mobile:ios:build` | Build the production/distribution-ready iOS application bundle. |
| `yarn mobile:android` | Compile and run the Android app in development on an emulator. |
| `yarn mobile:android:build` | Build the production/distribution-ready Android app. |
| `yarn mobile:test` | Run the Jest unit tests for the mobile workspace. |
