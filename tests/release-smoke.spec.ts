import { test, expect, Page } from '@playwright/test';

async function resetBrowserState(page: Page) {
  await page.goto('./');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.getByText('Рабочий портал ДКП')).toBeVisible();
}

async function switchRole(page: Page, role: 'Инициатор' | 'ДКП' | 'Инженер ГСТИ' | 'Project' | 'Администратор') {
  await page.getByRole('button', { name: role, exact: true }).click();
}

test.beforeEach(async ({ page }) => {
  await resetBrowserState(page);
});

test('ДКП: GOVIN v0.6.1 — понятный итог, действие, детали, маппинг и перенос в ПРИИЗ', async ({ page }) => {
  await page.getByRole('button', { name: 'Проверка направления', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Проверка направления и маппинга' })).toBeVisible();
  await expect(page.getByText('Итог проверки')).toHaveCount(0);

  await page.getByLabel('Интеграция').selectOption('Нетрика');
  await page.getByLabel('Номер направления / штрихкод').fill('4236514265');
  await page.getByRole('button', { name: 'Проверить направление', exact: true }).click();

  await expect(page.getByText('Итог проверки')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Результаты не доставлены' })).toBeVisible();
  await expect(page.getByText('Причина: у одного теста отсутствует маппинг. Доставка результатов отменена.', { exact: true })).toBeVisible();
  await expect(page.getByText('Что делать сейчас')).toBeVisible();
  await expect(page.getByText('Создайте обращение в ПРИИЗ на исправление маппинга теста и повторную отправку результата.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Создать обращение в ПРИИЗ', exact: true })).toBeVisible();
  await expect(page.getByText('DIR-DEMO-004')).toHaveCount(0);
  await expect(page.getByText('NMU-T05')).toHaveCount(0);

  await page.getByRole('button', { name: 'Показать детали проверки' }).click();
  await expect(page.getByText('DIR-DEMO-004')).toBeVisible();
  await expect(page.getByText('Действие ДКП')).toBeVisible();
  await expect(page.getByText('NMU-T05')).toHaveCount(0);

  await page.getByRole('button', { name: 'Показать маппинг' }).click();
  await expect(page.getByText('NMU-T05')).toBeVisible();
  await expect(page.getByText('Нет маппинга', { exact: true }).last()).toBeVisible();

  await page.getByRole('button', { name: 'Создать обращение в ПРИИЗ', exact: true }).click();
  await expect(page.getByText('Данные перенесены из «Проверки направления».')).toBeVisible();
  await expect(page.getByLabel('ИНЗ / номер заявки *')).toHaveValue('942476084');
  await expect(page.getByLabel('Вендор / интеграция')).toHaveValue('Нетрика');
  await expect(page.getByLabel('Описание проблемы *')).toHaveValue(/4236514265/);

  await page.getByRole('button', { name: 'Назад к обращениям' }).click();
  await expect(page.getByRole('heading', { name: 'Обращения', exact: true })).toBeVisible();
});

test('PРИИЗ: полный путь ДКП → Инициатор → Инженер → подтверждение → закрытие', async ({ page }) => {
  await page.getByRole('button', { name: 'Инициаторы', exact: true }).click();
  await page.getByRole('button', { name: 'Добавить инициатора' }).click();
  await page.getByRole('button', { name: 'Создать приглашение', exact: true }).click();
  await expect(page.getByText('Приглашение создано.')).toBeVisible();

  await switchRole(page, 'Инициатор');
  await expect(page.getByRole('heading', { name: 'Активация аккаунта' })).toBeVisible();
  await page.getByRole('button', { name: 'Активировать аккаунт' }).click();
  await expect(page.getByRole('heading', { name: 'Вход в ПРИИЗ' })).toBeVisible();
  await page.getByRole('button', { name: 'Войти', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Мои обращения' })).toBeVisible();

  await page.getByRole('button', { name: 'Создать обращение', exact: true }).first().click();
  await expect(page.getByRole('heading', { name: 'Не получен результат' })).toBeVisible();
  await page.getByRole('button', { name: 'Создать обращение', exact: true }).click();
  const incidentId = (await page.locator('h1').filter({ hasText: /^PRIIZ-/ }).textContent())?.trim();
  expect(incidentId).toMatch(/^PRIIZ-\d{6}$/);
  await expect(page.getByText('Новое', { exact: true }).first()).toBeVisible();

  await switchRole(page, 'Инженер ГСТИ');
  await expect(page.getByRole('heading', { name: 'Очередь обращений' })).toBeVisible();
  await page.getByText(incidentId!, { exact: true }).click();
  await page.getByRole('button', { name: 'В работе', exact: true }).click();
  await expect(page.getByText('В работе', { exact: true }).first()).toBeVisible();

  await page.getByPlaceholder('Ответ пользователю или комментарий...').fill('Уточните, пожалуйста, время последней попытки.');
  await page.getByRole('button', { name: 'Отправить комментарий' }).click();
  await expect(page.getByText('Ожидает ответа', { exact: true }).first()).toBeVisible();

  await switchRole(page, 'Инициатор');
  await expect(page.getByRole('heading', { name: 'Мои обращения' })).toBeVisible();
  await page.getByText(incidentId!, { exact: true }).click();
  await page.getByPlaceholder('Добавить комментарий...').fill('Последняя попытка была сегодня в 10:15.');
  await page.getByRole('button', { name: 'Отправить комментарий' }).click();
  await expect(page.getByText('В работе', { exact: true }).first()).toBeVisible();

  await switchRole(page, 'Инженер ГСТИ');
  await page.getByText(incidentId!, { exact: true }).click();
  await page.getByRole('button', { name: 'Выполнено', exact: true }).click();
  await expect(page.getByText('Ожидается подтверждение результата Инициатором.')).toBeVisible();

  await switchRole(page, 'Инициатор');
  await page.getByText(incidentId!, { exact: true }).click();
  await page.getByRole('button', { name: 'Подтвердить получение результата' }).click();
  await expect(page.getByText('Получение подтверждено. Ожидается закрытие обращения.')).toBeVisible();

  await switchRole(page, 'Инженер ГСТИ');
  await page.getByText(incidentId!, { exact: true }).click();
  await page.getByRole('button', { name: 'Закрыть обращение' }).click();
  await page.getByLabel('Причина').fill('DEMO: ошибка доставки');
  await page.getByLabel('Решение').fill('DEMO: доставка результата восстановлена');
  await page.getByRole('button', { name: 'Закрыть', exact: true }).click();
  await expect(page.getByText('Закрыт', { exact: true }).first()).toBeVisible();
});

test('ДКП: поиск и фильтр обращений имеют понятное пустое состояние', async ({ page }) => {
  await page.getByLabel('Поиск обращений').fill('НЕСУЩЕСТВУЮЩИЙ-ИНЗ');
  await expect(page.getByText('Ничего не найдено')).toBeVisible();
  await page.getByLabel('Поиск обращений').fill('');
  await page.getByLabel('Фильтр по статусу').selectOption({ label: 'Ожидает ответа' });
  await expect(page.getByText('PRIIZ-000243')).toBeVisible();
});

test('Project и база знаний: аналитика открывается, поиск работает', async ({ page }) => {
  await switchRole(page, 'Project');
  await expect(page.getByRole('heading', { name: 'Аналитика ПРИИЗ' })).toBeVisible();
  await expect(page.getByText('DEMO DATA').first()).toBeVisible();

  await page.getByRole('button', { name: 'База знаний', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'База знаний' })).toBeVisible();
  await page.getByLabel('Поиск в базе знаний').fill('INC-02');
  await expect(page.getByText('Runbook: не получен результат')).toBeVisible();
  await page.getByLabel('Поиск в базе знаний').fill('xyz-no-result');
  await expect(page.getByText('Ничего не найдено')).toBeVisible();
});

test('Администратор: роли и полный CRUD DEMO-чатов Express', async ({ page }) => {
  await switchRole(page, 'Администратор');
  await expect(page.getByRole('heading', { name: 'Администрирование ПРИИЗ' })).toBeVisible();

  await page.getByLabel('Роль Мария Иванова').selectOption('Инженер ГСТИ');
  await expect(page.getByLabel('Роль Мария Иванова')).toHaveValue('Инженер ГСТИ');

  await page.getByRole('button', { name: 'Добавить чат' }).click();
  await page.getByLabel('Название чата').fill('QA DEMO чат');
  await page.getByLabel('Назначение чата').fill('Проверка релизного сценария');
  await page.getByRole('button', { name: 'Сохранить' }).click();
  await expect(page.getByText('QA DEMO чат')).toBeVisible();

  await page.getByRole('button', { name: 'Изменить QA DEMO чат' }).click();
  await page.getByLabel('Название чата').fill('QA DEMO чат 2');
  await page.getByRole('button', { name: 'Сохранить' }).click();
  await expect(page.getByText('QA DEMO чат 2')).toBeVisible();

  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Удалить QA DEMO чат 2' }).click();
  await expect(page.getByText('QA DEMO чат 2')).toHaveCount(0);
});
