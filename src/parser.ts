import { Checker } from "./checker.js";
import { EventDispatcher } from "./event_dispatcher.js";
import { Extractor } from "./extractor.js";
import { messageTypes, MessageTypes } from "./constants.js";
import { UnknownResult } from "./results.js";
import { StatusExtractor } from "./status_extractor.js";

export class Parser {
  check: Checker;
  messageTypes: MessageTypes;
  statusExtractor: StatusExtractor;
  extractor: Extractor;
  dispatcher: EventDispatcher;

  constructor() {
    this.check = new Checker();
    this.messageTypes = messageTypes;
    this.statusExtractor = new StatusExtractor();
    this.extractor = new Extractor();
    this.dispatcher = new EventDispatcher();
  }

  parseData(input: string): void {
    const data = input.trim();
    if (this.check.isStatusReport(data)) {
      const statusData = this.statusExtractor.statusReport(data);
      this.dispatcher.dispatch(this.messageTypes.status, statusData);
    }
    else if (this.check.isSuccessResponse(data)) {
      const successData = this.extractor.successReport(data);
      this.dispatcher.dispatch(this.messageTypes.success, successData);
    }

    else if (this.check.isGrblInitialization(data)) {
      const initData = this.extractor.grblInitReport(data);
      this.dispatcher.dispatch(this.messageTypes.initialize, initData);
    }

    else if (this.check.isAlarm(data)) {
      const alarmData = this.extractor.alarmReport(data);
      this.dispatcher.dispatch(this.messageTypes.alarm, alarmData);
    }

    else if (this.check.isError(data)) {
      const errorData = this.extractor.errorReport(data);
      this.dispatcher.dispatch(this.messageTypes.error, errorData);
    }

    else if (this.check.isGrblSetting(data)) {
      const grblSettingData = this.extractor.settingsReport(data);
      this.dispatcher.dispatch(this.messageTypes.setting, grblSettingData);
    }

    else if (this.check.isFeedbackMessage(data)) {
      const feedbackMessageData = this.extractor.feedbackMessageReport(data);
      this.dispatcher.dispatch(this.messageTypes.feedbackMessage, feedbackMessageData);
    }

    else if (this.check.isBuildVersion(data)) {
      const buildVersionData = this.extractor.buildVersionReport(data);
      this.dispatcher.dispatch(this.messageTypes.buildVersion, buildVersionData);
    }

    else if (this.check.isBuildOptions(data)) {
      const buildOptionsData = this.extractor.buildOptionsReport(data);
      this.dispatcher.dispatch(this.messageTypes.buildOptions, buildOptionsData);
    }

    else if (this.check.isGcodeState(data)) {
      const gcodeStateData = this.extractor.gcodeStateReport(data);
      this.dispatcher.dispatch(this.messageTypes.gcodeState, gcodeStateData);
    }

    else if (this.check.isHelpMessage(data)) {
      const helpData = this.extractor.helpMessageReport(data);
      this.dispatcher.dispatch(this.messageTypes.helpMessage, helpData);
    }

    else if (this.check.isGcodeSystem(data)) {
      const gcodeSystem = this.extractor.gcodeSystemReport(data);
      this.dispatcher.dispatch(this.messageTypes.gcodeSystem, gcodeSystem);
    }

    else if (this.check.isProbeResult(data)) {
      const probeResultData = this.extractor.probeResultReport(data);
      this.dispatcher.dispatch(this.messageTypes.probeResult, probeResultData);
    }

    else if (this.check.isEcho(data)) {
      const echoReport = this.extractor.echoReport(data);
      this.dispatcher.dispatch(this.messageTypes.echoMessage, echoReport);
    }

    else if (this.check.isStartupLine(data)) {
      const startupLineData = this.extractor.startupLineReport(data);
      this.dispatcher.dispatch(this.messageTypes.gcodeStartup, startupLineData);
    }

    else {
      const unknownData: UnknownResult = { input: data, type: this.messageTypes.unknown };
      this.dispatcher.dispatch(this.messageTypes.unknown, unknownData);
    }
  }
}
