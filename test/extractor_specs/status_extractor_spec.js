var StatusExtractor = require('../../lib/status_extractor')
var expect = require('chai').expect
var validStrings = require('../spec_constants').validStrings

describe('StatusExtractor', function() {
  before(function() {
    statusExtractor = new StatusExtractor()
  })

  describe('#statusReport()', function() {
    it('should return a correctly formatted report object given valid strings', function() {
      mockedReport = {
        machinePosition: {
          x: 0,
          y: 0,
          z: 0
        },
        buffer: {
          availableBlocks: 15,
          availableRXBytes: 128
        },
        feedSpindle: {
          realtimeFeedrate: 675.5,
          realtimeSpindle: 24000
        },
        workcoordinateOffset: {
          x: 0,
          y: -5.2,
          z: 306.351
        },
        status: {
          code: 0,
          message: "Hold complete. Ready to resume.",
          state: 'Hold'
        },
        override: {
          feeds: 120,
          rapids: 100,
          spindle: 100
        },
        accessories: {
          flood: true,
          mist: true,
          spindleDirection: 'clockwise'
        }
      }

      var report = statusExtractor.statusReport(validStrings.validStatus)
      expect(report).to.deep.equal(mockedReport)

      var mockedReportB = {
        status: {
          state: "Idle"
        },
        workPosition: {
          x: 0,
          y: 0,
          z: 0
        },
        feedSpindle: {
          realtimeFeedrate: 0,
          realtimeSpindle: 0
        }
      }

      var reportB = statusExtractor.statusReport(validStrings.validStatusB)
      expect(reportB).to.deep.equal(mockedReportB)

      var mockedReportC = {
        status: {
          state: "Idle"
        }
      }

      var reportC = statusExtractor.statusReport(validStrings.validStatusC)
      expect(reportC).to.deep.equal(mockedReportC)

      var mockedReportD = {
        status: {
          state: "Run",
        },
        machinePosition: {
          x: 0,
          y: 0,
          z: 0
        },
        feedSpindle: {
          realtimeFeedrate: 112,
          realtimeSpindle: 12000
        },
        override: {
          feeds: 120,
          rapids: 110,
          spindle: 100
        },
        accessories: {
          spindleDirection: "counter-clockwise",
          flood: false,
          mist: false
        }
      }

      var reportD = statusExtractor.statusReport(validStrings.validStatusD)
      expect(reportD).to.deep.equal(mockedReportD)

    })
  })
})
