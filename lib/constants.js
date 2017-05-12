module.exports.settingsMap = require('./data/setting_codes.json')
module.exports.gcodeMap = require('./data/gcode_map.json')

module.exports.supportedVersions = ['Grbl 1.1e', 'Grbl 1.1f']

module.exports.alarmMap = {
  1: "Hard limit triggered",
  2: "G-code motion target exceeds machine travel.",
  3: "Reset while in motion. Lost steps are likely.",
  4: "Probe fail. The probe is not in the expected initial state before starting probe cycle.",
  5: "Probe fail. Probe did not contact the workpiece.",
  6: "Homing fail. Reset during active homing cycle.",
  7: "Homing fail. Safety door was opened during active homing cycle.",
  8: "Homing fail. Cycle failed to clear limit switch when pulling off.",
  9: "Homing fail. Could not find limit switch within search distance."
}

module.exports.buildOptionsMap = {
  "V": "Variable spindle enabled",
  "N": "Line numbers enabled",
  "M": "Mist coolant enabled",
  "C": "CoreXY enabled",
  "P": "Parking motion enabled",
  "Z": "Homing force origin enabled",
  "H": "Homing single axis enabled",
  "T": "Two limit switches on axis enabled",
  "A": "Allow feed rate overrides in probe cycles",
  "*": "Restore all EEPROM disabled",
  "$": "Restore EEPROM $ settings disabled",
  "#": "Restore EEPROM parameter data disabled",
  "I": "Build info write user string disabled",
  "E": "Force sync upon EEPROM write disabled",
  "W": "Force sync upon work coordinate offset change disabled",
  "L": "Homing init lock sets Grbl into an alarm state upon power up"
}

module.exports.errorMap = {
  1: "G-code words consist of a letter and a value. Letter was not found.",
  2: "Missing the expected G-code word value or numeric value format is not valid.",
  3: "Grbl '$' system command was not recognized or supported.",
  4: "Negative value received for an expected positive value.",
  5: "Homing cycle failure. Homing is not enabled via settings.",
  6: "Minimum step pulse time must be greater than 3usec.",
  7: "An EEPROM read failed. Auto-restoring affected EEPROM to default values.",
  8: "Grbl '$' command cannot be used unless Grbl is IDLE. Ensures smooth operation during a job.",
  9: "G-code commands are locked out during alarm or jog state.",
  10: "Soft limits cannot be enabled without homing also enabled.",
  11: "Max characters per line exceeded. Received command line was not executed.",
  12: "Grbl '$' setting value cause the step rate to exceed the maximum supported.",
  13: "Safety door detected as opened and door state initiated.",
  14: "Build info or startup line exceeded EEPROM line length limit. Line not stored.",
  15: "Jog target exceeds machine travel. Jog command has been ignored.",
  16: "Jog command has no '=' or contains prohibited g-code.",
  17: "Laser mode requires PWM output.",
  20: "Unsupported or invalid g-code command found in block.",
  21: "More than one g-code command from same modal group found in block.",
  22: "Feed rate has not yet been set or is undefined.",
  23: "G-code command in block requires an integer value.",
  24: "More than one g-code command that requires axis words found in block.",
  25: "Repeated g-code word found in block.",
  26: "No axis words found in block for g-code command or current modal state which requires them.",
  27: "Line number value is invalid.",
  28: "G-code command is missing a required value word.",
  29: "G59.x work coordinate systems are not supported.",
  30: "G53 only allowed with G0 and G1 motion modes.",
  31: "Axis words found in block when no command or current modal state uses them.",
  32: "G2 and G3 arcs require at least one in-plane axis word.",
  33: "Motion command target is invalid.",
  34: "Arc radius value is invalid.",
  35: "G2 and G3 arcs require at least one in-plane offset word.",
  36: "Unused value words found in block.",
  37: "G43.1 dynamic tool length offset is not assigned to configured tool length axis.",
  38: "Tool number greater than max supported value.",
}

module.exports.messageTypes = {
  status: "status",
  success: "success",
  initialize: "initialize",
  alarm: "alarm",
  error: "error",
  setting: "setting",
  feedbackMessage: "feedbackMessage",
  buildVersion: "buildVersion",
  buildOptions: "buildOptions",
  gcodeState: "gcodeState",
  helpMessage: "helpMessage",
  gcodeSystem: "gcodeSystem",
  probeResult: "probeResult",
  echoMessage: "echoMessage",
  gcodeStartup: "gcodeStartup",
  unknown: "unknown"
}

module.exports.subStateMessage = {
  "Door": {
    0: "Door closed. Ready to resume.",
    1: "Machine stopped. Door still ajar. Can't resume until closed.",
    2: "Door opened. Hold (or parking retract) in-progress. Reset will throw an alarm.",
    3: "Door closed and resuming. Restoring from park, if applicable. Reset will throw an alarm."
  },
  "Hold": {
    0: "Hold complete. Ready to resume.",
    1: "Hold in-progress. Reset will throw an alarm."
  }
}

module.exports.statusMap = {
  "A": "accessories",
  "Bf": "buffer",
  "Buf": "buffer",
  "RX": "buffer",
  "FS": "realtimeFeed",
  "MPos": "machinePosition",
  "Ov": "override",
  "Lim": "pins",
  "Pn": "pins",
  "Pin": "pins",
  "WCO": "workcoordinateOffset",
  "WPos": "workPosition"
}
