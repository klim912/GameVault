import { describe, it, expect } from 'vitest';
import { getGameImage } from '../gameUtils';

describe('Game Utils - Обробка зображень', () => {
  it('повертає оригінальне посилання, якщо воно коректне', () => {
    expect(getGameImage('http://example.com/img.jpg')).toBe('http://example.com/img.jpg');
  });

  it('повертає заглушку, якщо посилання null', () => {
    expect(getGameImage(null)).toBe('/assets/default-placeholder.png');
  });

  it('повертає заглушку, якщо посилання порожнє', () => {
    expect(getGameImage('')).toBe('/assets/default-placeholder.png');
  });
});