import { vi } from 'vitest';

// Mock the logger module
vi.mock('../../lib/logger', () => ({
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}));

// Export the mocked functions for test assertions
export const mockLog = vi.fn();
export const mockWarn = vi.fn();
export const mockError = vi.fn();

// Re-export the mocked logger functions
export { mockLog as log, mockWarn as warn, mockError as error };