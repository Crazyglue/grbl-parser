import { Parser } from "./lib/parser.js";

const parser = new Parser();

parser.dispatcher.addToAllListeners((data: any) => {
  console.log("parsed:", data);
});

const samples = [
  "<Idle,MPos:50.300,-120.000,0.000,WPos:-10.300,5.230,0.000,Buf:12,RX:101,Lim:010>",
  "ok",
  "Grbl 1.1f ['$' for help]",
  "$10=255.5",
  "[GC:G0 G54 G17 G21 G90 G94 M5 M9 T0 F0 S0]",
  "error:20"
];

samples.forEach((sample) => parser.parseData(sample));
