import React, { useMemo, useRef, useState } from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, ChevronDown, CircleHelp, RotateCcw } from 'lucide-react';
import { GovinIssueClass, IncidentPrefill } from '../types';

interface DirectionCheckViewProps { onCreateIncident: (prefill: IncidentPrefill) => void; }
type Integration = 'Нетрика' | 'Адыгея' | 'Брегис';
type DemoScenarioId = 'S1' | 'S2' | 'S3' | 'S4' | 'S5';
type StageState = 'ok' | 'error' | 'pending';
type StageId = 'services' | 'checkin' | 'delivery';
type MappingKind = 'Услуга' | 'Тест';
interface MappingRow { kind: MappingKind; invitroCode: string; invitroName: string; vendorCode: string; vendorName: string; status: 'Замапплено' | 'Нет маппинга' | 'Некорректный маппинг' | 'Нет данных'; }
interface StageCard { id: StageId; number: number; title: string; mappingType: string; state: StageState; summary: string; action: string; }
interface DemoDirection {
  scenario: DemoScenarioId; integration: Integration; barcode: string; externalId: string; client: string; clientCode: string; lpu: string; createdAt: string;
  inz: string[]; serviceName: string; assignedTests: string[]; deliveredResults: string[]; sourceStatus: string; databaseState: string;
  mappingRows: MappingRow[]; stages: StageCard[]; issueLabel?: string; issueClass?: GovinIssueClass; incidentTitle?: string; recommendedRoute?: string; incidentDescription?: string;
}

const integrations: Integration[] = ['Нетрика', 'Адыгея', 'Брегис'];
const demoDirections: DemoDirection[] = [
  { scenario: 'S1', integration: 'Нетрика', barcode: '1236514265', externalId: 'DIR-DEMO-001', client: 'Демо-клиент 1', clientCode: 'CLI-DEMO-01', lpu: 'ЛПУ · DEMO 01', createdAt: '21.08.2026 09:15', inz: ['942476082'], serviceName: 'Профиль обследования · DEMO', assignedTests: ['Тест A · качественный', 'Тест B · количественный'], deliveredResults: ['Тест A · результат доставлен', 'Тест B · результат доставлен'], sourceStatus: 'Доставка завершена', databaseState: 'Направление и заказ найдены в DEMO-БД', mappingRows: [
    { kind: 'Услуга', invitroCode: 'NMU-1001', invitroName: 'Услуга INVITRO · DEMO', vendorCode: 'V-SVC-77', vendorName: 'Услуга в МИС/ЛИС · DEMO', status: 'Замапплено' },
    { kind: 'Тест', invitroCode: 'NMU-T01', invitroName: 'Тест A · DEMO', vendorCode: 'V-T01', vendorName: 'Тест A в МИС/ЛИС', status: 'Замапплено' },
    { kind: 'Тест', invitroCode: 'NMU-T02', invitroName: 'Тест B · DEMO', vendorCode: 'V-T02', vendorName: 'Тест B в МИС/ЛИС', status: 'Замапплено' },
  ], stages: [
    { id: 'services', number: 1, title: 'Получение услуг / создание направления', mappingType: 'Маппинг услуг', state: 'ok', summary: 'Услуги сопоставлены корректно.', action: 'Ничего исправлять не требуется.' },
    { id: 'checkin', number: 2, title: 'Чекин', mappingType: 'Маппинг услуг', state: 'ok', summary: 'Повторная проверка услуг пройдена.', action: 'Направление может идти дальше по процессу.' },
    { id: 'delivery', number: 3, title: 'Доставка результатов', mappingType: 'Маппинг тестов', state: 'ok', summary: 'Все тесты сопоставлены, результаты доставлены.', action: 'Дополнительных действий нет.' },
  ]},
  { scenario: 'S2', integration: 'Адыгея', barcode: '2236514265', externalId: 'DIR-DEMO-002', client: 'Демо-клиент 2', clientCode: 'CLI-DEMO-02', lpu: 'ЛПУ · DEMO 02', createdAt: '21.08.2026 09:40', inz: [], serviceName: 'Услуга обследования · DEMO', assignedTests: [], deliveredResults: [], sourceStatus: 'Направление получено', databaseState: 'Направление найдено, внутренний заказ ещё не создан', mappingRows: [{ kind: 'Услуга', invitroCode: 'NMU-2001', invitroName: 'Услуга INVITRO · DEMO', vendorCode: 'V-SVC-88', vendorName: 'Услуга в МИС/ЛИС · DEMO', status: 'Нет маппинга' }], stages: [
    { id: 'services', number: 1, title: 'Получение услуг / создание направления', mappingType: 'Маппинг услуг', state: 'error', summary: 'Для одной услуги отсутствует маппинг.', action: 'Исправить маппинг до чекина и повторно убедиться, что услуга сопоставлена корректно.' },
    { id: 'checkin', number: 2, title: 'Чекин', mappingType: 'Маппинг услуг', state: 'pending', summary: 'Чекин ещё не выполнен.', action: 'После исправления маппинга система повторно проверит услуги на чекине.' },
    { id: 'delivery', number: 3, title: 'Доставка результатов', mappingType: 'Маппинг тестов', state: 'pending', summary: 'Этап ещё не наступил.', action: 'Контроль маппинга тестов выполняется только на этапе доставки результатов.' },
  ], issueLabel: 'Нет маппинга услуги', issueClass: 'SERVICE_MAPPING', incidentTitle: 'Ошибка маппинга услуги', recommendedRoute: 'Сопровождение маппинга', incidentDescription: 'На этапе создания направления отсутствует маппинг услуги. Нужно исправить сопоставление до чекина.' },
  { scenario: 'S3', integration: 'Брегис', barcode: '3236514265', externalId: 'DIR-DEMO-003', client: 'Демо-клиент 3', clientCode: 'CLI-DEMO-03', lpu: 'ЛПУ · DEMO 03', createdAt: '21.08.2026 10:05', inz: ['942476083'], serviceName: 'Услуга обследования · DEMO', assignedTests: ['Тест C · DEMO'], deliveredResults: [], sourceStatus: 'Нечекин', databaseState: 'Направление и внутренний заказ найдены', mappingRows: [{ kind: 'Услуга', invitroCode: 'NMU-3001', invitroName: 'Услуга INVITRO · DEMO', vendorCode: 'V-SVC-99', vendorName: 'Услуга в МИС/ЛИС · DEMO', status: 'Нет маппинга' }], stages: [
    { id: 'services', number: 1, title: 'Получение услуг / создание направления', mappingType: 'Маппинг услуг', state: 'ok', summary: 'На создании направление прошло контроль.', action: 'Переходим к повторной проверке на чекине.' },
    { id: 'checkin', number: 2, title: 'Чекин', mappingType: 'Маппинг услуг', state: 'error', summary: 'Нечекин вызван отсутствующим маппингом услуги.', action: 'Исправить маппинг услуги и направить заявку на ручное лабораторное исполнение.' },
    { id: 'delivery', number: 3, title: 'Доставка результатов', mappingType: 'Маппинг тестов', state: 'pending', summary: 'Доставка не началась.', action: 'После прохождения чекина перейти к контролю маппинга тестов.' },
  ], issueLabel: 'Нечекин / нет маппинга услуги', issueClass: 'SERVICE_MAPPING', incidentTitle: 'Нечекин из-за отсутствующего маппинга услуги', recommendedRoute: 'Исправление маппинга услуги + ручное лабораторное исполнение', incidentDescription: 'На этапе чекина отсутствует маппинг услуги. По регламенту нужно исправить маппинг услуги и направить заявку на ручное лабораторное исполнение.' },
  { scenario: 'S4', integration: 'Нетрика', barcode: '4236514265', externalId: 'DIR-DEMO-004', client: 'Демо-клиент 4', clientCode: 'CLI-DEMO-04', lpu: 'ЛПУ · DEMO 04', createdAt: '21.08.2026 10:30', inz: ['942476084'], serviceName: 'Профиль обследования · DEMO', assignedTests: ['Тест D · качественный', 'Тест E · количественный'], deliveredResults: [], sourceStatus: 'Доставка отменена', databaseState: 'Направление, заказ и результаты найдены; доставка не выполнена', mappingRows: [
    { kind: 'Услуга', invitroCode: 'NMU-4001', invitroName: 'Услуга INVITRO · DEMO', vendorCode: 'V-SVC-44', vendorName: 'Услуга в МИС/ЛИС · DEMO', status: 'Замапплено' },
    { kind: 'Тест', invitroCode: 'NMU-T04', invitroName: 'Тест D · DEMO', vendorCode: 'V-T04', vendorName: 'Тест D в МИС/ЛИС', status: 'Замапплено' },
    { kind: 'Тест', invitroCode: 'NMU-T05', invitroName: 'Тест E · DEMO', vendorCode: 'V-T05', vendorName: 'Тест E в МИС/ЛИС', status: 'Нет маппинга' },
  ], stages: [
    { id: 'services', number: 1, title: 'Получение услуг / создание направления', mappingType: 'Маппинг услуг', state: 'ok', summary: 'Маппинг услуг корректен.', action: 'Контроль пройден.' },
    { id: 'checkin', number: 2, title: 'Чекин', mappingType: 'Маппинг услуг', state: 'ok', summary: 'Чекин пройден.', action: 'Направление передано дальше.' },
    { id: 'delivery', number: 3, title: 'Доставка результатов', mappingType: 'Маппинг тестов', state: 'error', summary: 'У одного теста отсутствует маппинг. Доставка результатов отменена.', action: 'Исправить маппинг теста, загрузить корректный маппинг и повторно инициировать отправку результата.' },
  ], issueLabel: 'Ошибка доставки / нет маппинга теста', issueClass: 'TEST_MAPPING', incidentTitle: 'Ошибка доставки результатов', recommendedRoute: 'ГСТИ, если интеграция в поддержке; чат «Ежевика», если интеграция ещё на сопровождении разработки', incidentDescription: 'На этапе доставки отсутствует маппинг теста, поэтому доставка результатов отменена. Нужно исправить тестовый маппинг и повторно инициировать отправку результата.' },
  { scenario: 'S5', integration: 'Нетрика', barcode: '9999999999', externalId: '', client: '', clientCode: '', lpu: '', createdAt: '', inz: [], serviceName: '', assignedTests: [], deliveredResults: [], sourceStatus: 'Не найдено', databaseState: 'В DEMO-БД направление не найдено', mappingRows: [], stages: [], issueLabel: 'Направление не найдено в базе данных', issueClass: 'DATABASE_NOT_FOUND', incidentTitle: 'Направление не найдено в БД', recommendedRoute: 'Техническая поддержка / ГСТИ', incidentDescription: 'Направление не найдено по переданному идентификатору. Нужно проверить идентификатор, выбранную интеграцию и наличие данных в базе.' },
];

const stageStyles: Record<StageState, string> = { ok: 'border-emerald-200 bg-emerald-50', error: 'border-red-200 bg-red-50', pending: 'border-slate-200 bg-slate-50' };
const stageStatus: Record<StageState, string> = { ok: 'Пройден', error: 'Проблема', pending: 'Не начался' };
const scenarioLabels: Record<DemoScenarioId, string> = { S1: 'Успешный путь', S2: 'Нет маппинга услуги', S3: 'Нечекин', S4: 'Ошибка доставки', S5: 'Не найдено' };

export const DirectionCheckView: React.FC<DirectionCheckViewProps> = ({ onCreateIncident }) => {
  const [integration, setIntegration] = useState<Integration | ''>('');
  const [barcode, setBarcode] = useState('');
  const [result, setResult] = useState<DemoDirection | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [showDemo, setShowDemo] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [mappingOpen, setMappingOpen] = useState(false);
  const [expandedStage, setExpandedStage] = useState<StageId | null>(null);
  const integrationRef = useRef<HTMLSelectElement>(null);
  const barcodeRef = useRef<HTMLInputElement>(null);
  const matchingScenario = useMemo(() => demoDirections.find((item) => item.integration === integration && item.barcode === barcode.trim()), [integration, barcode]);

  const resetDetails = () => { setDetailsOpen(false); setMappingOpen(false); setExpandedStage(null); };
  const clearResult = () => { setResult(null); setNotFound(false); setValidationMessage(''); resetDetails(); };
  const resetSearch = () => { setIntegration(''); setBarcode(''); clearResult(); requestAnimationFrame(() => integrationRef.current?.focus()); };

  const handleSearch = () => {
    if (!integration) { setValidationMessage('Выберите интеграцию.'); clearResult(); requestAnimationFrame(() => integrationRef.current?.focus()); return; }
    if (!barcode.trim()) { setValidationMessage('Введите номер направления или штрихкод.'); setResult(null); setNotFound(false); resetDetails(); requestAnimationFrame(() => barcodeRef.current?.focus()); return; }
    setValidationMessage(''); resetDetails();
    if (matchingScenario && matchingScenario.scenario !== 'S5') { setResult(matchingScenario); setNotFound(false); return; }
    setResult(null); setNotFound(true);
  };

  const selectScenario = (scenarioId: DemoScenarioId) => {
    const scenario = demoDirections.find((item) => item.scenario === scenarioId)!;
    setIntegration(scenario.integration); setBarcode(scenario.barcode); setValidationMessage(''); resetDetails();
    if (scenarioId === 'S5') { setResult(null); setNotFound(true); } else { setResult(scenario); setNotFound(false); }
  };

  const openDetails = (direction: DemoDirection) => {
    if (detailsOpen) { setDetailsOpen(false); setMappingOpen(false); setExpandedStage(null); return; }
    const relevant = direction.stages.find((stage) => stage.state === 'error') || direction.stages[direction.stages.length - 1];
    setDetailsOpen(true); setMappingOpen(false); setExpandedStage(relevant?.id || null);
  };

  const createIncident = (direction: DemoDirection) => {
    const failedStage = direction.stages.find((stage) => stage.state === 'error');
    onCreateIncident({ source: 'GOVIN-303', client: direction.client || undefined, clientCode: direction.clientCode || undefined, lpu: direction.lpu || undefined, vendor: direction.integration, inz: direction.inz.join(', '), contextLabel: `${direction.integration} · ${direction.issueLabel || direction.sourceStatus} · ${direction.barcode}`, incidentTitle: direction.incidentTitle || direction.issueLabel || 'Инцидент GOVIN', issueClass: direction.issueClass, processStage: failedStage?.title || 'Проверка направления', externalDirectionId: direction.externalId || undefined, barcode: direction.barcode, recommendedRoute: direction.recommendedRoute, description: `GOVIN v0.6.0 · ${direction.issueLabel || direction.sourceStatus}. Идентификатор направления: ${direction.barcode}. Этап: ${failedStage?.title || 'Проверка направления'}. Клиент: ${direction.client || 'нет данных'}. ЛПУ: ${direction.lpu || 'нет данных'}. ИНЗ: ${direction.inz.join(', ') || 'не присвоен / нет данных'}. Интеграция: ${direction.integration}. ${direction.incidentDescription || ''} Рекомендованный маршрут: ${direction.recommendedRoute || 'уточнить по регламенту'}.` });
  };

  const createNotFoundIncident = () => {
    if (!integration || !barcode.trim()) return;
    onCreateIncident({ source: 'GOVIN-303', vendor: integration, inz: '', contextLabel: `${integration} · направление не найдено · ${barcode.trim()}`, incidentTitle: 'Направление не найдено в БД', issueClass: 'DATABASE_NOT_FOUND', processStage: 'Проверка направления', barcode: barcode.trim(), recommendedRoute: 'Техническая поддержка / ГСТИ', description: `GOVIN v0.6.0 · Направление не найдено в базе данных. Идентификатор: ${barcode.trim()}. Интеграция: ${integration}. Клиент, ЛПУ и ИНЗ в GOVIN не определены. Требуется проверить идентификатор, интеграцию и наличие данных в базе. Рекомендованный маршрут: техническая поддержка / ГСТИ.` });
  };

  const activeStage = result?.stages.find((stage) => stage.id === expandedStage) || null;
  const failedStage = result?.stages.find((stage) => stage.state === 'error') || null;

  return <div className="max-w-6xl mx-auto space-y-4 py-3 pb-12" translate="no">
    <header className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
      <div><h1 className="text-[28px] sm:text-[30px] font-extrabold tracking-tight text-slate-900 leading-tight">Проверка направления и маппинга</h1><p className="text-[15px] text-slate-500 mt-1.5">Найдите направление — GOVIN покажет результат и следующее действие.</p></div>
      <div className="flex items-center gap-2"><button type="button" onClick={() => setShowDemo((v) => !v)} className="px-2 py-1.5 text-[13px] font-bold text-slate-500 hover:text-[#007f89]">{showDemo ? 'Скрыть DEMO' : 'DEMO-сценарии'}</button><span className="px-2.5 py-1.5 rounded-md bg-[#e8f8f8] text-[#075b61] text-xs font-extrabold tracking-wide whitespace-nowrap">GOVIN-303 · DEMO v0.6.0</span></div>
    </header>

    {showDemo && <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3">{(Object.keys(scenarioLabels) as DemoScenarioId[]).map((id) => <button key={id} type="button" onClick={() => selectScenario(id)} className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[13px] font-semibold">{id} · {scenarioLabels[id]}</button>)}</div>}

    <section aria-label="Проверка направления" className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
      <div className="text-base font-extrabold text-slate-800 mb-3">Проверить направление</div>
      <div className="grid grid-cols-1 md:grid-cols-[270px_minmax(0,1fr)_220px] gap-3 items-start">
        <label><span className="text-sm font-bold text-slate-700 block mb-1.5">Интеграция</span><select ref={integrationRef} value={integration} onChange={(e) => { const next = e.target.value as Integration | ''; setIntegration(next); clearResult(); if (next) requestAnimationFrame(() => barcodeRef.current?.focus()); }} className="w-full h-12 px-3 rounded-lg border border-slate-200 bg-white text-base"><option value="">Выберите интеграцию</option>{integrations.map((item) => <option key={item}>{item}</option>)}</select><span className="block text-xs text-slate-500 mt-1.5">Источник направления</span></label>
        <label><span className="text-sm font-bold text-slate-700 block mb-1.5">Номер направления / штрихкод</span><input ref={barcodeRef} value={barcode} onChange={(e) => { setBarcode(e.target.value); clearResult(); }} onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }} placeholder="Введите номер из алерта или чат-бота" className="w-full h-12 px-3 rounded-lg border border-slate-200 bg-white text-base"/><span className={`block text-xs mt-1.5 ${integration && !barcode ? 'text-[#007f89] font-semibold' : 'text-slate-500'}`}>{integration ? `Введите номер для ${integration}` : 'Можно ввести номер вручную или отсканировать штрихкод'}</span></label>
        <div><span className="text-sm font-bold text-transparent block mb-1.5 select-none" aria-hidden="true">Действие</span><button type="button" onClick={handleSearch} className="w-full h-12 px-4 rounded-lg bg-[#00a6ad] hover:bg-[#007f89] text-white text-base font-extrabold">Проверить направление</button><span className="block text-xs text-slate-500 mt-1.5">Получите итог и следующий шаг</span></div>
      </div>
      {validationMessage && <div role="alert" className="mt-3 text-sm font-semibold text-red-600">{validationMessage}</div>}
    </section>

    {notFound && <section aria-label="Итог и следующее действие" className="rounded-xl border border-amber-200 bg-amber-50 p-5 sm:p-6"><div className="flex items-start gap-3"><CircleHelp className="w-7 h-7 text-amber-600 shrink-0 mt-0.5"/><div className="min-w-0 flex-1"><div className="text-sm font-bold uppercase tracking-wide text-amber-800">Итог проверки</div><h2 className="text-2xl font-extrabold text-slate-900 mt-1">Направление не найдено</h2><p className="text-base text-slate-700 mt-2">GOVIN не нашёл направление в выбранной интеграции.</p><div className="mt-5 rounded-lg bg-white/80 border border-amber-200 p-4"><div className="text-sm font-bold text-slate-600">Что делать сейчас</div><p className="text-lg font-bold text-slate-900 mt-1">Проверьте номер и интеграцию. Если данные верны — создайте обращение в ПРИИЗ.</p><p className="text-sm text-slate-600 mt-2">Маршрут: техническая поддержка / ГСТИ.</p></div><div className="mt-5 flex flex-col sm:flex-row gap-3"><button type="button" onClick={createNotFoundIncident} className="h-12 px-5 rounded-lg bg-[#00a6ad] hover:bg-[#007f89] text-white text-base font-extrabold inline-flex items-center justify-center gap-2">Создать обращение в ПРИИЗ <ArrowRight className="w-4 h-4"/></button><button type="button" onClick={resetSearch} className="h-12 px-5 rounded-lg border border-slate-300 bg-white text-slate-700 text-base font-bold inline-flex items-center justify-center gap-2"><RotateCcw className="w-4 h-4"/> Проверить другое направление</button></div></div></div></section>}

    {result && <>
      <section aria-label="Итог и следующее действие" className={`rounded-xl border p-5 sm:p-6 ${result.issueLabel ? 'border-red-200 bg-red-50' : 'border-emerald-200 bg-emerald-50'}`}>
        <div className="flex items-start gap-3">{result.issueLabel ? <AlertTriangle className="w-7 h-7 text-red-600 shrink-0 mt-0.5"/> : <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5"/>}<div className="min-w-0 flex-1"><div className={`text-sm font-bold uppercase tracking-wide ${result.issueLabel ? 'text-red-700' : 'text-emerald-700'}`}>Итог проверки</div><h2 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 mt-1">{result.issueLabel || 'С направлением всё в порядке'}</h2><p className="text-base text-slate-700 mt-2">{result.issueLabel ? <>Проблемный этап: <strong>{failedStage?.title}</strong>.</> : 'Создание, чекин и доставка результатов прошли контроль.'}</p>
          <div className="mt-5 rounded-lg bg-white/80 border border-current/10 p-4"><div className="text-sm font-bold text-slate-600">Что делать сейчас</div><p className="text-lg sm:text-xl font-bold text-slate-900 mt-1 leading-snug">{failedStage?.action || 'Ничего делать не нужно. Дополнительных действий нет.'}</p>{result.recommendedRoute && <p className="text-sm text-slate-600 mt-2">Маршрут: <strong>{result.recommendedRoute}</strong>.</p>}</div>
          <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">{result.issueLabel ? <button type="button" onClick={() => createIncident(result)} className="h-12 px-5 rounded-lg bg-[#00a6ad] hover:bg-[#007f89] text-white text-base font-extrabold inline-flex items-center justify-center gap-2">Создать обращение в ПРИИЗ <ArrowRight className="w-4 h-4"/></button> : <button type="button" onClick={resetSearch} className="h-12 px-5 rounded-lg bg-[#00a6ad] hover:bg-[#007f89] text-white text-base font-extrabold inline-flex items-center justify-center gap-2"><RotateCcw className="w-4 h-4"/> Проверить другое направление</button>}<button type="button" aria-expanded={detailsOpen} onClick={() => openDetails(result)} className="h-12 px-4 rounded-lg border border-slate-300 bg-white text-slate-700 text-base font-bold inline-flex items-center justify-center gap-2">{detailsOpen ? 'Скрыть детали проверки' : 'Показать детали проверки'}<ChevronDown className={`w-4 h-4 transition-transform ${detailsOpen ? 'rotate-180' : ''}`}/></button></div>
        </div></div>
      </section>

      {detailsOpen && <section aria-label="Детали проверки" className="space-y-3">
        <section aria-label="Данные направления" className="bg-white rounded-xl border border-slate-200 shadow-xs px-4 py-4"><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100"><div className="flex items-center gap-2 flex-wrap"><strong className="font-mono text-base text-slate-900">{result.externalId}</strong><span className="text-sm text-slate-500">{result.integration}</span></div><span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">{result.sourceStatus}</span></div><dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-3 pt-3"><div><dt className="text-xs text-slate-500">Клиент / ЛПУ</dt><dd className="text-sm font-bold text-slate-800 mt-1">{result.client} <span className="font-normal text-slate-500">· {result.lpu}</span></dd></div><div><dt className="text-xs text-slate-500">Создано / ИНЗ</dt><dd className="text-sm font-bold text-slate-800 mt-1">{result.createdAt} <span className="font-normal text-slate-500">· {result.inz.join(', ') || 'Не присвоен'}</span></dd></div><div><dt className="text-xs text-slate-500">Услуга / штрихкод</dt><dd className="text-sm font-bold text-slate-800 mt-1">{result.serviceName} <span className="font-mono font-normal text-slate-500">· {result.barcode}</span></dd></div><div><dt className="text-xs text-slate-500">База данных</dt><dd className="text-sm font-bold text-slate-800 mt-1">{result.databaseState}</dd></div></dl></section>

        <section aria-label="Этапы проверки" className="bg-white rounded-xl border border-slate-200 shadow-xs p-4"><div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3"><h3 className="text-base font-extrabold text-slate-900">Этапы процесса</h3><span className="text-xs text-slate-500">Нажмите этап, чтобы посмотреть подробности</span></div><div className="grid grid-cols-1 md:grid-cols-3 gap-2">{result.stages.map((stage) => <button key={stage.id} type="button" aria-expanded={expandedStage === stage.id} aria-controls={`stage-detail-${stage.id}`} onClick={() => setExpandedStage((current) => current === stage.id ? null : stage.id)} className={`w-full text-left rounded-lg border px-3 py-3 transition ${stageStyles[stage.state]} hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0099a8]/30`}><div className="flex items-center justify-between gap-2"><span className="text-xs font-black text-slate-600">Этап {stage.number}</span><span className={`text-xs font-black ${stage.state === 'ok' ? 'text-emerald-700' : stage.state === 'error' ? 'text-red-700' : 'text-slate-500'}`}>{stageStatus[stage.state]}</span></div><div className="font-extrabold text-sm text-slate-900 leading-tight mt-1.5">{stage.title}</div><div className="text-xs text-slate-500 mt-1">{stage.mappingType}</div></button>)}</div>{activeStage && <div id={`stage-detail-${activeStage.id}`} className={`mt-3 rounded-lg border px-4 py-4 ${stageStyles[activeStage.state]}`}><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div><div className="font-black uppercase tracking-wide text-slate-500 text-xs">Что проверяем</div><div className="font-bold text-slate-800 text-sm mt-1">{activeStage.mappingType}</div></div><div><div className="font-black uppercase tracking-wide text-slate-500 text-xs">Что увидели</div><div className="text-slate-700 text-sm mt-1">{activeStage.summary}</div></div><div><div className="font-black uppercase tracking-wide text-slate-500 text-xs">Действие ДКП</div><div className="text-slate-700 text-sm mt-1 font-semibold">{activeStage.action}</div></div></div></div>}</section>

        <div className="bg-white rounded-xl border border-slate-200 p-4"><div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-start"><div><h3 className="text-base font-extrabold text-slate-900">Тесты и результаты</h3><p className="text-sm text-slate-700 mt-2"><strong>Назначенные:</strong> {result.assignedTests.join(', ') || 'Нет данных'}</p><p className="text-sm text-slate-700 mt-1"><strong>Доставленные:</strong> {result.deliveredResults.join(', ') || (result.scenario === 'S4' ? 'Не доставлены — доставка отменена' : 'Нет данных')}</p></div><button type="button" aria-expanded={mappingOpen} onClick={() => setMappingOpen((value) => !value)} className="h-11 px-4 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-bold inline-flex items-center justify-center gap-2">{mappingOpen ? 'Скрыть маппинг' : 'Показать маппинг'}<ChevronDown className={`w-4 h-4 transition-transform ${mappingOpen ? 'rotate-180' : ''}`}/></button></div>
          {mappingOpen && <div className="overflow-x-auto mt-4 border-t border-slate-100 pt-3"><table className="w-full text-sm"><thead><tr className="text-left border-b border-slate-200"><th className="py-2 pr-3">Тип</th><th className="py-2 pr-3">Код INVITRO / НМУ</th><th className="py-2 pr-3">Название INVITRO</th><th className="py-2 pr-3">Код вендора</th><th className="py-2 pr-3">Название в МИС/ЛИС</th><th className="py-2">Статус</th></tr></thead><tbody>{result.mappingRows.map((row, i) => <tr key={`${row.kind}-${i}`} className="border-b border-slate-100"><td className="py-3 pr-3 font-bold">{row.kind}</td><td className="py-3 pr-3 font-mono">{row.invitroCode}</td><td className="py-3 pr-3">{row.invitroName}</td><td className="py-3 pr-3 font-mono">{row.vendorCode}</td><td className="py-3 pr-3">{row.vendorName}</td><td className="py-3"><span className={`px-2 py-1 rounded-full font-bold ${row.status === 'Замапплено' ? 'bg-emerald-50 text-emerald-700' : row.status === 'Нет данных' ? 'bg-slate-100 text-slate-600' : 'bg-red-50 text-red-700'}`}>{row.status}</span></td></tr>)}</tbody></table></div>}
        </div>
      </section>}
    </>}

    <details className="rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2 text-xs text-slate-400"><summary className="cursor-pointer select-none">О DEMO</summary><div className="pt-2">Используются только вымышленные данные. Реальные API, ПДн и медицинские данные не используются.</div></details>
  </div>;
};