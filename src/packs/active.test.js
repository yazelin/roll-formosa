import { describe, it, expect } from 'vitest';
import { CITIES, DEFAULT_CITY, resolveCityId } from './manifest.js';

describe('city manifest', () => {
  it('lists taipei + kaohsiung as ready', () => {
    const ready = CITIES.filter((c) => c.status === 'ready').map((c) => c.id);
    expect(ready).toContain('taipei');
    expect(ready).toContain('kaohsiung');
  });
  it('resolveCityId defaults to taipei when nothing is set', () => {
    expect(resolveCityId()).toBe(DEFAULT_CITY);
  });
});
