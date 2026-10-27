import { describe, it, expect, vi } from 'vitest'
import { EventDispatcher } from '../dist/index.js'
import { validStrings } from './spec_constants.js'

describe('EventDispatcher', () => {
  describe('#addListener()', () => {
    it("calls the callbacks when a message is dispatched", () => {
      const eventDispatcher = new EventDispatcher()
      const spy = vi.fn()

      eventDispatcher.addListener("status", spy)
      eventDispatcher.dispatch("status", undefined as never)
      expect(spy).to.have.been.calledOnce
    })
  })

  describe('#removeListener()', () => {
    it("does not call the callbacks when a message is dispatched", () => {
      const eventDispatcher = new EventDispatcher()
      const spy = vi.fn()

      eventDispatcher.addListener("status", spy)
      eventDispatcher.removeListener("status", spy)
      eventDispatcher.dispatch("status", undefined as never)
      expect(spy).not.have.been.calledOnce
    })

    it("does not call the removed callback when a message registered for all message types is dispatched", () => {
      const eventDispatcher = new EventDispatcher()
      const spy = vi.fn()

      eventDispatcher.addToAllListeners(spy)
      eventDispatcher.removeListener("status", spy)
      eventDispatcher.dispatch("status", undefined as never)
      expect(spy).not.have.been.calledOnce
    })
  })

  describe('#addToAllListeners()', () => {
    it("calls the callback when dispatching a single message type", () => {
      const eventDispatcher = new EventDispatcher()
      const spy = vi.fn()

      eventDispatcher.addToAllListeners(spy)
      eventDispatcher.dispatch("status", undefined as never)
      expect(spy).to.have.been.calledOnce
    })

    it("calls the callback when dispatching multiple message types", () => {
      const eventDispatcher = new EventDispatcher()
      const spy = vi.fn()

      eventDispatcher.addToAllListeners(spy)
      eventDispatcher.dispatch("status", undefined as never)
      eventDispatcher.dispatch("initialize", undefined as never)
      eventDispatcher.dispatch("alarm", undefined as never)
      expect(spy).to.have.been.calledThrice
    })
  })
})
