/**
 * In-Memory & LocalStorage Repository for Incidents
 */

import { Incident, UserRole } from '../types';

const STORAGE_KEY = 'priiz_incidents_v0.2';

export const INITIAL_MOCK_INCIDENTS: Incident[] = [
  {
    id: 'PRIIZ-000245',
    incidentType: 'INC-02',
    source: 'ПРИИЗ Portal',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 min ago
    createdBy: 'Иванова Мария (ДКП)',
    authorRole: 'ДКП',
    status: 'Новый',
    priority: 'Высокий',
    responsibleTeam: 'Support',
    assignee: 'Дежурный инженер (Support)',
    internalServiceDeskId: 'SD-INV-908124',
    client: 'ООО "МедТехЦентр"',
    clientCode: 'CLI-88231',
    contract: 'ДОГ-2025/INV-4412',
    lpu: 'Филиал Юго-Западный (ЛПУ-104)',
    vendor: '1С:Медицина',
    integrationType: 'типовая',
    environment: 'Production',
    inz: '998877665',
    eventDateTime: new Date(Date.now() - 1000 * 60 * 120).toISOString().slice(0, 16),
    scope: 'единичная',
    workedBefore: 'да',
    description: 'Пациент прошел исследование в 09:30. В ЛИС статус «Выполнено», но в МИС 1С клиентов результат не подгрузился до сих пор.',
    vendorContacted: true,
    vendorAnswer: 'Вендор сообщил о задержке обработки на своей стороне.',
    attachments: [
      {
        id: 'att-1',
        fileName: 'vendor_response.txt',
        fileSize: '14.2 KB',
        fileType: 'text/plain',
        uploadedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: 'att-2',
        fileName: 'screen_mis_empty_result.png',
        fileSize: '420.5 KB',
        fileType: 'image/png',
        uploadedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
    ],
    diagnosticResult: {
      inzFound: true,
      labExecutionPassed: true,
      resultGenerated: true,
      deliveryConfirmed: false,
      traceId: 'tr_inv_9f82d1c04',
      checkedAt: new Date(Date.now() - 1000 * 60 * 34).toISOString(),
      recommendedAction: 'Заявка найдена, обработка успешна, результат сформирован. Не зафиксировано подтверждение доставки. Оформите обращение в ПРИИЗ для передачи в службу поддержки.',
      stages: [
        { id: '1', name: 'Поиск ИНЗ в интеграционной платформе', status: 'ok', details: 'Заявка найдена.' },
        { id: '2', name: 'Обработка в интеграционной платформе', status: 'ok', details: 'Обработка успешна.' },
        { id: '3', name: 'Формирование результата', status: 'ok', details: 'Результат сформирован.' },
        { id: '4', name: 'Доставка в систему клиента (Вендор / ЛПУ)', status: 'error', details: 'Ошибка доставки DEMO.' },
      ],
    },
    comments: [
      {
        id: 'c-1',
        author: 'Иванова Мария (ДКП)',
        role: 'ДКП',
        content: 'Заявка создана с полным пакетом контекста (ИНЗ, скриншоты, ответ вендора). Ждем оперативную доставку.',
        createdAt: new Date(Date.now() - 1000 * 60 * 34).toISOString(),
      },
    ],
    fullDataOnFirstSubmit: true,
    clarificationCount: 0,
    slaStatus: 'В норме (демо)',
  },
  {
    id: 'PRIIZ-000244',
    incidentType: 'INC-02',
    source: 'ПРИИЗ Portal',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    createdBy: 'Петров Алексей (ДКП)',
    authorRole: 'ДКП',
    status: 'В работе',
    priority: 'Средний',
    responsibleTeam: 'Support',
    assignee: 'Сидоров И.А. (Support)',
    internalServiceDeskId: 'SD-INV-908119',
    client: 'ГБУЗ "Городская поликлиника №4"',
    clientCode: 'CLI-55410',
    contract: 'ДОГ-2024/INV-1102',
    lpu: 'Поликлиническое отделение №2',
    vendor: 'ИНФОРММЕД',
    integrationType: 'кастомная',
    environment: 'Production',
    inz: '887766554',
    eventDateTime: new Date(Date.now() - 1000 * 60 * 300).toISOString().slice(0, 16),
    scope: 'несколько',
    workedBefore: 'да',
    description: 'Не приходят результаты по 3 пациентам за утреннюю смену. ИНЗ первой заявки: 887766554.',
    vendorContacted: false,
    attachments: [],
    diagnosticResult: {
      inzFound: true,
      labExecutionPassed: true,
      resultGenerated: true,
      deliveryConfirmed: false,
      traceId: 'tr_inv_887766554',
      checkedAt: new Date(Date.now() - 1000 * 60 * 175).toISOString(),
      stages: [
        { id: '1', name: 'Поиск ИНЗ в интеграционной платформе', status: 'ok', details: 'Заявка найдена' },
        { id: '2', name: 'Обработка в интеграционной платформе', status: 'ok', details: 'Обработка успешна' },
        { id: '3', name: 'Формирование результата', status: 'ok', details: 'Результат сформирован' },
        { id: '4', name: 'Доставка в систему клиента (Вендор / ЛПУ)', status: 'error', details: 'Ошибка доставки DEMO' },
      ],
    },
    comments: [
      {
        id: 'c-201',
        author: 'Петров Алексей (ДКП)',
        role: 'ДКП',
        content: 'Проблема повторяется периодически по вторникам.',
        createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      },
      {
        id: 'c-202',
        author: 'Сидоров И.А. (Support)',
        role: 'Support',
        content: 'Взял в работу. Запустил проверку очереди шлюза в Консоли.',
        createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      },
    ],
    fullDataOnFirstSubmit: true,
    clarificationCount: 0,
    slaStatus: 'В норме (демо)',
  },
  {
    id: 'PRIIZ-000243',
    incidentType: 'INC-01',
    source: 'ПРИИЗ Portal',
    createdAt: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    createdBy: 'Сергеев Дмитрий (Manager)',
    authorRole: 'Manager',
    status: 'Требует уточнения',
    priority: 'Низкий',
    responsibleTeam: 'Support',
    assignee: 'Дежурный инженер (Support)',
    internalServiceDeskId: 'SD-INV-907998',
    client: 'АО "Семейный Доктор"',
    clientCode: 'CLI-33201',
    lpu: 'Центральный филиал',
    vendor: 'Меддиалог',
    integrationType: 'типовая',
    environment: 'Production',
    inz: '776655443',
    eventDateTime: new Date(Date.now() - 1000 * 60 * 500).toISOString().slice(0, 16),
    scope: 'единичная',
    workedBefore: 'неизвестно',
    description: 'Направление отправлено из МИС, но в ЛИС ИНВИТРО забронированный номер не найден.',
    vendorContacted: true,
    vendorAnswer: 'Вендор сообщил об отсутствии обязательного поля СНИЛС врача.',
    attachments: [],
    comments: [
      {
        id: 'c-301',
        author: 'Поддержка ИНВИТРО (Support)',
        role: 'Support',
        content: 'Просьба уточнить входные параметры из МИС для проверки данных врача.',
        createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
      },
    ],
    fullDataOnFirstSubmit: false,
    clarificationCount: 1,
    slaStatus: 'Риск нарушения (демо)',
  },
  {
    id: 'PRIIZ-000242',
    incidentType: 'INC-02',
    source: 'ПРИИЗ Portal',
    createdAt: new Date(Date.now() - 1000 * 60 * 1440).toISOString(), // 1 day ago
    createdBy: 'Ковалева Елена (ДКП)',
    authorRole: 'ДКП',
    status: 'Ожидает подтверждения ДКП',
    priority: 'Высокий',
    responsibleTeam: 'Support',
    assignee: 'Кузнецов В.М. (Support)',
    internalServiceDeskId: 'SD-INV-907102',
    client: 'МЦ "Здоровье и Долголетие"',
    clientCode: 'CLI-11094',
    lpu: 'Основной корпус',
    vendor: 'БАРС.Здравоохранение',
    integrationType: 'типовая',
    environment: 'Production',
    inz: '665544332',
    eventDateTime: new Date(Date.now() - 1000 * 60 * 1600).toISOString().slice(0, 16),
    scope: 'единичная',
    workedBefore: 'да',
    description: 'Результаты общего анализа крови не пришли.',
    vendorContacted: true,
    vendorAnswer: 'Вендор подтвердил восстановление соединения со шлюзом.',
    attachments: [],
    diagnosticResult: {
      inzFound: true,
      labExecutionPassed: true,
      resultGenerated: true,
      deliveryConfirmed: true,
      traceId: 'tr_inv_665544332',
      checkedAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
      stages: [
        { id: '1', name: 'Поиск ИНЗ', status: 'ok' },
        { id: '2', name: 'Обработка в платформе', status: 'ok' },
        { id: '3', name: 'Формирование результатов', status: 'ok' },
        { id: '4', name: 'Доставка клиенту', status: 'ok', details: 'Повторная отправка завершена успешно.' },
      ],
    },
    comments: [
      {
        id: 'c-401',
        author: 'Кузнецов В.М. (Support)',
        role: 'Support',
        content: 'Выполнена повторная отправка результатов из Консоли Интеграции. Статус доставки подтвержден. ДКП, подтвердите, пожалуйста, получение клиентом.',
        createdAt: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
      },
    ],
    fullDataOnFirstSubmit: true,
    clarificationCount: 0,
    slaStatus: 'В норме (демо)',
  },
  {
    id: 'PRIIZ-000241',
    incidentType: 'INC-05',
    source: 'ПРИИЗ Portal',
    createdAt: new Date(Date.now() - 1000 * 60 * 2880).toISOString(), // 2 days ago
    createdBy: 'Иванова Мария (ДКП)',
    authorRole: 'ДКП',
    status: 'Закрыт',
    priority: 'Низкий',
    responsibleTeam: 'Support',
    assignee: 'Кузнецов В.М. (Support)',
    internalServiceDeskId: 'SD-INV-906540',
    client: 'Клиника "Энергия Жизни"',
    clientCode: 'CLI-99012',
    lpu: 'Филиал Север',
    vendor: 'Самописный HTTP API',
    integrationType: 'кастомная',
    environment: 'Production',
    inz: '554433221',
    eventDateTime: new Date(Date.now() - 1000 * 60 * 3000).toISOString().slice(0, 16),
    scope: 'массовая',
    workedBefore: 'да',
    description: 'Ошибка раскодирования биоматериала при получении нового справочника услуг.',
    vendorContacted: false,
    attachments: [],
    comments: [
      {
        id: 'c-501',
        author: 'Кузнецов В.М. (Support)',
        role: 'Support',
        content: 'Маппинг кодов биоматериала обновлен в НСИ.',
        createdAt: new Date(Date.now() - 1000 * 60 * 2000).toISOString(),
      },
      {
        id: 'c-502',
        author: 'Иванова Мария (ДКП)',
        role: 'ДКП',
        content: 'Получение подтверждаю, справочник корректный.',
        createdAt: new Date(Date.now() - 1000 * 60 * 1500).toISOString(),
      },
    ],
    fullDataOnFirstSubmit: true,
    clarificationCount: 0,
    slaStatus: 'В норме (демо)',
    rootCause: 'NSI / Mapping Desync',
    resolution: 'Маппинг справочников биоматериалов актуализирован дежурной группой.',
    resolvedAt: new Date(Date.now() - 1000 * 60 * 1400).toISOString(),
    reusableKnowledge: true,
  },
];

export class IncidentRepository {
  private incidents: Incident[];

  constructor() {
    this.incidents = this.loadFromStorage();
  }

  private loadFromStorage(): Incident[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse localStorage incidents:', e);
    }
    return [...INITIAL_MOCK_INCIDENTS];
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.incidents));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }

  public resetToDefault(): Incident[] {
    this.incidents = [...INITIAL_MOCK_INCIDENTS];
    this.saveToStorage();
    return this.getAll();
  }

  public getAll(): Incident[] {
    return [...this.incidents].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getById(id: string): Incident | undefined {
    return this.incidents.find((inc) => inc.id === id);
  }

  public save(incident: Incident): Incident {
    const index = this.incidents.findIndex((inc) => inc.id === incident.id);
    if (index >= 0) {
      this.incidents[index] = { ...incident };
    } else {
      this.incidents.unshift(incident);
    }
    this.saveToStorage();
    return incident;
  }

  public generateNextId(): string {
    const numbers = this.incidents.map((i) => {
      const num = parseInt(i.id.replace('PRIIZ-', ''), 10);
      return isNaN(num) ? 0 : num;
    });
    const maxNum = numbers.length > 0 ? Math.max(...numbers) : 245;
    const nextNum = maxNum + 1;
    return `PRIIZ-${nextNum.toString().padStart(6, '0')}`;
  }
}

export const incidentRepository = new IncidentRepository();
