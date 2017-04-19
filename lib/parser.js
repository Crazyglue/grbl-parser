const constants = require("./constants")
Checker = require("./checker")
EventDispatcher = require("./event_dispatcher")
StatusExtractor = require("./status_extractor")
Extractor = require("./extractor")

module.exports = class GrblParser extends EventDispatcher {
  constructor() {
    super()
    this.check = new Checker()
    this.messageTypes = constants.messageTypes
    this.statusExtractor = new StatusExtractor()
    this.extractor = new Extractor()
  }

  parseData(string) {
    var data = string.trim()
    if (this.check.isStatusReport(data)) {
      var params = this.statusExtractor.statusReport(data)
      this.dispatch(this.messageTypes.status, params)
    }
    else if (this.check.isSuccessResponse(data))
      this.dispatch(this.messageTypes.success, data)

    else if (this.check.isGrblInitialization(data)) {
      var initData = this.extractor.grblInitReport(data)
      this.dispatch(this.messageTypes.initialize, initData)
    }

    else if (this.check.isAlarm(data)) {
      var alarmData = this.extractor.alarmReport(data)
      this.dispatch(this.messageTypes.alarm, alarmData)
    }

    else if (this.check.isError(data)) {
      var errorData = this.extractor.errorReport(data)
      this.dispatch(this.messageTypes.error, errorData)
    }

    else if (this.check.isGrblSetting(data)) {
      var grblSettingData = this.extractor.settingsReport(data)
      this.dispatch(this.messageTypes.setting, grblSettingData)
    }

    else if (this.check.isFeedbackMessage(data))
      this.dispatch(this.messageTypes.feedbackMessage, d)

    else if (this.check.isBuildVersion(data)) {
      var buildVersionData = this.extractor.buildVersionReport(data)
      this.dispatch(this.messageTypes.buildVersion, buildVersionData)
    }

    else if (this.check.isBuildOptions(data)) {
      var buildOptionsData = this.extractor.buildOptionsReport(data)
      this.dispatch(this.messageTypes.buildOptions, buildOptionsData)
    }

    else if (this.check.isGcodeState(data)) {
      var gcodeStateData = this.extractor.gcodeStateReport(data)
      this.dispatch(this.messageTypes.gcodeState, gcodeStateData)
    }

    else if (this.check.isHelpMessage(data))
      this.dispatch(this.messageTypes.helpMessage, data)

    else if (this.check.isGcodeSystem(data))
      this.dispatch(this.messageTypes.gcodeSystem, data)

    else if (this.check.isProbeResult(data))
      this.dispatch(this.messageTypes.probeResult, data)

    else if (this.check.isEcho(data))
      this.dispatch(this.messageTypes.echoMessage, data)

    else if (this.check.isStartupLine(data))
      this.dispatch(this.messageTypes.gcodeStartup, data)

  }
}
