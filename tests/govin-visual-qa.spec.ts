import { test, expect, Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

type Scenario = {
  id: 'S1' | 'S2' | 'S3' | 'S4' | 'S5';
  integration: 'Нетрика' | 'Адыгея' | 'Брегис';
  barcode: string;
};

const scenarios: Scenario[] = [
  { id: 'S1', integration: 'Нетрика', barcode: '1236514265' },
  { id: 'S2', integration: 'Адыгея', barcode: '2236514265' },
  { id: 'S3', integration: 'Брегис', barcode: '3236514265' },
  { id: 'S4', integration: 'Нетрика', barcode: '4236514265' },
  { id: 'S5', integration: 'Нетрика', barcode: '9999999999' },
];

async function openGovin(page: Page) {
  await page.goto('./');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole('button', { name: 'Проверка направления', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Проверка направления и маппинга' })).toBeVisible();
}

async function search(page: Page, scenario: Scenario) {
  await page.getByLabel('Интеграция').selectOption(scenario.integration);
  await page.getByLabel('Номер направления / штрихкод').fill(scenario.barcode);
  await page.getByRole('button', { name: 'Проверить направление', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Итог и следующее действие' })).toBeVisible();
}

async function expectNoPageOverflow(page: Page) {
  const metrics = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(metrics.scroll, `horizontal overflow: scrollWidth=${metrics.scroll}, viewport=${metrics.viewport}`).toBeLessThanOrEqual(metrics.viewport + 1);
}

async function expectDetailsStayInside(page: Page) {
  const details = page.getByRole('region', { name: 'Детали проверки' });
  const bounds = await details.evaluate((root) => {
    const rootRect = root.getBoundingClientRect();
    const candidates = Array.from(root.querySelectorAll('dd, [id^="stage-detail-"] > div > div'));
    return candidates.map((node) => {
      const rect = node.getBoundingClientRect();
      return { left: rect.left, right: rect.right, rootLeft: rootRect.left, rootRight: rootRect.right };
    });
  });
  for (const box of bounds) {
    expect(box.left).toBeGreaterThanOrEqual(box.rootLeft - 1);
    expect(box.right).toBeLessThanOrEqual(box.rootRight + 1);
  }
}

test('GOVIN v0.6.0: visual QA S1-S5 outcome + details', async ({ page }, testInfo) => {
  const project = testInfo.project.name;
  const root = path.join('visual-qa', 'govin-v060', project);
  fs.mkdirSync(root, { recursive: true });

  await openGovin(page);
  await expectNoPageOverflow(page);

  for (const scenario of scenarios) {
    await search(page, scenario);
    await expectNoPageOverflow(page);
    await page.screenshot({ path: path.join(root, `${scenario.id}-outcome.png`), fullPage: true });

    if (scenario.id !== 'S5') {
      await page.getByRole('button', { name: /Показать детали проверки/ }).click();
      await expect(page.getByRole('region', { name: 'Детали проверки' })).toBeVisible();
      await expectNoPageOverflow(page);
      await expectDetailsStayInside(page);
      await page.screenshot({ path: path.join(root, `${scenario.id}-details.png`), fullPage: true });
    }
  }
});
