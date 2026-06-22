/**
 * @file locale.test.js — TDD for the zh-TW locale t() lookup.
 *
 * Pure logic — no DOM, no Three.js. Tests:
 *   1. String keys return the zh-TW string.
 *   2. Function keys interpolate positional args correctly.
 *   3. Missing keys return visible fallback '⚠[key]' (no crash).
 *   4. fmt() returns a string (Intl or fallback).
 */

import { describe, it, expect } from 'vitest';
import { t, fmt } from './locale.js';

describe('taipei locale t()', () => {
  it('returns zh-TW string for a string key', () => {
    expect(t('hud.rareFound')).toBe('發現稀有！+5000');
    expect(t('hud.goalCall')).toBe('林百貨在呼喚你…！');
    expect(t('hud.goalGuide')).toBe('朝林百貨前進！');
  });

  it('hud.landmark interpolates landmark name', () => {
    expect(t('hud.landmark', '赤崁樓')).toBe('「赤崁樓」捲進來了！');
    expect(t('hud.landmark', '孔廟')).toBe('「孔廟」捲進來了！');
  });

  it('hud.collect interpolates found/total', () => {
    expect(t('hud.collect', 3, 13)).toBe('收藏 3/13');
    expect(t('hud.collect', 0, 13)).toBe('收藏 0/13');
  });

  it('screens.shareText interpolates all fields', () => {
    const result = t('screens.shareText', '02:30.0', 'A', '12,345', 5, 13);
    expect(result).toContain('台南捲完了');
    expect(result).toContain('02:30.0');
    expect(result).toContain('RANK A');
    expect(result).toContain('5/13');
  });

  it('returns visible fallback for missing key (no throw)', () => {
    expect(t('nonexistent.key')).toBe('⚠[nonexistent.key]');
    expect(t('')).toBe('⚠[]');
  });

  it('title keys present', () => {
    expect(t('title.start')).toContain('START');
    expect(t('title.subtitle')).toContain('台南');
  });

  it('win overlay keys present', () => {
    expect(t('win.title')).toContain('台南');
    expect(t('win.postX')).toContain('POST');
    expect(t('win.rollAgain')).toContain('再來');
  });

  it('donack toggle keys present', () => {
    expect(t('donack.on')).toContain('ON');
    expect(t('donack.off')).toContain('OFF');
  });
});

describe('taipei locale fmt()', () => {
  it('returns a string for any number', () => {
    expect(typeof fmt(12345)).toBe('string');
    expect(typeof fmt(0)).toBe('string');
  });

  it('string contains the digits', () => {
    const s = fmt(12345);
    // Allow grouping separators but must contain the digits
    expect(s.replace(/[^0-9]/g, '')).toBe('12345');
  });
});
