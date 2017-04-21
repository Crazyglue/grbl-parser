var Parser = require('../lib/parser')
var Extractor = require('../lib/extractor')
var expect = require('chai').expect
var validStrings = require('./spec_constants').validStrings
var sinon = require("sinon")
var _ = require("lodash")

var generateSuccessTest = function(funcName, strings, extractorName) {
  describe('for ' + funcName + ' messages', function() {
    _.map(strings, function(value, key) {
      before(function() {
        parser = new Parser()
        spyFunc = sinon.spy(parser[extractorName], funcName)
        sinon.spy(parser, "parseData")
      })
      it('should call ' + funcName + '-related methods for ' + value, function() {
        parser.parseData(value)
        expect(spyFunc.calledWith(value)).to.be.true
      })
    })
  })
  describe("for non-status messages", function() {
    _.map(validStrings, function(value, key) {
      if (!_.isEqual(validStrings[key], strings)) {
        _.map(value, function(value, key) {
          before(function() {
            parser = new Parser()
            spyFunc = sinon.spy(parser[extractorName], funcName)
            sinon.spy(parser, "parseData")
          })
          it('should not call ' + funcName + '-related methods for ' + value, function() {
            parser.parseData(value)
            expect(spyFunc.calledWith(value)).to.be.false
          })
        })
      }
    })
  })
}

describe('Parser', function() {
  describe('#parseData()', function() {
    generateSuccessTest("statusReport", validStrings.status, "statusExtractor")
    generateSuccessTest("successReport", validStrings.success, "extractor")
    generateSuccessTest("grblInitReport", validStrings.init, "extractor")
    generateSuccessTest("alarmReport", validStrings.alarm, "extractor")
    generateSuccessTest("errorReport", validStrings.error, "extractor")
    generateSuccessTest("settingsReport", validStrings.setting, "extractor")
    generateSuccessTest("feedbackMessageReport", validStrings.feedbackMessage, "extractor")
    generateSuccessTest("buildVersionReport", validStrings.buildVersion, "extractor")
    generateSuccessTest("buildOptionsReport", validStrings.buildOptions, "extractor")
    generateSuccessTest("gcodeStateReport", validStrings.gcodeState, "extractor")
    generateSuccessTest("helpMessageReport", validStrings.helpMessage, "extractor")
    generateSuccessTest("gcodeSystemReport", validStrings.gcodeSystem, "extractor")
    generateSuccessTest("probeResultReport", validStrings.probeResult, "extractor")
    generateSuccessTest("echoReport", validStrings.echo, "extractor")
    generateSuccessTest("startupLineReport", validStrings.startupLine, "extractor")
  })
})
