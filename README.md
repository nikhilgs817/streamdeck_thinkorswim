# thinkorswim Controls

Unofficial Windows companion for Elgato Stream Deck. Version 1.0.0.0.

Includes documented chart-settings, time-frame and zoom shortcuts, focus, editing and field navigation. Chart shortcuts require a selected chart. Optional Charts/Watchlist shortcut actions use bindings you choose under Setup > Application Settings > Hot keys.

![Animated keys](docs/images/deck.gif)

## Setup

Requires Windows 10+, Stream Deck 7.1+ and Windows Daily Toolkit 2.6+ for coordinated automatic profile switching. Install the plugin package, accept its editable **thinkorswim** profile, and launch thinkorswim from Toolkit's Open App action. The deck follows the foreground app; Back returns to your main keys. Multiple companions switch through the main profile instead of nesting profiles. Keys also work in a manually selected profile without the Toolkit coordinator.

## Appearance and controls

Every key has animated Colourful, Vivid and Pro looks, 29 themes, custom labels, glyphs and pictures. Gentle loop uses a six-second loop at 12 fps and stops for hidden keys. Select any key to set its optional shortcut override. The Back key has a Follow focus switch. App controls verify the executable identity and foreground window before sending input.

No default key submits, cancels or modifies a trading order. No account data or login credentials are bundled.

## Build

```sh
npm ci
npm run build
npx tsc --noEmit
npm test
npm run test:ui
npm run validate
npm run pack
```

Open `dist/com.dailyops.thinkorswim.v1.streamDeckPlugin` to install. Build artifacts and personal settings are Git-ignored. Source code and dependencies are self-contained in this repository.

![Key settings](docs/images/settings.png)

## References

- [App documentation](https://toslc.thinkorswim.com/center/howToTos/thinkManual/Getting-Started/Keyboard-Shortcuts)
- [Windows Daily Toolkit](https://github.com/nikhilgs817/windows_daily_toolkit)

Not affiliated with or endorsed by the app publisher. App names belong to their respective owners. MIT license.
