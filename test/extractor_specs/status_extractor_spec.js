var StatusExtractor = require('../../lib/status_extractor')
var expect = require('chai').expect
var validStrings = require('../spec_constants').validStrings

describe('StatusExtractor', function() {
  before(function() {
    statusExtractor = new StatusExtractor()
  })

  describe('#statusReport()', function() {
    it('should return a correctly formatted report object given valid strings', function() {
      var string = validStrings.status[0] // <Hold:0|MPos:0.000,0.000,0.000|Bf:15,128|FS:675.5,24000|Ov:120,100,100|WCO:0.000,-5.200,306.351|A:SFM|Pn:XYZPDHRS>
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
          realtimeFeed: {
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
          },
          pins:[
            { pin: "limit-x", on: true },
            { pin: "limit-y", on: true },
            { pin: "limit-z", on: true },
            { pin: "probe", on: true },
            { pin: "door", on: true },
            { pin: "hold", on: true },
            { pin: "soft-reset", on: true },
            { pin: "cycle-start", on: true },
          ]
        },
        type: 'status',
        input: string
      }

      var report = statusExtractor.statusReport(string)
      expect(report).to.deep.equal(mockedReport)

    })

    it('should return a correctly formatted report object given valid strings', function() {

      var string = validStrings.status[1]
      var mockedReport = {
        data: {
          status: {
            state: "Idle"
          },
          workPosition: {
            x: 0,
            y: 0,
            z: 0
          },
          realtimeFeed: {
            realtimeFeedrate: 0,
            realtimeSpindle: 0
          },
          pins: [
            { pin: "limit-x", on: true },
            { pin: "hold", on: true },
            { pin: "cycle-start", on: true }
          ]
        },
        type: 'status',
        input: string
      }

      var report = statusExtractor.statusReport(string)
      expect(report).to.deep.equal(mockedReport)

    })

    it('should return a correctly formatted report object given valid strings', function() {

      var string = validStrings.status[2]
      var mockedReport = {
        data: {
          status: {
            state: "Idle"
          }
        },
        type: 'status',
        input: string
      }

      var report = statusExtractor.statusReport(string)
      expect(report).to.deep.equal(mockedReport)

    })

    it('should return a correctly formatted report object given valid strings', function() {

      var string = validStrings.status[3]
      var mockedReport = {
        data: {
          status: {
            state: "Run",
          },
          machinePosition: {
            x: 0,
            y: 0,
            z: 0
          },
          realtimeFeed: {
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

      var report = statusExtractor.statusReport(string)
      expect(report).to.deep.equal(mockedReport)

    })

    it('should return a correctly formatted report object given valid strings', function() {

      var string = validStrings.status[4] // "<Idle,MPos:50.300,-120.000,0.000,WPos:-10.300,5.230,0.000,Buf:12,RX:101,Lim:010>"
      var mockedReport = {
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

      var report = statusExtractor.statusReport(string)
      expect(report).to.deep.equal(mockedReport)

    })

    it('should return a correctly formatted report object given valid strings', function() {

      var string = validStrings.status[6] // <Idle,MPos:0.000,0.000,0.000,WPos:0.000,0.000,0.000,Pin:100|1|0100>
      var mockedReport = {
        data: {
          status: {
            state: "Idle"
          },
          machinePosition: {
            x: 0,
            y: 0,
            z: 0
          },
          workPosition: {
            x: 0,
            y: 0,
            z: 0
          },
          pins: [
            { pin: "limit-x", on: true },
            { pin: "limit-y", on: false },
            { pin: "limit-z", on: false },
            { pin: "probe", on: true },
            { pin: "door", on: false },
            { pin: "hold", on: true },
            { pin: "soft-reset", on: false },
            { pin: "cycle-start", on: false },
          ]
        },
        type: 'status',
        input: string
      }

      var report = statusExtractor.statusReport(string)
      expect(report).to.deep.equal(mockedReport)

    })

    it('should return a correctly formatted report object given valid strings', function() {

      var string = validStrings.status[7] // <Idle,MPos:100.000,100.000,100.000,WPos:0.000,0.000,0.000,Pin:|1|>
      var mockedReport = {
        data: {
          status: {
            state: "Idle"
          },
          machinePosition: {
            x: 100,
            y: 100,
            z: 100
          },
          workPosition: {
            x: 0,
            y: 0,
            z: 0
          },
          pins: [
            { pin: "probe", on: true },
          ]
        },
        type: 'status',
        input: string
      }

      var report = statusExtractor.statusReport(string)
      expect(report).to.deep.equal(mockedReport)

    })
  })
})
