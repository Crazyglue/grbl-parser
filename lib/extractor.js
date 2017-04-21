const constants = require("./constants")
const messageTypes = constants.messageTypes
var parseCoordinates = require("./utils/extractor_utils").parseCoordinates

module.exports = class Extractor {
  gcodeStateReport(state) {
    // [GC:G0 G54 G17 G21 G90 G94 M5 M9 T0 F0 S0]
    var gcodeData = state.replace("[GC:", "").replace("]", "").split(" ")

    var codes = []

    gcodeData.forEach((code) => {
      if (/G.+/.test(code))
        codes.push(constants.gcodeMap.gcode[code])
      else if (/M.+/.test(code))
        codes.push(constants.gcodeMap.mcode[code])
      else if (/T.+/.test(code))
        codes.push({ code: code, name: "Tool", description: "The current tool" })
      else if (/F.+/.test(code))
        codes.push({ code, code, name: "Feed rate", description: "The last feed command" })
      else if (/S.+/.test(code))
        codes.push({ code: code, name: "RPM", description: "The current spindle speed command"})
    })

    return {
      type: messageTypes.gcodeState,
      data: {
        codes: codes
      },
      input: state
    }
  }

  grblInitReport(init) {
    // Grbl 1.1f ['$' for help]

    var initData = init.match(/^Grbl\sv?(\d\.\d.)\s\[\'\$\'\sfor\shelp\]$/)
    return {
      type: messageTypes.initialize,
      data: {
        firmwareVersion: initData[1]
      },
      input: init
    }
  }

  errorReport(error) {
    // error:9

    var errorData = error.split(":")

    var code = errorData[1]
    var message = constants.errorMap[code]

    return {
      type: messageTypes.error,
      data: {
        code: code,
        message: message
      },
      input: error
    }
  }

  alarmReport(alarm) {
    // ALARM:9

    var alarmData = alarm.split(":")
    var code = parseInt(alarmData[1])
    var message = constants.alarmMap[code]

    return {
      type: messageTypes.alarm,
      data: {
        code: code,
        message: message,
      },
      input: alarm
    }
  }

  buildVersionReport(version) {
    // [VER:1.1f.20170131:]

    var versionMatch = version.match(/\[(.+)\]/)
    var versionData = versionMatch[1].split(":")

    versionData = versionData.slice(1, versionData.length)

    var data = {}
    data.firmwareVersion = versionData[0]
    if (versionData[1])
      data.buildString = versionData[1]

    return {
      type: messageTypes.buildVersion,
      data: data,
      input: version
    }
  }

  buildOptionsReport(options) {
    // [OPT:V,15,128]

    var versionMatch = options.match(/\[(.+)\]/)
    var versionData = versionMatch[1].split(":")

    versionData = versionData[1]
    var versionOptions = versionData.split(",")
    var versionCodes = versionOptions[0].split("")
    var versionExtras = versionOptions.slice(1, versionOptions.length)

    var buildOptions = []
    var buildExtras = []

    versionCodes.forEach((code) => {
      buildOptions.push({ code: code, message: constants.buildOptionsMap[code] })
    })

    versionExtras.forEach((extra) => {
      buildExtras.push(extra)
    })

    return {
      type: messageTypes.buildOptions,
      data: {
        options: buildOptions,
        extras: buildExtras,
      },
      input: options
    }
  }

  settingsReport(setting) {
    // $10=255.5

    var settingData = setting.split("=")

    var data = {}
    data.code = parseFloat(settingData[0].match(/\$(\d+)/)[1])
    data.value = parseFloat(settingData[1])
    data.setting = constants.settingsMap[data.code].setting
    data.units = constants.settingsMap[data.code].units
    data.description = constants.settingsMap[data.code].description

    return {
      type: messageTypes.setting,
      data: data,
      input: setting
    }
  }

  probeResultReport(probeResult) {
    // [PRB:0.000,0.000,1.492:1]
    var probeData = probeResult.replace("[PRB:", "").replace("]", "").split(":")
    // ["0.000, 0.000, 1.492", "1"]
    var data = {}

    if (probeData) {
      data.location = parseCoordinates(probeData[0])
      data.success = parseInt(probeData[1]) === 1
    }

    return {
      type: messageTypes.probeResult,
      data: data,
      input: probeResult
    }
  }

  helpMessageReport(helpMessage) {
    // [HLP:$$ $# $G $I $N $x=val $Nx=line $J=line $SLP $C $X $H ~ ! ? ctrl-x]
    var helpData = helpMessage.replace("[HLP:", "").replace("]", "").split(" ")

    var data = {}
    data.availableCommands = []

    helpData.forEach((command) => {
      data.availableCommands.push(command)
    })

    return {
      type: messageTypes.helpMessage,
      data: data,
      input: helpMessage
    }
  }

  gcodeSystemReport(gcodeSystem) {
    // [G28:0.000,0.000,0.000]
    // [TLO:0.000]
    var data = {}
    var systemData = gcodeSystem.replace("[", "").replace("]", "").split(":")

    if (systemData[0] == "TLO") {
      data = constants.gcodeMap.tool[systemData[0]]
      data.coordinates = { z: parseFloat(systemData[1]) }
    }
    else {
      data = constants.gcodeMap.gcode[systemData[0]]
      data.coordinates = parseCoordinates(systemData[1])
    }

    return {
      type: messageTypes.gcodeSystem,
      data: data,
      input: gcodeSystem
    }
  }

  echoReport(echo) {
    // [echo:G1X0.540Y10.4F100]
    var data = {}
    var echoData = echo.replace("[", "").replace("]", "").split(":")
    data.message = echoData[1]

    return {
      type: messageTypes.echoMessage,
      data: data,
      input: echo
    }
  }

  startupLineReport(startupLine) {
    // >G54G20:ok
    var data = {}
    var startupData = startupLine.replace(">", "").split(":")
    data.line = startupData[0]
    data.success = startupData[1] === "ok"

    return {
      type: messageTypes.gcodeStartup,
      data: data,
      input: startupLine
    }
  }

  successReport(success) {
    // ok
    var data = {}
    data.success = success === "ok"

    return {
      type: messageTypes.success,
      data: data,
      input: success
    }
  }

  feedbackMessageReport(feedbackMessage) {
    // [MSG:‘$H’|’$X’ to unlock]
    // [Caution: Unlocked]
    var data = {}
    var message = feedbackMessage.replace("[", "").replace("]", "")

    if (message.includes("MSG:")) {
      var messageData = message.split(":")
      data.message = messageData[1]
    }
    else
      data.message = message

    return {
      type: messageTypes.feedbackMessage,
      data: data,
      input: feedbackMessage
    }
  }
}
