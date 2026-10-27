export class Checker {
  isStatusReport(data: string): boolean {
    return /^<.*>$/.test(data);
  }

  isSuccessResponse(data: string): boolean {
    return /^ok$/.test(data);
  }

  isGrblInitialization(data: string): boolean {
    return /^Grbl\sv?(\d\.\d.)\s\[\'\$\'\sfor\shelp\]$/.test(data);
  }

  isAlarm(data: string): boolean {
    return /^ALARM:.+$/.test(data);
  }

  isError(data: string): boolean {
    return /^error:.+$/.test(data);
  }

  isGrblSetting(data: string): boolean {
    return /^\$\d+\=.+$/.test(data);
  }

  isBuildVersion(data: string): boolean {
    return /^\[(VER:)?(\d\.\d\w).+\:.*\]$/.test(data);
  }

  isBuildOptions(data: string): boolean {
    return /^\[OPT\:.*\]$/.test(data);
  }

  isFeedbackMessage(data: string): boolean {
    if (/^\[((?!G|VER:|TLO|OPT|HLP|echo|PRB).+)\]$/.test(data)) {
      return !/^\[(VER:)?(\d\.\d\w).+\:.*\]$/.test(data);
    } else {
      return false;
    }
  }

  isGcodeState(data: string): boolean {
    return /^\[.+(G\d).+(M\d).+\]$/.test(data);
  }

  isHelpMessage(data: string): boolean {
    return /^\[HLP\:.*\]$/.test(data);
  }

  isGcodeSystem(data: string): boolean {
    return /^\[(G\d+|TLO)\:.*\]$/.test(data);
  }

  isProbeResult(data: string): boolean {
    return /^\[PRB\:.*\]$/.test(data);
  }

  isEcho(data: string): boolean {
    return /^\[echo\:.*\]$/.test(data);
  }

  isStartupLine(data: string): boolean {
    return /^\>?.+\:?ok$/.test(data);
  }
}
