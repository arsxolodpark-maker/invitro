/**
 * Demo View: Integration Console (отдельный внутренний инженерный контур)
 *
 * This public prototype intentionally shows only safe mock diagnostics.
 * No real internal endpoints, logs, protocols or control actions are exposed.
 */

import React from 'react';
import {
  Server,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Activity,
} from 'lucide-react';

interface IntegrationConsoleModalProps {
  inz: string;
  onClose: () => void;
}

export const IntegrationConsoleModal: React.FC<IntegrationConsoleModalProps> = ({
  inz,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 text-slate-100 rounded-2xl max-w-3xl w-full border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-white text-base tracking-tight">
                  Integration Console
                </span>
                <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  DEMO
                </span>
              </div>
              <p className="text-xs text-slate-400">Отдельный внутренний инженерный контур</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Вернуться в ПРИИЗ</span>
          </button>
        </div>

        <div className="bg-blue-950/40 border-b border-blue-900/50 px-6 py-3 text-xs text-blue-200 flex items-start space-x-2.5">
          <Lock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <span>
            <strong>Граница продукта:</strong> ПРИИЗ показывает пользователю статус и результат обработки. Подробная диагностика и управляющие действия остаются во внутреннем инженерном контуре и в этом публичном прототипе не реализованы.
          </span>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase tracking-wider block">ИНЗ</span>
              <span className="text-sm font-bold text-white">{inz || 'DEMO-INZ'}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase tracking-wider block">Trace ID</span>
              <span className="text-xs font-bold text-blue-400">demo_trace_9f82d1</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase tracking-wider block">Статус</span>
              <span className="text-xs font-bold text-amber-400">Требует проверки</span>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-slate-300 font-bold text-xs">
              <Activity className="w-4 h-4 text-blue-400" />
              <span>Безопасная демонстрационная диагностика</span>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Заявка найдена.</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Обработка выполнена.</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Результат сформирован.</span>
              </div>
              <div className="flex items-center gap-2 text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Статус доставки требует технической проверки.</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 leading-relaxed">
            Реальные технические журналы, адреса внутренних систем, протоколы и управляющие операции намеренно не показаны. Они должны подключаться только после подтверждения архитектуры и требований ИБ INVITRO.
          </div>
        </div>

        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Закрыть консоль
          </button>
        </div>
      </div>
    </div>
  );
};
