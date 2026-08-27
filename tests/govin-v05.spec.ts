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

test.beforeEach(async ({ page }) => {
  await openGovin(page);
});

test('GOVIN v0.5.9: первый экран — простой поиск без псевдошагов и стрелочной цепочки', async ({ page }) => {
  await expect(page.getByText('Проверить направление', { exact: true }).first()).toBeVisible();
  await expect(page.getByLabel('Интеграция')).toBeVisible();
  await expect(page.getByLabel('Номер направления / штрихкод')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Проверить направление', exact: true })).toBeVisible();

  await expect(page.getByText('Получение услуг → чекин → доставка результатов')).toHaveCount(0);
  await expect(page.getByText(/Шаг 1|Шаг 2|Шаг 3/)).toHaveCount(0);
  await expect(page.getByRole('region', { name: 'Этапы проверки' })).toHaveCount(0);

  await page.getByRole('button', { name: 'Проверить направление', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText('Выберите интеграцию.');
  await expect(page.getByLabel('Интеграция')).toBeFocused();

  await page.getByLabel('Интеграция').selectOption('Брегис');
  await expect(page.getByLabel('Номер направления / штрихкод')).toBeFocused();
  await expect(page.getByText(/Введите номер для Брегис/)).toBeVisible();

  await page.getByRole('button', { name: 'Проверить направление', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText('Введите номер направления или штрихкод.');
  await expect(page.getByLabel('Номер направления / штрихкод')).toBeFocused();

  await page.getByLabel('Номер направления / штрихкод').fill('3236514265');
  await page.getByLabel('Номер направления / штрихкод').press('Enter');
  await expect(page.getByRole('heading', { name: 'Нечекин / нет маппинга услуги' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Этапы проверки' })).toBeVisible();
});

test('GOVIN v0.5.9: карточка направления и этапы компактны, детали раскрываются по клику', async ({ page }) => {
  await searchDirection(page, 'Брегис', '3236514265');

  const directionData = page.getByRole('region', { name: 'Данные направления' });
  await expect(directionData).toBeVisible();
  await expect(directionData.getByText('Демо-клиент 3', { exact: false })).toBeVisible();
  await expect(directionData.getByText('942476083', { exact: false })).toBeVisible();
  await expect(directionData.getByText('3236514265', { exact: false })).toBeVisible();

  const stages = page.getByRole('region', { name: 'Этапы проверки' });
  const stage1 = stages.getByRole('button', { name: /Этап 1.*Получение услуг/ });
  const stage2 = stages.getByRole('button', { name: /Этап 2.*Чекин/ });
  const stage3 = stages.getByRole('button', { name: /Этап 3.*Доставка результатов/ });
  await expect(stage1).toBeVisible();
  await expect(stage2).toBeVisible();
  await expect(stage3).toBeVisible();
  await expect(stage2).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByText('Нечекин вызван отсутствующим маппингом услуги.')).toHaveCount(0);

  await stage2.click();
  await expect(stage2).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText('Нечекин вызван отсутствующим маппингом услуги.')).toBeVisible();
  await expect(page.getByText(/Исправить маппинг услуги и направить заявку на ручное лабораторное исполнение/).last()).toBeVisible();

  await stage3.click();
  await expect(stage2).toHaveAttribute('aria-expanded', 'false');
  await expect(stage3).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText('Доставка не началась.')).toBeVisible();
});

test('GOVIN v0.5.9: подсказка ПРИИЗ не перекрывает следующий шаг', async ({ page }) => {
  await searchDirection(page, 'Брегис', '3236514265');
  const priizButton = page.getByRole('button', { name: 'Создать обращение в ПРИИЗ' });
  const width = page.viewportSize()?.width ?? 1280;

  if (width >= 768) {
    await priizButton.hover();
    const hint = page.getByRole('tooltip').filter({ hasText: /Из GOVIN автоматически перенесутся известные данные/ });
    await expect(hint).toBeVisible();
    const [buttonBox, hintBox] = await Promise.all([priizButton.boundingBox(), hint.boundingBox()]);
    expect(buttonBox).not.toBeNull();
    expect(hintBox).not.toBeNull();
    expect(hintBox!.y).toBeGreaterThanOrEqual(buttonBox!.y + buttonBox!.height - 1);
    expect(hintBox!.width).toBeGreaterThan(360);
  } else {
    await expect(page.getByText(/После нажатия:.*Откроется форма ПРИИЗ/i)).toBeVisible();
  }

  await priizButton.click();
  await expect(page.getByRole('button', { name: 'Назад в GOVIN', exact: true })).toBeVisible();
});

test('GOVIN S2: маппинг услуги до чекина создаёт правильный тип обращения без обязательного ИНЗ', async ({ page }) => {
  await searchDirection(page, 'Адыгея', '2236514265');
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
  await searchDirection(page, 'Брегис', '3236514265');
  await expect(page.getByRole('heading', { name: 'Нечекин / нет маппинга услуги' })).toBeVisible();
  await page.getByRole('region', { name: 'Этапы проверки' }).getByRole('button', { name: /Этап 2.*Чекин/ }).click();
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
  await searchDirection(page, 'Нетрика', '4236514265');
  await expect(page.getByText('Доставка отменена', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Не доставлены — доставка отменена')).toBeVisible();
  await page.getByRole('region', { name: 'Этапы проверки' }).getByRole('button', { name: /Этап 3.*Доставка результатов/ }).click();
  await expect(page.getByText(/повторно инициировать отправку результата/i).last()).toBeVisible();
  await expect(page.getByText(/ГСТИ, если интеграция в поддержке/).first()).toBeVisible();

  await page.getByRole('button', { name: 'Создать обращение в ПРИИЗ' }).click();
  await expect(page.getByRole('heading', { name: 'Ошибка доставки результатов' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Описание проблемы *', exact: true })).toHaveValue(/доставка результатов отменена/i);
  await expect(page.getByRole('textbox', { name: 'Описание проблемы *', exact: true })).toHaveValue(/повторно инициировать отправку результата/i);
});

test('GOVIN S5: не найдено можно создать без вымышленных клиента и ИНЗ', async ({ page }) => {
  await searchDirection(page, 'Нетрика', '9999999999');
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
  await expect(page.getByRole('heading', { name: /^PRIIZ-\d{6}$/ })).toBeVisible();
  await expect(page.getByText('Связанный контекст GOVIN', { exact: true })).toBeVisible();
  await expect(page.getByText(/GOVIN → ПРИИЗ/).first()).toBeVisible();
  await expect(page.getByText(/Направление не найдено в БД/).first()).toBeVisible();
});