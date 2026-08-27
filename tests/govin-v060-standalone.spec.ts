import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const scenarios = ['S1', 'S2', 'S3', 'S4', 'S5'] as const;
const standaloneUrl = (scenario: string) => `http://127.0.0.1:3000/invitro/govin-v060/index.html?scenario=${scenario}`;

async function expectNoOverflow(page: import('@playwright/test').Page) {
  const { clientWidth, scrollWidth } = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(scrollWidth, `standalone horizontal overflow: ${scrollWidth} > ${clientWidth}`).toBeLessThanOrEqual(clientWidth + 1);
}

test('standalone GOVIN v0.6.0: S1-S5 exact public page visual and flow gate', async ({ page }, testInfo) => {
  const root = path.join('visual-qa', 'govin-v060', 'standalone', testInfo.project.name);
  fs.mkdirSync(root, { recursive: true });

  for (const scenario of scenarios) {
    await page.goto(standaloneUrl(scenario));
    await expect(page).toHaveTitle('GOVIN-303 · DEMO v0.6.0');
    await expect(page.getByRole('heading', { name: 'Проверка направления и маппинга' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Итог и следующее действие' })).toBeVisible();
    await expectNoOverflow(page);
    await page.screenshot({ path: path.join(root, `${scenario}-outcome.png`), fullPage: true });

    if (scenario !== 'S5') {
      await expect(page.getByRole('region', { name: 'Детали проверки' })).toBeHidden();
      await page.getByRole('button', { name: 'Показать детали проверки' }).click();
      await expect(page.getByRole('region', { name: 'Детали проверки' })).toBeVisible();
      await expectNoOverflow(page);
      await page.screenshot({ path: path.join(root, `${scenario}-details.png`), fullPage: true });
    }
  }
});

test('standalone v0.6.0: outcome-first copy and primary CTA are correct for every scenario', async ({ page }) => {
  const cases = [
    { id: 'S1', title: 'С направлением всё в порядке', action: 'Ничего делать не нужно. Дополнительных действий нет.', cta: 'Проверить другое направление' },
    { id: 'S2', title: 'Нет маппинга услуги', action: /Исправить маппинг до чекина/, cta: 'Создать обращение в ПРИИЗ' },
    { id: 'S3', title: 'Нечекин / нет маппинга услуги', action: /ручное лабораторное исполнение/, cta: 'Создать обращение в ПРИИЗ' },
    { id: 'S4', title: 'Ошибка доставки / нет маппинга теста', action: /повторно инициировать отправку результата/, cta: 'Создать обращение в ПРИИЗ' },
    { id: 'S5', title: 'Направление не найдено', action: /Проверьте номер и интеграцию/, cta: 'Создать обращение в ПРИИЗ' },
  ] as const;

  for (const item of cases) {
    await page.goto(standaloneUrl(item.id));
    const outcome = page.getByRole('region', { name: 'Итог и следующее действие' });
    await expect(outcome.getByRole('heading', { name: item.title })).toBeVisible();
    await expect(outcome.getByText(item.action)).toBeVisible();
    await expect(outcome.getByRole('button', { name: item.cta })).toBeVisible();
  }
});

test('standalone v0.6.0: S3/S4/S5 open correct PRIIZ context without invented data', async ({ page }) => {
  for (const item of [
    { id: 'S3', title: 'Нечекин из-за отсутствующего маппинга услуги', inz: '942476083', vendor: 'Брегис' },
    { id: 'S4', title: 'Ошибка доставки результатов', inz: '942476084', vendor: 'Нетрика' },
    { id: 'S5', title: 'Направление не найдено в БД', inz: '', vendor: 'Нетрика' },
  ] as const) {
    await page.goto(standaloneUrl(item.id));
    await page.getByRole('button', { name: 'Создать обращение в ПРИИЗ' }).click();
    await expect(page.getByRole('heading', { name: item.title })).toBeVisible();
    await expect(page.getByLabel('ИНЗ / номер заявки')).toHaveValue(item.inz);
    await expect(page.getByLabel('Вендор / интеграция')).toHaveValue(item.vendor);
    if (item.id === 'S5') {
      await expect(page.getByLabel('Клиент')).toHaveValue('');
      await expect(page.getByLabel('Код клиента')).toHaveValue('');
      await expect(page.getByLabel('ЛПУ / подразделение')).toHaveValue('');
    }
  }
});