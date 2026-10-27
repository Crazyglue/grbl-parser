import { Checker } from '../dist/index.js'
import * as constants from './spec_constants.js'
import { describe, it, expect } from 'vitest'

var check

var generateTests = function(func, messageType) {
  generateTrueTest(func, messageType)
  generateFalseTest(func, messageType)
}

var generateFalseTest = function(func, avoidMessageType) {
  describe("for invalid strings", function() {
    Object.entries(constants.validStrings).forEach(function(entry) {
      var key = entry[0]
      if (key != avoidMessageType) {
        entry[1].forEach(function(value) {
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
    constants.validStrings[messageType].forEach(function(value) {
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


