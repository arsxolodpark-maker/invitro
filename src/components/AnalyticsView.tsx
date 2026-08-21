/**
 * Product and process analytics for the PRIIZ prototype.
 */

import React from 'react';
import { getProductMetrics } from '../services/incidents';
import { Zap, Info } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const metrics = getProductMetrics();

  return (
    <div className="max-w-7xl mx-auto space-y-6 py-4 pb-16 notranslate" translate="no">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-extrabold text-[#17383d] tracking-tight">Аналитика ПРИИЗ</h1>
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">DEMO DATA</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Качество входных данных, скорость решения, повторяемость и структура обращений.</p>
        </div>
        <div className="text-xs text-slate-500 bg-white px-4 py-2.5 rounded-xl border border-[#dfeaea]">Период: <strong>последние 30 дней · DEMO</strong></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Полнота с первого раза" value={`${metrics.firstTimeCompletenessRate}%`} note="Фактический baseline ожидается" />
        <MetricCard title="Уточнений на обращение" value={metrics.avgClarificationCount} note="Фактический baseline ожидается" />
        <MetricCard title="Среднее время решения" value={`${metrics.mttrMinutes} мин`} note="Фактический baseline ожидается" />
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative"><div className="flex items-center justify-between gap-2"><span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Доля самообслуживания</span><span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#e9f8f8] text-[#007f8a] border border-[#b9e3e4]">DEMO</span></div><div className="mt-3 flex items-baseline justify-between"><span className="text-3xl font-extrabold text-slate-900">{metrics.selfServiceRate}%</span><Zap className="w-5 h-5 text-[#0099a8]" /></div><p className="mt-1 text-[11px] text-slate-500">Фактический baseline ожидается</p></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <SmallMetric title="Время до полного комплекта данных" value={`${metrics.avgTimeToFullDataMinutes} мин`} note="Демонстрационное значение" />
        <SmallMetric title="Повторные обращения" value={`${metrics.repeatIncidentRate}%`} note="Эффект проверяется на фактических данных" />
        <SmallMetric title="Обращения вне ПРИИЗ" value={`${metrics.nonPriizIncidentShare}%`} note="Фактический baseline ожидается" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4"><div><h2 className="font-bold text-slate-900 text-base">Структура обращений по типам</h2><p className="text-xs text-slate-500">Пока в прототипе используется только подтвержденный рабочий сценарий INC-02.</p></div><span className="text-xs font-bold px-2.5 py-1 bg-[#e9f8f8] text-[#007f8a] rounded-full border border-[#b9e3e4]">DEMO · 30 дней</span></div>
        <div className="overflow-x-auto"><table className="w-full text-left border-collapse text-sm"><thead><tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider"><th className="py-3.5 px-4">Код</th><th className="py-3.5 px-4">Тип обращения</th><th className="py-3.5 px-4 text-center">Количество</th><th className="py-3.5 px-4 text-center">Среднее время, мин</th><th className="py-3.5 px-4 text-center">Повторы, %</th><th className="py-3.5 px-4">Ответственная команда</th></tr></thead><tbody className="divide-y divide-slate-100 text-slate-800 text-xs">{metrics.typeBreakdown.map((row) => (<tr key={row.type}><td className="py-3.5 px-4 font-mono font-bold text-[#008c98]">{row.type}</td><td className="py-3.5 px-4 font-semibold text-slate-900">{row.label}</td><td className="py-3.5 px-4 text-center font-bold text-slate-900">{row.count}</td><td className="py-3.5 px-4 text-center font-mono font-medium">{row.mttrMinutes}</td><td className="py-3.5 px-4 text-center font-mono">{row.repeatRate}%</td><td className="py-3.5 px-4 text-slate-600 font-medium">{row.responsibleTeam}</td></tr>))}</tbody></table></div>
      </div>

      <div className="bg-[#eefafa] border border-[#cce8e9] rounded-2xl p-6 text-slate-800 space-y-2 shadow-2xs"><div className="flex items-center space-x-2 text-[#006e77] font-bold text-sm"><Info className="w-5 h-5 text-[#0099a8] shrink-0" /><span>Назначение метрик</span></div><p className="text-xs text-slate-700 leading-relaxed pl-7">После получения фактических данных эти показатели позволят сравнить текущий и целевой процесс. Сейчас все численные значения являются демонстрационными.</p></div>
    </div>
  );
};

const MetricCard: React.FC<{ title: string; value: React.ReactNode; note: string }> = ({ title, value, note }) => <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs"><div className="flex items-center justify-between gap-2"><span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span><span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#e9f8f8] text-[#007f8a] border border-[#b9e3e4]">DEMO</span></div><div className="mt-3 text-3xl font-extrabold text-slate-900">{value}</div><p className="mt-1 text-[11px] text-slate-500">{note}</p></div>;
const SmallMetric: React.FC<{ title: string; value: string; note: string }> = ({ title, value, note }) => <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-3"><div><span className="text-slate-500 font-semibold block">{title}</span><span className="text-2xl font-bold text-slate-900 mt-1 block">{value}</span><span className="text-[11px] text-slate-400">{note}</span></div><span className="text-xs font-bold px-2 py-1 bg-amber-50 text-amber-800 rounded border border-amber-200">DEMO</span></div>;
