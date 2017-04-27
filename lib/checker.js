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
    return /^ALARM:.+$/.test(data)
  }

  isError(data) {
    return /^error:.+$/.test(data)
  }

  isGrblSetting(data) {
    return /^\$\d+\=.+$/.test(data)
  }

  isBuildVersion(data) {
    return /^\[(VER:)?(\d\.\d\w).+\:.*\]$/.test(data)
  }

  isBuildOptions(data) {
    return /^\[OPT\:.*\]$/.test(data)
  }

  isFeedbackMessage(data) {
    if (/^\[((?!G|VER:|TLO|OPT|HLP|echo|PRB).+)\]$/.test(data)) {
      return !/^\[(VER:)?(\d\.\d\w).+\:.*\]$/.test(data)
    }
    else {
      return false
    }
  }

  isGcodeState(data) {
    return /^\[.+(G\d).+(M\d).+\]$/.test(data)
  }

  isHelpMessage(data) {
    return /^\[HLP\:.*\]$/.test(data)
  }

  isGcodeSystem(data) {
    return /^\[(G\d+|TLO)\:.*\]$/.test(data)
  }

  isProbeResult(data) {
    return /^\[PRB\:.*\]$/.test(data)
  }

  isEcho(data) {
    return /^\[echo\:.*\]$/.test(data)
  }

  isStartupLine(data) {
    return /^\>?.+\:?ok$/.test(data)
  }
}
