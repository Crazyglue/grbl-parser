var expect = require('chai').expect
var _ = require("lodash")
var sinon = require("sinon")

var Extractor = require('../lib/extractor')
var Parser = require('../lib/parser')
var validStrings = require('./spec_constants').validStrings

describe('EventDispatcher', function() {
  describe('#addListener()', function() {
    it("calls the callbacks when a message is dispatched", function() {
      var eventDispatcher = new EventDispatcher()
      var spy = sinon.spy()

      eventDispatcher.addListener("status", spy)
      eventDispatcher.dispatch("status")
      expect(spy.calledOnce).to.be.true
    })
  })

  describe('#removeListener()', function() {
    it("does not call the callbacks when a message is dispatched", function() {
      var eventDispatcher = new EventDispatcher()
      var spy = sinon.spy()

      eventDispatcher.addListener("status", spy)
      eventDispatcher.removeListener("status", spy)
      eventDispatcher.dispatch("status")
      expect(spy.calledOnce).to.be.false
    })

    it("does not call the removed callback when a message registered for all message types is dispatched", function() {
      var eventDispatcher = new EventDispatcher()
      var spy = sinon.spy()

      eventDispatcher.addToAllListeners(spy)
      eventDispatcher.removeListener("status", spy)
      eventDispatcher.dispatch("status")
      expect(spy.calledOnce).to.be.false
    })
  })

  describe('#addToAllListeners()', function() {
    it("calls the callback when dispatching a single message type", function() {
      var eventDispatcher = new EventDispatcher()
      var spy = sinon.spy()

      eventDispatcher.addToAllListeners(spy)
      eventDispatcher.dispatch("status")
      expect(spy.calledOnce).to.be.true
    })

    it("calls the callback when dispatching multiple message types", function() {
      var eventDispatcher = new EventDispatcher()
      var spy = sinon.spy()

      eventDispatcher.addToAllListeners(spy)
      eventDispatcher.dispatch("status")
      eventDispatcher.dispatch("initialize")
      eventDispatcher.dispatch("alarm")
      expect(spy.calledThrice).to.be.true
    })
  })
})
