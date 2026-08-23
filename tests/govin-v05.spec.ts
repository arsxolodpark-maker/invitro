import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole('button', { name: 'Проверка направления', exact: true }).click();
  await page.getByRole('button', { name: /Демо-сценарии/ }).click();
});

test('GOVIN S2: маппинг услуги до чекина создаёт правильный тип обращения без обязательного ИНЗ', async ({ page }) => {
  await page.getByRole('button', { name: /S2 · Нет маппинга услуги/ }).click();
  await expect(page.getByRole('heading', { name: 'Нет маппинга услуги' })).toBeVisible();
  await expect(page.getByText(/Исправить маппинг до чекина/).first()).toBeVisible();
  await page.getByRole('button', { name: 'Создать обращение в ПРИИЗ' }).click();

  await expect(page.getByRole('heading', { name: 'Ошибка маппинга услуги' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'ИНЗ / номер заявки', exact: true })).toHaveValue('');
  await expect(page.getByRole('textbox', { name: 'Клиент', exact: true })).toHaveValue('Демо-клиент 2');
  await expect(page.getByRole('textbox', { name: 'Вендор / интеграция', exact: true })).toHaveValue('Адыгея');
  await expect(page.getByText(/Получение услуг \/ создание направления/).first()).toBeVisible();

  await page.getByRole('button', { name: 'Создать обращение', exact: true }).click();
  await expect(page.getByText(/GOVIN → ПРИИЗ · Ошибка маппинга услуги/)).toBeVisible();
  await expect(page.getByText('ИНЗ не присвоен / нет данных')).toBeVisible();
});

test('GOVIN S3: нечекин из-за отсутствующего маппинга ведёт к ручному лабораторному исполнению', async ({ page }) => {
  await page.getByRole('button', { name: /S3 · Нечекин \/ нет маппинга/ }).click();
  await expect(page.getByRole('heading', { name: 'Нечекин / нет маппинга биоматериала' })).toBeVisible();
  await expect(page.getByText(/ручное лабораторное исполнение/).first()).toBeVisible();
  await expect(page.getByText('Нет маппинга', { exact: true }).first()).toBeVisible();
});

test('GOVIN S4: при отсутствии маппинга теста доставка отменена и требуется повторная отправка', async ({ page }) => {
  await page.getByRole('button', { name: /S4 · Ошибка доставки/ }).click();
  await expect(page.getByText('Доставка отменена', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Не доставлены — доставка отменена')).toBeVisible();
  await expect(page.getByText(/повторно инициировать отправку результата/i).first()).toBeVisible();
  await expect(page.getByText(/ГСТИ, если интеграция в поддержке/).first()).toBeVisible();
});

test('GOVIN S5: не найдено можно создать без вымышленных клиента и ИНЗ', async ({ page }) => {
  await page.getByRole('button', { name: /S5 · Не найдено/ }).click();
  await expect(page.getByRole('heading', { name: 'Направление не найдено' })).toBeVisible();
  await page.getByRole('button', { name: 'Создать обращение в ПРИИЗ' }).click();

  await expect(page.getByRole('heading', { name: 'Направление не найдено в БД' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Клиент', exact: true })).toHaveValue('');
  await expect(page.getByRole('textbox', { name: 'Код клиента', exact: true })).toHaveValue('');
  await expect(page.getByRole('textbox', { name: 'ЛПУ / подразделение', exact: true })).toHaveValue('');
  await expect(page.getByRole('textbox', { name: 'ИНЗ / номер заявки', exact: true })).toHaveValue('');
  await expect(page.getByRole('textbox', { name: 'Вендор / интеграция', exact: true })).toHaveValue('Нетрика');
  await expect(page.getByRole('textbox', { name: 'Описание проблемы *', exact: true })).toHaveValue(/9999999999/);

  await page.getByRole('button', { name: 'Создать обращение', exact: true }).click();
  await expect(page.getByText(/GOVIN → ПРИИЗ · Направление не найдено в БД/)).toBeVisible();
});
