module.exports.validStrings = {
  status: [
    "<Hold:0|MPos:0.000,0.000,0.000|Bf:15,128|FS:675.5,24000|Ov:120,100,100|WCO:0.000,-5.200,306.351|A:SFM>",
    "<Idle|WPos:0.000,0.000,0.000|FS:0,0>",
    "<Idle>",
    "<Run|MPos:0.000,0.000,0.000|FS:112,12000|Ov:120,110,100|A:C>",
    "<Idle,MPos:50.300,-120.000,0.000,WPos:-10.300,5.230,0.000,Buf:12,RX:101,Lim:010>", // grbl 09
    "<Hold,MPos:50.300,-120.000,0.000>" // grbl 09
  ],
  init: [
    "Grbl 1.1f ['$' for help]",
    "Grbl 0.9j ['$' for help]"
  ],

  alarm: [
    "ALARM:9",
    "ALARM:1",
    "ALARM:Hard/soft limit",
    "ALARM:Abort during cycle"
  ],
  error: [ "error:20" ],
  setting: [
    "$10=255.5",
    "$23=0 (homing dir invert mask:00000000)", // grbl 09
    "$6=1",
  ],
  feedbackMessage: [
    "[MSG:‘$H’|’$X’ to unlock]",
    "[MSG:Reset to continue]",
    "[MSG:Enabled]",
    "[Reset to continue]",  // grbl 09
    "[Enabled]", // grbl 09
    "['$H'|'$X' to unlock]",  // grbl 09
    "[Caution: Unlocked]"  // grbl 09
  ],
  gcodeState: [
    "[GC:G0 G54 G17 G21 G90 G94 M5 M9 T0 F0 S0]",
    "[GC:G0 G58 G17 G20 G91 G94 M5 M7 M9 T4 F100 S12000]"
  ],
  helpMessage: [ "[HLP:$$ $# $G $I $N $x=val $Nx=line $J=line $SLP $C $X $H ~ ! ? ctrl-x]" ],
  buildVersion: [
    "[VER:1.1f.20170131:]",
    "[VER:1.1e.20170131:My OEM string]",
    "[0.9j.20160316:]",
    "[1.0c.20161011:]"
  ],
  buildOptions: [ "[OPT:V,15,128]" ],
  success: [ "ok" ],
  gcodeSystem: [ "[G28:]" ],
  probeResult: [
    "[PRB:]",
    "[PRB:0.000,0.000,1.492:1]"
  ],
  echo: [ "[echo:]" ],
  startupLine: [ ">G54G20:ok" ]
}
