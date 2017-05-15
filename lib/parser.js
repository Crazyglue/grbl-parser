const constants = require("./constants")
Checker = require("./checker")
EventDispatcher = require("./event_dispatcher")
StatusExtractor = require("./status_extractor")
Extractor = require("./extractor")

module.exports = class GrblParser {
  constructor() {
    this.check = new Checker()
    this.messageTypes = constants.messageTypes
    this.statusExtractor = new StatusExtractor()
    this.extractor = new Extractor()
    this.dispatcher = new EventDispatcher()
  }

  parseData(string) {
    var data = string.trim()
    if (this.check.isStatusReport(data)) {
      var statusData = this.statusExtractor.statusReport(data)
      this.dispatcher.dispatch(this.messageTypes.status, statusData)
    }
    else if (this.check.isSuccessResponse(data)) {
      var successData = this.extractor.successReport(data)
      this.dispatcher.dispatch(this.messageTypes.success, successData)
    }

    else if (this.check.isGrblInitialization(data)) {
      var initData = this.extractor.grblInitReport(data)
      this.dispatcher.dispatch(this.messageTypes.initialize, initData)
    }

    else if (this.check.isAlarm(data)) {
      var alarmData = this.extractor.alarmReport(data)
      this.dispatcher.dispatch(this.messageTypes.alarm, alarmData)
    }

    else if (this.check.isError(data)) {
      var errorData = this.extractor.errorReport(data)
      this.dispatcher.dispatch(this.messageTypes.error, errorData)
    }

    else if (this.check.isGrblSetting(data)) {
      var grblSettingData = this.extractor.settingsReport(data)
      this.dispatcher.dispatch(this.messageTypes.setting, grblSettingData)
    }

    else if (this.check.isFeedbackMessage(data)) {
      var feedbackMessageData = this.extractor.feedbackMessageReport(data)
      this.dispatcher.dispatch(this.messageTypes.feedbackMessage, feedbackMessageData)
    }

    else if (this.check.isBuildVersion(data)) {
      var buildVersionData = this.extractor.buildVersionReport(data)
      this.dispatcher.dispatch(this.messageTypes.buildVersion, buildVersionData)
    }

    else if (this.check.isBuildOptions(data)) {
      var buildOptionsData = this.extractor.buildOptionsReport(data)
      this.dispatcher.dispatch(this.messageTypes.buildOptions, buildOptionsData)
    }

    else if (this.check.isGcodeState(data)) {
      var gcodeStateData = this.extractor.gcodeStateReport(data)
      this.dispatcher.dispatch(this.messageTypes.gcodeState, gcodeStateData)
    }

    else if (this.check.isHelpMessage(data)) {
      var helpData = this.extractor.helpMessageReport(data)
      this.dispatcher.dispatch(this.messageTypes.helpMessage, helpData)
    }

    else if (this.check.isGcodeSystem(data)) {
      var gcodeSystem = this.extractor.gcodeSystemReport(data)
      this.dispatcher.dispatch(this.messageTypes.gcodeSystem, gcodeSystem)
    }

    else if (this.check.isProbeResult(data)) {
      var probeResultData = this.extractor.probeResultReport(data)
      this.dispatcher.dispatch(this.messageTypes.probeResult, probeResultData)
    }

    else if (this.check.isEcho(data)) {
      var echoReport = this.extractor.echoReport(data)
      this.dispatcher.dispatch(this.messageTypes.echoMessage, echoReport)
    }

    else if (this.check.isStartupLine(data)) {
      var startupLineData = this.extractor.startupLineReport(data)
      this.dispatcher.dispatch(this.messageTypes.gcodeStartup, startupLineData)
    }

    else {
      var unknownData = { input: data, type: this.messageTypes.unknown}
      this.dispatcher.dispatch(this.messageTypes.unknown, unknownData)
    }

  }
}
