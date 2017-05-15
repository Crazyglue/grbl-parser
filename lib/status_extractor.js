const constants = require("./constants")
const statusMap = constants.statusMap
const subStateMessage = constants.subStateMessage
const messageTypes = constants.messageTypes
var parseCoordinates = require("./utils/extractor_utils").parseCoordinates

var StatusExtractor = function() {}

StatusExtractor.prototype.statusReport = function(message) {
  var report = {}
  // <Hold:0|MPos:0.000,0.000,0.000|Bf:15,128|FS:675.5,24000|Ov:120,100,100|WCO:0.000,-5.200,306.351|A:SFM>
  // <Idle,MPos:0.000,0.000,0.000,WPos:0.000,0.000,0.000>
  var match = message.match(/^<(.*)>$/)[1]
  // Hold:0|MPos:0.000,0.000,0.000|Bf:15,128|FS:0,0|WCO:0.000,0.000,306.351
  // Idle,MPos:0.000,0.000,0.000,WPos:0.000,0.000,0.000

  if (message.includes(",MPos:") || message.includes(",WPos:")) {
    var statusData = match.match(/(\w+)\,(.+)/)
    report.status = this.parseStatus(statusData[1]) // Idle
    var statusParams = statusData[2].match(/([a-zA-Z]+)\:([\d\,\.\-\|]+)\,?/g) // [ "MPos:0.000,0.000,0.000,", "WPos:0.000,0.000,0.000,", "Buf:0,", "RX:0,", "Lim:000" ]

    var paramMap = {}
    var buffer = []

    statusParams.forEach(function(param) {
      var paramData = param.split(":")   // [ "MPos", "0.000,0.000,0.000," ]
      var key = paramData[0]
      var value = paramData[1]

      if (key === "Buf")
        buffer[0] = value.replace(",", "")
      else if (key === "RX")
        buffer[1] = value.replace(",", "")
      else
        report[statusMap[key]] = value

    })

    if (buffer.length > 0)
      report.buffer = buffer.join(",")
  }

  else {
    var params = match.split("|")
    // ["Hold:0", "MPos:0.000,0.000,0.000", "Bf:15,128", ...]

    report.status = this.parseStatus(params[0]) // "Hold:0"

    var paramsPairs = params.slice(1, params.length)

    paramsPairs.forEach(function(param) {
      var paramData = param.split(":")
      report[statusMap[paramData[0]]] = paramData[1]
    })
  }

  if (report.machinePosition) {
    report.machinePosition = parseCoordinates(report.machinePosition)
  }

  if (report.workPosition) {
    report.workPosition = parseCoordinates(report.workPosition)
  }

  if (report.workcoordinateOffset) {
    report.workcoordinateOffset = parseCoordinates(report.workcoordinateOffset)
  }

  if (report.accessories) {
    report.accessories = this.parseAccessories(report.accessories)
  }

  if (report.buffer) {
    report.buffer = this.parseBuffer(report.buffer)
  }

  if (report.realtimeFeed) {
    report.realtimeFeed = this.parseFeeds(report.realtimeFeed)
  }

  if (report.override) {
    report.override = this.parseOverride(report.override)
  }

  if (report.pins) {
    report.pins = this.parsePins(report.pins)
  }

  return {
    data: report,
    type: messageTypes.status,
    input: message
  }
}

StatusExtractor.prototype.parsePins = function(pins) {
  var data = []
  var limitPinMap = {
    0: "limit-x",
    1: "limit-y",
    2: "limit-z"
  }
  var controlPinMap = {
    0: "door",
    1: "hold",
    2: "soft-reset",
    3: "cycle-start",
  }

  if (/([01]+)\,?([01])?\,?([01]+)?/.test(pins)) {
    // 000,1,0000
    var pinMatch = pins.match(/(\d{3})?(\|\d\|)?(\d+)?/)
    var xyzPins = pinMatch[1]
    var probePin = pinMatch[2]
    var controlPins = pinMatch[3]

    if (xyzPins) {
      var limitPins = xyzPins.split("")
      limitPins.forEach(function(value, index) {
        let pin = { pin: limitPinMap[index], on: (value === "1") }
        data.push(pin)
      })
    }

    if (probePin) {
      data.push({ pin: "probe", on: probePin.replace(/\|/g, "") === "1" })
    }

    if (controlPins) {
      controlPins.split("").forEach(function(pin, index) {
        data.push({ pin: controlPinMap[index], on: pin === "1" })
      })
    }
  }

  else {
    var grbl11pinMap = {
      "X": "limit-x",
      "Y": "limit-y",
      "Z": "limit-z",
      "P": "probe",
      "D": "door",
      "H": "hold",
      "R": "soft-reset",
      "S": "cycle-start",
    }
    var pinData = pins.split("")

    pinData.forEach(function(pin, index) {
      var pin = { pin: grbl11pinMap[pin], on: true }
      data.push(pin)
    })

  }
  return data
}

StatusExtractor.prototype.parseStatus = function(status) {
  // Hold:0
  var match = status.split(":")

  var parsedStatus = {
    state: match[0]
  }

  if (match[1]) {
    parsedStatus.code = parseFloat(match[1])
    parsedStatus.message = subStateMessage[match[0]][match[1]]
  }

  return parsedStatus
}

StatusExtractor.prototype.parseAccessories = function(accessories) {
  // SFM
  var flags = accessories.split("")
  var parsedAccessories = {}

  if (flags.indexOf("F") > -1)
    parsedAccessories.flood = true
  else
    parsedAccessories.flood = false

  if (flags.indexOf("M") > -1)
    parsedAccessories.mist = true
  else
    parsedAccessories.mist = false

  if (flags.indexOf("S") > -1)
    parsedAccessories.spindleDirection = "clockwise"
  else
    parsedAccessories.spindleDirection = "counter-clockwise"

  return parsedAccessories
}

StatusExtractor.prototype.parseBuffer = function(buffer) {
  // example input: "15,128"
  var bufferData = buffer.split(",")
  var parsedBuffer = {
    availableBlocks: parseFloat(bufferData[0]),
    availableRXBytes: parseFloat(bufferData[1])
  }

  return parsedBuffer
}

StatusExtractor.prototype.parseFeeds = function(feeds) {
  // example input: "15.432,12000.5"
  var feedData = feeds.split(",")
  var parsedFeeds = {}

  parsedFeeds.realtimeFeedrate = parseFloat(feedData[0])
  parsedFeeds.realtimeSpindle = parseFloat(feedData[1])

  return parsedFeeds
}

StatusExtractor.prototype.parseOverride = function(override) {
  // 120,100,100
  var overrideData = override.split(",")

  return {
    feeds: parseFloat(overrideData[0]),
    rapids: parseFloat(overrideData[1]),
    spindle: parseFloat(overrideData[2])
  }
}

module.exports = StatusExtractor
