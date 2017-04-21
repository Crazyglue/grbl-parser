var StatusExtractor = require('../../lib/status_extractor')
var expect = require('chai').expect
var validStrings = require('../spec_constants').validStrings

describe('StatusExtractor', function() {
  before(function() {
    statusExtractor = new StatusExtractor()
  })

  describe('#statusReport()', function() {
    it('should return a correctly formatted report object given valid strings', function() {
      var string = validStrings.status[0]
      var mockedReport = {
        data: {
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
        },
        type: 'status',
        input: string
      }

      var report = statusExtractor.statusReport(string)
      expect(report).to.deep.equal(mockedReport)

    })

    it('should return a correctly formatted report object given valid strings', function() {

      var string = validStrings.status[1]
      var mockedReportB = {
        data: {
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
        },
        type: 'status',
        input: string
      }

      var reportB = statusExtractor.statusReport(string)
      expect(reportB).to.deep.equal(mockedReportB)

    })

    it('should return a correctly formatted report object given valid strings', function() {

      var string = validStrings.status[2]
      var mockedReportC = {
        data: {
          status: {
            state: "Idle"
          }
        },
        type: 'status',
        input: string
      }

      var reportC = statusExtractor.statusReport(string)
      expect(reportC).to.deep.equal(mockedReportC)

    })

    it('should return a correctly formatted report object given valid strings', function() {

      var string = validStrings.status[3]
      var mockedReportD = {
        data: {
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
        },
        type: 'status',
        input: string
      }

      var reportD = statusExtractor.statusReport(string)
      expect(reportD).to.deep.equal(mockedReportD)

    })

    it('should return a correctly formatted report object given valid strings', function() {

      var string = validStrings.status[4] // "<Idle,MPos:50.300,-120.000,0.000,WPos:-10.300,5.230,0.000,Buf:12,RX:101,Lim:010>"
      var mockedReportE = {
        data: {
          status: {
            state: "Idle"
          },
          machinePosition: {
            x: 50.3,
            y: -120,
            z: 0
          },
          workPosition: {
            x: -10.3,
            y: 5.23,
            z: 0
          },
          buffer: {
            availableBlocks: 12,
            availableRXBytes: 101
          },
          pins: [
            { pin: "limit-x", on: false },
            { pin: "limit-y", on: true },
            { pin: "limit-z", on: false }
          ]
        },
        type: 'status',
        input: string // Idle,MPos:50.300,-120.000,0.000,WPos:-10.300,5.230,0.000,Buf:12,RX:101,Lim:010
      }

      var reportE = statusExtractor.statusReport(string)
      expect(reportE).to.deep.equal(mockedReportE)

    })
  })
})
