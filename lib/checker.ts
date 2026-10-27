var Checker = function() {}

Checker.prototype.isStatusReport = function(data) {
  return /^<.*>$/.test(data)
}

Checker.prototype.isSuccessResponse = function(data) {
  return /^ok$/.test(data)
}

Checker.prototype.isGrblInitialization = function(data) {
    return /^Grbl\sv?(\d\.\d.)\s\[\'\$\'\sfor\shelp\]$/.test(data)
  }

Checker.prototype.isAlarm = function(data) {
    return /^ALARM:.+$/.test(data)
  }

Checker.prototype.isError = function(data) {
    return /^error:.+$/.test(data)
  }

Checker.prototype.isGrblSetting = function(data) {
    return /^\$\d+\=.+$/.test(data)
  }

Checker.prototype.isBuildVersion = function(data) {
    return /^\[(VER:)?(\d\.\d\w).+\:.*\]$/.test(data)
  }

Checker.prototype.isBuildOptions = function(data) {
    return /^\[OPT\:.*\]$/.test(data)
  }

Checker.prototype.isFeedbackMessage = function(data) {
    if (/^\[((?!G|VER:|TLO|OPT|HLP|echo|PRB).+)\]$/.test(data)) {
      return !/^\[(VER:)?(\d\.\d\w).+\:.*\]$/.test(data)
    }
    else {
      return false
    }
  }

Checker.prototype.isGcodeState = function(data) {
    return /^\[.+(G\d).+(M\d).+\]$/.test(data)
  }

Checker.prototype.isHelpMessage = function(data) {
    return /^\[HLP\:.*\]$/.test(data)
  }

Checker.prototype.isGcodeSystem = function(data) {
    return /^\[(G\d+|TLO)\:.*\]$/.test(data)
  }

Checker.prototype.isProbeResult = function(data) {
    return /^\[PRB\:.*\]$/.test(data)
  }

Checker.prototype.isEcho = function(data) {
    return /^\[echo\:.*\]$/.test(data)
  }

Checker.prototype.isStartupLine = function(data) {
    return /^\>?.+\:?ok$/.test(data)
  }

module.exports = Checker
