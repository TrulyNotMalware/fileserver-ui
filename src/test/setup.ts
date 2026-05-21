import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';

import { cleanup } from '@testing-library/react';

// Vitest does not auto-cleanup RTL roots between tests in run mode.
afterEach(() => {
  cleanup();
});
