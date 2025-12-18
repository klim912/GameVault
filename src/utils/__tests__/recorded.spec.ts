import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('textbox', { name: 'Пошук' }).click();
  await page.getByRole('link', { name: 'Магазин', exact: true }).click();
  await page.getByText('GAME VAULTМагазинБібліотекаДрузіАкції').click();
  const searchInput = page.getByRole('textbox', { name: 'Пошук' });
await searchInput.fill('Batman');
await searchInput.press('Enter');
});