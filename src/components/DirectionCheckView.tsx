import React, { useMemo, useState } from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, CircleHelp, Database, FlaskConical, Search, Waypoints, Wrench } from 'lucide-react';
import { IncidentPrefill } from '../types';

interface DirectionCheckViewProps {
  onCreateIncident: (prefill: IncidentPrefill) => void;
}

type Integration = 'Нетрика' | 'Адыгея' | 'Брегис';
type DemoScenarioId = 'S1' | 'S2' | 'S3' | 'S4' | 'S5';
type StageState = 'ok' | 'warning' | 'error' | 'pending';

interface MappingRow {
  kind: 'Услуга' | 'Биоматериал' | 'Тест';
  invitroCode: string;
  invitroName: string;
  vendorCode: string;
  vendorName: string;
  status: 'Замапплено' | 'Нет маппинга' | 'Некорректный маппинг' | 'Нет данных';
}

interface StageCard {
  id: 'services' | 'checkin' | 'delivery';
  number: number;
  title: string;
  mappingType: string;
  state: StageState;
  summary: string;
  action: string;
}

interface DemoDirection {
  scenario: DemoScenarioId;
  integration: Integration;
  barcode: string;
  externalId: string;
  client: string;
  clientCode: string;
  lpu: string;
  createdAt: string;
  inz: string[];
  serviceName: string;
  assignedTests: string[];
  deliveredResults: string[];
  sourceStatus: string;
  databaseState: string;
  mappingRows: MappingRow[];
  stages: StageCard[];
  issueLabel?: string;
  recommendedRoute?: string;
  incidentDescription?: string;
}

const integrations: Integration[] = ['Нетрика', 'Адыгея', 'Брегис'];

const demoDirections: DemoDirection[] = [
  {
    scenario: 'S1', integration: 'Нетрика', barcode: '1236514265', externalId: 'DIR-DEMO-001', client: 'Демо-клиент 1', clientCode: 'CLI-DEMO-01', lpu: 'ЛПУ · DEMO 01', createdAt: '21.08.2026 09:15', inz: ['942476082'], serviceName: 'Профиль обследования · DEMO', assignedTests: ['Тест A · качественный', 'Тест B · количественный'], deliveredResults: ['Тест A · результат доставлен', 'Тест B · результат доставлен'], sourceStatus: 'Доставка завершена', databaseState: 'Направление и заказ найдены в DEMO-БД',
    mappingRows: [
      { kind: 'Услуга', invitroCode: 'NMU-1001', invitroName: 'Услуга INVITRO · DEMO', vendorCode: 'V-SVC-77', vendorName: 'Услуга в МИС/ЛИС · DEMO', status: 'Замапплено' },
      { kind: 'Биоматериал', invitroCode: 'BIO-01', invitroName: 'Сыворотка · DEMO', vendorCode: 'V-BIO-01', vendorName: 'Материал · DEMO', status: 'Замапплено' },
      { kind: 'Тест', invitroCode: 'NMU-T01', invitroName: 'Тест A · DEMO', vendorCode: 'V-T01', vendorName: 'Тест A в МИС/ЛИС', status: 'Замапплено' },
      { kind: 'Тест', invitroCode: 'NMU-T02', invitroName: 'Тест B · DEMO', vendorCode: 'V-T02', vendorName: 'Тест B в МИС/ЛИС', status: 'Замапплено' },
    ],
    stages: [
      { id: 'services', number: 1, title: 'Получение услуг / создание направления', mappingType: 'Маппинг услуг', state: 'ok', summary: 'Услуги сопоставлены корректно.', action: 'Ничего исправлять не требуется.' },
      { id: 'checkin', number: 2, title: 'Чекин', mappingType: 'Маппинг услуг', state: 'ok', summary: 'Повторная проверка услуг пройдена.', action: 'Направление может идти дальше по процессу.' },
      { id: 'delivery', number: 3, title: 'Доставка результатов', mappingType: 'Маппинг тестов', state: 'ok', summary: 'Все тесты сопоставлены, результаты доставлены.', action: 'Дополнительных действий нет.' },
    ],
  },
  {
    scenario: 'S2', integration: 'Адыгея', barcode: '2236514265', externalId: 'DIR-DEMO-002', client: 'Демо-клиент 2', clientCode: 'CLI-DEMO-02', lpu: 'ЛПУ · DEMO 02', createdAt: '21.08.2026 09:40', inz: [], serviceName: 'Услуга обследования · DEMO', assignedTests: [], deliveredResults: [], sourceStatus: 'Направление получено', databaseState: 'Направление найдено, внутренний заказ ещё не создан',
    mappingRows: [
      { kind: 'Услуга', invitroCode: 'NMU-2001', invitroName: 'Услуга INVITRO · DEMO', vendorCode: 'V-SVC-88', vendorName: 'Услуга в МИС/ЛИС · DEMO', status: 'Нет маппинга' },
      { kind: 'Биоматериал', invitroCode: 'BIO-02', invitroName: 'Кровь · DEMO', vendorCode: 'V-BIO-02', vendorName: 'Материал · DEMO', status: 'Замапплено' },
    ],
    stages: [
      { id: 'services', number: 1, title: 'Получение услуг / создание направления', mappingType: 'Маппинг услуг', state: 'error', summary: 'Для одной услуги отсутствует маппинг.', action: 'Исправить маппинг до поступления пробирок в лабораторию и проверить сопоставление повторно.' },
      { id: 'checkin', number: 2, title: 'Чекин', mappingType: 'Маппинг услуг', state: 'pending', summary: 'Чекин ещё не выполнен.', action: 'После исправления маппинга система повторно проверит услуги на чекине.' },
      { id: 'delivery', number: 3, title: 'Доставка результатов', mappingType: 'Маппинг тестов', state: 'pending', summary: 'Этап ещё не наступил.', action: 'Контроль тестового маппинга выполняется на этапе доставки.' },
    ],
    issueLabel: 'Нет маппинга услуги', recommendedRoute: 'Сопровождение маппинга (точная команда — TBD)', incidentDescription: 'На этапе создания направления отсутствует маппинг услуги. Требуется проверить код услуги INVITRO и код услуги в МИС/ЛИС, исправить сопоставление до чекина.',
  },
  {
    scenario: 'S3', integration: 'Брегис', barcode: '3236514265', externalId: 'DIR-DEMO-003', client: 'Демо-клиент 3', clientCode: 'CLI-DEMO-03', lpu: 'ЛПУ · DEMO 03', createdAt: '21.08.2026 10:05', inz: ['942476083'], serviceName: 'Услуга обследования · DEMO', assignedTests: ['Тест C · DEMO'], deliveredResults: [], sourceStatus: 'Ошибка чекина', databaseState: 'Направление и внутренний заказ найдены',
    mappingRows: [
      { kind: 'Услуга', invitroCode: 'NMU-3001', invitroName: 'Услуга INVITRO · DEMO', vendorCode: 'V-SVC-99', vendorName: 'Услуга в МИС/ЛИС · DEMO', status: 'Замапплено' },
      { kind: 'Биоматериал', invitroCode: 'BIO-03', invitroName: 'Биоматериал INVITRO · DEMO', vendorCode: 'V-BIO-03', vendorName: 'Материал в МИС/ЛИС · DEMO', status: 'Некорректный маппинг' },
    ],
    stages: [
      { id: 'services', number: 1, title: 'Получение услуг / создание направления', mappingType: 'Маппинг услуг', state: 'ok', summary: 'На создании направление прошло контроль.', action: 'Переходим к повторной проверке на чекине.' },
      { id: 'checkin', number: 2, title: 'Чекин', mappingType: 'Маппинг услуг', state: 'error', summary: 'Чекин не прошёл: обнаружен некорректный маппинг биоматериала.', action: 'Оперативно исправить маппинг. Если нечекин вызван отсутствием маппинга, направить заявку на ручное лабораторное исполнение.' },
      { id: 'delivery', number: 3, title: 'Доставка результатов', mappingType: 'Маппинг тестов', state: 'pending', summary: 'Доставка не началась.', action: 'После успешного чекина перейти к контролю тестового маппинга.' },
    ],
    issueLabel: 'Ошибка чекина / маппинг биоматериала', recommendedRoute: 'Сопровождение маппинга (точная команда — TBD) + при необходимости ручное лабораторное исполнение', incidentDescription: 'На этапе чекина обнаружена ошибка маппинга биоматериала. Требуется исправить сопоставление. При нечекине из-за отсутствующего маппинга предусмотреть ручное лабораторное исполнение заявки.',
  },
  {
    scenario: 'S4', integration: 'Нетрика', barcode: '4236514265', externalId: 'DIR-DEMO-004', client: 'Демо-клиент 4', clientCode: 'CLI-DEMO-04', lpu: 'ЛПУ · DEMO 04', createdAt: '21.08.2026 10:30', inz: ['942476084'], serviceName: 'Профиль обследования · DEMO', assignedTests: ['Тест D · качественный', 'Тест E · количественный'], deliveredResults: ['Тест D · результат сформирован'], sourceStatus: 'Ошибка доставки', databaseState: 'Направление, заказ и результаты найдены',
    mappingRows: [
      { kind: 'Услуга', invitroCode: 'NMU-4001', invitroName: 'Услуга INVITRO · DEMO', vendorCode: 'V-SVC-44', vendorName: 'Услуга в МИС/ЛИС · DEMO', status: 'Замапплено' },
      { kind: 'Тест', invitroCode: 'NMU-T04', invitroName: 'Тест D · DEMO', vendorCode: 'V-T04', vendorName: 'Тест D в МИС/ЛИС', status: 'Замапплено' },
      { kind: 'Тест', invitroCode: 'NMU-T05', invitroName: 'Тест E · DEMO', vendorCode: 'V-T05', vendorName: 'Тест E в МИС/ЛИС', status: 'Нет маппинга' },
    ],
    stages: [
      { id: 'services', number: 1, title: 'Получение услуг / создание направления', mappingType: 'Маппинг услуг', state: 'ok', summary: 'Маппинг услуг корректен.', action: 'Контроль пройден.' },
      { id: 'checkin', number: 2, title: 'Чекин', mappingType: 'Маппинг услуг', state: 'ok', summary: 'Чекин пройден.', action: 'Направление передано дальше.' },
      { id: 'delivery', number: 3, title: 'Доставка результатов', mappingType: 'Маппинг тестов', state: 'error', summary: 'У одного теста отсутствует маппинг. Автоматическая доставка результата по нему не выполнена.', action: 'Исправить тестовый маппинг и повторно инициировать отправку результата. Для интеграции в поддержке - через заявку ГСТИ; для интеграции на сопровождении разработки - в чат «Ежевика».' },
    ],
    issueLabel: 'Ошибка доставки / нет маппинга теста', recommendedRoute: 'ГСТИ / техническая поддержка либо команда разработки / чат «Ежевика» - зависит от стадии сопровождения интеграции (источник стадии — TBD)', incidentDescription: 'На этапе доставки отсутствует маппинг теста. Требуется исправить тестовый маппинг и повторно инициировать отправку результата. Маршрут повторной отправки зависит от того, передана ли интеграция в поддержку.',
  },
  {
    scenario: 'S5', integration: 'Нетрика', barcode: '9999999999', externalId: '', client: '', clientCode: '', lpu: '', createdAt: '', inz: [], serviceName: '', assignedTests: [], deliveredResults: [], sourceStatus: 'Не найдено', databaseState: 'В DEMO-БД направление не найдено', mappingRows: [], stages: [], issueLabel: 'Направление не найдено в базе данных', recommendedRoute: 'Техническая поддержка / ГСТИ', incidentDescription: 'Направление не найдено в системе по переданному идентификатору. Требуется проверить идентификатор, интеграцию и наличие данных в базе.',
  },
];

const stageStyles: Record<StageState, string> = {
  ok: 'border-emerald-200 bg-emerald-50', warning: 'border-amber-200 bg-amber-50', error: 'border-red-200 bg-red-50', pending: 'border-slate-200 bg-slate-50',
};

const scenarioLabels: Record<DemoScenarioId, string> = {
  S1: 'Успешный путь', S2: 'Нет маппинга услуги', S3: 'Ошибка чекина', S4: 'Ошибка доставки', S5: 'Не найдено',
};

export const DirectionCheckView: React.FC<DirectionCheckViewProps> = ({ onCreateIncident }) => {
  const [integration, setIntegration] = useState<Integration | ''>('');
  const [barcode, setBarcode] = useState('');
  const [result, setResult] = useState<DemoDirection | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const matchingScenario = useMemo(() => demoDirections.find((item) => item.integration === integration && item.barcode === barcode.trim()), [integration, barcode]);

  const clearResult = () => { setResult(null); setNotFound(false); setValidationMessage(''); };

  const handleSearch = () => {
    if (!integration) { setValidationMessage('Сначала выберите интеграцию.'); setResult(null); setNotFound(false); return; }
    if (!barcode.trim()) { setValidationMessage('Введите номер направления или штрихкод из алерта / чат-бота.'); setResult(null); setNotFound(false); return; }
    setValidationMessage('');
    if (matchingScenario && matchingScenario.scenario !== 'S5') { setResult(matchingScenario); setNotFound(false); return; }
    setResult(null); setNotFound(true);
  };

  const selectScenario = (scenarioId: DemoScenarioId) => {
    const scenario = demoDirections.find((item) => item.scenario === scenarioId)!;
    setIntegration(scenario.integration); setBarcode(scenario.barcode); setValidationMessage('');
    if (scenarioId === 'S5') { setResult(null); setNotFound(true); } else { setResult(scenario); setNotFound(false); }
  };

  const createIncident = (direction: DemoDirection) => {
    onCreateIncident({
      source: 'GOVIN-303',
      client: direction.client || undefined,
      clientCode: direction.clientCode || undefined,
      lpu: direction.lpu || undefined,
      vendor: direction.integration,
      inz: direction.inz.join(', '),
      contextLabel: `${direction.integration} · ${direction.issueLabel || direction.sourceStatus} · ${direction.barcode}`,
      description: `GOVIN v0.5 · ${direction.issueLabel || direction.sourceStatus}. Этап: ${direction.stages.find((stage) => stage.state === 'error')?.title || 'Проверка направления'}. Клиент: ${direction.client || 'нет данных'}. ЛПУ: ${direction.lpu || 'нет данных'}. ИНЗ: ${direction.inz.join(', ') || 'не присвоен'}. Интеграция: ${direction.integration}. ${direction.incidentDescription || ''} Рекомендованный маршрут: ${direction.recommendedRoute || 'уточнить по регламенту'}.`,
    });
  };

  const createNotFoundIncident = () => {
    if (!integration || !barcode.trim()) return;
    onCreateIncident({
      source: 'GOVIN-303',
      vendor: integration,
      inz: '',
      contextLabel: `${integration} · направление не найдено · ${barcode.trim()}`,
      description: `GOVIN v0.5 · Направление не найдено в базе данных. Идентификатор: ${barcode.trim()}. Интеграция: ${integration}. Клиент, ЛПУ и ИНЗ в GOVIN не определены и должны быть дополнены вручную. Требуется проверить идентификатор, интеграцию и наличие данных в базе. Рекомендованный маршрут: техническая поддержка / ГСТИ.`,
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5 py-4 pb-16 notranslate" translate="no">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 text-[#007f89] font-bold text-xs uppercase tracking-wider mb-2"><Waypoints className="w-4 h-4" /> GOVIN-303 · DEMO v0.5</div>
        <h1 className="text-2xl font-extrabold text-slate-900">Проверка направления и маппинга</h1>
        <p className="text-sm text-slate-600 mt-1">Три контрольных этапа ДКП: получение услуг → чекин → доставка результатов.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr_auto] gap-3 items-end">
          <label><span className="text-xs font-bold text-slate-700 block mb-1">Интеграция</span><select value={integration} onChange={(e) => { setIntegration(e.target.value as Integration | ''); clearResult(); }} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm"><option value="">Выберите интеграцию</option>{integrations.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span className="text-xs font-bold text-slate-700 block mb-1">Номер направления / штрихкод</span><input value={barcode} onChange={(e) => { setBarcode(e.target.value); clearResult(); }} onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }} placeholder="Введите номер из алерта / чат-бота" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm" /><span className="block mt-1 text-[11px] text-slate-500">Подсказка для ДКП: используйте идентификатор направления, который пришёл в алерте или чат-боте. Точный промышленный тип поиска требует сверки контракта.</span></label>
          <button type="button" onClick={handleSearch} className="px-5 py-2.5 rounded-xl bg-[#0099a8] hover:bg-[#007f89] text-white text-sm font-bold inline-flex items-center justify-center gap-2"><Search className="w-4 h-4" /> Найти</button>
        </div>
        {validationMessage && <div role="alert" className="mt-3 text-xs font-semibold text-red-600">{validationMessage}</div>}
        <div className="flex flex-wrap gap-2 mt-5">{(Object.keys(scenarioLabels) as DemoScenarioId[]).map((id) => <button key={id} type="button" onClick={() => selectScenario(id)} className="px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold">{id} · {scenarioLabels[id]}</button>)}</div>
      </div>

      {notFound && (
        <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-xs">
          <div className="flex gap-3"><CircleHelp className="w-5 h-5 text-amber-600 mt-0.5"/><div className="flex-1"><h2 className="font-extrabold text-slate-900">Направление не найдено</h2><p className="text-sm text-slate-600 mt-1">Проверьте номер/штрихкод и выбранную интеграцию. Если данных нет в базе, регламент требует эскалации в техническую поддержку.</p><div className="mt-3 text-xs rounded-lg border border-amber-200 bg-amber-50 p-3"><strong>Маршрут:</strong> техническая поддержка / ГСТИ. Автоматический поиск по всем интеграциям не выполняется.</div><button type="button" onClick={createNotFoundIncident} className="mt-4 px-4 py-2 rounded-lg border border-[#8bd2d6] bg-white text-[#007f89] font-bold text-sm inline-flex items-center gap-2 hover:bg-[#e9f8f8]">Создать инцидент в ПРИИЗ <ArrowRight className="w-4 h-4"/></button></div></div>
        </div>
      )}

      {result && (
        <>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><div className="text-xs text-slate-500">{result.integration} · внешнее направление</div><div className="font-mono font-bold text-slate-900 mt-1">{result.externalId}</div></div><div className="flex gap-2 flex-wrap"><span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">{result.sourceStatus}</span>{result.issueLabel && <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold">{result.issueLabel}</span>}</div></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-5 text-sm"><div className="p-4 rounded-xl bg-slate-50 border border-slate-200"><span className="text-xs text-slate-500 block">Клиент / ЛПУ</span><strong>{result.client}</strong><span className="block text-xs mt-1">{result.lpu}</span></div><div className="p-4 rounded-xl bg-slate-50 border border-slate-200"><span className="text-xs text-slate-500 block">Создано</span><strong>{result.createdAt}</strong><span className="text-xs text-slate-500 block mt-2">ИНЗ</span><strong>{result.inz.join(', ') || 'Не присвоен'}</strong></div><div className="p-4 rounded-xl bg-slate-50 border border-slate-200"><span className="text-xs text-slate-500 block">Услуга</span><strong>{result.serviceName}</strong><span className="text-xs text-slate-500 block mt-2">Штрихкод</span><strong>{result.barcode}</strong></div><div className="p-4 rounded-xl bg-slate-50 border border-slate-200"><span className="text-xs text-slate-500 block">База данных</span><strong>{result.databaseState}</strong></div></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {result.stages.map((stage) => <div key={stage.id} className={`rounded-2xl border p-5 ${stageStyles[stage.state]}`}><div className="flex items-center justify-between gap-2"><span className="text-xs font-black">Этап {stage.number}</span>{stage.state === 'ok' ? <CheckCircle2 className="w-5 h-5 text-emerald-600"/> : stage.state === 'error' ? <AlertTriangle className="w-5 h-5 text-red-600"/> : <Wrench className="w-5 h-5 text-slate-500"/>}</div><h3 className="font-extrabold text-slate-900 mt-2">{stage.title}</h3><div className="text-xs font-bold text-slate-600 mt-1">Контроль: {stage.mappingType}</div><p className="text-sm text-slate-700 mt-3">{stage.summary}</p><div className="mt-3 pt-3 border-t border-black/10 text-xs text-slate-700"><strong>Действие ДКП:</strong> {stage.action}</div></div>)}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3"><Database className="w-5 h-5 text-[#0099a8]"/><h2 className="font-extrabold text-slate-900">Сводка маппинга</h2></div>
            <div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr className="text-left border-b border-slate-200"><th className="py-2 pr-3">Тип</th><th className="py-2 pr-3">Код INVITRO / НМУ</th><th className="py-2 pr-3">Название INVITRO</th><th className="py-2 pr-3">Код вендора</th><th className="py-2 pr-3">Название в МИС/ЛИС</th><th className="py-2">Статус</th></tr></thead><tbody>{result.mappingRows.map((row, index) => <tr key={`${row.kind}-${index}`} className="border-b border-slate-100"><td className="py-3 pr-3 font-bold">{row.kind}</td><td className="py-3 pr-3 font-mono">{row.invitroCode}</td><td className="py-3 pr-3">{row.invitroName}</td><td className="py-3 pr-3 font-mono">{row.vendorCode}</td><td className="py-3 pr-3">{row.vendorName}</td><td className="py-3"><span className={`px-2 py-1 rounded-full font-bold ${row.status === 'Замапплено' ? 'bg-emerald-50 text-emerald-700' : row.status === 'Нет данных' ? 'bg-slate-100 text-slate-600' : 'bg-red-50 text-red-700'}`}>{row.status}</span></td></tr>)}</tbody></table></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5"><div className="flex items-center gap-2"><FlaskConical className="w-5 h-5 text-[#0099a8]"/><h3 className="font-extrabold">Тесты и результаты</h3></div><div className="mt-3 text-xs"><strong>Назначенные тесты:</strong> {result.assignedTests.join(', ') || 'Нет данных'}</div><div className="mt-2 text-xs"><strong>Доставленные результаты:</strong> {result.deliveredResults.join(', ') || 'Нет данных'}</div></div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5"><h3 className="font-extrabold">Что делать дальше</h3><p className="text-sm text-slate-700 mt-2">{result.recommendedRoute ? <>Рекомендованный маршрут: <strong>{result.recommendedRoute}</strong>.</> : 'Регламентных действий не требуется.'}</p>{result.issueLabel && <button type="button" onClick={() => createIncident(result)} className="mt-4 px-4 py-2 rounded-lg border border-[#8bd2d6] bg-white text-[#007f89] font-bold text-sm inline-flex items-center gap-2 hover:bg-[#e9f8f8]">Создать инцидент в ПРИИЗ <ArrowRight className="w-4 h-4"/></button>}</div>
          </div>
        </>
      )}

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-[11px] text-slate-500">Регламент v0.5 основан на валидации команды ДКП от 21.08.2026. В публичном DEMO используются только вымышленные данные. Автоматическая маршрутизация в реальные команды, повторная отправка результатов и реальные API не выполняются.</div>
    </div>
  );
};
