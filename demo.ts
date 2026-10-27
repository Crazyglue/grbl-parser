// Demo — intentionally NOT part of the tsc build (it lives outside src/).
// Run it after building with `npm run demo`: Node 24 type-strips this file
// directly, and it loads the built barrel from dist/.
import { Parser } from "./dist/index.js";

const parser = new Parser();

parser.dispatcher.addToAllListeners((data) => {
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
