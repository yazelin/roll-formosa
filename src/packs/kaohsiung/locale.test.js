/**
 * @file locale.test.js — TDD for the zh-TW locale t() lookup (Kaohsiung pack).
 *
 * Pure logic — no DOM, no Three.js. Tests:
 *   1. String keys return the zh-TW string.
 *   2. Function keys interpolate positional args correctly.
 *   3. Missing keys return visible fallback '⚠[key]' (no crash).
 *   4. fmt() returns a string (Intl or fallback).
 */

import { describe, it, expect } from 'vitest';
import { t, fmt } from './locale.js';

describe('kaohsiung locale t()', () => {
  it('returns zh-TW string for a string key', () => {
    expect(t('hud.rareFound')).toBe('發現稀有！+5000');
    expect(t('hud.goalCall')).toBe('高雄 85 大樓在呼喚你…！');
    expect(t('hud.goalGuide')).toBe('朝高雄 85 大樓前進！');
  });

  it('hud.landmark interpolates landmark name', () => {
    expect(t('hud.landmark', '龍虎塔')).toBe('「龍虎塔」捲進來了！');
    expect(t('hud.landmark', '駁二藝術特區')).toBe('「駁二藝術特區」捲進來了！');
  });

  it('hud.collect interpolates found/total', () => {
    expect(t('hud.collect', 3, 13)).toBe('收藏 3/13');
    expect(t('hud.collect', 0, 13)).toBe('收藏 0/13');
  });

  it('screens.shareText interpolates all fields', () => {
    const result = t('screens.shareText', '02:30.0', 'A', '12,345', 5, 13);
    expect(result).toContain('高雄捲完了');
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
    expect(t('title.subtitle')).toContain('高雄');
  });

  it('win overlay keys present', () => {
    expect(t('win.title')).toContain('高雄');
    expect(t('win.postX')).toContain('POST');
    expect(t('win.rollAgain')).toContain('再來');
  });

  it('donack toggle keys present', () => {
    expect(t('donack.on')).toContain('ON');
    expect(t('donack.off')).toContain('OFF');
  });

  it('no Japanese kana in any locale string', () => {
    const kana = /[぀-ゟ゠-ヿ]/;
    const probes = [
      'hud.rareFound', 'hud.goalCall', 'hud.goalGuide',
      'title.subtitle', 'title.start', 'title.seedLine', 'title.personalBest',
      'win.title', 'win.subtitle', 'win.postX', 'win.rollAgain', 'donack.on', 'donack.off',
    ];
    for (const key of probes) expect(kana.test(t(key)), `key ${key} has kana`).toBe(false);
  });
});

describe('kaohsiung locale fmt()', () => {
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
