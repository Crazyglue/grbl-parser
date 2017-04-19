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
})
