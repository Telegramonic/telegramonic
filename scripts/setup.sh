#!/bin/bash
# setup.sh - Set up dependencies for Telegramonic (including Node/Yarn, Rust, and iOS targets)

set -e

echo "=== Telegramonic Setup Script ==="

# 1. Check/Install Rust
if ! command -v cargo &> /dev/null; then
    echo "Rust/Cargo not found. Installing via rustup..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    
    # Source cargo environment
    source "$HOME/.cargo/env"
else
    echo "Rust/Cargo is already installed."
fi

# Make sure Cargo is in the PATH for the rest of this script
export PATH="$HOME/.cargo/bin:$PATH"

# 2. Add iOS targets for Tauri mobile build
echo "Adding Rust targets for iOS..."
rustup target add aarch64-apple-ios x86_64-apple-ios aarch64-apple-ios-sim

# 3. Install CocoaPods (required for Tauri iOS build)
if ! command -v pod &> /dev/null; then
    echo "CocoaPods not found. Installing via Homebrew..."
    brew install cocoapods
else
    echo "CocoaPods is already installed."
fi

# 4. Install npm dependencies
echo "Installing project dependencies via Yarn..."
yarn install

echo "=== Setup Completed Successfully ==="
echo "Please run: source \$HOME/.cargo/env or restart your terminal to make cargo available."
