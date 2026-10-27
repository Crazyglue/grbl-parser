# grbl-parser

[![CI](https://github.com/Crazyglue/grbl-parser/actions/workflows/ci.yml/badge.svg)](https://github.com/Crazyglue/grbl-parser/actions)

Grbl machine parser library written in TypeScript (ESM).

Provides event-based callbacks to parse any strings grbl may output.

Supports Grbl 0.9, 1.0, and 1.1 (untested with grbl 0.8)

## Installation

```bash
npm install grbl-parser
```

Requires Node 24+.

## Usage

```javascript
import { Parser } from "grbl-parser"
const parser = new Parser()
const myCallback = function (parsedData) {
  // do stuff with parsed data (see example status output in Examples section)
}
const myString = "<Hold:0|MPos:0.000,0.000,0.000|Bf:15,128|FS:675.5,24000|Ov:120,100,100|WCO:0.000,-5.200,306.351|A:SFM>"

parser.dispatcher.addListener("status", myCallback) // bind myCallback to grbl status reports
parser.parseData(myString)
```

### Message types

Use these to bind to specific message types

```javascript
"status",
"success",
"initialize",
"alarm",
"error",
"setting",
"feedbackMessage",
"buildVersion",
"buildOptions",
"gcodeState",
"helpMessage",
"gcodeSystem",
"probeResult",
"echoMessage",
"gcodeStartup",
"unknown"
```

You can get all message types:

```javascript
console.log(new Parser().messageTypes)
// [ status: "status", alarm: "alarm", ... ]
```

## Development

The library lives in `src/` and compiles with `tsc` into `dist/` (the package
entry point is the built barrel, `dist/index.js`). Tests are TypeScript specs
in `test/` that run against the built output with
[vitest](https://vitest.dev) — `npm test` builds, strictly type-checks the
specs against the emitted `.d.ts` files, then runs the suite; `npm run
coverage` adds the v8 coverage report; `npm run demo` runs `demo.ts` (Node
type-stripping). The suite expects Node 24; see `.nvmrc` / `.node-version`.

## Examples

### Bind callback to message types

```javascript
parser.dispatcher.addListener("status", myStatusCallback)
parser.dispatcher.addListener("alarm", myAlarmCallback)
parser.dispatcher.addToAllListeners(myEverythingCallback)
```

### Status message output

```javascript
parser.parseData("<Hold:0|MPos:0.000,0.000,0.000|Bf:15,128|FS:675.5,24000|Ov:120,100,100|WCO:0.000,-5.200,306.351|A:SFM>")

{
  data: {
    machinePosition: {
      x: 0,
      y: 0,
      z: 0
    },
    buffer: {
      availableBlocks: 15,
      availableRXBytes: 128
    },
    realtimeFeed: {
      realtimeFeedrate: 675.5,
      realtimeSpindle: 24000
    },
    workcoordinateOffset: {
      x: 0,
      y: -5.2,
      z: 306.351
    },
    status: {
      code: 0,
      message: "Hold complete. Ready to resume.",
      state: 'Hold'
    },
    override: {
      feeds: 120,
      rapids: 100,
      spindle: 100
    },
    accessories: {
      flood: true,
      mist: true,
      spindleDirection: 'clockwise'
    }
  },
  type: "status",
  input: "<Hold:0|MPos:0.000,0.000,0.000|Bf:15,128|FS:675.5,24000|Ov:120,100,100|WCO:0.000,-5.200,306.351|A:SFM>"
}
```

```javascript
parser.parseData("error:20")

{
  data: {
    code: 20,
    message: "Unsupported or invalid g-code command found in block."
  },
  input: "error:20",
  type: "error"
}
```

## Other links
- [In-browser example](https://runkit.com/5812b6009d0cb70013f5b92b/59179e16a8b8390011a55e1f)
- [grbl](https://github.com/gnea/grbl)
- [node-serialport](https://github.com/EmergingTechnologyAdvisors/node-serialport)
