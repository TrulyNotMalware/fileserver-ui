import { describe, expect, it } from 'vitest';

import { formatAbsoluteTime, formatRelativeTime, formatSize } from './format';

describe('formatSize', () => {
  it('renders dash for null', () => {
    expect(formatSize(null)).toBe('-');
  });
  it('falls back to bytes under 1 KiB', () => {
    expect(formatSize(0)).toBe('0 B');
    expect(formatSize(1023)).toBe('1023 B');
  });
  it('uses KB / MB / GB at each threshold', () => {
    expect(formatSize(1024)).toBe('1.0 KB');
    expect(formatSize(1024 * 1024)).toBe('1.0 MB');
    expect(formatSize(1024 * 1024 * 1024)).toBe('1.0 GB');
  });
});

describe('formatRelativeTime', () => {
  it('handles a few seconds ago', () => {
    const d = new Date(Date.now() - 3 * 1000);
    expect(formatRelativeTime(d)).toMatch(/\d+ seconds ago/);
  });
  it('handles minutes / hours / days', () => {
    const min = new Date(Date.now() - 2 * 60 * 1000);
    expect(formatRelativeTime(min)).toBe('2 minutes ago');
    const hr = new Date(Date.now() - 5 * 60 * 60 * 1000);
    expect(formatRelativeTime(hr)).toBe('5 hours ago');
    const day = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(day)).toBe('3 days ago');
  });
});

describe('formatAbsoluteTime', () => {
  it('returns a non-empty locale string', () => {
    const out = formatAbsoluteTime('2026-05-21T12:34:56Z');
    expect(out.length).toBeGreaterThan(0);
  });
});
