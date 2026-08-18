import React, { useState } from 'react';
import { Search, ArrowRight, CheckCircle2, AlertTriangle, TestTube2, PackageCheck, Waypoints } from 'lucide-react';

interface DirectionCheckViewProps {
  onCreateIncident: () => void;
}

const integrations = ['Нетрика', 'Адыгея', 'Брегис'];

export const DirectionCheckView: React.FC<DirectionCheckViewProps> = ({ onCreateIncident }) => {
  const [integration, setIntegration] = useState('Нетрика');
  const [barcode, setBarcode] = useState('1236514265');
  const [searched, setSearched] = useState(true);

  const handleSearch = () => setSearched(Boolean(barcode.trim()));

  return (
    <div className="max-w-5xl mx-auto space-y-5 py-4 pb-16">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 text-[#007f89] font-bold text-xs uppercase tracking-wider mb-2">
          <Waypoints className="w-4 h-4" /> GOVIN-303
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Проверка статуса направления</h1>
        <p className="text-sm text-slate-600 mt-1">Отдельный модуль единого фронта ДКП. Поиск внешнего направления и просмотр его текущего состояния.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr_auto] gap-3 items-end">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Интеграция</label>
            <select value={integration} onChange={(e) => setIntegration(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm">
              {integrations.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Штрихкод направления</label>
            <input value={barcode} onChange={(e) => setBarcode(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm" />
          </div>
          <button onClick={handleSearch} className="px-4 py-2 rounded-lg bg-[#0099a8] hover:bg-[#007f89] text-white text-sm font-bold inline-flex items-center gap-2">
            <Search className="w-4 h-4" /> Найти
          </button>
        </div>
      </div>

      {searched && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs text-slate-500">{integration} · внешнее направление</div>
              <div className="font-mono font-bold text-slate-900 mt-1">a6bfa4f1-b596-43f9-b419-06b06a46ffa8</div>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">Статус: В работе</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 text-sm">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200"><span className="text-xs text-slate-500 block">Клиент</span><strong>Демо-клиент</strong><span className="text-xs text-slate-500 block mt-2">Дата направления</span><strong>25.05.2026 17:24</strong></div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200"><span className="text-xs text-slate-500 block">ИНЗ</span><strong>942476082, 942476083, 942476084</strong><span className="text-xs text-slate-500 block mt-2">Штрихкод</span><strong>{barcode}</strong></div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200"><span className="text-xs text-slate-500 block">Последняя доставка</span><strong>27.05.2026 22:23</strong><span className="text-xs text-slate-500 block mt-2">Источник</span><strong>{integration}</strong></div>
          </div>

          <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"><CheckCircle2 className="w-5 h-5 text-emerald-600 mb-2"/><strong className="block text-emerald-900">Направление получено</strong><span className="text-emerald-800">Внешний заказ найден.</span></div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"><TestTube2 className="w-5 h-5 text-emerald-600 mb-2"/><strong className="block text-emerald-900">Назначенные тесты</strong><span className="text-emerald-800">16GLU, 70EIA, 68HIV</span></div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4"><AlertTriangle className="w-5 h-5 text-amber-600 mb-2"/><strong className="block text-amber-900">Ошибка доставки</strong><span className="text-amber-800">Часть тестов не подтверждена как доставленная. DEMO.</span></div>
          </div>

          <div className="p-5 border-t border-slate-100 bg-[#f7fbfb] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-700"><PackageCheck className="w-5 h-5 text-[#0099a8]"/><span>Если требуется разбор инцидента, контекст направления можно передать в ПРИИЗ без повторного ввода.</span></div>
            <button onClick={onCreateIncident} className="px-4 py-2 rounded-lg border border-[#8bd2d6] bg-white text-[#007f89] font-bold text-sm inline-flex items-center gap-2 hover:bg-[#e9f8f8]">Создать обращение в ПРИИЗ <ArrowRight className="w-4 h-4"/></button>
          </div>
        </div>
      )}

      <p className="text-[11px] text-slate-400">Все значения на экране демонстрационные. Поля и статусы основаны на постановке GOVIN-303; реальные API в публичной версии не вызываются.</p>
    </div>
  );
};
