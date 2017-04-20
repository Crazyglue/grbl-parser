const constants = require("./constants")
const statusMap = constants.statusMap
const subStateMessage = constants.subStateMessage
const messageTypes = constants.messageTypes

module.exports = class StatusExtractor {
  statusReport(message) {
    var report = {}
    // <Hold:0|MPos:0.000,0.000,0.000|Bf:15,128|FS:675.5,24000|Ov:120,100,100|WCO:0.000,-5.200,306.351|A:SFM>
    // <Idle,MPos:0.000,0.000,0.000,WPos:0.000,0.000,0.000>
    var match = message.match(/^<(.*)>$/)[1]
    // Hold:0|MPos:0.000,0.000,0.000|Bf:15,128|FS:0,0|WCO:0.000,0.000,306.351
    // Idle,MPos:0.000,0.000,0.000,WPos:0.000,0.000,0.000

    if (message.includes(",MPos:") || message.includes(",WPos:")) {
      var statusData = match.match(/(\w+)\,(.+)/)
      report.status = this.parseStatus(statusData[1]) // Idle
      var statusParams = statusData[2].match(/([a-zA-Z]+)\:([\d\,\.\-]+)\,?/g) // [ "MPos:0.000,0.000,0.000,", "WPos:0.000,0.000,0.000,", "Buf:0,", "RX:0,", "Lim:000" ]

      var paramMap = {}
      report.buffer = new Array(2)

      statusParams.forEach((param) => {
        var paramData = param.split(":")
        var key = paramData[0]
        var value = paramData[1].match(/([\-\d\.]+)/g).join(",")

        if (key === "Buf")
          report.buffer[0] = value
        else if (key === "RX")
          report.buffer[1] = value
        else
          report[statusMap[key]] = value

      })
      report.buffer = report.buffer.join(",")
    }

    else {
      var params = match.split("|")
      // ["Hold:0", "MPos:0.000,0.000,0.000", "Bf:15,128", ...]

      report.status = this.parseStatus(params[0]) // "Hold:0"

      var paramsPairs = params.slice(1, params.length)

      paramsPairs.forEach((param) => {
        var paramData = param.split(":")
        report[statusMap[paramData[0]]] = paramData[1]
      })
    }

    if (report.machinePosition) {
      report.machinePosition = this.parseCoordinates(report.machinePosition)
    }

    if (report.workPosition) {
      report.workPosition = this.parseCoordinates(report.workPosition)
    }

    if (report.workcoordinateOffset) {
      report.workcoordinateOffset = this.parseCoordinates(report.workcoordinateOffset)
    }

    if (report.accessories) {
      report.accessories = this.parseAccessories(report.accessories)
    }

    if (report.buffer) {
      report.buffer = this.parseBuffer(report.buffer)
    }

    if (report.feedSpindle) {
      report.feedSpindle = this.parseFeeds(report.feedSpindle)
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

  parsePins(pins) {
    var pinData = pins.split("")
    var data = []

    var pinMap = {
      0: "x",
      1: "y",
      2: "z"
    }

    pinData.forEach((pin, index) => {
      data.push({ pin: "limit-" + pinMap[index], on: pin == 0 ? false : true })
    })

    return data
  }

  parseStatus(status) {
    //Hold:0
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

  parseCoordinates(position) {
    // example input: "23.3242,102.2234,0.4200"
    var coordinates = position.split(",")
    return {
      x: parseFloat(coordinates[0]),
      y: parseFloat(coordinates[1]),
      z: parseFloat(coordinates[2])
    }
  }

  parseAccessories(accessories) {
    // example input: "SFM"
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
    else if (flags.indexOf("C") > -1)
      parsedAccessories.spindleDirection = "counter-clockwise"

    return parsedAccessories
  }

  parseBuffer(buffer) {
    // example input: "15,128"
    var bufferData = buffer.split(",")
    var parsedBuffer = {}

    parsedBuffer.availableBlocks = parseFloat(bufferData[0])
    parsedBuffer.availableRXBytes = parseFloat(bufferData[1])

    return parsedBuffer
  }

  parseFeeds(feeds) {
    // example input: "15.432,12000.5"
    var feedData = feeds.split(",")
    var parsedFeeds = {}

    parsedFeeds.realtimeFeedrate = parseFloat(feedData[0])
    parsedFeeds.realtimeSpindle = parseFloat(feedData[1])

    return parsedFeeds
  }

  parseOverride(override) {
    // 120,100,100
    var overrideData = override.split(",")

    return {
      feeds: parseFloat(overrideData[0]),
      rapids: parseFloat(overrideData[1]),
      spindle: parseFloat(overrideData[2])
    }
  }
}
