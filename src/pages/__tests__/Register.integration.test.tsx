// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from '../Register';

// --- MOCKS ---

// 1. Мокаємо AuthContext і створюємо шпигуна (Spy) для функції register
const mockRegister = vi.fn();

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    register: mockRegister, // Spy-об'єкт
    currentUser: null,
  }),
}));

// 2. Мокаємо ReCAPTCHA (зовнішній компонент)
vi.mock('react-google-recaptcha', () => ({
  default: ({ onChange }: any) => (
    <button onClick={() => onChange("fake-token")}>Mock ReCAPTCHA</button>
  ),
}));

// 3. Мокаємо навігацію
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Register Integration Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('успішно викликає метод реєстрації при заповненні форми', async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    // 1. Емуляція введення даних користувачем
    fireEvent.change(screen.getByPlaceholderText(/Введіть ім’я/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText(/Введіть email/i), { target: { value: 'integration@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Введіть пароль'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText(/Повторіть пароль/i), { target: { value: 'password123' } });

    // 2. Емуляція проходження капчі
    fireEvent.click(screen.getByText('Mock ReCAPTCHA'));

    // 3. Емуляція відправки форми (пошук кнопки за роллю)
    const submitBtn = screen.getByRole('button', { name: /Зареєструватися/i });
    fireEvent.click(submitBtn);

    // 4. Перевірка інтеграції (Spy): чи викликалась бізнес-логіка з правильними даними?
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledTimes(1);
      expect(mockRegister).toHaveBeenCalledWith('Test User', 'integration@test.com', 'password123');
    });
  });
});
