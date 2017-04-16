GrblParser = require('./lib/parser')

constants = require('./lib/constants')
validStrings = require('./test/spec_constants').validStrings

var parser = new GrblParser()

function printParse(data) {
  console.log("parsed:", data);
}

parser.addToAllListener(printParse)

parser.parseData(validStrings.validError)
parser.parseData(validStrings.validGcodeState)
parser.parseData(validStrings.validSetting)
