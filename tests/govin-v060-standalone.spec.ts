import { test, expect } from '@playwright/test';

const cases = [
  ['S1', 'С направлением всё в порядке', 'DIR-DEMO-001', 'NMU-T01'],
  ['S2', 'Нет маппинга услуги', 'DIR-DEMO-002', 'NMU-2001'],
  ['S3', 'Нечекин / нет маппинга услуги', 'DIR-DEMO-003', 'NMU-3001'],
  ['S4', 'Ошибка доставки / нет маппинга теста', 'DIR-DEMO-004', 'NMU-T05'],
] as const;

for (const [scenario, title, directionId, mappingCode] of cases) {
  test(`Standalone GOVIN ${scenario}: outcome → details → mapping`, async ({ page }) => {
    await page.goto(`./govin-v060/index.html?scenario=${scenario}`);
    await expect(page.getByText('GOVIN-303 · DEMO v0.6.0')).toBeVisible();
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
    await expect(page.getByText('Что делать сейчас')).toBeVisible();
    await expect(page.getByText(directionId)).toHaveCount(0);
    await expect(page.getByText(mappingCode)).toHaveCount(0);

    await page.getByRole('button', { name: 'Показать детали проверки' }).click();
    await expect(page.getByText(directionId)).toBeVisible();
    await expect(page.getByText(mappingCode)).toBeHidden();

    await page.getByRole('button', { name: 'Показать маппинг' }).click();
    await expect(page.getByText(mappingCode)).toBeVisible();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBeFalsy();
  });
}

test('Standalone GOVIN S5: not found → PRIIZ keeps unknown fields empty', async ({ page }) => {
  await page.goto('./govin-v060/index.html?scenario=S5');
  await expect(page.getByRole('heading', { name: 'Направление не найдено' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Показать детали проверки' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Создать обращение в ПРИИЗ', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Клиент', exact: true })).toHaveValue('');
  await expect(page.getByRole('textbox', { name: 'Код клиента', exact: true })).toHaveValue('');
  await expect(page.getByRole('textbox', { name: 'ЛПУ / подразделение', exact: true })).toHaveValue('');
  await expect(page.getByRole('textbox', { name: 'ИНЗ / номер заявки', exact: true })).toHaveValue('');
  await expect(page.getByRole('textbox', { name: 'Вендор / интеграция', exact: true })).toHaveValue('Нетрика');
});
