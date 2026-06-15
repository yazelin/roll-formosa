import { describe, it, expect } from 'vitest';

describe('vitest runner smoke', () => {
  it('executes assertions', () => {
    expect(1 + 1).toBe(2);
  });
});
