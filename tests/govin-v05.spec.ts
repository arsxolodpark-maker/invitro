import { test, expect, Page } from '@playwright/test';

async function openGovin(page: Page) {
  await page.goto('./');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole('button', { name: 'Проверка направления', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Проверка направления и маппинга' })).toBeVisible();
}

async function searchDirection(page: Page, integration: 'Нетрика' | 'Адыгея' | 'Брегис', barcode: string) {
  await page.getByLabel('Интеграция').selectOption(integration);
  await page.getByLabel('Номер направления / штрихкод').fill(barcode);
  await page.getByRole('button', { name: 'Проверить направление', exact: true }).click();
}

async function openDetails(page: Page) {
  await page.getByRole('button', { name: /Показать детали проверки/ }).click();
  await expect(page.getByRole('region', { name: 'Детали проверки' })).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await openGovin(page);
});

test('GOVIN v0.6.0: поиск простой, результат и технические детали до проверки отсутствуют', async ({ page }) => {
  await expect(page.getByLabel('Интеграция')).toBeVisible();
  await expect(page.getByLabel('Номер направления / штрихкод')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Проверить направление', exact: true })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Итог и следующее действие' })).toHaveCount(0);
  await expect(page.getByRole('region', { name: 'Детали проверки' })).toHaveCount(0);
  await expect(page.getByRole('region', { name: 'Этапы проверки' })).toHaveCount(0);

  await page.getByRole('button', { name: 'Проверить направление', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText('Выберите интеграцию.');
  await expect(page.getByLabel('Интеграция')).toBeFocused();

  await page.getByLabel('Интеграция').selectOption('Брегис');
  await expect(page.getByLabel('Номер направления / штрихкод')).toBeFocused();
  await page.getByRole('button', { name: 'Проверить направление', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText('Введите номер направления или штрихкод.');
});

test('S1: успех сразу говорит, что делать не нужно; диагностика скрыта', async ({ page }) => {
  await searchDirection(page, 'Нетрика', '1236514265');
  const outcome = page.getByRole('region', { name: 'Итог и следующее действие' });
  await expect(outcome.getByRole('heading', { name: 'С направлением всё в порядке' })).toBeVisible();
  await expect(outcome.getByText('Создание, чекин и доставка результатов прошли контроль.')).toBeVisible();
  await expect(outcome.getByText(/Ничего делать не нужно/)).toBeVisible();
  await expect(outcome.getByRole('button', { name: /Проверить другое направление/ })).toBeVisible();
  await expect(outcome.getByRole('button', { name: /Показать детали проверки/ })).toBeVisible();
  await expect(page.getByText('Сводка маппинга')).toHaveCount(0);
  await expect(page.getByRole('region', { name: 'Данные направления' })).toHaveCount(0);

  const mainAction = outcome.getByText(/Ничего делать не нужно/);
  const fontSize = await mainAction.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(fontSize).toBeGreaterThanOrEqual(18);

  await openDetails(page);
  await expect(page.getByRole('region', { name: 'Этапы проверки' })).toBeVisible();
  await expect(page.getByText('Доставка результатов', { exact: true })).toBeVisible();
  await expect(page.getByText('Все тесты сопоставлены, результаты доставлены.')).toBeVisible();
  await page.getByRole('button', { name: /Показать маппинг/ }).click();
  await expect(page.getByText('NMU-T02')).toBeVisible();
});

test('S2: до чекина сразу видны причина, действие и CTA ПРИИЗ; детали вторичны', async ({ page }) => {
  await searchDirection(page, 'Адыгея', '2236514265');
  const outcome = page.getByRole('region', { name: 'Итог и следующее действие' });
  await expect(outcome.getByRole('heading', { name: 'Нет маппинга услуги' })).toBeVisible();
  await expect(outcome.getByText(/Проблемный этап: Получение услуг \/ создание направления/)).toBeVisible();
  await expect(outcome.getByText(/Исправить маппинг до чекина/)).toBeVisible();
  await expect(outcome.getByText(/Маршрут: Сопровождение маппинга/)).toBeVisible();
  await expect(outcome.getByRole('button', { name: 'Создать обращение в ПРИИЗ' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Этапы проверки' })).toHaveCount(0);

  await openDetails(page);
  const stages = page.getByRole('region', { name: 'Этапы проверки' });
  await expect(stages.getByRole('button', { name: /Этап 1.*Получение услуг/ })).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText('Для одной услуги отсутствует маппинг.')).toBeVisible();
  await page.getByRole('button', { name: /Показать маппинг/ }).click();
  await expect(page.getByText('Нет маппинга', { exact: true }).first()).toBeVisible();

  await outcome.getByRole('button', { name: 'Создать обращение в ПРИИЗ' }).click();
  await expect(page.getByRole('heading', { name: 'Ошибка маппинга услуги' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'ИНЗ / номер заявки', exact: true })).toHaveValue('');
});

test('S3: нечекин сразу ведёт к исправлению маппинга и ручному исполнению', async ({ page }) => {
  await searchDirection(page, 'Брегис', '3236514265');
  const outcome = page.getByRole('region', { name: 'Итог и следующее действие' });
  await expect(outcome.getByRole('heading', { name: 'Нечекин / нет маппинга услуги' })).toBeVisible();
  await expect(outcome.getByText(/Проблемный этап: Чекин/)).toBeVisible();
  await expect(outcome.getByText(/Исправить маппинг услуги и направить заявку на ручное лабораторное исполнение/)).toBeVisible();
  await expect(outcome.getByRole('button', { name: 'Создать обращение в ПРИИЗ' })).toBeVisible();
  await expect(page.getByText(/биоматериал/i)).toHaveCount(0);

  await openDetails(page);
  const stage2 = page.getByRole('region', { name: 'Этапы проверки' }).getByRole('button', { name: /Этап 2.*Чекин/ });
  await expect(stage2).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText('Нечекин вызван отсутствующим маппингом услуги.')).toBeVisible();
});

test('S4: ошибка доставки сразу говорит про повторную отправку и маршрут', async ({ page }) => {
  await searchDirection(page, 'Нетрика', '4236514265');
  const outcome = page.getByRole('region', { name: 'Итог и следующее действие' });
  await expect(outcome.getByRole('heading', { name: 'Ошибка доставки / нет маппинга теста' })).toBeVisible();
  await expect(outcome.getByText(/Проблемный этап: Доставка результатов/)).toBeVisible();
  await expect(outcome.getByText(/Исправить маппинг теста.*повторно инициировать отправку результата/)).toBeVisible();
  await expect(outcome.getByText(/ГСТИ, если интеграция в поддержке/)).toBeVisible();
  await expect(outcome.getByRole('button', { name: 'Создать обращение в ПРИИЗ' })).toBeVisible();
  await expect(page.getByText('Не доставлены — доставка отменена')).toHaveCount(0);

  await openDetails(page);
  const stage3 = page.getByRole('region', { name: 'Этапы проверки' }).getByRole('button', { name: /Этап 3.*Доставка результатов/ });
  await expect(stage3).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText('Не доставлены — доставка отменена')).toBeVisible();
  await page.getByRole('button', { name: /Показать маппинг/ }).click();
  await expect(page.getByText('NMU-T05')).toBeVisible();
});

test('S5: не найдено даёт один понятный путь и не выдумывает данные', async ({ page }) => {
  await searchDirection(page, 'Нетрика', '9999999999');
  const outcome = page.getByRole('region', { name: 'Итог и следующее действие' });
  await expect(outcome.getByRole('heading', { name: 'Направление не найдено' })).toBeVisible();
  await expect(outcome.getByText(/Проверьте номер и интеграцию/)).toBeVisible();
  await expect(outcome.getByRole('button', { name: 'Создать обращение в ПРИИЗ' })).toBeVisible();
  await expect(outcome.getByRole('button', { name: /Проверить другое направление/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Показать детали проверки/ })).toHaveCount(0);

  await outcome.getByRole('button', { name: 'Создать обращение в ПРИИЗ' }).click();
  await expect(page.getByRole('heading', { name: 'Направление не найдено в БД' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Клиент', exact: true })).toHaveValue('');
  await expect(page.getByRole('textbox', { name: 'Код клиента', exact: true })).toHaveValue('');
  await expect(page.getByRole('textbox', { name: 'ЛПУ / подразделение', exact: true })).toHaveValue('');
  await expect(page.getByRole('textbox', { name: 'ИНЗ / номер заявки', exact: true })).toHaveValue('');
  await expect(page.getByRole('textbox', { name: 'Вендор / интеграция', exact: true })).toHaveValue('Нетрика');
});

test('v0.6.0: «Проверить другое направление» возвращает к чистому поиску', async ({ page }) => {
  await searchDirection(page, 'Нетрика', '1236514265');
  await page.getByRole('region', { name: 'Итог и следующее действие' }).getByRole('button', { name: /Проверить другое направление/ }).click();
  await expect(page.getByLabel('Интеграция')).toHaveValue('');
  await expect(page.getByLabel('Номер направления / штрихкод')).toHaveValue('');
  await expect(page.getByRole('region', { name: 'Итог и следующее действие' })).toHaveCount(0);
  await expect(page.getByLabel('Интеграция')).toBeFocused();
});