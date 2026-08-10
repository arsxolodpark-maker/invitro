/**
 * Diagnostics Pre-Check Service
 * Simulates automated technical diagnostic checks for INC-02 "Не получен результат"
 */

import { DiagnosticResult } from '../types';

export async function runPrecheck(inz: string): Promise<DiagnosticResult> {
  // Simulate network/service latency between 700ms and 1200ms
  const delay = Math.floor(Math.random() * 500) + 700;
  await new Promise((resolve) => setTimeout(resolve, delay));

  const cleanInz = inz.trim() || '998877665';
  const traceId = `tr_inv_${Math.random().toString(36).substring(2, 10)}`;
  const timestamp = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  return {
    inzFound: true,
    labExecutionPassed: true,
    resultGenerated: true,
    deliveryConfirmed: false,
    traceId,
    checkedAt: new Date().toISOString(),
    recommendedAction: 
      'Заявка найдена, обработка успешна, результат сформирован. Не зафиксировано подтверждение доставки. Оформите обращение в ПРИИЗ для передачи в службу поддержки.',
    stages: [
      {
        id: 'stage-1',
        name: 'Поиск ИНЗ в интеграционной платформе',
        status: 'ok',
        details: `Заявка найдена (ИНЗ ${cleanInz}).`,
        timestamp: `${timestamp} : 10.001`,
      },
      {
        id: 'stage-2',
        name: 'Обработка в интеграционной платформе',
        status: 'ok',
        details: 'Обработка успешна.',
        timestamp: `${timestamp} : 10.042`,
      },
      {
        id: 'stage-3',
        name: 'Формирование результата',
        status: 'ok',
        details: 'Результат сформирован.',
        timestamp: `${timestamp} : 10.105`,
      },
      {
        id: 'stage-4',
        name: 'Доставка в систему клиента (Вендор / ЛПУ)',
        status: 'error',
        details: 'Ошибка доставки DEMO.',
        timestamp: `${timestamp} : 10.890`,
      },
    ],
  };
}
