import { alarmMap, buildOptionsMap, errorMap, gcodeMap, messageTypes, settingsMap } from "./constants.js";
import { parseCoordinates } from "./utils/extractor_utils.js";

export class Extractor {
  gcodeStateReport(state: string): any {
    // [GC:G0 G54 G17 G21 G90 G94 M5 M9 T0 F0 S0]
    const gcodeData = state.replace("[", "").replace("]", "").replace("GC:", "").split(" ");

    const codes = [];

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

  grblInitReport(init: string): any {
    // Grbl 1.1f ['$' for help]

    const initData = init.match(/^Grbl\sv?(\d\.\d.)\s\[\'\$\'\sfor\shelp\]$/);
    return {
      type: messageTypes.initialize,
      data: {
        firmwareVersion: initData[1]
      },
      input: init
    };
  }

  errorReport(error: string): any {
    // error:9
    // error:Bad number format
    const data: any = {};

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

  alarmReport(alarm: string): any {
    // ALARM:9
    // ALARM:Hard/soft limit

    const alarmData = alarm.split(":")[1];
    const data: any = {};

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

  buildVersionReport(version: string): any {
    // [VER:1.1f.20170131:]

    const versionMatch = version.replace("[", "").replace("VER:", "").replace("]", "").split(":"); //  '1.1f.20170131', 'My string!!'
    const versionData: any = versionMatch[0].match(/^(.+)\.(\d{8})$/);
    const data: any = {};
    data.firmwareVersion = versionData[1];
    data.buildDate = versionData[2];

    if (versionMatch[1])
      data.buildString = versionMatch[1];

    return {
      type: messageTypes.buildVersion,
      data: data,
      input: version
    };
  }

  buildOptionsReport(options: string): any {
    // [OPT:V,15,128]

    const versionMatch = options.match(/\[(.+)\]/);
    let versionData: any = versionMatch[1].split(":");

    versionData = versionData[1];
    const versionOptions = versionData.split(",");
    const versionCodes = versionOptions[0].split("");
    const versionExtras = versionOptions.slice(1, versionOptions.length);

    const buildOptions = [];
    const buildExtras = [];

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

  settingsReport(setting: string): any {
    // $10=255.5

    const settingData = setting.split("=");

    const data: any = {};
    data.code = parseFloat(settingData[0].match(/\$(\d+)/)[1]);
    data.value = parseFloat(settingData[1]);
    data.setting = settingsMap[data.code].setting;
    data.units = settingsMap[data.code].units;
    data.description = settingsMap[data.code].description;

    return {
      type: messageTypes.setting,
      data: data,
      input: setting
    };
  }

  probeResultReport(probeResult: string): any {
    // [PRB:0.000,0.000,1.492:1]
    const probeData = probeResult.replace("[PRB:", "").replace("]", "").split(":");
    // ["0.000, 0.000, 1.492", "1"]
    const data: any = {};

    data.location = parseCoordinates(probeData[0]);
    data.success = parseInt(probeData[1]) === 1;

    return {
      type: messageTypes.probeResult,
      data: data,
      input: probeResult
    };
  }

  helpMessageReport(helpMessage: string): any {
    // [HLP:$$ $# $G $I $N $x=val $Nx=line $J=line $SLP $C $X $H ~ ! ? ctrl-x]
    const helpData = helpMessage.replace("[HLP:", "").replace("]", "").split(" ");

    const data: any = {};
    data.availableCommands = [];

    helpData.forEach((command) => {
      data.availableCommands.push(command);
    });

    return {
      type: messageTypes.helpMessage,
      data: data,
      input: helpMessage
    };
  }

  // NOTE: this mutates the shared gcode-map entries (adds `coordinates` to
  // the map object itself) — behavior the test suite's deep-equal checks depend
  // on; do not "fix" it without updating the specs.
  gcodeSystemReport(gcodeSystem: string): any {
    // [G28:0.000,0.000,0.000]
    // [TLO:0.000]
    // [G28:0.000,-10.225,0.000]
    let data: any = {};
    const systemData = gcodeSystem.replace("[", "").replace("]", "").split(":");

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

  echoReport(echo: string): any {
    // [echo:G1X0.540Y10.4F100]
    const data: any = {};
    const echoData = echo.replace("[", "").replace("]", "").split(":");
    data.message = echoData[1];

    return {
      type: messageTypes.echoMessage,
      data: data,
      input: echo
    };
  }

  startupLineReport(startupLine: string): any {
    // >G54G20:ok
    const data: any = {};
    const startupData = startupLine.replace(">", "").split(":");
    data.line = startupData[0];
    data.success = startupData[1] === "ok";

    return {
      type: messageTypes.gcodeStartup,
      data: data,
      input: startupLine
    };
  }

  successReport(success: string): any {
    // ok
    const data: any = {};
    data.success = success === "ok";

    return {
      type: messageTypes.success,
      data: data,
      input: success
    };
  }

  feedbackMessageReport(feedbackMessage: string): any {
    // [MSG:‘$H’|’$X’ to unlock]
    // [Caution: Unlocked]
    const data: any = {};
    const message = feedbackMessage.replace("[", "").replace("]", "");

    if (message.includes("MSG:")) {
      const messageData = message.split(":");
      data.message = messageData[1];
    } else
      data.message = message;

    return {
      type: messageTypes.feedbackMessage,
      data: data,
      input: feedbackMessage
    };
  }
}
