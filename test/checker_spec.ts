import { Checker } from '../dist/index.js'
import * as constants from './spec_constants.js'
import { describe, it, expect } from 'vitest'

let check: Checker

type CheckFunc = (value: string) => boolean

var generateTests = function(func: CheckFunc, messageType: string) {
  generateTrueTest(func, messageType)
  generateFalseTest(func, messageType)
}

var generateFalseTest = function(func: CheckFunc, avoidMessageType: string) {
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

var generateTrueTest = function(func: CheckFunc, messageType: string) {
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
    generateTests(check.isStatusReport.bind(check), "status")
  })

  describe('#isGrblInitialization()', function() {
    check = new Checker()
    generateTests(check.isGrblInitialization.bind(check), "init")
  })

  describe('#isAlarm()', function() {
    check = new Checker()
    generateTests(check.isAlarm.bind(check), "alarm")
  })

  describe('#isError()', function() {
    check = new Checker()
    generateTests(check.isError.bind(check), "error")
  })

  describe('#isGrblSetting()', function() {
    check = new Checker()
    generateTests(check.isGrblSetting.bind(check), "setting")
  })

  describe('#isFeedbackMessage()', function() {
    check = new Checker()
    generateTests(check.isFeedbackMessage.bind(check), "feedbackMessage")
  })

  describe('#isBuildVersion()', function() {
    check = new Checker()
    generateTests(check.isBuildVersion.bind(check), "buildVersion")
  })

  describe('#isBuildOptions()', function() {
    check = new Checker()
    generateTests(check.isBuildOptions.bind(check), "buildOptions")
  })

  describe('#isGcodeState()', function() {
    check = new Checker()
    generateTests(check.isGcodeState.bind(check), "gcodeState")
  })

  describe('#isHelpMessage()', function() {
    check = new Checker()
    generateTests(check.isHelpMessage.bind(check), "helpMessage")
  })

  describe('#isGcodeSystem()', function() {
    check = new Checker()
    generateTests(check.isGcodeSystem.bind(check), "gcodeSystem")
  })

  describe('#isProbeResult()', function() {
    check = new Checker()
    generateTests(check.isProbeResult.bind(check), "probeResult")
  })

  describe('#isEcho()', function() {
    check = new Checker()
    generateTests(check.isEcho.bind(check), "echo")
  })

  describe('#isStartupLine()', function() {
    check = new Checker()
    generateTests(check.isStartupLine.bind(check), "startupLine")
  })

  describe('#isSuccessResponse()', function() {
    check = new Checker()
    generateTests(check.isSuccessResponse.bind(check), "success")
  })
})
