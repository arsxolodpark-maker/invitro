import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('проверены активные и будущие модули, GOVIN v0.5.9 и инженерная диагностика', async ({ page }) => {
  for (const moduleName of ['ОМС / лимиты', 'Маркетплейс', 'Покрытие', 'Платформа']) {
    await expect(page.getByRole('button', { name: new RegExp(`^${moduleName}`) })).toBeDisabled();
  }

  await page.getByRole('button', { name: 'Проверка направления', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Проверка направления и маппинга' })).toBeVisible();
  await expect(page.getByText('Получение услуг → чекин → доставка результатов')).toHaveCount(0);

  await page.getByRole('button', { name: 'Проверить направление', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText('Выберите интеграцию.');

  await page.getByLabel('Интеграция').selectOption('Нетрика');
  await expect(page.getByLabel('Номер направления / штрихкод')).toBeFocused();
  await page.getByRole('button', { name: 'Проверить направление', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText('Введите номер направления или штрихкод.');

  await page.getByLabel('Номер направления / штрихкод').fill('1236514265');
  await page.getByRole('button', { name: 'Проверить направление', exact: true }).click();
  await expect(page.getByText('DIR-DEMO-001')).toBeVisible();
  await expect(page.getByRole('region', { name: 'Данные направления' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Этапы проверки' }).getByRole('button')).toHaveCount(3);
  await expect(page.getByText('Сводка маппинга')).toBeVisible();

  await page.getByLabel('Интеграция').selectOption('Брегис');
  await page.getByLabel('Номер направления / штрихкод').fill('3236514265');
  await page.getByRole('button', { name: 'Проверить направление', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Нечекин / нет маппинга услуги' })).toBeVisible();
  await page.getByRole('region', { name: 'Этапы проверки' }).getByRole('button', { name: /Этап 2.*Чекин/ }).click();
  await expect(page.getByText('Нечекин вызван отсутствующим маппингом услуги.')).toBeVisible();
  await expect(page.getByText(/ручное лабораторное исполнение/).first()).toBeVisible();
  await expect(page.getByText(/биоматериал/i)).toHaveCount(0);

  await page.getByRole('button', { name: 'Инженер ГСТИ', exact: true }).click();
  await page.getByText('PRIIZ-000245', { exact: true }).click();
  await page.getByRole('button', { name: 'Диагностика · DEMO' }).click();
  await expect(page.getByText('Integration Console')).toBeVisible();
  await expect(page.getByText('ИНЗ', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Закрыть консоль' }).click();
  await expect(page.getByText('Integration Console')).toHaveCount(0);
});

test('валидация активации и входа Инициатора блокирует пустые/короткие значения', async ({ page }) => {
  await page.getByRole('button', { name: 'Инициаторы', exact: true }).click();
  await page.getByRole('button', { name: 'Добавить инициатора' }).click();
  await page.getByRole('button', { name: 'Создать приглашение' }).click();
  await page.getByRole('button', { name: 'Инициатор', exact: true }).click();
  await page.getByLabel('Пароль для активации').fill('123');
  await page.getByRole('button', { name: 'Активировать аккаунт' }).click();
  await expect(page.getByRole('alert')).toHaveText('Пароль должен содержать не менее 8 символов.');
  await page.getByLabel('Пароль для активации').fill('DemoPassword!1');
  await page.getByRole('button', { name: 'Активировать аккаунт' }).click();
  await page.getByLabel('Пароль').fill('');
  await page.getByRole('button', { name: 'Войти', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText('Введите пароль.');
});

test('глобальный сброс возвращает измененное обращение в исходное DEMO-состояние', async ({ page }) => {
  await page.getByRole('button', { name: 'Инженер ГСТИ', exact: true }).click();
  await page.getByText('PRIIZ-000245', { exact: true }).click();
  await page.getByRole('button', { name: 'В работе', exact: true }).click();
  await expect(page.getByText('В работе', { exact: true }).first()).toBeVisible();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Сбросить DEMO-данные' }).click();
  await expect(page.getByText('Рабочий портал ДКП')).toBeVisible();
  await page.getByText('PRIIZ-000245', { exact: true }).click();
  await expect(page.getByText('Новое', { exact: true }).first()).toBeVisible();
});