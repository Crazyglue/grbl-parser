var DemoParser = require('./lib/parser')

var constants = require('./lib/constants')
var validStrings = require('./test/spec_constants').validStrings

var parser = new DemoParser()

var printParse = function(data) {
  console.log("parsed:", data);
}

parser.addToAllListeners(printParse)

parser.parseData(validStrings.validError)
parser.parseData(validStrings.validGcodeState)
parser.parseData(validStrings.validSetting)
