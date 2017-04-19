var Extractor = require('../../lib/extractor')
var expect = require('chai').expect
var validStrings = require('../spec_constants').validStrings

describe('Extractor', function() {
  before(function() {
    extractor = new Extractor()
  })

  describe('#errorReport()', function() {
    it('should return a correctly formatted report object', function() {
      var mockedReport = {
        data: {
          code: "20",
          message: "Unsupported or invalid g-code command found in block."
        },
        input: validStrings.validError,
        type: "error"
      }

      var report = extractor.errorReport(validStrings.validError)

      expect(report).to.deep.equal(mockedReport)
    })
  })

  describe('#grblInitReport()', function() {
    it('should return a correctly formatted report object', function() {
      var mockedReport = {
        data: {
          firmwareVersion: 'Grbl 1.1f'
        },
        input: validStrings.validInitialization,
        type: "initialize"
      }

      var report = extractor.grblInitReport(validStrings.validInitialization)

      expect(report).to.deep.equal(mockedReport)
    })
  })

  describe('#alarmReport()', function() {
    it('should return a correctly formatted report object', function() {
      var mockedReport = {
        data: {
          code: 9,
          message: 'Homing fail. Could not find limit switch within search distance.'
        },
        input: validStrings.validAlarm,
        type: "alarm"
      }

      var report = extractor.alarmReport(validStrings.validAlarm)

      expect(report).to.deep.equal(mockedReport)
    })
  })

  describe('#buildVersionReport()', function() {
    it('should return a correctly formatted report object', function() {
      var mockedReport = {
        data: {
          firmwareVersion: '1.1f.20170131'
        },
        input: validStrings.validBuildVersion,
        type: "buildVersion"

      }

      var report = extractor.buildVersionReport(validStrings.validBuildVersion)
      expect(report).to.deep.equal(mockedReport)

      var mockedReportB = {
        data: {
          firmwareVersion: '1.1e.20170131',
          buildString: "My OEM string"
        },
        input: validStrings.validBuildVersionB,
        type: "buildVersion"
      }

      var report = extractor.buildVersionReport(validStrings.validBuildVersionB)
      expect(report).to.deep.equal(mockedReportB)
    })
  })

  describe('#buildOptionsReport()', function() {
    it('should return a correctly formatted report object', function() {
      var mockedReport = {
        data: {
          options: [
            { code: 'V', message: 'Variable spindle enabled' }
          ],
          extras: [ '15', '128' ]
        },
        input: validStrings.validBuildOptions,
        type: "buildOptions"
      }

      var report = extractor.buildOptionsReport(validStrings.validBuildOptions)

      expect(report).to.deep.equal(mockedReport)
    })
  })

  describe('#settingsReport()', function() {
    it('should return a correctly formatted report object', function() {
      var mockedReport = {
        type: "setting",
        data: {
          code: "10",
          value: "255.5",
          setting: "Status report options",
          units: "mask",
          description: "Alters data included in status reports."
        },
        input: validStrings.validSetting
      }

      var report = extractor.settingsReport(validStrings.validSetting)
      expect(report).to.deep.equal(mockedReport)

      var mockedReportB = {
        type: "setting",
        data: {
          code: "6",
          value: "1",
          setting: "Invert probe pin",
          units: "boolean",
          description: "Inverts the probe input pin signal."
        },
        input: validStrings.validSettingB
      }

      var reportB = extractor.settingsReport(validStrings.validSettingB)
      expect(reportB).to.deep.equal(mockedReportB)

    })
  })

  // [GC:G0 G54 G17 G21 G90 G94 M5 M9 T0 F0 S0]
  describe('#gcodeStateReport()', function() {
    it('should return a correctly formatted report object', function() {
      var mockedReport = {
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
            { code: "T0", name: "Tool", description: "The current tool" },
            { code: "F0", name: "Feed rate", description: "The last feed command" },
            { code: "S0", name: "RPM", description: "The current spindle speed command" },
          ]
        },
        input: validStrings.validGcodeState
      }

      var report = extractor.gcodeStateReport(validStrings.validGcodeState)
      expect(report).to.deep.equal(mockedReport)

    })
  })
})
