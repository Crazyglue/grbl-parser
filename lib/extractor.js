const constants = require("./constants")

module.exports = class Extractor {
  gcodeStateReport(state) {
    var report = {}
    // [GC:G0 G54 G17 G21 G90 G94 M5 M9 T0 F0 S0]
    var gcodeData = state.replace("[GC:", "").replace("]", "").split(" ")

    report.codes = []

    gcodeData.forEach((code) => {
      if (/G.+/.test(code))
        report.codes.push(constants.gcodeMap.gcode[code])
      else if (/M.+/.test(code))
        report.codes.push(constants.gcodeMap.mcode[code])
      else if (/T.+/.test(code))
        report.codes.push({ code: code, name: "Tool", description: "The current tool" })
      else if (/F.+/.test(code))
        report.codes.push({ code, code, name: "Feed rate", description: "The last feed command" })
      else if (/S.+/.test(code))
        report.codes.push({ code: code, name: "RPM", description: "The current spindle speed command"})
    })

    return report
  }

  grblInitReport(init) {
    var report = {}
    // Grbl 1.1f ['$' for help]

    var initData = init.match(/(Grbl\s.+)\s\[.+/)
    report.firmwareVersion = initData[1]

    return report
  }

  errorReport(error) {
    var report = {}
    // error:9

    var errorData = error.split(":")

    report.code = errorData[1]
    report.message = constants.errorMap[report.code]

    return report
  }

  alarmReport(alarm) {
    var report = {}
    // ALARM:9

    var alarmData = alarm.split(":")

    report.code = parseInt(alarmData[1])
    report.message = constants.alarmMap[report.code]

    return report
  }

  buildVersionReport(version) {
    var report = {}
    // [VER:1.1f.20170131:]

    var versionMatch = version.match(/\[(.+)\]/)
    var versionData = versionMatch[1].split(":")

    versionData = versionData.slice(1, versionData.length)

    report.firmwareVersion = versionData[0]
    if (versionData[1])
      report.buildString = versionData[1]

    return report
  }

  buildOptionsReport(options) {
    var report = {}
    // [OPT:V,15,128]

    var versionMatch = options.match(/\[(.+)\]/)
    var versionData = versionMatch[1].split(":")

    versionData = versionData[1]
    var versionOptions = versionData.split(",")
    var versionCodes = versionOptions[0].split("")
    var versionExtras = versionOptions.slice(1, versionOptions.length)

    report.options = []
    report.extras = []

    versionCodes.forEach((code) => {
      report.options.push({ code: code, message: constants.buildOptionsMap[code] })
    })

    versionExtras.forEach((extra) => {
      report.extras.push(extra)
    })

    return report
  }

  settingsReport(setting) {
    var report = {}
    // $10=255.5

    var data = setting.split("=")

    report.code = data[0].match(/\$(\d+)/)[1]
    report.value = data[1]
    report.setting = constants.settingsMap[report.code].setting
    report.units = constants.settingsMap[report.code].units
    report.description = constants.settingsMap[report.code].description

    return report
  }
}