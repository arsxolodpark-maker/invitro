/**
 * ReadmeModal Component
 * Architectural notes, current-state assumptions, role matrix, and DoD documentation.
 */

import React from 'react';
import { FileText, Shield, ArrowLeft, Layers, Server } from 'lucide-react';

interface ReadmeModalProps {
  onBack: () => void;
}

export const ReadmeModal: React.FC<ReadmeModalProps> = ({ onBack }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4 pb-16">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Вернуться на главную</span>
        </button>
        <span className="text-xs font-bold px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full">
          Архитектура & TBD (v0.3 DEMO)
        </span>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" />
          <span>Документация прототипа ПРИИЗ v0.3 DEMO</span>
        </h1>
        <p className="text-xs text-slate-600 leading-relaxed">
          ПРИИЗ — это автономный пользовательский слой для правильной регистрации, сопровождения и контроля инцидентов интеграций, спроектированный с учетом принципа максимального повторного использования (reuse/integrate) существующего IT-контура INVITRO.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-600" />
          <span>1. Current-State Assumptions (Текущий контекст AS-IS)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 text-sm block">Существующая инфраструктура (AS-IS):</span>
            <ul className="space-y-1.5 text-slate-700 list-disc pl-4">
              <li>Существующая интеграционная платформа.</li>
              <li>Домен «Сервис».</li>
              <li>Service Desk / 1С (точная схема синхронизации TBD).</li>
              <li>Частично существующий мониторинг и тестовый стенд.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 text-sm block">Целевые возможности / gap to be confirmed:</span>
            <ul className="space-y-1.5 text-slate-700 list-disc pl-4">
              <li>Единый пользовательский UI-слой (ПРИИЗ) с обязательными динамическими формами.</li>
              <li>Автоматический pre-check ИНЗ до создания заявки.</li>
              <li>Единая неразрывная карточка переписки (без распадения по чатам и почте).</li>
            </ul>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
          <span className="font-bold block">TBD / To Be Confirmed для Production:</span>
          <p className="text-amber-800 leading-relaxed">
            Точный протокол и API двусторонней синхронизации тикетов между ПРИИЗ и 1С/Service Desk (Adapter Layer), а также правила шлюза информационной безопасности по обезличиванию медицинских скриншотов.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Server className="w-5 h-5 text-blue-600" />
          <span>2. Архитектура и точки подключения Адаптеров</span>
        </h2>
        <p className="text-xs text-slate-600">
          Приложение структурировано с четким разделением слоев UI, сервисов и репозиториев для быстрой подмены mock-слоя на реальные API/адаптеры после подтверждения архитектуры INVITRO:
        </p>
        <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs space-y-2">
          <p className="text-blue-400 font-bold">// Внутренние контракты для будущего подключения:</p>
          <p>• src/services/serviceDesk.ts (Interface ServiceDeskAdapter)</p>
          <p>• src/services/diagnostics.ts (Automated Pre-check API)</p>
          <p>• src/repositories/incidentRepository.ts (Domain Storage Adapter)</p>
        </div>
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-slate-800 space-y-1">
          <span className="font-bold text-blue-900 block">Разделение ПРИИЗ и Integration Console:</span>
          <p className="text-slate-700 leading-relaxed">ПРИИЗ не выполняет технические управляющие операции. Они остаются во внутреннем инженерном контуре.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <span>3. Ролевая матрица (Demo Role Matrix)</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                <th className="py-2.5 px-3">Роль</th>
                <th className="py-2.5 px-3">Создание</th>
                <th className="py-2.5 px-3">Комментарии</th>
                <th className="py-2.5 px-3">Подтверждение</th>
                <th className="py-2.5 px-3">Консоль (Демо)</th>
                <th className="py-2.5 px-3">Аналитика</th>
                <th className="py-2.5 px-3">Закрытие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              <tr><td className="py-2.5 px-3 font-bold">ДКП</td><td className="py-2.5 px-3 text-emerald-600 font-bold">✓</td><td className="py-2.5 px-3 text-emerald-600 font-bold">✓</td><td className="py-2.5 px-3 text-emerald-600 font-bold">✓</td><td className="py-2.5 px-3 text-slate-300">✕</td><td className="py-2.5 px-3 text-slate-300">✕</td><td className="py-2.5 px-3 text-slate-300">✕</td></tr>
              <tr><td className="py-2.5 px-3 font-bold">Manager</td><td className="py-2.5 px-3 text-emerald-600 font-bold">✓</td><td className="py-2.5 px-3 text-emerald-600 font-bold">✓</td><td className="py-2.5 px-3 text-emerald-600 font-bold">✓</td><td className="py-2.5 px-3 text-slate-300">✕</td><td className="py-2.5 px-3 font-semibold">Обзор клиента</td><td className="py-2.5 px-3 text-slate-300">✕</td></tr>
              <tr><td className="py-2.5 px-3 font-bold">Project</td><td className="py-2.5 px-3 text-emerald-600 font-bold">✓</td><td className="py-2.5 px-3 text-emerald-600 font-bold">✓</td><td className="py-2.5 px-3 text-emerald-600 font-bold">✓</td><td className="py-2.5 px-3 text-slate-300">✕</td><td className="py-2.5 px-3 font-semibold">Обзор проекта</td><td className="py-2.5 px-3 text-slate-300">✕</td></tr>
              <tr><td className="py-2.5 px-3 font-bold">Product</td><td className="py-2.5 px-3 text-slate-300">✕</td><td className="py-2.5 px-3 text-slate-300">✕</td><td className="py-2.5 px-3 text-slate-300">✕</td><td className="py-2.5 px-3 text-slate-300">✕</td><td className="py-2.5 px-3 text-emerald-600 font-bold">Full Read-only KPI</td><td className="py-2.5 px-3 text-slate-300">✕</td></tr>
              <tr><td className="py-2.5 px-3 font-bold">Support</td><td className="py-2.5 px-3 text-emerald-600 font-bold">✓</td><td className="py-2.5 px-3 text-emerald-600 font-bold">✓</td><td className="py-2.5 px-3 text-slate-300">✕</td><td className="py-2.5 px-3 text-emerald-600 font-bold">✓ (Кнопка в карточке)</td><td className="py-2.5 px-3 text-emerald-600 font-bold">✓</td><td className="py-2.5 px-3 text-emerald-600 font-bold">✓ (С фиксацией причины и решения)</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
