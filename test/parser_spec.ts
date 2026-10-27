import { Parser, Extractor, StatusExtractor } from '../dist/index.js'
import { MessagePayload } from '../dist/results.js'
import { validStrings } from './spec_constants.js'
import { describe, it, expect, beforeEach, vi, Mock } from 'vitest'

type AnySpy = Mock<(input: string, data: MessagePayload) => unknown>

let parser: Parser
let spyFunc: AnySpy

var generateSuccessTest = function(
  funcName: string,
  strings: string[],
  makeSpy: (parser: Parser) => AnySpy
) {
  describe('for ' + funcName + ' messages', () => {
    beforeEach(() => {
      parser = new Parser()
      spyFunc = makeSpy(parser)
      vi.spyOn(parser, "parseData")
    })

    strings.forEach(function(value) {
      it('should call ' + funcName + '-related methods for ' + value, () => {
        parser.parseData(value)
        expect(spyFunc).to.have.been.calledWith(value)
      })
    })
  })
  describe("for non-status messages", () => {
    beforeEach(() => {
      parser = new Parser()
      spyFunc = makeSpy(parser)
      vi.spyOn(parser, "parseData")
    })

    Object.entries(validStrings).forEach(function(entry) {
      if (JSON.stringify(entry[1]) !== JSON.stringify(strings)) {
        entry[1].forEach(function(value) {
          it('should not call ' + funcName + '-related methods for ' + value, () => {
            parser.parseData(value)
            expect(spyFunc).not.have.been.calledWith(value)
          })
        })
      }
    })
  })
}

describe('Parser', () => {
  describe('#parseData()', () => {
    generateSuccessTest("statusReport", validStrings.status, function(parser) { return vi.spyOn(parser.statusExtractor, "statusReport") })
    generateSuccessTest("successReport", validStrings.success, function(parser) { return vi.spyOn(parser.extractor, "successReport") })
    generateSuccessTest("grblInitReport", validStrings.init, function(parser) { return vi.spyOn(parser.extractor, "grblInitReport") })
    generateSuccessTest("alarmReport", validStrings.alarm, function(parser) { return vi.spyOn(parser.extractor, "alarmReport") })
    generateSuccessTest("errorReport", validStrings.error, function(parser) { return vi.spyOn(parser.extractor, "errorReport") })
    generateSuccessTest("settingsReport", validStrings.setting, function(parser) { return vi.spyOn(parser.extractor, "settingsReport") })
    generateSuccessTest("feedbackMessageReport", validStrings.feedbackMessage, function(parser) { return vi.spyOn(parser.extractor, "feedbackMessageReport") })
    generateSuccessTest("buildVersionReport", validStrings.buildVersion, function(parser) { return vi.spyOn(parser.extractor, "buildVersionReport") })
    generateSuccessTest("buildOptionsReport", validStrings.buildOptions, function(parser) { return vi.spyOn(parser.extractor, "buildOptionsReport") })
    generateSuccessTest("gcodeStateReport", validStrings.gcodeState, function(parser) { return vi.spyOn(parser.extractor, "gcodeStateReport") })
    generateSuccessTest("helpMessageReport", validStrings.helpMessage, function(parser) { return vi.spyOn(parser.extractor, "helpMessageReport") })
    generateSuccessTest("gcodeSystemReport", validStrings.gcodeSystem, function(parser) { return vi.spyOn(parser.extractor, "gcodeSystemReport") })
    generateSuccessTest("probeResultReport", validStrings.probeResult, function(parser) { return vi.spyOn(parser.extractor, "probeResultReport") })
    generateSuccessTest("echoReport", validStrings.echo, function(parser) { return vi.spyOn(parser.extractor, "echoReport") })
    generateSuccessTest("startupLineReport", validStrings.startupLine, function(parser) { return vi.spyOn(parser.extractor, "startupLineReport") })

    it("should dispatch unknown message type for non-grbl strings", () => {
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
