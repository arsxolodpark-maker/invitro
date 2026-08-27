import { test, expect, Page } from '@playwright/test';

const cards = [
  {
    key: 'S1', integration: 'Нетрика', barcode: '1236514265',
    title: 'С направлением всё в порядке',
    context: 'Направление создано, чекин пройден, результаты доставлены.',
    now: 'Ничего делать не нужно.',
    action: 'Проверить другое направление', detailId: 'DIR-DEMO-001', mapping: 'NMU-T01',
  },
  {
    key: 'S2', integration: 'Адыгея', barcode: '2236514265',
    title: 'Услуга не сопоставлена',
    context: 'На этапе создания направления для одной услуги отсутствует маппинг.',
    now: 'Создайте обращение в ПРИИЗ на исправление маппинга услуги до чекина.',
    action: 'Создать обращение в ПРИИЗ', detailId: 'DIR-DEMO-002', mapping: 'NMU-2001',
  },
  {
    key: 'S3', integration: 'Брегис', barcode: '3236514265',
    title: 'Направление не прошло чекин',
    context: 'Причина: на чекине отсутствует маппинг услуги.',
    now: 'Создайте обращение в ПРИИЗ: исправить маппинг услуги и передать заявку на ручное лабораторное исполнение.',
    action: 'Создать обращение в ПРИИЗ', detailId: 'DIR-DEMO-003', mapping: 'NMU-3001',
  },
  {
    key: 'S4', integration: 'Нетрика', barcode: '4236514265',
    title: 'Результаты не доставлены',
    context: 'Причина: у одного теста отсутствует маппинг. Доставка результатов отменена.',
    now: 'Создайте обращение в ПРИИЗ на исправление маппинга теста и повторную отправку результата.',
    action: 'Создать обращение в ПРИИЗ', detailId: 'DIR-DEMO-004', mapping: 'NMU-T05',
  },
] as const;

async function openGovin(page: Page) {
  await page.goto('./');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole('button', { name: 'Проверка направления', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Проверка направления и маппинга' })).toBeVisible();
}

for (const card of cards) {
  test(`GOVIN v0.6.1 ${card.key}: ДКП понимает что произошло, что делать и куда нажать`, async ({ page }) => {
    await openGovin(page);
    await page.getByLabel('Интеграция').selectOption(card.integration);
    await page.getByLabel('Номер направления / штрихкод').fill(card.barcode);
    await page.getByRole('button', { name: 'Проверить направление', exact: true }).click();

    await expect(page.getByText('Итог проверки')).toBeVisible();
    await expect(page.getByRole('heading', { name: card.title })).toBeVisible();
    await expect(page.getByText(card.context, { exact: true })).toBeVisible();
    await expect(page.getByText('Что делать сейчас')).toBeVisible();
    await expect(page.getByText(card.now, { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: card.action, exact: true })).toBeVisible();

    await expect(page.getByText(card.detailId)).toHaveCount(0);
    await expect(page.getByText(card.mapping)).toHaveCount(0);

    await page.getByRole('button', { name: 'Показать детали проверки' }).click();
    await expect(page.getByText(card.detailId)).toBeVisible();
    await expect(page.getByText('Что проверяем')).toBeVisible();
    await expect(page.getByText(card.mapping)).toHaveCount(0);

    await page.getByRole('button', { name: 'Показать маппинг' }).click();
    await expect(page.getByText(card.mapping)).toBeVisible();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBeFalsy();
  });
}

test('GOVIN v0.6.1 S5: сначала перепроверка, потом эскалация', async ({ page }) => {
  await openGovin(page);
  await page.getByLabel('Интеграция').selectOption('Нетрика');
  await page.getByLabel('Номер направления / штрихкод').fill('9999999999');
  await page.getByRole('button', { name: 'Проверить направление', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Направление не найдено' })).toBeVisible();
  await expect(page.getByText('GOVIN не нашёл направление 9999999999 в интеграции «Нетрика».', { exact: true })).toBeVisible();
  await expect(page.getByText('Сначала перепроверьте номер направления и выбранную интеграцию.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Исправить номер или интеграцию', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Данные верны — создать обращение', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Показать детали проверки' })).toHaveCount(0);

  await page.getByRole('button', { name: 'Исправить номер или интеграцию', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Направление не найдено' })).toHaveCount(0);
  await expect(page.getByLabel('Номер направления / штрихкод')).toHaveValue('9999999999');

  await page.getByRole('button', { name: 'Проверить направление', exact: true }).click();
  await page.getByRole('button', { name: 'Данные верны — создать обращение', exact: true }).click();
  await expect(page.getByText('Данные перенесены из «Проверки направления».')).toBeVisible();
  await expect(page.getByLabel('Клиент *')).toHaveValue('');
  await expect(page.getByLabel('Код клиента *')).toHaveValue('');
  await expect(page.getByLabel('ЛПУ / подразделение')).toHaveValue('');
  await expect(page.getByLabel('ИНЗ / номер заявки *')).toHaveValue('');
  await expect(page.getByLabel('Вендор / интеграция')).toHaveValue('Нетрика');
  await expect(page.getByLabel('Описание проблемы *')).toHaveValue(/9999999999/);
});

test('GOVIN v0.6.1 S2: отсутствие ИНЗ сохраняется при GOVIN → ПРИИЗ', async ({ page }) => {
  await openGovin(page);
  await page.getByLabel('Интеграция').selectOption('Адыгея');
  await page.getByLabel('Номер направления / штрихкод').fill('2236514265');
  await page.getByRole('button', { name: 'Проверить направление', exact: true }).click();
  await page.getByRole('button', { name: 'Создать обращение в ПРИИЗ', exact: true }).click();
  await expect(page.getByLabel('Клиент *')).toHaveValue('Демо-клиент 2');
  await expect(page.getByLabel('ИНЗ / номер заявки *')).toHaveValue('');
  await expect(page.getByLabel('Вендор / интеграция')).toHaveValue('Адыгея');
});
