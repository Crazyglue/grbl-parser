import { Extractor } from '../../dist/index.js'
import { validStrings } from '../spec_constants.js'
import { describe, it, expect, beforeEach } from 'vitest'

let extractor: Extractor

describe('Extractor', function() {
  beforeEach(function() {
    extractor = new Extractor()
  })

  describe('#errorReport()', function() {
    it('should return a correctly formatted report object', function() {
      const string = validStrings.error[0]
      const mockedReport = {
        data: {
          code: 20,
          message: "Unsupported or invalid g-code command found in block."
        },
        input: string,
        type: "error"
      }

      const report = extractor.errorReport(string)
      expect(report).to.deep.equal(mockedReport)
    })

    it('should return a correctly formatted report object', function() {
      const string = validStrings.error[1]
      const mockedReport = {
        data: {
          message: "Bad number format"
        },
        input: string,
        type: "error"
      }

      const report = extractor.errorReport(string)
      expect(report).to.deep.equal(mockedReport)
    })

    it('should return a correctly formatted report object', function() {
      const string = validStrings.error[3]
      const mockedReport = {
        data: {
          message: "Invalid gcode ID:24"
        },
        input: string,
        type: "error"
      }

      const report = extractor.errorReport(string)
      expect(report).to.deep.equal(mockedReport)
    })
  })

  describe('#grblInitReport()', function() {
    it('should return a correctly formatted report object', function() {
      const string = validStrings.init[0]
      const mockedReport = {
        data: {
          firmwareVersion: '1.1f'
        },
        input: string,
        type: "initialize"
      }

      const report = extractor.grblInitReport(string)
      expect(report).to.deep.equal(mockedReport)
    })
  })

  describe('#alarmReport()', function() {
    it('should return a correctly formatted report object', function() {
      const string = validStrings.alarm[0]
      const mockedReport = {
        data: {
          code: 9,
          message: 'Homing fail. Could not find limit switch within search distance.'
        },
        input: string,
        type: "alarm"
      }

      const report = extractor.alarmReport(string)
      expect(report).to.deep.equal(mockedReport)
    })

    it('should return a correctly formatted report object', function() {
      const string = validStrings.alarm[2] //ALARM:Hard/soft limit
      const mockedReport = {
        data: {
          message: 'Hard/soft limit'
        },
        input: string,
        type: "alarm"
      }

      const report = extractor.alarmReport(string)
      expect(report).to.deep.equal(mockedReport)
    })
  })

  describe('#buildVersionReport()', function() {
    it('should return a correctly formatted report object', function() {
      const string = validStrings.buildVersion[0]
      const mockedReport = {
        data: {
          firmwareVersion: '1.1f',
          buildDate: "20170131"
        },
        input: string,
        type: "buildVersion"
      }

      const report = extractor.buildVersionReport(string)
      expect(report).to.deep.equal(mockedReport)
    })

    it('should return a correctly formatted report object', function() {
      const string = validStrings.buildVersion[1]
      const mockedReportB = {
        data: {
          firmwareVersion: '1.1e',
          buildDate: "20170131",
          buildString: "My OEM string"
        },
        input: string,
        type: "buildVersion"
      }

      const report = extractor.buildVersionReport(string)
      expect(report).to.deep.equal(mockedReportB)
    })

    it('should return a correctly formatted report object', function() {
      const string = validStrings.buildVersion[2] // [0.9j.20160316:Another OEM string!!]
      const mockedReportB = {
        data: {
          firmwareVersion: '0.9j',
          buildDate: "20160316",
          buildString: "Another OEM string!!"
        },
        input: string,
        type: "buildVersion"
      }

      const report = extractor.buildVersionReport(string)
      expect(report).to.deep.equal(mockedReportB)
    })
  })

  describe('#buildOptionsReport()', function() {
    it('should return a correctly formatted report object', function() {
      const string = validStrings.buildOptions[0]
      const mockedReport = {
        data: {
          options: [
            { code: 'V', message: 'Variable spindle enabled' }
          ],
          extras: [ '15', '128' ]
        },
        input: string,
        type: "buildOptions"
      }

      const report = extractor.buildOptionsReport(string)

      expect(report).to.deep.equal(mockedReport)
    })
  })

  describe('#settingsReport()', function() {
    it('should return a correctly formatted report object', function() {
      const string = validStrings.setting[0]
      const mockedReport = {
        type: "setting",
        data: {
          code: 10,
          value: 255.5,
          setting: "Status report options",
          units: "mask",
          description: "Alters data included in status reports."
        },
        input: string
      }

      const report = extractor.settingsReport(string)
      expect(report).to.deep.equal(mockedReport)
    })

    it('should return a correctly formatted report object', function() {
      const string = validStrings.setting[1]
      const mockedReportB = {
        type: "setting",
        data: {
          code: 23,
          value: 0,
          setting: "Homing direction invert",
          units: "mask",
          description: "Homing searches for a switch in the positive direction. Set axis bit (00000ZYX) to search in negative direction."
        },
        input: string
      }

      const reportB = extractor.settingsReport(string)
      expect(reportB).to.deep.equal(mockedReportB)
     })

    it('should return a correctly formatted report object', function() {
      const string = validStrings.setting[2]
      const mockedReportC = {
        type: "setting",
        data: {
          code: 6,
          value: 1,
          setting: "Invert probe pin",
          units: "boolean",
          description: "Inverts the probe input pin signal."
        },
        input: string
      }

      const reportC = extractor.settingsReport(string)
      expect(reportC).to.deep.equal(mockedReportC)


    })
  })

  // [GC:G0 G54 G17 G21 G90 G94 M5 M9 T0 F0 S0]
  describe('#gcodeStateReport()', function() {
    it('should return a correctly formatted report object', function() {
      const string = validStrings.gcodeState[0]
      const mockedReport = {
        type: "gcodeState",
        data: {
          codes: [
            { code: "G0", name: "Movement", description: "The last movement command" },
            { code: "G54", name: "WCS", description: "Default Work Coordinate System" },
            { code: "G17", name: "Plane", description: "X Y (default)" },
            { code: "G21", name: "Units", description: "Current units" },
            { code: "G90", name: "Distance Mode", description: "Absolute distance mode" },
            { code: "G94", name: "Feed Rate Mode", description: "Units per minute mode" },
            { code: "M5", name: "Spindle", description: "Spindle stopped" },
            { code: "M9", name: "Coolant", description: "Coolant stopped" },
            { code: "T", name: "Tool", description: "The current tool", value: 0 },
            { code: "F", name: "Feed rate", description: "The last feed command", value: 0 },
            { code: "S", name: "RPM", description: "The current spindle speed command", value: 0 },
          ]
        },
        input: string
      }

      const report = extractor.gcodeStateReport(string)
      expect(report).to.deep.equal(mockedReport)
    })

    it('should return a correctly formatted report object for grbl 1.0', function() {
      const string = validStrings.gcodeState[2] //  [G0 G54 G17 G21 G90 G94 M0 M5 M9 T0 F60 S12000]
      const mockedReport = {
        type: "gcodeState",
        data: {
          codes: [
            { code: "G0", name: "Movement", description: "The last movement command" },
            { code: "G54", name: "WCS", description: "Default Work Coordinate System" },
            { code: "G17", name: "Plane", description: "X Y (default)" },
            { code: "G21", name: "Units", description: "Current units" },
            { code: "G90", name: "Distance Mode", description: "Absolute distance mode" },
            { code: "G94", name: "Feed Rate Mode", description: "Units per minute mode" },
            { code: "M0", name: "Suspended", description: "Machine is currently suspended" },
            { code: "M5", name: "Spindle", description: "Spindle stopped" },
            { code: "M9", name: "Coolant", description: "Coolant stopped" },
            { code: "T", name: "Tool", description: "The current tool", value: 0 },
            { code: "F", name: "Feed rate", description: "The last feed command", value: 60 },
            { code: "S", name: "RPM", description: "The current spindle speed command", value: 12000 },
          ]
        },
        input: string
      }

      const report = extractor.gcodeStateReport(string)
      expect(report).to.deep.equal(mockedReport)
    })

    it('should return a correctly formatted report object that has an unknown code', function() {
      const string = validStrings.gcodeState[3] //  [G0 G54 G17 G21 G90 G94 M0 M5 M9 P2 T0 F0 S0]
      const mockedReport = {
        type: "gcodeState",
        data: {
          codes: [
            { code: "G0", name: "Movement", description: "The last movement command" },
            { code: "G54", name: "WCS", description: "Default Work Coordinate System" },
            { code: "G17", name: "Plane", description: "X Y (default)" },
            { code: "G21", name: "Units", description: "Current units" },
            { code: "G90", name: "Distance Mode", description: "Absolute distance mode" },
            { code: "G94", name: "Feed Rate Mode", description: "Units per minute mode" },
            { code: "M0", name: "Suspended", description: "Machine is currently suspended" },
            { code: "M5", name: "Spindle", description: "Spindle stopped" },
            { code: "M9", name: "Coolant", description: "Coolant stopped" },
            { code: "P2", name: "Unknown", description: "Unknown gcode state" },
            { code: "T", name: "Tool", description: "The current tool", value: 0 },
            { code: "F", name: "Feed rate", description: "The last feed command", value: 0 },
            { code: "S", name: "RPM", description: "The current spindle speed command", value: 0 },
          ]
        },
        input: string
      }

      const report = extractor.gcodeStateReport(string)
      expect(report).to.deep.equal(mockedReport)
    })
  })

  // [PRB:0.000,0.000,1.492:1]
  describe('#probeResultReport()', function() {
    it('should return a correctly formatted report object', function() {
      const string = validStrings.probeResult[0]
      const mockedReport = {
        type: "probeResult",
        data: {
          location: {
            x: 0,
            y: 0,
            z: 1.492
          },
          success: true
        },
        input: string
      }

      const report = extractor.probeResultReport(string)
      expect(report).to.deep.equal(mockedReport)
    })

    it('should return a correctly formatted report object', function() {
      const string = validStrings.probeResult[1]  // "[PRB:53.223,0.000,-100.203:0]"
      const mockedReport = {
        type: "probeResult",
        data: {
          location: {
            x: 53.223,
            y: 0,
            z: -100.203
          },
          success: false
        },
        input: string
      }

      const report = extractor.probeResultReport(string)
      expect(report).to.deep.equal(mockedReport)
    })

  })

  // [G28:0.000,0.000,0.000]
  describe('#gcodeSystemReport()', function() {
    it('should return a correctly formatted report object', function() {
      const string = validStrings.gcodeSystem[0] // [G54:0.000,0.000,306.351]
      const mockedReport = {
        type: "gcodeSystem",
        data: {
          code: "G54",
          name: "WCS",
          description: "Default Work Coordinate System",
          coordinates: {
            x: 0,
            y: 0,
            z: 306.351
          }
        },
        input: string
      }

      const report = extractor.gcodeSystemReport(string)
      expect(report).to.deep.equal(mockedReport)
    })

    it('should return a correctly formatted report object', function() {
      const string = validStrings.gcodeSystem[1] // [TLO:0.000]
      const mockedReport = {
        type: "gcodeSystem",
        data: {
          code: "TLO",
          name: "Tool length offset",
          description: "The distance the tool is offset from the current WCS",
          coordinates: {
            z: 120
          }
        },
        input: string
      }

      const report = extractor.gcodeSystemReport(string)
      expect(report).to.deep.equal(mockedReport)

    })
  })

  describe('#echoReport()', function() {
    it('should return a correctly formatted report object', function() {
      const string = validStrings.echo[0] // [echo:G1X0.540Y10.4F100]
      const mockedReport = {
        type: "echoMessage",
        data: {
          message: "G1X0.540Y10.4F100"
        },
        input: string
      }

      const report = extractor.echoReport(string)
      expect(report).to.deep.equal(mockedReport)
    })
  })

  describe('#startupLineReport()', function() {
    it('should return a correctly formatted report object', function() {
      const string = validStrings.startupLine[0] // >G54G20:ok
      const mockedReport = {
        type: "gcodeStartup",
        data: {
          line: "G54G20",
          success: true
        },
        input: string
      }

      const report = extractor.startupLineReport(string)
      expect(report).to.deep.equal(mockedReport)
    })
  })

  describe('#successReport()', function() {
    it('should return a correctly formatted report object', function() {
      const string = validStrings.success[0] // ok
      const mockedReport = {
        type: "success",
        data: {
          success: true
        },
        input: string
      }

      const report = extractor.successReport(string)
      expect(report).to.deep.equal(mockedReport)
    })
  })

  describe('#feedbackMessageReport()', function() {
    it('should return a correctly formatted report object', function() {
      const string = validStrings.feedbackMessage[0] // [MSG:‘$H’|’$X’ to unlock]
      const mockedReport = {
        type: "feedbackMessage",
        data: {
          message: "‘$H’|’$X’ to unlock"
        },
        input: string
      }

      const report = extractor.feedbackMessageReport(string)
      expect(report).to.deep.equal(mockedReport)
    })

    it('should return a correctly formatted report object', function() {
      const string = validStrings.feedbackMessage[3] // [Reset to continue]
      const mockedReport = {
        type: "feedbackMessage",
        data: {
          message: "Reset to continue"
        },
        input: string
      }

      const report = extractor.feedbackMessageReport(string)
      expect(report).to.deep.equal(mockedReport)
    })
  })
})
