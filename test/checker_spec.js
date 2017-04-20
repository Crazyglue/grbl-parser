var Checker = require('../lib/checker')
var expect = require('chai').expect
var constants = require('./spec_constants')
var _ = require('lodash')

describe('Checkers', function() {
  describe('#isStatusReport()', function() {
    beforeEach(function() {
      check = new Checker()
    })

    describe('for valid status report strings', function(){
      it('should return true for ' + constants.validStrings.validStatus, function() {
        expect(check.isStatusReport(constants.validStrings.validStatus)).to.be.true
      })
    })

    describe("for non-startup strings", function() {
      strings = constants.validStrings
      _.map(strings, function(value, key) {
        if (value !== strings.validStatus && value !== strings.validStatusB  && value !== strings.validStatusC && value !== strings.validStatusD && value !== strings.validStatusE)
          it('should return false for ' + value, function() {
            expect(check.isStatusReport(value)).to.be.false
          })
      });
    })
  })

  describe('#isGrblInitialization()', function() {
    beforeEach(function() {
      check = new Checker()
    })

    describe('for valid grbl init strings', function(){
      it('should return true for ' + constants.validStrings.validInitialization, function() {
        expect(check.isGrblInitialization(constants.validStrings.validInitialization)).to.be.true
      })
    })

    describe("for non-startup strings", function() {
      strings = constants.validStrings
      _.map(strings, function(value, key) {
        if (value !== strings.validInitialization && value !== strings.validInitializationB)
          it('should return false for ' + value, function() {
            expect(check.isGrblInitialization(value)).to.be.false
          })
      });
    })
  })

  describe('#isAlarm()', function() {
    beforeEach(function() {
      check = new Checker()
    })

    describe('for valid alarm strings', function(){
      it('should return true for ' + constants.validStrings.validAlarm, function() {
        expect(check.isAlarm(constants.validStrings.validAlarm)).to.be.true
      })
    })

    describe("for non-startup strings", function() {
      strings = constants.validStrings
      _.map(strings, function(value, key) {
        if (value !== strings.validAlarm)
          it('should return false for ' + value, function() {
            expect(check.isAlarm(value)).to.be.false
          })
      });
    })
  })

  describe('#isError()', function() {
    beforeEach(function() {
      check = new Checker()
    })

    describe('for valid error strings', function(){
      it('should return true for ' + constants.validStrings.validError, function() {
        expect(check.isError(constants.validStrings.validError)).to.be.true
      })
    })

    describe("for non-startup strings", function() {
      strings = constants.validStrings
      _.map(strings, function(value, key) {
        if (value !== strings.validError)
          it('should return false for ' + value, function() {
            expect(check.isError(value)).to.be.false
          })
      });
    })
  })

  describe('#isGrblSetting()', function() {
    beforeEach(function() {
      check = new Checker()
    })

    describe('for valid grbl setting strings', function(){
      it('should return true for ' + constants.validStrings.validSetting, function() {
        expect(check.isGrblSetting(constants.validStrings.validSetting)).to.be.true
        expect(check.isGrblSetting(constants.validStrings.validSettingB)).to.be.true
      })
    })

    describe("for non-startup strings", function() {
      strings = constants.validStrings
      _.map(strings, function(value, key) {
        if (value !== strings.validSetting && value !== strings.validSettingB)
          it('should return false for ' + value, function() {
            expect(check.isGrblSetting(value)).to.be.false
          })
      });
    })
  })

  describe('#isFeedbackMessage()', function() {
    beforeEach(function() {
      check = new Checker()
    })

    describe('for valid feedback strings', function(){
      it('should return true for ' + constants.validStrings.validFeedbackMessage, function() {
        expect(check.isFeedbackMessage(constants.validStrings.validFeedbackMessage)).to.be.true
      })
    })

    describe("for non-startup strings", function() {
      strings = constants.validStrings
      _.map(strings, function(value, key) {
        if (value !== strings.validFeedbackMessage)
          it('should return false for ' + value, function() {
            expect(check.isFeedbackMessage(value)).to.be.false
          })
      });
    })
  })

  describe('#isBuildVersion()', function() {
    beforeEach(function() {
      check = new Checker()
    })

    describe('for valid build version strings', function(){
      it('should return true for ' + constants.validStrings.validBuildVersion, function() {
        expect(check.isBuildVersion(constants.validStrings.validBuildVersion)).to.be.true
      })
    })

    describe("for non-startup strings", function() {
      strings = constants.validStrings
      _.map(strings, function(value, key) {
        if (value !== strings.validBuildVersion && value !== strings.validBuildVersionB)
          it('should return false for ' + value, function() {
            expect(check.isBuildVersion(value)).to.be.false
          })
      });
    })
  })

  describe('#isBuildOptions()', function() {
    describe('for valid build option strings', function(){
      it('should return true for ' + constants.validStrings.validBuildOptions, function() {
        expect(check.isBuildOptions(constants.validStrings.validBuildOptions)).to.be.true
      })
    })

    describe("for non-startup strings", function() {
      strings = constants.validStrings
      _.map(strings, function(value, key) {
        if (value !== strings.validBuildOptions)
          it('should return false for ' + value, function() {
            expect(check.isBuildOptions(value)).to.be.false
          })
      });
    })
  })

  describe('#isGcodeState()', function() {
    beforeEach(function() {
      check = new Checker()
    })

    describe('for valid gcode state strings', function(){
      it('should return true for ' + constants.validStrings.validGcodeState, function() {
        expect(check.isGcodeState(constants.validStrings.validGcodeState)).to.be.true
      })
    })

    describe("for non-startup strings", function() {
      strings = constants.validStrings
      _.map(strings, function(value, key) {
        if (value !== strings.validGcodeState)
          it('should return false for ' + value, function() {
            expect(check.isGcodeState(value)).to.be.false
          })
      });
    })
  })

  describe('#isHelpMessage()', function() {
    beforeEach(function() {
      check = new Checker()
    })

    describe('for valid help strings', function(){
      it('should return true for ' + constants.validStrings.validHelpMessage, function() {
        expect(check.isHelpMessage(constants.validStrings.validHelpMessage)).to.be.true
      })
    })

    describe("for non-startup strings", function() {
      strings = constants.validStrings
      _.map(strings, function(value, key) {
        if (value !== strings.validHelpMessage)
          it('should return false for ' + value, function() {
            expect(check.isHelpMessage(value)).to.be.false
          })
      });
    })
  })

  describe('#isGcodeSystem()', function() {
    beforeEach(function() {
      check = new Checker()
    })

    describe('for valid gcode system strings', function(){
      it('should return true for ' + constants.validStrings.validGcodeSystem, function() {
        expect(check.isGcodeSystem(constants.validStrings.validGcodeSystem)).to.be.true
      })
    })

    describe("for non-startup strings", function() {
      strings = constants.validStrings
      _.map(strings, function(value, key) {
        if (value !== strings.validGcodeSystem)
          it('should return false for ' + value, function() {
            expect(check.isGcodeSystem(value)).to.be.false
          })
      });
    })
  })

  describe('#isProbeResult()', function() {
    beforeEach(function() {
      check = new Checker()
    })

    describe('for valid probe strings', function(){
      it('should return true for ' + constants.validStrings.validProbeResult, function() {
        expect(check.isProbeResult(constants.validStrings.validProbeResult)).to.be.true
      })
    })

    describe("for non-startup strings", function() {
      strings = constants.validStrings
      _.map(strings, function(value, key) {
        if (value !== strings.validProbeResult)
          it('should return false for ' + value, function() {
            expect(check.isProbeResult(value)).to.be.false
          })
      });
    })
  })

  describe('#isEcho()', function() {
    beforeEach(function() {
      check = new Checker()
    })

    describe('for valid echo strings', function(){
      it('should return true for ' + constants.validStrings.validEcho, function() {
        expect(check.isEcho(constants.validStrings.validEcho)).to.be.true
      })
    })

    describe("for non-startup strings", function() {
      strings = constants.validStrings
      _.map(strings, function(value, key) {
        if (value !== strings.validEcho)
          it('should return false for ' + value, function() {
            expect(check.isEcho(value)).to.be.false
          })
      });
    })
  })

  describe('#isStartupLine()', function() {
    beforeEach(function() {
      check = new Checker()
    })

    describe('for valid startup strings', function(){
      it('should return true for ' + constants.validStrings.validStartupLine, function() {
        expect(check.isStartupLine(constants.validStrings.validStartupLine)).to.be.true
      })
    })

    describe("for non-startup strings", function() {
      strings = constants.validStrings
      _.map(strings, function(value, key) {
        if (value !== strings.validStartupLine)
          it('should return false for ' + value, function() {
            expect(check.isStartupLine(value)).to.be.false
          })
      });
    })
  })

  describe('#isSuccessResponse()', function() {
    beforeEach(function() {
      check = new Checker()
    })

    describe('for valid success strings', function(){
      it('should return true for ' + constants.validStrings.validSuccess, function() {
        expect(check.isSuccessResponse(constants.validStrings.validSuccess)).to.be.true
      })
    })

    describe("for non-startup strings", function() {
      strings = constants.validStrings
      _.map(strings, function(value, key) {
        if (value !== strings.validSuccess)
          it('should return false for ' + value, function() {
            expect(check.isSuccessResponse(value)).to.be.false
          })
      });
    })
  })

})


