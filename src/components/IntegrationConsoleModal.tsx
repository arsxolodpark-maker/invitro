/**
 * Demo View: Integration Console (Отдельный внутренний продукт)
 * 
 * Demonstrates the boundary between PRIIZ (User Incident Management Layer) 
 * and Integration Console (Engineering L2/L3 Control Console).
 */

import React, { useState } from 'react';
import { 
  Server, 
  Terminal, 
  RefreshCw, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Activity,
  Layers,
  Lock
} from 'lucide-react';

interface IntegrationConsoleModalProps {
  inz: string;
  onClose: () => void;
}

export const IntegrationConsoleModal: React.FC<IntegrationConsoleModalProps> = ({
  inz,
  onClose,
}) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retrySuccess, setRetrySuccess] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      setRetrySuccess(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 text-slate-100 rounded-2xl max-w-3xl w-full border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-white text-base tracking-tight">
                  Integration Console
                </span>
                <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Демо внутренний продукт
                </span>
              </div>
              <p className="text-xs text-slate-400">Инженерный контур управления интеграциями</p>
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

        {/* Boundary Notice Banner */}
        <div className="bg-blue-950/40 border-b border-blue-900/50 px-6 py-3 text-xs text-blue-200 flex items-start space-x-2.5">
          <Lock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <span>
            <strong>Разделение контуров:</strong> Технические действия по перезапуску шины интеграций выполняет служба поддержки здесь, в инженерной консоли. Пользователи ПРИИЗ (ДКП, клиенты) не имеют прямого доступа к сервисной кнопке Retry.
          </span>
        </div>

        {/* Console Body */}
        <div className="p-6 space-y-5 overflow-y-auto font-mono text-xs">
          
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase tracking-wider block font-sans">ИНЗ заказа</span>
              <span className="text-sm font-bold text-white">{inz || '998877665'}</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase tracking-wider block font-sans">Trace ID</span>
              <span className="text-xs font-bold text-blue-400">tr_inv_9f82d1c04</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase tracking-wider block font-sans">Статус очереди</span>
              <span className={`text-xs font-bold ${retrySuccess ? 'text-emerald-400' : 'text-amber-400'}`}>
                {retrySuccess ? 'HTTP 200 OK (Delivered)' : 'SOCKET_RESET (502 Gateway)'}
              </span>
            </div>
          </div>

          {/* Terminal Logs Simulation */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-sans border-b border-slate-800/80 pb-2">
              <span className="flex items-center gap-1.5 font-bold text-slate-300">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                Лог транзакции платформы
              </span>
              <span>Node: worker-node-04.invitro.local</span>
            </div>

            <div className="space-y-1 text-[11px] font-mono leading-relaxed">
              <p className="text-slate-400">[10:00:01.002] INFO  [IntegrationRouter] Received INZ {inz} payload from LIS.</p>
              <p className="text-slate-400">[10:00:01.042] INFO  [PdfGenerator] Rendered result PDF (142 KB).</p>
              <p className="text-slate-400">[10:00:01.105] INFO  [Hl7Adapter] Formatted HL7 ORU^R01 message.</p>

              {retrySuccess ? (
                <>
                  <p className="text-emerald-400 font-bold">[10:14:02.100] SUCCESS [OutboundGateway] Retry triggered from Console. Socket reconnected.</p>
                  <p className="text-emerald-400 font-bold">[10:14:02.890] SUCCESS [OutboundGateway] Partner endpoint acknowledged packet: HTTP 200 OK (ACK received).</p>
                </>
              ) : (
                <>
                  <p className="text-amber-400 font-bold">[10:00:02.890] WARN  [OutboundGateway] Connecting to endpoint https://mis.medtechcenter.ru/hl7/inbound...</p>
                  <p className="text-red-400 font-bold">[10:00:04.210] ERROR [OutboundGateway] HTTP 502 Bad Gateway: Connection reset by peer. ACK missing.</p>
                </>
              )}
            </div>
          </div>

          {/* Console Control Action */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
            <div>
              <span className="font-bold text-white text-xs block">Технический перезапуск доставки</span>
              <span className="text-[11px] text-slate-400">
                Инициирует принудительный повторный вызов REST/HL7 эндпоинта вендора.
              </span>
            </div>

            {retrySuccess ? (
              <div className="inline-flex items-center gap-2 text-emerald-400 font-bold text-xs bg-emerald-950/60 px-4 py-2.5 rounded-xl border border-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Доставка успешно повторена (HTTP 200 OK)</span>
              </div>
            ) : (
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center space-x-2 shrink-0"
              >
                <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
                <span>{isRetrying ? 'Выполняется retry...' : 'Повторить отправку (Демо Консоль)'}</span>
              </button>
            )}
          </div>

        </div>

        {/* Footer */}
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
