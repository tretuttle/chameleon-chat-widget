import { vi, beforeEach, afterEach } from 'vitest'
import '@testing-library/jest-dom'

// Mock window.confirm
Object.defineProperty(window, 'confirm', {
  writable: true,
  value: vi.fn(() => true)
})

// Mock Element.prototype.scrollIntoView
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  writable: true,
  value: vi.fn()
})

// Enable fake timers
beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  vi.clearAllMocks()
})