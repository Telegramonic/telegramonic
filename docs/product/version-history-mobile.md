# Mobile Version History

This document tracks release updates, major features, optimizations, and bug fixes for the Telegramonic Mobile application workspace.

---

## [v0.1.0] - Initial Mobile Release

- **Mobile Workspace Version**: `0.1.0`

### 🌟 New Features

- **Bottom Tab Navigation Bar**: Replaced the slide-out mobile sidebar drawer with a sticky bottom navigation tab bar on smaller viewports for easier single-handed navigation.
- **Responsive Dialog Sizing**: Refactored user-input confirmation dialogs (such as the folder creation modal) to scale responsively and fit securely within the bounds of small mobile viewports.
- **Tauri Mobile Setup**: Configured Tauri workspace wrapper configs for generating Android and iOS native mobile application bundles.
- **Mobile Options Menus**: Added a dedicated three-dot menu for list actions on small screens, preventing options overlays from causing vertical layout shifts.
- **Android Release Pipeline**: Added a dedicated GitHub Actions build workflow (`build-android-release.yml`) to generate, optimize, and sign the Android production package (.aab / .apk).
- **Tauri Skip Compilation Optimization**: Configured `TAURI_SKIP_FRONTEND_BUILD` conditional bypasses to prevent duplicate Web UI compilation cycles when building mobile application targets.
