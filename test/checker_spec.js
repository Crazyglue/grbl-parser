var Checker = require('../lib/checker')
var expect = require('chai').expect
var constants = require('./spec_constants')
var _ = require('lodash')

var generateTests = function(func, messageType) {
  generateTrueTest(func, messageType)
  generateFalseTest(func, messageType)
}

var generateFalseTest = function(func, avoidMessageType) {
  describe("for invalid strings", function() {
    _.map(constants.validStrings, function(value, key) {
      if (key != avoidMessageType) {
        _.map(constants.validStrings[key], function(value, key) {
          it('should return false for ' + value, function() {
            expect(func(value)).to.be.false
          })
        })
      }
    })
  })
}

var generateTrueTest = function(func, messageType) {
  describe('for valid strings', function() {
    _.map(constants.validStrings[messageType], function(value) {
      it('should return true for ' + value, function() {
        expect(func(value)).to.be.true
      })
    })
  })
}

describe('Checkers', function() {
  describe('#isStatusReport()', function() {
    check = new Checker()
    generateTests(check.isStatusReport.bind(this), "status")
  })

  describe('#isGrblInitialization()', function() {
    check = new Checker()
    generateTests(check.isGrblInitialization.bind(this), "init")
  })

  describe('#isAlarm()', function() {
    check = new Checker()
    generateTests(check.isAlarm.bind(this), "alarm")
  })

  describe('#isError()', function() {
    check = new Checker()
    generateTests(check.isError.bind(this), "error")
  })

  describe('#isGrblSetting()', function() {
    check = new Checker()
    generateTests(check.isGrblSetting.bind(this), "setting")
  })

  describe('#isFeedbackMessage()', function() {
    check = new Checker()
    generateTests(check.isFeedbackMessage.bind(this), "feedbackMessage")
  })

  describe('#isBuildVersion()', function() {
    check = new Checker()
    generateTests(check.isBuildVersion.bind(this), "buildVersion")
  })

  describe('#isBuildOptions()', function() {
    check = new Checker()
    generateTests(check.isBuildOptions.bind(this), "buildOptions")
  })

  describe('#isGcodeState()', function() {
    check = new Checker()
    generateTests(check.isGcodeState.bind(this), "gcodeState")
  })

  describe('#isHelpMessage()', function() {
    check = new Checker()
    generateTests(check.isHelpMessage.bind(this), "helpMessage")
  })

  describe('#isGcodeSystem()', function() {
    check = new Checker()
    generateTests(check.isGcodeSystem.bind(this), "gcodeSystem")
  })

  describe('#isProbeResult()', function() {
    check = new Checker()
    generateTests(check.isProbeResult.bind(this), "probeResult")
  })

  describe('#isEcho()', function() {
    check = new Checker()
    generateTests(check.isEcho.bind(this), "echo")
  })

  describe('#isStartupLine()', function() {
    check = new Checker()
    generateTests(check.isStartupLine.bind(this), "startupLine")
  })

  describe('#isSuccessResponse()', function() {
    check = new Checker()
    generateTests(check.isSuccessResponse.bind(this), "success")
  })
})


