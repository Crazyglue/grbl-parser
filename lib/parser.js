const constants = require("./constants")
Checker = require("./checker")
EventDispatcher = require("./event_dispatcher")
StatusExtractor = require("./status_extractor")
Extractor = require("./extractor")

module.exports = class GrblParser extends EventDispatcher {
  constructor() {
    super()
    this.check = new Checker()
    this.callbackList = constants.callbacks
    this.statusExtractor = new StatusExtractor()
    this.extractor = new Extractor()
  }

  parseData(string) {
    var data = string.trim()
    if (this.check.isStatusReport(data)) {
      var params = this.statusExtractor.statusReport(data)
      this.dispatch("grbl-status-report", params)
    }
    else if (this.check.isSuccessResponse(data))
      this.dispatch("success", data)

    else if (this.check.isGrblInitialization(data)) {
      var initData = this.extractor.grblInitReport(data)
      this.dispatch("initialized-grbl", initData)
    }

    else if (this.check.isAlarm(data)) {
      var alarmData = this.extractor.alarmReport(data)
      this.dispatch("grbl-alarm", alarmData)
    }

    else if (this.check.isError(data)) {
      var errorData = this.extractor.errorReport(data)
      this.dispatch("grbl-error", errorData)
    }

    else if (this.check.isGrblSetting(data)) {
      var grblSettingData = this.extractor.settingsReport(data)
      this.dispatch("grbl-setting", grblSettingData)
    }

    else if (this.check.isFeedbackMessage(data))
      this.dispatch("feedback-message", d)

    else if (this.check.isBuildVersion(data)) {
      var buildVersionData = this.extractor.buildVersionReport(data)
      this.dispatch("build-version", buildVersionData)
    }

    else if (this.check.isBuildOptions(data)) {
      var buildOptionsData = this.extractor.buildOptionsReport(data)
      this.dispatch("build-options", buildOptionsData)
    }

    else if (this.check.isGcodeState(data)) {
      var gcodeStateData = this.extractor.gcodeStateReport(data)
      this.dispatch("gcode-state", gcodeStateData)
    }

    else if (this.check.isHelpMessage(data))
      this.dispatch("help-message", data)

    else if (this.check.isGcodeSystem(data))
      this.dispatch("gcode-system", data)

    else if (this.check.isProbeResult(data))
      this.dispatch("probe-result", data)

    else if (this.check.isEcho(data))
      this.dispatch("echo", data)

    else if (this.check.isStartupLine(data))
      this.dispatch("gcode-startup", data)

  }
}
