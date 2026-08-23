import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole('button', { name: 'Проверка направления', exact: true }).click();
  await page.getByRole('button', { name: /Демо-сценарии/ }).click();
});

test('GOVIN S2: отсутствующий ИНЗ не подменяется DEMO-значением в ПРИИЗ', async ({ page }) => {
  await page.getByRole('button', { name: /S2 · Нет маппинга услуги/ }).click();
  await expect(page.getByText('Нет маппинга услуги').first()).toBeVisible();
  await page.getByRole('button', { name: 'Создать инцидент в ПРИИЗ' }).click();

  await expect(page.getByText('Данные перенесены из «Проверки направления».')).toBeVisible();
  await expect(page.getByLabel('ИНЗ / номер заявки *')).toHaveValue('');
  await expect(page.getByLabel('Клиент *')).toHaveValue('Демо-клиент 2');
  await expect(page.getByLabel('Вендор / интеграция')).toHaveValue('Адыгея');
});

test('GOVIN S5: не найдено можно эскалировать без вымышленных клиента и ИНЗ', async ({ page }) => {
  await page.getByRole('button', { name: /S5 · Не найдено/ }).click();
  await expect(page.getByRole('heading', { name: 'Направление не найдено' })).toBeVisible();
  await page.getByRole('button', { name: 'Создать инцидент в ПРИИЗ' }).click();

  await expect(page.getByText('Данные перенесены из «Проверки направления».')).toBeVisible();
  await expect(page.getByLabel('Клиент *')).toHaveValue('');
  await expect(page.getByLabel('Код клиента *')).toHaveValue('');
  await expect(page.getByLabel('ЛПУ / подразделение')).toHaveValue('');
  await expect(page.getByLabel('ИНЗ / номер заявки *')).toHaveValue('');
  await expect(page.getByLabel('Вендор / интеграция')).toHaveValue('Нетрика');
  await expect(page.getByLabel('Описание проблемы *')).toHaveValue(/9999999999/);
  await expect(page.getByLabel('Описание проблемы *')).toHaveValue(/техническая поддержка \/ ГСТИ/i);
});