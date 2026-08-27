import React, { useMemo, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Search, Waypoints } from 'lucide-react';
import { IncidentPrefill } from '../types';

interface DirectionCheckViewProps {
  onCreateIncident: (prefill: IncidentPrefill) => void;
}

type StageStatus = 'ok' | 'error' | 'pending';
type Stage = {
  name: string;
  control: string;
  status: StageStatus;
  observed: string;
  action: string;
};
type MappingRow = {
  type: 'Услуга' | 'Тест';
  invitroCode: string;
  invitroName: string;
  vendorCode: string;
  vendorName: string;
  status: 'Замапплено' | 'Нет маппинга';
};
type DirectionScenario = {
  key: 'S1' | 'S2' | 'S3' | 'S4';
  integration: string;
  barcode: string;
  externalId: string;
  client: string;
  clientCode: string;
  lpu: string;
  createdAt: string;
  inz: string;
  service: string;
  status: string;
  database: string;
  issue: string;
  route: string;
  assignedTests: string;
  deliveredTests: string;
  stages: Stage[];
  mapping: MappingRow[];
};

type NotFoundScenario = {
  key: 'S5';
  integration: string;
  barcode: string;
};

type Scenario = DirectionScenario | NotFoundScenario;

const integrations = ['Нетрика', 'Адыгея', 'Брегис'];

const scenarios: DirectionScenario[] = [
  {
    key: 'S1', integration: 'Нетрика', barcode: '1236514265', externalId: 'DIR-DEMO-001', client: 'Демо-клиент 1', clientCode: 'CLI-DEMO-01', lpu: 'ЛПУ · DEMO 01', createdAt: '21.08.2026 09:15', inz: '942476082', service: 'Профиль обследования · DEMO', status: 'Доставка завершена', database: 'Направление и заказ найдены', issue: '', route: 'Регламентных действий не требуется.', assignedTests: 'Тест A · качественный, Тест B · количественный', deliveredTests: 'Тест A · результат доставлен, Тест B · результат доставлен',
    stages: [
      { name: 'Получение услуг / создание направления', control: 'Маппинг услуг', status: 'ok', observed: 'Услуги сопоставлены корректно.', action: 'Ничего исправлять не требуется.' },
      { name: 'Чекин', control: 'Маппинг услуг', status: 'ok', observed: 'Повторная проверка услуг пройдена.', action: 'Направление может идти дальше по процессу.' },
      { name: 'Доставка результатов', control: 'Маппинг тестов', status: 'ok', observed: 'Все тесты сопоставлены, результаты доставлены.', action: 'Дополнительных действий нет.' },
    ],
    mapping: [
      { type: 'Услуга', invitroCode: 'NMU-1001', invitroName: 'Услуга INVITRO · DEMO', vendorCode: 'V-SVC-77', vendorName: 'Услуга в МИС/ЛИС', status: 'Замапплено' },
      { type: 'Тест', invitroCode: 'NMU-T01', invitroName: 'Тест A', vendorCode: 'V-T01', vendorName: 'Тест A в МИС/ЛИС', status: 'Замапплено' },
      { type: 'Тест', invitroCode: 'NMU-T02', invitroName: 'Тест B', vendorCode: 'V-T02', vendorName: 'Тест B в МИС/ЛИС', status: 'Замапплено' },
    ],
  },
  {
    key: 'S2', integration: 'Адыгея', barcode: '2236514265', externalId: 'DIR-DEMO-002', client: 'Демо-клиент 2', clientCode: 'CLI-DEMO-02', lpu: 'ЛПУ · DEMO 02', createdAt: '21.08.2026 09:40', inz: '', service: 'Услуга обследования · DEMO', status: 'Направление получено', database: 'Направление найдено, внутренний заказ ещё не создан', issue: 'Нет маппинга услуги', route: 'Сопровождение маппинга', assignedTests: 'Нет данных', deliveredTests: 'Нет данных',
    stages: [
      { name: 'Получение услуг / создание направления', control: 'Маппинг услуг', status: 'error', observed: 'Для одной услуги отсутствует маппинг.', action: 'Исправить маппинг до чекина и повторно убедиться, что услуга сопоставлена корректно.' },
      { name: 'Чекин', control: 'Маппинг услуг', status: 'pending', observed: 'Чекин ещё не выполнен.', action: 'После исправления маппинга система повторно проверит услуги на чекине.' },
      { name: 'Доставка результатов', control: 'Маппинг тестов', status: 'pending', observed: 'Этап ещё не наступил.', action: 'Контроль маппинга тестов выполняется только на этапе доставки результатов.' },
    ],
    mapping: [{ type: 'Услуга', invitroCode: 'NMU-2001', invitroName: 'Услуга INVITRO · DEMO', vendorCode: 'V-SVC-88', vendorName: 'Услуга в МИС/ЛИС', status: 'Нет маппинга' }],
  },
  {
    key: 'S3', integration: 'Брегис', barcode: '3236514265', externalId: 'DIR-DEMO-003', client: 'Демо-клиент 3', clientCode: 'CLI-DEMO-03', lpu: 'ЛПУ · DEMO 03', createdAt: '21.08.2026 10:05', inz: '942476083', service: 'Услуга обследования · DEMO', status: 'Нечекин', database: 'Направление и внутренний заказ найдены', issue: 'Нечекин / нет маппинга услуги', route: 'Исправление маппинга услуги + ручное лабораторное исполнение', assignedTests: 'Тест C · DEMO', deliveredTests: 'Нет данных',
    stages: [
      { name: 'Получение услуг / создание направления', control: 'Маппинг услуг', status: 'ok', observed: 'На создании направление прошло контроль.', action: 'Переходим к повторной проверке на чекине.' },
      { name: 'Чекин', control: 'Маппинг услуг', status: 'error', observed: 'Нечекин вызван отсутствующим маппингом услуги.', action: 'Исправить маппинг услуги и направить заявку на ручное лабораторное исполнение.' },
      { name: 'Доставка результатов', control: 'Маппинг тестов', status: 'pending', observed: 'Доставка не началась.', action: 'После прохождения чекина перейти к контролю маппинга тестов.' },
    ],
    mapping: [{ type: 'Услуга', invitroCode: 'NMU-3001', invitroName: 'Услуга INVITRO · DEMO', vendorCode: 'V-SVC-99', vendorName: 'Услуга в МИС/ЛИС', status: 'Нет маппинга' }],
  },
  {
    key: 'S4', integration: 'Нетрика', barcode: '4236514265', externalId: 'DIR-DEMO-004', client: 'Демо-клиент 4', clientCode: 'CLI-DEMO-04', lpu: 'ЛПУ · DEMO 04', createdAt: '21.08.2026 10:30', inz: '942476084', service: 'Профиль обследования · DEMO', status: 'Доставка отменена', database: 'Направление, заказ и результаты найдены; доставка не выполнена', issue: 'Ошибка доставки / нет маппинга теста', route: 'ГСТИ, если интеграция в поддержке; чат «Ежевика», если интеграция ещё на сопровождении разработки', assignedTests: 'Тест D · качественный, Тест E · количественный', deliveredTests: 'Не доставлены — доставка отменена',
    stages: [
      { name: 'Получение услуг / создание направления', control: 'Маппинг услуг', status: 'ok', observed: 'Маппинг услуг корректен.', action: 'Контроль пройден.' },
      { name: 'Чекин', control: 'Маппинг услуг', status: 'ok', observed: 'Чекин пройден.', action: 'Направление передано дальше.' },
      { name: 'Доставка результатов', control: 'Маппинг тестов', status: 'error', observed: 'У одного теста отсутствует маппинг. Доставка результатов отменена.', action: 'Исправить маппинг теста, загрузить корректный маппинг и повторно инициировать отправку результата.' },
    ],
    mapping: [
      { type: 'Услуга', invitroCode: 'NMU-4001', invitroName: 'Услуга INVITRO · DEMO', vendorCode: 'V-SVC-44', vendorName: 'Услуга в МИС/ЛИС', status: 'Замапплено' },
      { type: 'Тест', invitroCode: 'NMU-T04', invitroName: 'Тест D', vendorCode: 'V-T04', vendorName: 'Тест D в МИС/ЛИС', status: 'Замапплено' },
      { type: 'Тест', invitroCode: 'NMU-T05', invitroName: 'Тест E', vendorCode: 'V-T05', vendorName: 'Тест E в МИС/ЛИС', status: 'Нет маппинга' },
    ],
  },
];

const statusText = (status: StageStatus) => status === 'ok' ? 'Пройден' : status === 'error' ? 'Проблема' : 'Не начался';

export const DirectionCheckView: React.FC<DirectionCheckViewProps> = ({ onCreateIncident }) => {
  const [integration, setIntegration] = useState('');
  const [barcode, setBarcode] = useState('');
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [validationMessage, setValidationMessage] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [mappingOpen, setMappingOpen] = useState(false);
  const [expandedStage, setExpandedStage] = useState<number | null>(null);
  const barcodeRef = useRef<HTMLInputElement>(null);

  const direction = scenario && scenario.key !== 'S5' ? scenario : null;
  const failedStageIndex = useMemo(() => direction?.stages.findIndex((stage) => stage.status === 'error') ?? -1, [direction]);
  const failedStage = failedStageIndex >= 0 ? direction?.stages[failedStageIndex] : undefined;

  const clearResult = () => {
    setScenario(null);
    setDetailsOpen(false);
    setMappingOpen(false);
    setExpandedStage(null);
  };

  const handleSearch = () => {
    if (!integration) {
      clearResult();
      setValidationMessage('Выберите интеграцию.');
      return;
    }
    if (!barcode.trim()) {
      clearResult();
      setValidationMessage('Введите номер направления или штрихкод.');
      barcodeRef.current?.focus();
      return;
    }
    setValidationMessage('');
    const found = scenarios.find((item) => item.integration === integration && item.barcode === barcode.trim());
    if (found) {
      setScenario(found);
    } else {
      setScenario({ key: 'S5', integration, barcode: barcode.trim() });
    }
    setDetailsOpen(false);
    setMappingOpen(false);
    setExpandedStage(null);
  };

  const resetSearch = () => {
    setIntegration('');
    setBarcode('');
    setValidationMessage('');
    clearResult();
  };

  const openDetails = () => {
    if (!direction) return;
    const next = !detailsOpen;
    setDetailsOpen(next);
    setMappingOpen(false);
    if (next) setExpandedStage(failedStageIndex >= 0 ? failedStageIndex : direction.stages.length - 1);
  };

  const createIncident = () => {
    if (!scenario) return;
    if (scenario.key === 'S5') {
      onCreateIncident({
        source: 'GOVIN-303', client: '', clientCode: '', lpu: '', vendor: scenario.integration, inz: '',
        contextLabel: `${scenario.integration} · штрихкод ${scenario.barcode} · направление не найдено`,
        description: `GOVIN v0.6.0 · направление ${scenario.barcode} не найдено в интеграции ${scenario.integration}. Клиент, код клиента, ЛПУ и ИНЗ неизвестны и не подставлены. Требуется разбор.`,
      });
      return;
    }
    onCreateIncident({
      source: 'GOVIN-303',
      client: scenario.client,
      clientCode: scenario.clientCode,
      lpu: scenario.lpu,
      vendor: scenario.integration,
      inz: scenario.inz,
      contextLabel: `${scenario.integration} · ${scenario.externalId} · штрихкод ${scenario.barcode}`,
      description: `GOVIN v0.6.0 · ${scenario.issue}. Идентификатор направления: ${scenario.barcode}. Интеграция: ${scenario.integration}. Клиент: ${scenario.client}. ЛПУ: ${scenario.lpu}. ИНЗ: ${scenario.inz || 'не присвоен / нет данных'}. Рекомендованный маршрут: ${scenario.route}.`,
    });
  };

  const outcomeTitle = scenario?.key === 'S5' ? 'Направление не найдено' : direction?.issue || 'С направлением всё в порядке';
  const outcomeContext = scenario?.key === 'S5' ? 'GOVIN не нашёл направление в выбранной интеграции.' : direction?.issue ? `Проблемный этап: ${failedStage?.name || 'Проверка направления'}.` : 'Создание, чекин и доставка результатов прошли контроль.';
  const actionNow = scenario?.key === 'S5' ? 'Проверьте номер и интеграцию. Если данные верны — создайте обращение в ПРИИЗ.' : failedStage?.action || 'Ничего делать не нужно. Дополнительных действий нет.';

  return (
    <div className="max-w-6xl mx-auto space-y-4 py-4 pb-16 notranslate" translate="no">
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[#007f89] font-bold text-xs uppercase tracking-wider mb-2"><Waypoints className="w-4 h-4" /> GOVIN-303</div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#17383d]">Проверка направления и маппинга</h1>
          <p className="text-sm text-slate-600 mt-1">Найдите направление — GOVIN покажет результат и следующее действие.</p>
        </div>
        <span className="self-start px-3 py-1.5 rounded-lg bg-[#e9f8f8] text-[#007f89] text-xs font-bold">DEMO v0.6.0</span>
      </div>

      <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs" aria-label="Проверка направления">
        <h2 className="text-base font-extrabold text-[#17383d] mb-4">Проверить направление</h2>
        <div className="grid grid-cols-1 md:grid-cols-[270px_1fr_230px] gap-3 items-start">
          <label className="text-sm font-bold text-slate-700">Интеграция
            <select aria-label="Интеграция" value={integration} onChange={(e) => { setIntegration(e.target.value); setValidationMessage(''); clearResult(); if (e.target.value) setTimeout(() => barcodeRef.current?.focus(), 0); }} className="mt-1 w-full h-12 px-3 rounded-lg border border-slate-300 bg-white text-base">
              <option value="">Выберите интеграцию</option>{integrations.map((item) => <option key={item}>{item}</option>)}
            </select>
            <span className="block mt-1 text-xs font-normal text-slate-500">Источник направления</span>
          </label>
          <label className="text-sm font-bold text-slate-700">Номер направления / штрихкод
            <input ref={barcodeRef} aria-label="Номер направления / штрихкод" value={barcode} onChange={(e) => { setBarcode(e.target.value); setValidationMessage(''); clearResult(); }} onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }} placeholder="Введите номер из алерта или чат-бота" className="mt-1 w-full h-12 px-3 rounded-lg border border-slate-300 bg-white text-base" />
            <span className="block mt-1 text-xs font-normal text-slate-500">Можно ввести номер вручную или отсканировать штрихкод</span>
          </label>
          <div className="md:pt-[25px]"><button type="button" onClick={handleSearch} className="w-full h-12 rounded-lg bg-[#0099a8] hover:bg-[#007f89] text-white font-extrabold text-base inline-flex items-center justify-center gap-2"><Search className="w-4 h-4" />Проверить направление</button><span className="block mt-1 text-xs text-slate-500">Получите итог и следующий шаг</span></div>
        </div>
        {validationMessage && <div role="alert" className="mt-3 text-sm font-semibold text-red-600">{validationMessage}</div>}
        <details className="mt-3 text-xs text-slate-400"><summary className="cursor-pointer select-none text-right">DEMO-сценарии</summary><div className="flex flex-wrap gap-2 justify-end mt-2">{scenarios.map((item) => <button key={item.key} type="button" onClick={() => { setIntegration(item.integration); setBarcode(item.barcode); setScenario(item); setDetailsOpen(false); setMappingOpen(false); setExpandedStage(null); }} className="px-2.5 py-1.5 border border-slate-200 bg-slate-50 rounded-md text-slate-600 font-semibold">{item.key} · {item.issue || 'Успешный путь'}</button>)}<button type="button" onClick={() => { setIntegration('Нетрика'); setBarcode('9999999999'); setScenario({ key: 'S5', integration: 'Нетрика', barcode: '9999999999' }); setDetailsOpen(false); setMappingOpen(false); }} className="px-2.5 py-1.5 border border-slate-200 bg-slate-50 rounded-md text-slate-600 font-semibold">S5 · Не найдено</button></div></details>
      </section>

      {scenario && <section aria-label="Итог и следующее действие" className={`rounded-xl border p-5 md:p-6 ${scenario.key === 'S5' ? 'bg-amber-50 border-amber-200' : direction?.issue ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
        <div className="text-xs font-black uppercase tracking-wider text-slate-600">Итог проверки</div>
        <h2 className="text-2xl md:text-[26px] leading-tight font-extrabold text-[#17383d] mt-1">{outcomeTitle}</h2>
        <p className="text-base text-slate-700 mt-2">{outcomeContext}</p>
        <div className="mt-5 bg-white/80 border border-slate-200/70 rounded-lg p-4"><div className="text-sm font-extrabold text-slate-600">Что делать сейчас</div><p className="text-lg md:text-xl font-extrabold text-[#17383d] leading-snug mt-1">{actionNow}</p>{direction?.issue && <p className="text-sm text-slate-600 mt-2">Маршрут: <strong>{direction.route}</strong>.</p>}{scenario.key === 'S5' && <p className="text-sm text-slate-600 mt-2">Маршрут: <strong>техническая поддержка / ГСТИ</strong>.</p>}</div>
        <div className="flex flex-col sm:flex-row gap-2 mt-5">
          <button type="button" onClick={scenario.key === 'S1' ? resetSearch : createIncident} className="h-12 px-5 rounded-lg bg-[#0099a8] hover:bg-[#007f89] text-white font-extrabold">{scenario.key === 'S1' ? 'Проверить другое направление' : 'Создать обращение в ПРИИЗ'}</button>
          {scenario.key !== 'S5' && <button type="button" onClick={openDetails} className="h-12 px-5 rounded-lg border border-slate-300 bg-white text-slate-700 font-bold">{detailsOpen ? 'Скрыть детали проверки' : 'Показать детали проверки'}</button>}
          {scenario.key === 'S5' && <button type="button" onClick={resetSearch} className="h-12 px-5 rounded-lg border border-slate-300 bg-white text-slate-700 font-bold">Проверить другое направление</button>}
        </div>
      </section>}

      {direction && detailsOpen && <section aria-label="Детали проверки" className="space-y-3">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-2"><div><div className="text-xs text-slate-500">{direction.integration} · внешнее направление</div><div className="font-mono font-bold text-slate-900 break-all mt-1">{direction.externalId}</div></div><span className="self-start px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">{direction.status}</span></div>
          <dl className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4"><div><dt className="text-xs text-slate-500">Клиент / ЛПУ</dt><dd className="text-sm font-bold mt-1">{direction.client}<span className="block font-normal text-slate-500">{direction.lpu}</span></dd></div><div><dt className="text-xs text-slate-500">Создано / ИНЗ</dt><dd className="text-sm font-bold mt-1">{direction.createdAt}<span className="block font-normal text-slate-500">{direction.inz || 'Не присвоен'}</span></dd></div><div><dt className="text-xs text-slate-500">Услуга / штрихкод</dt><dd className="text-sm font-bold mt-1">{direction.service}<span className="block font-normal text-slate-500 break-all">{direction.barcode}</span></dd></div><div><dt className="text-xs text-slate-500">База данных</dt><dd className="text-sm font-bold mt-1">{direction.database}</dd></div></dl>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4"><div className="flex flex-col sm:flex-row justify-between gap-1 mb-3"><h3 className="font-extrabold text-[#17383d]">Этапы процесса</h3><span className="text-xs text-slate-500">Нажмите этап, чтобы посмотреть подробности</span></div><div className="grid grid-cols-1 md:grid-cols-3 gap-2">{direction.stages.map((stage, index) => <button key={stage.name} type="button" onClick={() => setExpandedStage(expandedStage === index ? null : index)} className={`text-left p-3 rounded-lg border min-h-24 ${stage.status === 'error' ? 'bg-red-50 border-red-200' : stage.status === 'ok' ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}><div className="flex justify-between gap-2 text-xs font-extrabold"><span>Этап {index + 1}</span><span>{statusText(stage.status)}</span></div><div className="text-sm font-extrabold mt-2">{stage.name}</div><div className="text-xs text-slate-500 mt-1">{stage.control}</div></button>)}</div>{expandedStage !== null && <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 mt-3 pt-3"><div><b className="block text-xs uppercase text-slate-500 mb-1">Что проверяем</b><span className="text-sm">{direction.stages[expandedStage].control}</span></div><div><b className="block text-xs uppercase text-slate-500 mb-1">Что увидели</b><span className="text-sm">{direction.stages[expandedStage].observed}</span></div><div><b className="block text-xs uppercase text-slate-500 mb-1">Действие ДКП</b><span className="text-sm">{direction.stages[expandedStage].action}</span></div></div>}</div>
        <div className="bg-white rounded-xl border border-slate-200 p-4"><div className="flex flex-col sm:flex-row justify-between gap-3"><div><h3 className="font-extrabold text-[#17383d]">Тесты и результаты</h3><p className="text-sm mt-2 text-slate-600"><strong>Назначенные:</strong> {direction.assignedTests}</p><p className="text-sm mt-1 text-slate-600"><strong>Доставленные:</strong> {direction.deliveredTests}</p></div><button type="button" onClick={() => setMappingOpen(!mappingOpen)} aria-expanded={mappingOpen} className="self-start h-11 px-4 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-bold inline-flex items-center gap-2">{mappingOpen ? 'Скрыть маппинг' : 'Показать маппинг'}{mappingOpen ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}</button></div>{mappingOpen && <div className="overflow-x-auto mt-4 pt-3 border-t border-slate-100"><table className="w-full text-xs min-w-[760px]"><thead><tr className="bg-slate-50 text-slate-600"><th className="p-2 text-left">Тип</th><th className="p-2 text-left">Код INVITRO / НМУ</th><th className="p-2 text-left">Название INVITRO</th><th className="p-2 text-left">Код вендора</th><th className="p-2 text-left">Название в МИС/ЛИС</th><th className="p-2 text-left">Статус</th></tr></thead><tbody>{direction.mapping.map((row) => <tr key={`${row.type}-${row.invitroCode}`} className="border-b border-slate-100"><td className="p-2 font-bold">{row.type}</td><td className="p-2">{row.invitroCode}</td><td className="p-2">{row.invitroName}</td><td className="p-2">{row.vendorCode}</td><td className="p-2">{row.vendorName}</td><td className={`p-2 font-bold ${row.status === 'Замапплено' ? 'text-emerald-700' : 'text-red-700'}`}>{row.status}</td></tr>)}</tbody></table></div>}</div>
      </section>}

      <div className="flex items-start gap-2 text-[11px] text-slate-400"><AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />Только вымышленные DEMO-данные. Реальные API, ПДн и медицинские данные не используются.</div>
    </div>
  );
};
