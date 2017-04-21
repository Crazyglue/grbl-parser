module.exports.validStrings = {
  validStatus: "<Hold:0|MPos:0.000,0.000,0.000|Bf:15,128|FS:675.5,24000|Ov:120,100,100|WCO:0.000,-5.200,306.351|A:SFM>",
  validStatusB: "<Idle|WPos:0.000,0.000,0.000|FS:0,0>",
  validStatusC: "<Idle>",
  validStatusD: "<Run|MPos:0.000,0.000,0.000|FS:112,12000|Ov:120,110,100|A:C>",
  validStatusE: "<Idle,MPos:50.300,-120.000,0.000,WPos:-10.300,5.230,0.000,Buf:12,RX:101,Lim:010>", // grbl 09
  validStatusF: "<Hold,MPos:50.300,-120.000,0.000>", // grbl 09
  validInitialization: "Grbl 1.1f ['$' for help]",
  validInitializationB: "Grbl 0.9j ['$' for help]",
  validAlarm: "ALARM:9",
  validError: "error:20",
  validSetting: "$10=255.5",
  validSettingB: "$23=0 (homing dir invert mask:00000000)", // grbl 09
  validSettingC: "$6=1",
  validFeedbackMessage: "[MSG:‘$H’|’$X’ to unlock]",
  validGcodeState: "[GC:G0 G54 G17 G21 G90 G94 M5 M9 T0 F0 S0]",
  validGcodeStateB: "[GC:G0 G58 G17 G20 G91 G94 M5 M7 M9 T4 F100 S12000]",
  validHelpMessage: "[HLP:$$ $# $G $I $N $x=val $Nx=line $J=line $SLP $C $X $H ~ ! ? ctrl-x]",
  validBuildVersion: "[VER:1.1f.20170131:]",
  validBuildVersionB: "[VER:1.1e.20170131:My OEM string]",
  validBuildVersionC: "[0.9j.20160316:]",
  validBuildOptions: "[OPT:V,15,128]",
  validSuccess: "ok",
  validGcodeSystem: "[G28:]",
  validProbeResult: "[PRB:]",
  validEcho: "[echo:]",
  validStartupLine: ">G54G20:ok"
}
