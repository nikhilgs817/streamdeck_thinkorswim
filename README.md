# thinkorswim Controls

Unofficial Windows companion for Elgato Stream Deck. Version 1.1.0.0.

Three editable pages organize preparation, execution and position management. Stocks only: no options workflow is bundled.

- Trade: Buy, Sell, editable OTOCO, Positions and Orders stay within one press.
- Plan: chart confirmation, watchlist, trade plan and risk check. Use linked Daily, 5-minute and 2-minute charts for context, confirmation and timing.
- Manage: partial exit, breakeven, trailing-stop, orders and journal. The partial-exit workflow is intended for a one-third reduction after a planned 1R move; the broker must supply any position-dependent calculation.

**Broker setup is required.** Buy/Sell send one explicitly configured broker hotkey using the app's symbol, account, quantity and order defaults. They do not calculate an order or append Enter. A press is never queued, retried, or repeated while held. The trading app must already be in front. Cancel orders and Flatten require a one-second hold; releasing early or leaving the page cancels that press.

Keys marked SETUP have no working default. Match a broker-supported hotkey in the inspector. Trim 1/3, Stop to B/E and Trail stop require corresponding broker capabilities; the plugin cannot infer fills, position size or stop prices. If unsupported, manage the order in Positions / Orders. Trade plan, Risk check and Journal accept your own full http(s) URLs. No personal service addresses are bundled.

thinkorswim supports direct Active Trader orders with Auto Send. Configure and verify the intended Buy/Sell behavior in paperMoney first. General Monitor, Scan and Charts shortcuts are provided and can be overridden; the Trade shortcut may be customized. This installation exposes no usable Java control tree for the bracket template picker, so OTOCO requires a supported editor-opening shortcut or manual selection of Active Trader > Template > TRG w/bracket. The plugin does not claim automatic template selection works on inaccessible Java controls.

The input dispatcher and deck behavior are tested with isolated fixtures. No live orders were placed, changed or cancelled during validation.

![Animated keys](docs/images/deck.gif)

## Setup

Requires Windows 10+, Stream Deck 7.1+ and Windows Daily Toolkit 2.6+ for automatic profile switching. Install the package and accept its editable app profile. Toolkit Open App and foreground app changes show the matching keys; Back returns to the main keys. Profiles also work when selected manually. Existing action IDs remain compatible.

## Appearance

App theme is the default: app-specific surfaces, type, corners and motion. Labels stay still while icon details animate in a six-second loop at 12 fps. Hidden keys stop animating. Colourful, Vivid and Pro remain available with 29 colours, custom labels, glyphs and pictures. App theme uses its own palette; choose another style for custom colours. Buy and Sell retain their semantic colours in App theme.

## Build and verify

```sh
npm ci
npm run build
npx tsc --noEmit
npm test
npm run test:ui
npm run validate
npm run pack
```

Installer: `dist/com.dailyops.thinkorswim.v1.streamDeckPlugin`. Sources and dependencies are self-contained. Personal profiles, credentials, account data and build output are excluded from Git.

![Settings](docs/images/settings.png)

## References

- [Official app documentation 1](https://toslc.thinkorswim.com/center/howToTos/thinkManual/Getting-Started/Keyboard-Shortcuts)
- [Official app documentation 2](https://toslc.thinkorswim.com/center/howToTos/thinkManual/Trade/Active-Trader/AT-Entering-Orders)
- [Windows Daily Toolkit](https://github.com/nikhilgs817/windows_daily_toolkit)

Not affiliated with or endorsed by the app publisher. App names belong to their respective owners. MIT license.
