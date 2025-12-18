import { Given, When, Then, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser, Page, expect } from '@playwright/test';

// Збільшуємо тайм-аут до 60 секунд (на всяк випадок)
setDefaultTimeout(60 * 1000);

let browser: Browser;
let page: Page;

Before(async () => {
  // headless: false дозволить вам побачити браузер і зрозуміти, що відбувається
  browser = await chromium.launch({ headless: false }); 
  page = await browser.newPage();
});

After(async () => {
  await browser.close();
});

// --- КРОКИ ---

Given('Я відкриваю головну сторінку', async () => {
  await page.goto('http://localhost:5173');
});

// Додаємо паузу, щоб переконатися, що перехід відбувся
Given('Я переходжу на сторінку входу', async () => {
  await page.goto('http://localhost:5173/login');
  // Чекаємо, поки з'явиться інпут. Це критично важливо!
  await page.waitForSelector('input[type="email"]', { state: 'visible' });
});

When('Я вводжу email {string}', async (email: string) => {
  // Шукаємо чітко по атрибуту type="email"
  const emailInput = page.locator('input[type="email"]');
  // Очищаємо поле перед введенням (на всяк випадок)
  await emailInput.clear();
  await emailInput.fill(email);
});

When('Я вводжу пароль {string}', async (password: string) => {
  // Шукаємо чітко по атрибуту type="password"
  const passwordInput = page.locator('input[type="password"]');
  await passwordInput.clear();
  await passwordInput.fill(password);
});

When('Я натискаю кнопку {string}', async (btnText: string) => {
  // Шукаємо кнопку, яка містить цей текст (ігноруємо регістр)
  // Якщо кнопок декілька, беремо першу видиму
  await page.getByRole('button', { name: btnText, exact: false }).first().click();
});

When('Я натискаю на посилання {string}', async (linkText: string) => {
    await page.getByText(linkText).first().click();
  });

Then('Я повинен побачити сторінку входу', async () => {
  await expect(page).toHaveURL(/.*login/);
});

Then('Я повинен побачити заголовок {string}', async (text: string) => {
  await expect(page.getByRole('heading', { name: text })).toBeVisible();
});

Then('Я повинен залишитись на сторінці входу', async () => {
  // Чекаємо 1 секунду, щоб побачити результат
  await page.waitForTimeout(1000);
  await expect(page).toHaveURL(/.*login/);
});

// Кроки, які були "skipped" у вас раніше, теж треба додати (для And)
When('And Я натискаю кнопку "Увійти"', async () => {
    // Дублюємо логіку натискання кнопки
    await page.getByRole('button', { name: /Увійти/i }).first().click();
});