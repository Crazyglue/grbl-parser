var Parser = require('../lib/parser')
var Extractor = require('../lib/extractor')
var expect = require('chai').expect
var validStrings = require('./spec_constants').validStrings
var sinon = require("sinon")
var _ = require("lodash")

describe('EventDispatcher', function() {
  describe('#addListener()', function() {
    describe("adding listeners", function() {
      it("calls the callbacks when dispatched", function() {
        eventDispatcher = new EventDispatcher()
        spy = sinon.spy()
        spyB = sinon.spy()
        spyC = sinon.spy()
        spyD = sinon.spy()

        eventDispatcher.addListener("status", spy)
        eventDispatcher.addListener("status", spyB)
        eventDispatcher.addListener("status", spyC)
        eventDispatcher.addListener("status", spyD)
        eventDispatcher.dispatch("status")
        expect(spy.called).to.be.true
        expect(spyB.called).to.be.true
        expect(spyC.called).to.be.true
        expect(spyD.called).to.be.true
      })
    })
  })
})
