import '@testing-library/jest-dom'

// Mock pentru localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
global.localStorage = localStorageMock

// Mock pentru window.alert și window.confirm
global.alert = vi.fn()
global.confirm = vi.fn()

// Mock pentru IntersectionObserver (necesar pentru unele componente)
global.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock pentru fetch
global.fetch = vi.fn()