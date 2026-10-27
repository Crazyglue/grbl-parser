import { describe, it, expect, vi } from 'vitest'
import { EventDispatcher } from '../dist/index.js'
import { validStrings } from './spec_constants.js'

describe('EventDispatcher', function() {
  describe('#addListener()', function() {
    it("calls the callbacks when a message is dispatched", function() {
      var eventDispatcher = new EventDispatcher()
      var spy = vi.fn()

      eventDispatcher.addListener("status", spy)
      eventDispatcher.dispatch("status")
      expect(spy).to.have.been.calledOnce
    })
  })

  describe('#removeListener()', function() {
    it("does not call the callbacks when a message is dispatched", function() {
      var eventDispatcher = new EventDispatcher()
      var spy = vi.fn()

      eventDispatcher.addListener("status", spy)
      eventDispatcher.removeListener("status", spy)
      eventDispatcher.dispatch("status")
      expect(spy).not.have.been.calledOnce
    })

    it("does not call the removed callback when a message registered for all message types is dispatched", function() {
      var eventDispatcher = new EventDispatcher()
      var spy = vi.fn()

      eventDispatcher.addToAllListeners(spy)
      eventDispatcher.removeListener("status", spy)
      eventDispatcher.dispatch("status")
      expect(spy).not.have.been.calledOnce
    })
  })

  describe('#addToAllListeners()', function() {
    it("calls the callback when dispatching a single message type", function() {
      var eventDispatcher = new EventDispatcher()
      var spy = vi.fn()

      eventDispatcher.addToAllListeners(spy)
      eventDispatcher.dispatch("status")
      expect(spy).to.have.been.calledOnce
    })

    it("calls the callback when dispatching multiple message types", function() {
      var eventDispatcher = new EventDispatcher()
      var spy = vi.fn()

      eventDispatcher.addToAllListeners(spy)
      eventDispatcher.dispatch("status")
      eventDispatcher.dispatch("initialize")
      eventDispatcher.dispatch("alarm")
      expect(spy).to.have.been.calledThrice
    })
  })
})
