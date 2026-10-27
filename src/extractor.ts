import { alarmMap, buildOptionsMap, errorMap, gcodeMap, messageTypes, settingsMap } from "./constants.js";
import { parseCoordinates } from "./utils/extractor_utils.js";
import {
  AlarmResult,
  BuildOptionEntry,
  BuildOptionsResult,
  BuildVersionResult,
  BuildVersionData,
  CodeStateEntry,
  CodeInfo,
  EchoResult,
  ErrorOrAlarmData,
  ErrorResult,
  FeedbackResult,
  GcodeStateResult,
  GcodeSystemResult,
  HelpResult,
  InitializeResult,
  MessageOnlyData,
  ProbeResult,
  SettingData,
  SettingResult,
  StartupResult,
  SuccessResult
} from "./results.js";

export class Extractor {
  gcodeStateReport(state: string): GcodeStateResult {
    // [GC:G0 G54 G17 G21 G90 G94 M5 M9 T0 F0 S0]
    const gcodeData = state.replace("[", "").replace("]", "").replace("GC:", "").split(" ");

    const codes: CodeStateEntry[] = [];

    gcodeData.forEach((code) => {
      if (/G.+/.test(code))
        codes.push(gcodeMap.gcode[code]);
      else if (/M.+/.test(code))
        codes.push(gcodeMap.mcode[code]);
      else if (/T.+/.test(code)) {
        codes.push({ code: "T", name: "Tool", description: "The current tool", value: parseInt(code.replace("T", "")) });
      }
      else if (/F.+/.test(code)) {
        codes.push({ code: "F", name: "Feed rate", description: "The last feed command", value: parseFloat(code.replace("F", "")) });
      }
      else if (/S.+/.test(code)) {
        codes.push({ code: "S", name: "RPM", description: "The current spindle speed command", value: parseFloat(code.replace("S", "")) });
      }
      else
        codes.push({ code: code, description: "Unknown gcode state", name: "Unknown" });
    });

    return {
      type: messageTypes.gcodeState,
      data: {
        codes: codes
      },
      input: state
    };
  }

  grblInitReport(init: string): InitializeResult {
    // Grbl 1.1f ['$' for help]
    const initData = init.match(/^Grbl\sv?(\d\.\d.)\s\[\'\$\'\sfor\shelp\]$/);
    if (!initData)
      throw new Error("Unrecognized initialization response: " + init);

    return {
      type: messageTypes.initialize,
      data: {
        firmwareVersion: initData[1]
      },
      input: init
    };
  }

  errorReport(error: string): ErrorResult {
    // error:9
    // error:Bad number format
    const data: ErrorOrAlarmData = {};

    const errorData = error.split(":");
    const err = errorData[1];
    if (Number.isInteger(parseInt(errorData[1]))) {
      data.code = parseInt(err);
      data.message = errorMap[err];
    } else
      data.message = error.replace("error:", "");

    return {
      type: messageTypes.error,
      data: data,
      input: error
    };
  }

  alarmReport(alarm: string): AlarmResult {
    // ALARM:9
    // ALARM:Hard/soft limit
    const alarmData = alarm.split(":")[1];
    const data: ErrorOrAlarmData = {};

    if (Number.isInteger(parseInt(alarmData))) {
      data.code = parseInt(alarmData);
      data.message = alarmMap[alarmData];
    } else
      data.message = alarmData;

    return {
      type: messageTypes.alarm,
      data: data,
      input: alarm
    };
  }

  buildVersionReport(version: string): BuildVersionResult {
    // [VER:1.1f.20170131:]
    const versionMatch = version.replace("[", "").replace("VER:", "").replace("]", "").split(":"); //  '1.1f.20170131', 'My string!!'
    const versionData = versionMatch[0].match(/^(.+)\.(\d{8})$/);
    if (!versionData)
      throw new Error("Unrecognized build version: " + version);
    const data: BuildVersionData = {
      firmwareVersion: versionData[1],
      buildDate: versionData[2]
    };

    if (versionMatch[1])
      data.buildString = versionMatch[1];

    return {
      type: messageTypes.buildVersion,
      data: data,
      input: version
    };
  }

  buildOptionsReport(options: string): BuildOptionsResult {
    // [OPT:V,15,128]
    const versionMatch = options.match(/\[(.+)\]/);
    if (!versionMatch)
      throw new Error("Unrecognized build options: " + options);
    const versionData = versionMatch[1].split(":")[1];
    const versionOptions = versionData.split(",");
    const versionCodes = versionOptions[0].split("");
    const versionExtras = versionOptions.slice(1, versionOptions.length);

    const buildOptions: BuildOptionEntry[] = [];
    const buildExtras: string[] = [];

    versionCodes.forEach((code) => {
      buildOptions.push({ code: code, message: buildOptionsMap[code] });
    });

    versionExtras.forEach((extra) => {
      buildExtras.push(extra);
    });

    return {
      type: messageTypes.buildOptions,
      data: {
        options: buildOptions,
        extras: buildExtras,
      },
      input: options
    };
  }

  settingsReport(setting: string): SettingResult {
    // $10=255.5
    const settingData = setting.split("=");
    const codeMatch = settingData[0].match(/\$(\d+)/);
    if (!codeMatch)
      throw new Error("Unrecognized setting report: " + setting);

    const code = parseFloat(codeMatch[1]);
    const entry = settingsMap[String(code)];

    const data: SettingData = {
      code: code,
      value: parseFloat(settingData[1]),
      setting: entry.setting,
      units: entry.units,
      description: entry.description
    };

    return {
      type: messageTypes.setting,
      data: data,
      input: setting
    };
  }

  probeResultReport(probeResult: string): ProbeResult {
    // [PRB:0.000,0.000,1.492:1]
    const probeData = probeResult.replace("[PRB:", "").replace("]", "").split(":");
    // ["0.000, 0.000, 1.492", "1"]

    return {
      type: messageTypes.probeResult,
      data: {
        location: parseCoordinates(probeData[0]),
        success: parseInt(probeData[1]) === 1
      },
      input: probeResult
    };
  }

  helpMessageReport(helpMessage: string): HelpResult {
    // [HLP:$$ $# $G $I $N $x=val $Nx=line $J=line $SLP $C $X $H ~ ! ? ctrl-x]
    const helpData = helpMessage.replace("[HLP:", "").replace("]", "").split(" ");

    return {
      type: messageTypes.helpMessage,
      data: {
        availableCommands: helpData
      },
      input: helpMessage
    };
  }

  // NOTE: this mutates the shared gcode-map entries (adds `coordinates` to
  // the map object itself) — behavior the test suite's deep-equal checks depend
  // on; do not "fix" it without updating the specs.
  gcodeSystemReport(gcodeSystem: string): GcodeSystemResult {
    // [G28:0.000,0.000,0.000]
    // [TLO:0.000]
    // [G28:0.000,-10.225,0.000]
    const systemData = gcodeSystem.replace("[", "").replace("]", "").split(":");

    let data: CodeInfo;
    if (systemData[0] == "TLO") {
      data = gcodeMap.tool[systemData[0]];
      data.coordinates = { z: parseFloat(systemData[1]) };
    } else {
      data = gcodeMap.gcode[systemData[0]];
      data.coordinates = parseCoordinates(systemData[1]);
    }

    return {
      type: messageTypes.gcodeSystem,
      data: data,
      input: gcodeSystem
    };
  }

  echoReport(echo: string): EchoResult {
    // [echo:G1X0.540Y10.4F100]
    const echoData = echo.replace("[", "").replace("]", "").split(":");

    return {
      type: messageTypes.echoMessage,
      data: {
        message: echoData[1]
      },
      input: echo
    };
  }

  startupLineReport(startupLine: string): StartupResult {
    // >G54G20:ok
    const startupData = startupLine.replace(">", "").split(":");

    return {
      type: messageTypes.gcodeStartup,
      data: {
        line: startupData[0],
        success: startupData[1] === "ok"
      },
      input: startupLine
    };
  }

  successReport(success: string): SuccessResult {
    // ok
    return {
      type: messageTypes.success,
      data: {
        success: success === "ok"
      },
      input: success
    };
  }

  feedbackMessageReport(feedbackMessage: string): FeedbackResult {
    // [MSG:‘$H’|’$X’ to unlock]
    // [Caution: Unlocked]
    const message = feedbackMessage.replace("[", "").replace("]", "");
    let data: MessageOnlyData;

    if (message.includes("MSG:")) {
      const messageData = message.split(":");
      data = { message: messageData[1] };
    } else
      data = { message: message };

    return {
      type: messageTypes.feedbackMessage,
      data: data,
      input: feedbackMessage
    };
  }
}
