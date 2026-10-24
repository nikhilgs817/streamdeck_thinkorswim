# Changelog

## 1.2.2

- **Back fixed:** moving between pages (More, Main and the other page keys) no longer replaces your main keys as the place Back returns to. Back, and switching away from the app or minimizing it, now return to your Default profile.
- Back and page presses are now written to the plugin log for troubleshooting.

## 1.2.1

- **Back** now returns to your previous profile even when these keys were opened directly in Stream Deck (not through Windows Daily Toolkit).
- Shared runtime and artwork updates.

## 1.2.0

- **New look:** thinkorswim Dark (default) with black terminal keys, teal accent, bold Segoe UI labels and an animated icon for every key; Buy green and Sell red in every style. thinkorswim Light, Colourful, Vivid and Pro share the icons.
- **Safety:** Custom shortcut and other non-trading keys refuse Enter and multi-key sequences in this trading app. Buy and Sell keep single-tap immediate behaviour (Flatten and Cancel orders still need a 1-second hold).
- **Fixed:** after a trading-worker error the next press no longer fails with "starting".
- Non-trading shortcut keys use the faster background helper, which checks thinkorswim is in front before each step.
- Installer: asks before installing Stream Deck, waits up to 60 s for startup, works when WMI is restricted, independent rollback steps, pinned package checksum.
- `npm test` now also runs the trading-input checks. Added a trading-risk notice.

## 1.1.2

- Restored the original Unicode label separators and broker notes.
- Reject invalid UTF-8 in app configuration during builds.

## 1.1.1

- Added a double-click Windows installer with prerequisite checks, package verification, local backups, preserved profiles/settings and automatic rollback.
- Included the pinned Windows Daily Toolkit dependency for automatic app switching. Compatible or newer installed versions are kept.
- Added a connected-runtime startup receipt and isolated installer tests.
- Added installation, update, troubleshooting and recovery documentation.
- Switched the development bundler to official Rollup WASM for restricted Windows environments.
