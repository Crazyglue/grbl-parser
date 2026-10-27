import { Parser, Extractor } from '../dist/index.js'
import { validStrings } from './spec_constants.js'
import { describe, it, expect, beforeEach, vi } from 'vitest'

var parser, spyFunc

var generateSuccessTest = function(funcName, strings, extractorName) {
  describe('for ' + funcName + ' messages', function() {
    beforeEach(function() {
      parser = new Parser()
      spyFunc = vi.spyOn(parser[extractorName], funcName)
      vi.spyOn(parser, "parseData")
    })

    strings.forEach(function(value) {
      it('should call ' + funcName + '-related methods for ' + value, function() {
        parser.parseData(value)
        expect(spyFunc).to.have.been.calledWith(value)
      })
    })
  })
  describe("for non-status messages", function() {
    beforeEach(function() {
      parser = new Parser()
      spyFunc = vi.spyOn(parser[extractorName], funcName)
      vi.spyOn(parser, "parseData")
    })

    Object.entries(validStrings).forEach(function(entry) {
      if (JSON.stringify(entry[1]) !== JSON.stringify(strings)) {
        entry[1].forEach(function(value) {
          it('should not call ' + funcName + '-related methods for ' + value, function() {
            parser.parseData(value)
            expect(spyFunc).not.have.been.calledWith(value)
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

    it("should dispatch unknown message type for non-grbl strings", function() {
      parser = new Parser()
      spyFunc = vi.spyOn(parser.dispatcher, "dispatch")

      parser.parseData("jkfldaskl")

      expect(spyFunc).to.have.been.calledWith("unknown", expect.anything())
      expect(spyFunc).not.have.been.calledWith("status", expect.anything())
      expect(spyFunc).not.have.been.calledWith("initialize", expect.anything())
      expect(spyFunc).not.have.been.calledWith("alarm", expect.anything())
      expect(spyFunc).not.have.been.calledWith("error", expect.anything())
      expect(spyFunc).not.have.been.calledWith("setting", expect.anything())
      expect(spyFunc).not.have.been.calledWith("feedbackMessage", expect.anything())
      expect(spyFunc).not.have.been.calledWith("buildVersion", expect.anything())
      expect(spyFunc).not.have.been.calledWith("buildOptions", expect.anything())
      expect(spyFunc).not.have.been.calledWith("gcodeState", expect.anything())
      expect(spyFunc).not.have.been.calledWith("helpMessage", expect.anything())
      expect(spyFunc).not.have.been.calledWith("gcodeSystem", expect.anything())
      expect(spyFunc).not.have.been.calledWith("probeResult", expect.anything())
      expect(spyFunc).not.have.been.calledWith("echoMessage", expect.anything())
      expect(spyFunc).not.have.been.calledWith("gcodeStartup", expect.anything())
      expect(spyFunc).not.have.been.calledWith("startupLine", expect.anything())
    })
  })
})
