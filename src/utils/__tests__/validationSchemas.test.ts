import { describe, it, expect } from 'vitest';
import { registerSchema } from '../validationSchemas';

describe('Validation Schemas - Реєстрація', () => {
  it('помилка, якщо пароль коротший за 6 символів', async () => {
    const data = { password: '123', confirmPassword: '123' };
    await expect(registerSchema.validate(data)).rejects.toThrow('Password too short');
  });

  it('успіх, якщо дані коректні', async () => {
    const data = { password: 'password123', confirmPassword: 'password123' };
    await expect(registerSchema.validate(data)).resolves.toBeTruthy();
  });

  it('помилка, якщо паролі різні', async () => {
    const data = { password: 'pass', confirmPassword: 'word' };
    await expect(registerSchema.validate(data)).rejects.toThrow(); // Будь-яка помилка
  });
});