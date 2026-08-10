/**
 * Screen 5: Product / Manager Analytics (Продуктовая аналитика ПРИИЗ)
 */

import React from 'react';
import { getProductMetrics } from '../services/incidents';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ShieldCheck,
  Zap,
  Info,
  Layers,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const metrics = getProductMetrics();

  return (
    <div className="max-w-7xl mx-auto space-y-6 py-4 pb-16">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-2xl tracking-tight">
                Продуктовая и процессная аналитика
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-400 text-slate-950 uppercase tracking-wider">
                DEMO DATA
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Мониторинг качества сбора контекста, скорости решения и экономии трудозатрат поддержки
            </p>
          </div>

          <div className="text-right text-xs text-slate-300 bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 shrink-0">
            <div>Период: <strong>Последние 30 дней (демо)</strong></div>
            <div className="text-blue-300 font-semibold mt-0.5">Всего обращений: 80</div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Полнота с первого раза</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              DEMO DATA
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{metrics.firstTimeCompletenessRate}%</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Значение демонстрационное. Baseline AS-IS будет получен у владельца продукта</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Уточнений на тикет</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              DEMO DATA
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{metrics.avgClarificationCount}</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Значение демонстрационное. Baseline AS-IS будет получен у владельца продукта</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Средний MTTR</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              DEMO DATA
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{metrics.mttrMinutes} мин</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Значение демонстрационное. Baseline AS-IS будет получен у владельца продукта</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Доля самообслуживания</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
              DEMO DATA
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{metrics.selfServiceRate}%</span>
            <Zap className="w-5 h-5 text-purple-600" />
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Значение демонстрационное. Baseline AS-IS будет получен у владельца продукта</p>
        </div>

      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-slate-500 font-semibold block">Время до полного комплекта данных</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">{metrics.avgTimeToFullDataMinutes} мин</span>
            <span className="text-[11px] text-slate-400">Значение демонстрационное. Baseline AS-IS будет получен у владельца продукта</span>
          </div>
          <span className="text-xs font-bold px-2 py-1 bg-amber-50 text-amber-800 rounded border border-amber-200">
            DEMO
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-slate-500 font-semibold block">Повторимость инцидентов (%)</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">{metrics.repeatIncidentRate}%</span>
            <span className="text-[11px] text-slate-400">Целевой показатель, эффект подтвердить на реальных данных</span>
          </div>
          <span className="text-xs font-bold px-2 py-1 bg-amber-50 text-amber-800 rounded border border-amber-200">
            DEMO
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-slate-500 font-semibold block">Доля обращений ВНЕ ПРИИЗ (%)</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">{metrics.nonPriizIncidentShare}%</span>
            <span className="text-[11px] text-slate-400">Baseline и динамика будут рассчитаны после запуска</span>
          </div>
          <span className="text-xs font-bold px-2 py-1 bg-amber-50 text-amber-800 rounded border border-amber-200">
            DEMO
          </span>
        </div>

      </div>

      {/* Incident Types Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 text-base">
              Структура инцидентов по типам (DEMO DATA)
            </h2>
            <p className="text-xs text-slate-500">
              Аналитика повторяемости, среднего MTTR и ответственных команд
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-800 rounded-full border border-blue-200">
            Срез: 30 дней
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Код типа</th>
                <th className="py-3.5 px-4">Наименование типа</th>
                <th className="py-3.5 px-4 text-center">Количество</th>
                <th className="py-3.5 px-4 text-center">MTTR (мин)</th>
                <th className="py-3.5 px-4 text-center">Доля повторов (%)</th>
                <th className="py-3.5 px-4">Ответственная команда</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 text-xs">
              {metrics.typeBreakdown.map((row) => (
                <tr key={row.type} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                    {row.type}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {row.label}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                    {row.count}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-medium">
                    {row.mttrMinutes} мин
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono">
                    {row.repeatRate}%
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {row.responsibleTeam}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Informational Box "Почему это важно" */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-slate-800 space-y-2 shadow-2xs">
        <div className="flex items-center space-x-2 text-blue-900 font-bold text-sm">
          <Info className="w-5 h-5 text-blue-600 shrink-0" />
          <span>Почему это важно для продуктового MVP ПРИИЗ?</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed pl-7">
          Эти показатели в следующем этапе будут использованы для сравнения AS-IS / TO-BE и расчета unit economics: трудозатраты Support, экономия времени на уточнения, доля self-service, снижение MTTR и предотвращенный рост команды.
        </p>
      </div>

    </div>
  );
};
