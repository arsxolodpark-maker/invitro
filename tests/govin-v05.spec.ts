import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole('button', { name: 'Проверка направления', exact: true }).click();
  await page.getByRole('button', { name: /Демо-сценарии/ }).click();
});

test('GOVIN v0.5.4: подсказки следующего шага работают без визуального шума', async ({ page }) => {
  const width = page.viewportSize()?.width ?? 1280;
  const findButton = page.getByRole('button', { name: 'Найти', exact: true });

  if (width >= 768) {
    await findButton.hover();
    await expect(page.getByRole('tooltip').filter({ hasText: /Проверит направление в выбранной интеграции/ })).toBeVisible();
  } else {
    await expect(page.getByText(/После нажатия:.*Проверит направление в выбранной интеграции/i)).toBeVisible();
  }

  await page.getByRole('button', { name: /S3 · Нечекин \/ нет маппинга услуги/ }).click();
  const priizButton = page.getByRole('button', { name: 'Создать обращение в ПРИИЗ' });
  if (width >= 768) {
    await priizButton.hover();
    await expect(page.getByRole('tooltip').filter({ hasText: /Из GOVIN автоматически перенесутся известные данные/ })).toBeVisible();
  } else {
    await expect(page.getByText(/После нажатия:.*Откроется форма ПРИИЗ/i)).toBeVisible();
  }

  await priizButton.click();
  const backButton = page.getByRole('button', { name: 'Назад в GOVIN', exact: true });
  if (width >= 768) {
    await backButton.hover();
    await expect(page.getByRole('tooltip').filter({ hasText: /Вернёт к той же проверке направления/ })).toBeVisible();
  } else {
    await expect(page.getByText(/После нажатия:.*Вернёт к той же проверке направления/i)).toBeVisible();
  }
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

test('GOVIN S3: нечекин из-за отсутствующего маппинга услуги ведёт к ручному лабораторному исполнению', async ({ page }) => {
  await page.getByRole('button', { name: /S3 · Нечекин \/ нет маппинга услуги/ }).click();
  await expect(page.getByRole('heading', { name: 'Нечекин / нет маппинга услуги' })).toBeVisible();
  await expect(page.getByText('Нечекин вызван отсутствующим маппингом услуги.')).toBeVisible();
  await expect(page.getByText(/ручное лабораторное исполнение/).first()).toBeVisible();
  await expect(page.getByText('Нет маппинга', { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/биоматериал/i)).toHaveCount(0);

  await page.getByRole('button', { name: 'Создать обращение в ПРИИЗ' }).click();
  await expect(page.getByRole('heading', { name: 'Нечекин из-за отсутствующего маппинга услуги' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Описание проблемы *', exact: true })).toHaveValue(/отсутствует маппинг услуги/);
  await expect(page.getByRole('textbox', { name: 'Описание проблемы *', exact: true })).not.toHaveValue(/биоматериал/i);
});

test('GOVIN S4: при отсутствии маппинга теста доставка отменена и требуется повторная отправка', async ({ page }) => {
  await page.getByRole('button', { name: /S4 · Ошибка доставки/ }).click();
  await expect(page.getByText('Доставка отменена', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Не доставлены — доставка отменена')).toBeVisible();
  await expect(page.getByText(/повторно инициировать отправку результата/i).first()).toBeVisible();
  await expect(page.getByText(/ГСТИ, если интеграция в поддержке/).first()).toBeVisible();

  await page.getByRole('button', { name: 'Создать обращение в ПРИИЗ' }).click();
  await expect(page.getByRole('heading', { name: 'Ошибка доставки результатов' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Описание проблемы *', exact: true })).toHaveValue(/доставка результатов отменена/i);
  await expect(page.getByRole('textbox', { name: 'Описание проблемы *', exact: true })).toHaveValue(/повторно инициировать отправку результата/i);
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
