/**
 * In-Memory & LocalStorage Repository for Incidents
 * DEMO data only. All working examples use the confirmed INC-02 scenario.
 */

import { Incident } from '../types';

const STORAGE_KEY = 'priiz_incidents_v0.7';

export const INITIAL_MOCK_INCIDENTS: Incident[] = [
  {
    id: 'PRIIZ-000245', incidentType: 'INC-02', source: 'ПРИИЗ Portal',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(), createdBy: 'Иванова Мария (ДКП)', authorRole: 'ДКП',
    status: 'Новое', priority: 'Высокий', responsibleTeam: 'Инженер ГСТИ', assignee: 'Дежурный инженер ГСТИ', internalServiceDeskId: 'DEMO-ITILIUM-245',
    client: 'ООО «МедТехЦентр»', clientCode: 'CLI-DEMO-01', contract: 'DEMO-CONTRACT-01', lpu: 'Филиал Юго-Западный (DEMO)', vendor: 'Вендор МИС · DEMO', integrationType: 'типовая', environment: 'Production',
    inz: '998877665', eventDateTime: new Date(Date.now() - 1000 * 60 * 120).toISOString().slice(0, 16), scope: 'единичная', workedBefore: 'да', description: 'DEMO: исследование выполнено, но результат не отображается в системе клиента.',
    vendorContacted: true, vendorAnswer: 'DEMO: вендор подтвердил, что требуется проверка доставки со стороны интеграционного контура.', attachments: [{ id: 'att-1', fileName: 'demo_context.txt', fileSize: '12 KB', fileType: 'text/plain', uploadedAt: new Date().toISOString() }],
    diagnosticResult: { inzFound: true, labExecutionPassed: true, resultGenerated: true, deliveryConfirmed: false, traceId: 'demo-trace-245', checkedAt: new Date(Date.now() - 1000 * 60 * 34).toISOString(), recommendedAction: 'DEMO: результат сформирован, подтверждение доставки не найдено.', stages: [{ id: '1', name: 'Поиск ИНЗ', status: 'ok', details: 'DEMO: заявка найдена.' }, { id: '2', name: 'Обработка', status: 'ok', details: 'DEMO: обработка успешна.' }, { id: '3', name: 'Результат', status: 'ok', details: 'DEMO: результат сформирован.' }, { id: '4', name: 'Доставка', status: 'error', details: 'DEMO: подтверждение доставки не найдено.' }] },
    comments: [{ id: 'c-1', author: 'Иванова Мария (ДКП)', role: 'ДКП', content: 'DEMO: обращение создано с полным контекстом.', createdAt: new Date(Date.now() - 1000 * 60 * 34).toISOString() }], fullDataOnFirstSubmit: true, clarificationCount: 0, slaStatus: 'В норме (демо)',
  },
  {
    id: 'PRIIZ-000244', incidentType: 'INC-02', source: 'ПРИИЗ Portal', createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), createdBy: 'Внешний инициатор · DEMO', authorRole: 'Инициатор',
    status: 'В работе', priority: 'Средний', responsibleTeam: 'Инженер ГСТИ', assignee: 'Инженер ГСТИ · DEMO', internalServiceDeskId: 'DEMO-ITILIUM-244', client: 'Клиент B2B · DEMO', clientCode: 'CLI-DEMO-02', lpu: 'Подразделение клиента · DEMO', vendor: 'Вендор МИС · DEMO', integrationType: 'кастомная', environment: 'Production',
    inz: '887766554', eventDateTime: new Date(Date.now() - 1000 * 60 * 300).toISOString().slice(0, 16), scope: 'несколько', workedBefore: 'да', description: 'DEMO: не отображаются результаты по нескольким обращениям клиента.', vendorContacted: false, attachments: [],
    diagnosticResult: { inzFound: true, labExecutionPassed: true, resultGenerated: true, deliveryConfirmed: false, checkedAt: new Date(Date.now() - 1000 * 60 * 175).toISOString(), stages: [{ id: '1', name: 'Поиск ИНЗ', status: 'ok' }, { id: '2', name: 'Обработка', status: 'ok' }, { id: '3', name: 'Результат', status: 'ok' }, { id: '4', name: 'Доставка', status: 'warning', details: 'DEMO: требуется проверка.' }] },
    comments: [{ id: 'c-201', author: 'Внешний инициатор · DEMO', role: 'Инициатор', content: 'DEMO: передаю контекст для проверки.', createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString() }, { id: 'c-202', author: 'Инженер ГСТИ', role: 'Инженер ГСТИ', content: 'DEMO: обращение принято в работу в 1C:ITILIUM.', createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() }],
    fullDataOnFirstSubmit: true, clarificationCount: 0, slaStatus: 'В норме (демо)',
  },
  {
    id: 'PRIIZ-000243', incidentType: 'INC-02', source: 'ПРИИЗ Portal', createdAt: new Date(Date.now() - 1000 * 60 * 420).toISOString(), createdBy: 'Внешний инициатор · DEMO', authorRole: 'Инициатор',
    status: 'Ожидает ответа', priority: 'Низкий', responsibleTeam: 'Инженер ГСТИ', internalServiceDeskId: 'DEMO-ITILIUM-243', client: 'Клиент проекта · DEMO', clientCode: 'CLI-DEMO-03', lpu: 'ЛПУ · DEMO', vendor: 'Вендор МИС · DEMO', integrationType: 'типовая', environment: 'Production',
    inz: '776655443', eventDateTime: new Date(Date.now() - 1000 * 60 * 500).toISOString().slice(0, 16), scope: 'единичная', workedBefore: 'неизвестно', description: 'DEMO: для диагностики не хватает части обязательного контекста.', vendorContacted: false, attachments: [], comments: [{ id: 'c-301', author: 'Инженер ГСТИ', role: 'Инженер ГСТИ', content: 'DEMO: требуется уточнить контекст обращения.', createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString() }], fullDataOnFirstSubmit: false, clarificationCount: 1, slaStatus: 'Риск нарушения (демо)',
  },
  {
    id: 'PRIIZ-000242', incidentType: 'INC-02', source: 'ПРИИЗ Portal', createdAt: new Date(Date.now() - 1000 * 60 * 1440).toISOString(), createdBy: 'Ковалева Елена (ДКП)', authorRole: 'ДКП',
    status: 'Выполнено', priority: 'Высокий', responsibleTeam: 'Инженер ГСТИ', internalServiceDeskId: 'DEMO-ITILIUM-242', client: 'Клиент · DEMO', clientCode: 'CLI-DEMO-04', lpu: 'Основной корпус · DEMO', vendor: 'Вендор МИС · DEMO', integrationType: 'типовая', environment: 'Production',
    inz: '665544332', eventDateTime: new Date(Date.now() - 1000 * 60 * 1600).toISOString().slice(0, 16), scope: 'единичная', workedBefore: 'да', description: 'DEMO: результат был недоступен в системе клиента.', vendorContacted: true, vendorAnswer: 'DEMO: сторона вендора сообщила о восстановлении.', attachments: [],
    diagnosticResult: { inzFound: true, labExecutionPassed: true, resultGenerated: true, deliveryConfirmed: true, checkedAt: new Date().toISOString(), stages: [{ id: '1', name: 'Поиск ИНЗ', status: 'ok' }, { id: '2', name: 'Обработка', status: 'ok' }, { id: '3', name: 'Результат', status: 'ok' }, { id: '4', name: 'Доставка', status: 'ok' }] },
    comments: [{ id: 'c-401', author: 'Инженер ГСТИ', role: 'Инженер ГСТИ', content: 'DEMO: работы завершены, на портале отображается статус «Выполнено».', createdAt: new Date(Date.now() - 1000 * 60 * 500).toISOString() }], fullDataOnFirstSubmit: true, clarificationCount: 0, slaStatus: 'В норме (демо)',
  },
];

export class IncidentRepository {
  private incidents: Incident[];
  constructor() { this.incidents = this.loadFromStorage(); }
  private loadFromStorage(): Incident[] { try { const stored = localStorage.getItem(STORAGE_KEY); if (stored) return JSON.parse(stored); } catch (e) { console.warn('Failed to parse localStorage incidents:', e); } return [...INITIAL_MOCK_INCIDENTS]; }
  private saveToStorage(): void { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.incidents)); } catch (e) { console.warn('Failed to save to localStorage:', e); } }
  public resetToDefault(): Incident[] { this.incidents = [...INITIAL_MOCK_INCIDENTS]; this.saveToStorage(); return this.getAll(); }
  public getAll(): Incident[] { return [...this.incidents].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); }
  public getById(id: string): Incident | undefined { return this.incidents.find((inc) => inc.id === id); }
  public save(incident: Incident): Incident { const index = this.incidents.findIndex((inc) => inc.id === incident.id); if (index >= 0) this.incidents[index] = { ...incident }; else this.incidents.unshift(incident); this.saveToStorage(); return incident; }
  public generateNextId(): string { const numbers = this.incidents.map((i) => { const num = parseInt(i.id.replace('PRIIZ-', ''), 10); return isNaN(num) ? 0 : num; }); const maxNum = numbers.length > 0 ? Math.max(...numbers) : 245; return `PRIIZ-${(maxNum + 1).toString().padStart(6, '0')}`; }
}

export const incidentRepository = new IncidentRepository();
