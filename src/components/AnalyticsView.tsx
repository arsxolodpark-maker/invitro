/**
 * Project Analytics (Продуктовая и процессная аналитика ПРИИЗ)
 */

import React from 'react';
import { getProductMetrics } from '../services/incidents';
import { Zap, Info } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const metrics = getProductMetrics();

  return (
    <div className="max-w-7xl mx-auto space-y-6 py-4 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-extrabold text-[#17383d] tracking-tight">Аналитика Project</h1>
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">DEMO DATA</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Качество контекста, скорость решения, повторяемость и структура инцидентов.</p>
        </div>
        <div className="text-xs text-slate-500 bg-white px-4 py-2.5 rounded-xl border border-[#dfeaea]">Период: <strong>последние 30 дней · DEMO</strong></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative"><div className="flex items-center justify-between gap-2"><span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Полнота с первого раза</span><span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">DEMO DATA</span></div><div className="mt-3"><span className="text-3xl font-extrabold text-slate-900">{metrics.firstTimeCompletenessRate}%</span></div><p className="mt-1 text-[11px] text-slate-500">Baseline AS-IS будет получен у владельца продукта</p></div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative"><div className="flex items-center justify-between gap-2"><span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Уточнений на тикет</span><span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#e9f8f8] text-[#007f8a] border border-[#b9e3e4]">DEMO DATA</span></div><div className="mt-3"><span className="text-3xl font-extrabold text-slate-900">{metrics.avgClarificationCount}</span></div><p className="mt-1 text-[11px] text-slate-500">Baseline AS-IS будет получен у владельца продукта</p></div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative"><div className="flex items-center justify-between gap-2"><span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Средний MTTR</span><span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#e9f8f8] text-[#007f8a] border border-[#b9e3e4]">DEMO DATA</span></div><div className="mt-3"><span className="text-3xl font-extrabold text-slate-900">{metrics.mttrMinutes} мин</span></div><p className="mt-1 text-[11px] text-slate-500">Baseline AS-IS будет получен у владельца продукта</p></div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative"><div className="flex items-center justify-between gap-2"><span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Доля самообслуживания</span><span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#e9f8f8] text-[#007f8a] border border-[#b9e3e4]">DEMO DATA</span></div><div className="mt-3 flex items-baseline justify-between"><span className="text-3xl font-extrabold text-slate-900">{metrics.selfServiceRate}%</span><Zap className="w-5 h-5 text-[#0099a8]" /></div><p className="mt-1 text-[11px] text-slate-500">Baseline AS-IS будет получен у владельца продукта</p></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-3"><div><span className="text-slate-500 font-semibold block">Время до полного комплекта данных</span><span className="text-2xl font-bold text-slate-900 mt-1 block">{metrics.avgTimeToFullDataMinutes} мин</span><span className="text-[11px] text-slate-400">Значение демонстрационное</span></div><span className="text-xs font-bold px-2 py-1 bg-amber-50 text-amber-800 rounded border border-amber-200">DEMO</span></div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-3"><div><span className="text-slate-500 font-semibold block">Повторимость инцидентов (%)</span><span className="text-2xl font-bold text-slate-900 mt-1 block">{metrics.repeatIncidentRate}%</span><span className="text-[11px] text-slate-400">Эффект подтвердить на реальных данных</span></div><span className="text-xs font-bold px-2 py-1 bg-amber-50 text-amber-800 rounded border border-amber-200">DEMO</span></div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-3"><div><span className="text-slate-500 font-semibold block">Доля обращений ВНЕ ПРИИЗ (%)</span><span className="text-2xl font-bold text-slate-900 mt-1 block">{metrics.nonPriizIncidentShare}%</span><span className="text-[11px] text-slate-400">Baseline после запуска</span></div><span className="text-xs font-bold px-2 py-1 bg-amber-50 text-amber-800 rounded border border-amber-200">DEMO</span></div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4"><div><h2 className="font-bold text-slate-900 text-base">Структура инцидентов по типам (DEMO DATA)</h2><p className="text-xs text-slate-500">Повторяемость, средний MTTR и ответственные команды</p></div><span className="text-xs font-bold px-2.5 py-1 bg-[#e9f8f8] text-[#007f8a] rounded-full border border-[#b9e3e4]">Срез: 30 дней</span></div>
        <div className="overflow-x-auto"><table className="w-full text-left border-collapse text-sm"><thead><tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider"><th className="py-3.5 px-4">Код типа</th><th className="py-3.5 px-4">Наименование типа</th><th className="py-3.5 px-4 text-center">Количество</th><th className="py-3.5 px-4 text-center">MTTR (мин)</th><th className="py-3.5 px-4 text-center">Доля повторов (%)</th><th className="py-3.5 px-4">Ответственная команда</th></tr></thead><tbody className="divide-y divide-slate-100 text-slate-800 text-xs">{metrics.typeBreakdown.map((row) => (<tr key={row.type}><td className="py-3.5 px-4 font-mono font-bold text-[#008c98]">{row.type}</td><td className="py-3.5 px-4 font-semibold text-slate-900">{row.label}</td><td className="py-3.5 px-4 text-center font-bold text-slate-900">{row.count}</td><td className="py-3.5 px-4 text-center font-mono font-medium">{row.mttrMinutes} мин</td><td className="py-3.5 px-4 text-center font-mono">{row.repeatRate}%</td><td className="py-3.5 px-4 text-slate-600 font-medium">{row.responsibleTeam}</td></tr>))}</tbody></table></div>
      </div>

      <div className="bg-[#eefafa] border border-[#cce8e9] rounded-2xl p-6 text-slate-800 space-y-2 shadow-2xs"><div className="flex items-center space-x-2 text-[#006e77] font-bold text-sm"><Info className="w-5 h-5 text-[#0099a8] shrink-0" /><span>Почему это важно для MVP ПРИИЗ?</span></div><p className="text-xs text-slate-700 leading-relaxed pl-7">Показатели нужны для сравнения AS-IS / TO-BE и будущего расчета экономики процесса. Пока все значения демонстрационные.</p></div>
    </div>
  );
};
