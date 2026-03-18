import { vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

// Mock localStorage with proper implementation
const localStorageMock = {
  getItem: vi.fn((key: string) => localStorageMock.store[key] || null),
  setItem: vi.fn((key: string, value: string) => { localStorageMock.store[key] = value }),
  clear: vi.fn(() => { localStorageMock.store = {} }),
  removeItem: vi.fn((key: string) => { delete localStorageMock.store[key] }),
  length: 0,
  key: vi.fn(() => null),
  store: {} as Record<string, string>,
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

// Mock IntersectionObserver
Object.defineProperty(global, 'IntersectionObserver', {
  value: function IntersectionObserver(this: any, callback: IntersectionObserverCallback) {
    this.observe = vi.fn()
    this.disconnect = vi.fn()
    this.unobserve = vi.fn()
    this._callback = callback
  },
  writable: true,
})