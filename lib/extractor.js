var extractorConstants = require("./constants");
var extractorMessageTypes = extractorConstants.messageTypes;
var extractorParseCoordinates = require("./utils/extractor_utils").parseCoordinates;
var Extractor = function () { };
Extractor.prototype.gcodeStateReport = function (state) {
    // [GC:G0 G54 G17 G21 G90 G94 M5 M9 T0 F0 S0]
    var gcodeData = state.replace("[", "").replace("]", "").replace("GC:", "").split(" ");
    var codes = [];
    gcodeData.forEach(function (code) {
        if (/G.+/.test(code))
            codes.push(extractorConstants.gcodeMap.gcode[code]);
        else if (/M.+/.test(code))
            codes.push(extractorConstants.gcodeMap.mcode[code]);
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
        type: extractorMessageTypes.gcodeState,
        data: {
            codes: codes
        },
        input: state
    };
};
Extractor.prototype.grblInitReport = function (init) {
    // Grbl 1.1f ['$' for help]
    var initData = init.match(/^Grbl\sv?(\d\.\d.)\s\[\'\$\'\sfor\shelp\]$/);
    return {
        type: extractorMessageTypes.initialize,
        data: {
            firmwareVersion: initData[1]
        },
        input: init
    };
};
Extractor.prototype.errorReport = function (error) {
    // error:9
    // error:Bad number format
    var data = {};
    var errorData = error.split(":");
    var err = errorData[1];
    if (Number.isInteger(parseInt(errorData[1]))) {
        data.code = parseInt(err);
        data.message = extractorConstants.errorMap[err];
    }
    else
        data.message = error.replace("error:", "");
    return {
        type: extractorMessageTypes.error,
        data: data,
        input: error
    };
};
Extractor.prototype.alarmReport = function (alarm) {
    // ALARM:9
    // ALARM:Hard/soft limit
    var alarmData = alarm.split(":")[1];
    var data = {};
    if (Number.isInteger(parseInt(alarmData))) {
        data.code = parseInt(alarmData);
        data.message = extractorConstants.alarmMap[alarmData];
    }
    else
        data.message = alarmData;
    return {
        type: extractorMessageTypes.alarm,
        data: data,
        input: alarm
    };
};
Extractor.prototype.buildVersionReport = function (version) {
    // [VER:1.1f.20170131:]
    var versionMatch = version.replace("[", "").replace("VER:", "").replace("]", "").split(":"); //  '1.1f.20170131', 'My string!!'
    var versionData = versionMatch[0].match(/^(.+)\.(\d{8})$/);
    var data = {};
    data.firmwareVersion = versionData[1];
    data.buildDate = versionData[2];
    // data.firmwareVersion = versionData[0]
    if (versionMatch[1])
        data.buildString = versionMatch[1];
    return {
        type: extractorMessageTypes.buildVersion,
        data: data,
        input: version
    };
};
Extractor.prototype.buildOptionsReport = function (options) {
    // [OPT:V,15,128]
    var versionMatch = options.match(/\[(.+)\]/);
    var versionData = versionMatch[1].split(":");
    versionData = versionData[1];
    var versionOptions = versionData.split(",");
    var versionCodes = versionOptions[0].split("");
    var versionExtras = versionOptions.slice(1, versionOptions.length);
    var buildOptions = [];
    var buildExtras = [];
    versionCodes.forEach(function (code) {
        buildOptions.push({ code: code, message: extractorConstants.buildOptionsMap[code] });
    });
    versionExtras.forEach(function (extra) {
        buildExtras.push(extra);
    });
    return {
        type: extractorMessageTypes.buildOptions,
        data: {
            options: buildOptions,
            extras: buildExtras,
        },
        input: options
    };
};
Extractor.prototype.settingsReport = function (setting) {
    // $10=255.5
    var settingData = setting.split("=");
    var data = {};
    data.code = parseFloat(settingData[0].match(/\$(\d+)/)[1]);
    data.value = parseFloat(settingData[1]);
    data.setting = extractorConstants.settingsMap[data.code].setting;
    data.units = extractorConstants.settingsMap[data.code].units;
    data.description = extractorConstants.settingsMap[data.code].description;
    return {
        type: extractorMessageTypes.setting,
        data: data,
        input: setting
    };
};
Extractor.prototype.probeResultReport = function (probeResult) {
    // [PRB:0.000,0.000,1.492:1]
    var probeData = probeResult.replace("[PRB:", "").replace("]", "").split(":");
    // ["0.000, 0.000, 1.492", "1"]
    var data = {};
    data.location = extractorParseCoordinates(probeData[0]);
    data.success = parseInt(probeData[1]) === 1;
    return {
        type: extractorMessageTypes.probeResult,
        data: data,
        input: probeResult
    };
};
Extractor.prototype.helpMessageReport = function (helpMessage) {
    // [HLP:$$ $# $G $I $N $x=val $Nx=line $J=line $SLP $C $X $H ~ ! ? ctrl-x]
    var helpData = helpMessage.replace("[HLP:", "").replace("]", "").split(" ");
    var data = {};
    data.availableCommands = [];
    helpData.forEach(function (command) {
        data.availableCommands.push(command);
    });
    return {
        type: extractorMessageTypes.helpMessage,
        data: data,
        input: helpMessage
    };
};
Extractor.prototype.gcodeSystemReport = function (gcodeSystem) {
    // [G28:0.000,0.000,0.000]
    // [TLO:0.000]
    // [G28:0.000,-10.225,0.000]
    var data = {};
    var systemData = gcodeSystem.replace("[", "").replace("]", "").split(":");
    if (systemData[0] == "TLO") {
        data = extractorConstants.gcodeMap.tool[systemData[0]];
        data.coordinates = { z: parseFloat(systemData[1]) };
    }
    else {
        data = extractorConstants.gcodeMap.gcode[systemData[0]];
        data.coordinates = extractorParseCoordinates(systemData[1]);
    }
    return {
        type: extractorMessageTypes.gcodeSystem,
        data: data,
        input: gcodeSystem
    };
};
Extractor.prototype.echoReport = function (echo) {
    // [echo:G1X0.540Y10.4F100]
    var data = {};
    var echoData = echo.replace("[", "").replace("]", "").split(":");
    data.message = echoData[1];
    return {
        type: extractorMessageTypes.echoMessage,
        data: data,
        input: echo
    };
};
Extractor.prototype.startupLineReport = function (startupLine) {
    // >G54G20:ok
    var data = {};
    var startupData = startupLine.replace(">", "").split(":");
    data.line = startupData[0];
    data.success = startupData[1] === "ok";
    return {
        type: extractorMessageTypes.gcodeStartup,
        data: data,
        input: startupLine
    };
};
Extractor.prototype.successReport = function (success) {
    // ok
    var data = {};
    data.success = success === "ok";
    return {
        type: extractorMessageTypes.success,
        data: data,
        input: success
    };
};
Extractor.prototype.feedbackMessageReport = function (feedbackMessage) {
    // [MSG:‘$H’|’$X’ to unlock]
    // [Caution: Unlocked]
    var data = {};
    var message = feedbackMessage.replace("[", "").replace("]", "");
    if (message.includes("MSG:")) {
        var messageData = message.split(":");
        data.message = messageData[1];
    }
    else
        data.message = message;
    return {
        type: extractorMessageTypes.feedbackMessage,
        data: data,
        input: feedbackMessage
    };
};
module.exports = Extractor;
