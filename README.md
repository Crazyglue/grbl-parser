# grbl-parser

[![Coverage Status](https://coveralls.io/repos/github/Crazyglue/grbl-parser/badge.svg?branch=master)](https://coveralls.io/github/Crazyglue/grbl-parser?branch=master) [![Build Status](https://travis-ci.org/Crazyglue/grbl-parser.svg?branch=master)](https://travis-ci.org/Crazyglue/grbl-parser)

Grbl machine parser library written in javascript

Provides an event-based callbacks to parse any strings grbl may output.

Supports Grbl 0.9, 1.0, and 1.1 (untested with grbl 0.8)

## Installation

```bash
npm install grbl-parser --save
```

## Usage

```javascript
var GrblParser = require("grbl-parser")
var parser = new GrblParser()
var myCallback = function(parsedData) {
  // do stuff with parsed data (see example status output in Examples section)
}
var myString = "<Hold:0|MPos:0.000,0.000,0.000|Bf:15,128|FS:675.5,24000|Ov:120,100,100|WCO:0.000,-5.200,306.351|A:SFM>"

parser.addListener("status", myCallback) // bind myCallback to grbl status reports
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
console.log(new GrblParser().messageTypes)
// [ status: "status", alarm: "alarm", ... ]
```

## Examples

### Bind callback to message types

```javascript
parser.addListener("status", myStatusCallback)
parser.addListener("alarm", myAlarmCallback)
parser.addToAllListeners(myEverythingCallback)
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
    code: "20",
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
