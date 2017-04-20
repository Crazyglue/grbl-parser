module.exports = class Checker {
  isStatusReport(data) {
    return /^<.*>$/.test(data)
  }

  isSuccessResponse(data) {
    return /^ok$/.test(data)
  }

  isGrblInitialization(data) {
    return /^Grbl\sv?(\d\.\d.)\s\[\'\$\'\sfor\shelp\]$/.test(data)
  }

  isAlarm(data) {
    return /^ALARM:\d+$/.test(data)
  }

  isError(data) {
    return /^error:\d+$/.test(data)
  }

  isGrblSetting(data) {
    return /^\$\d+\=.+$/.test(data)
  }

  isFeedbackMessage(data) {
    return /^\[MSG:.*\]$/.test(data)
  }

  isBuildVersion(data) {
    return /^\[VER\:.*\]$/.test(data)
  }

  isBuildOptions(data) {
    return /^\[OPT\:.*\]$/.test(data)
  }

  isGcodeState(data) {
    return /^\[GC\:.*\]$/.test(data)
  }

  isHelpMessage(data) {
    return /^\[HLP\:.*\]$/.test(data)
  }

  isGcodeSystem(data) {
    return /^\[G\d\d\:.*\]$/.test(data)
  }

  isProbeResult(data) {
    return /^\[PRB\:.*\]$/.test(data)
  }

  isEcho(data) {
    return /^\[echo\:.*\]$/.test(data)
  }

  isStartupLine(data) {
    return /^\>.*\:ok$/.test(data)
  }
}
