import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with testing-library matchers
expect.extend(matchers);

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock fetch globally
global.fetch = global.fetch || (() => 
  Promise.resolve({ 
    ok: true, 
    json: () => Promise.resolve({}) 
  }) as any
);
