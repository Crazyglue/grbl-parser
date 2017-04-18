[![Coverage Status](https://coveralls.io/repos/github/Crazyglue/grbl-parser/badge.svg?branch=master)](https://coveralls.io/github/Crazyglue/grbl-parser?branch=master) [![Build Status](https://travis-ci.org/Crazyglue/grbl-parser.svg?branch=master)](https://travis-ci.org/Crazyglue/grbl-parser)

# grbl-parser
Javascript based grbl parser

Provides an event-based system to parse any strings grbl may output.

Grbl 1.1 support only (for now)

### Installation

```bash
npm install grbl-parser --save
```

### Usage

```javascript
var GrblParser = require("grbl-parser")
var parser = new GrblParser()
var myCallback = function(message) {
  // do stuff
}
var myString = "<Hold:0|MPos:0.000,0.000,0.000|Bf:15,128|FS:675.5,24000|Ov:120,100,100|WCO:0.000,-5.200,306.351|A:SFM>"

parser.addListener("grbl-status-report", myCallback) // bind myCallback to grbl status reports
parser.parseData(myString)
```

### Examples

#### Bind to all responses

```javascript
parser.addToAllListener(myCallback)
```

#### Status message output

```javascript
parser.parseData("<Hold:0|MPos:0.000,0.000,0.000|Bf:15,128|FS:675.5,24000|Ov:120,100,100|WCO:0.000,-5.200,306.351|A:SFM>")
```

Returns:

```javascript
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
    feedSpindle: {
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
  type: "grbl-status",
  input: "<Hold:0|MPos:0.000,0.000,0.000|Bf:15,128|FS:675.5,24000|Ov:120,100,100|WCO:0.000,-5.200,306.351|A:SFM>"
}
```

### Binding the parser to a port

### TODO

- Support Grbl 0.9 messages
- Support Grbl 1.0 messages
- Finish extractor methods
