import React, { useMemo, useState } from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, Search, Waypoints } from 'lucide-react';
import { GOVIN_DEMO_DIRECTIONS } from './demoData';
import { GovinDirection, GovinIntegration } from './types';

interface DirectionCheckViewProps {
  onCreateIncident: () => void;
}

const integrations: GovinIntegration[] = ['Нетрика', 'Адыгея', 'Брегис'];

const stageLabel: Record<GovinDirection['uiStage'], string> = {
  RECEIVED: 'Направление получено',
  CHECKIN: 'Чекин',
  IN_PROGRESS: 'В работе',
  DELIVERY: 'Доставка',
};

export const DirectionCheckView: React.FC<DirectionCheckViewProps> = ({ onCreateIncident }) => {
  const [integration, setIntegration] = useState<GovinIntegration | ''>('');
  const [barcode, setBarcode] = useState('');
  const [searched, setSearched] = useState(false);

  const result = useMemo(() => {
    if (!searched || !integration || !barcode.trim()) return null;
    return GOVIN_DEMO_DIRECTIONS.find((item) => item.integration === integration && item.barcode === barcode.trim()) ?? null;
  }, [searched, integration, barcode]);

  const handleSearch = () => setSearched(Boolean(integration && barcode.trim()));

  return (
    <div className="max-w-5xl mx-auto space-y-5 py-4 pb-16">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 text-[#007f89] font-bold text-xs uppercase tracking-wider mb-2">
          <Waypoints className="w-4 h-4" /> GOVIN-303
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Проверка направления</h1>
        <p className="text-sm text-slate-600 mt-1">Выберите интеграцию и найдите внешнее направление по штрихкоду.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr_auto] gap-3 items-end">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Интеграция</label>
            <select value={integration} onChange={(e) => { setIntegration(e.target.value as GovinIntegration | ''); setSearched(false); }} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm">
              <option value="">Выберите интеграцию</option>
              {integrations.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Штрихкод направления</label>
            <input value={barcode} onChange={(e) => { setBarcode(e.target.value); setSearched(false); }} placeholder="Например, 1236514265" className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm" />
          </div>
          <button disabled={!integration || !barcode.trim()} onClick={handleSearch} className="px-4 py-2 rounded-lg bg-[#0099a8] disabled:bg-slate-300 hover:bg-[#007f89] text-white text-sm font-bold inline-flex items-center gap-2">
            <Search className="w-4 h-4" /> Найти
          </button>
        </div>
        <div className="mt-3 text-[11px] text-slate-400">DEMO: Нетрика 1236514265 · Адыгея 2236514265 · Брегис 3236514265 · Нетрика 4236514265</div>
      </div>

      {searched && !result && (
        <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div><div className="font-bold text-slate-900">Направление не найдено</div><div className="text-sm text-slate-600 mt-1">Проверьте штрихкод и выбранную интеграцию. Автоматический поиск по всем интеграциям в MVP не используется.</div></div>
          </div>
        </div>
      )}

      {result && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs text-slate-500">{result.integration} · внешнее направление</div>
              <div className="font-mono font-bold text-slate-900 mt-1">{result.externalId}</div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">Этап: {stageLabel[result.uiStage]}</span>
              {result.diagnosticProblem && <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold">{result.diagnosticProblem === 'CHECKIN_ERROR' ? 'Ошибка чекина' : 'Ошибка доставки'}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 text-sm">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200"><span className="text-xs text-slate-500 block">Клиент</span><strong>{result.client}</strong><span className="text-xs text-slate-500 block mt-2">Дата направления</span><strong>{new Date(result.externalOrderDate).toLocaleString('ru-RU')}</strong></div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200"><span className="text-xs text-slate-500 block">ИНЗ</span><strong>{result.inz.length ? result.inz.join(', ') : 'Не присвоен'}</strong><span className="text-xs text-slate-500 block mt-2">Штрихкод</span><strong>{result.barcode}</strong></div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200"><span className="text-xs text-slate-500 block">Исходный статус</span><strong>{result.sourceStatus}</strong><span className="text-xs text-slate-500 block mt-2">Последняя доставка</span><strong>{result.lastDeliveryDate ? new Date(result.lastDeliveryDate).toLocaleString('ru-RU') : 'Нет данных'}</strong></div>
          </div>

          <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><strong className="block text-slate-900 mb-1">Назначенные тесты</strong><span>{result.assignedTests.length ? result.assignedTests.join(', ') : 'Нет данных'}</span></div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><strong className="block text-slate-900 mb-1">Доставленные тесты</strong><span>{result.deliveredTests.length ? result.deliveredTests.join(', ') : 'Нет данных'}</span></div>
            <div className={`rounded-xl border p-4 ${result.diagnosticProblem ? 'border-red-200 bg-red-50' : 'border-emerald-200 bg-emerald-50'}`}>
              {result.diagnosticProblem ? <AlertTriangle className="w-5 h-5 text-red-600 mb-2"/> : <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-2"/>}
              <strong className="block mb-1">Диагностика</strong>
              <span>{result.checkinError || result.deliveryErrors?.join('; ') || 'Ошибки не обнаружены'}</span>
            </div>
          </div>

          <div className="p-5 border-t border-slate-100 bg-[#f7fbfb] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-sm text-slate-700"><strong>Что делать дальше:</strong> {result.diagnosticProblem ? 'передать диагностический контекст в ПРИИЗ для разбора.' : 'по данным GOVIN проблема не обнаружена.'}</div>
            <button onClick={onCreateIncident} className="px-4 py-2 rounded-lg border border-[#8bd2d6] bg-white text-[#007f89] font-bold text-sm inline-flex items-center gap-2 hover:bg-[#e9f8f8]">Создать обращение в ПРИИЗ <ArrowRight className="w-4 h-4"/></button>
          </div>
        </div>
      )}

      <p className="text-[11px] text-slate-400">Публичный демонстрационный модуль. Только вымышленные данные; реальные API, медицинские данные, ПДн, внутренние адреса и секреты не используются.</p>
    </div>
  );
};
