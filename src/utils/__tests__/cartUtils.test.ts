import { describe, it, expect } from 'vitest';
import { calculateTotal } from '../cartUtils';

describe('Cart Utils - Розрахунок вартості', () => {
  it('повертає 0 для порожнього кошика', () => {
    expect(calculateTotal([])).toBe(0);
  });

  it('правильно рахує суму товарів', () => {
    const items = [
      { price: 100, quantity: 2 }, // 200
      { price: 50, quantity: 1 }   // 50
    ];
    expect(calculateTotal(items)).toBe(250);
  });
});