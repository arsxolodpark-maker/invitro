/**
 * Screen 4: Incident Detail Card (Карточка инцидента PRIIZ-XXXXXX)
 */

import React, { useState } from 'react';
import { Incident, UserRole } from '../types';
import {
  ArrowLeft,
  Building2,
  Server,
  FileText,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Send,
  ShieldCheck,
  FileCheck2,
  Lock,
  Tag
} from 'lucide-react';

interface IncidentDetailCardProps {
  incident: Incident;
  currentRole: UserRole;
  onBack: () => void;
  onOpenConsole: (inz: string) => void;
  onAddComment: (incidentId: string, content: string) => void;
  onConfirmReceipt: (incidentId: string) => void;
  onCloseIncident: (incidentId: string, rootCause: string, resolution: string) => void;
}

export const IncidentDetailCard: React.FC<IncidentDetailCardProps> = ({ incident, currentRole, onBack, onOpenConsole, onAddComment, onConfirmReceipt, onCloseIncident }) => {
  const [commentText, setCommentText] = useState('');
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [rootCause, setRootCause] = useState('Delivery / Integration');
  const [resolution, setResolution] = useState('Результат доставлен после технического восстановления во внутреннем контуре');

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(incident.id, commentText);
    setCommentText('');
  };

  const handleConfirmClose = (e: React.FormEvent) => {
    e.preventDefault();
    onCloseIncident(incident.id, rootCause, resolution);
    setShowCloseModal(false);
  };

  const canConfirmReceipt = ['ДКП', 'Project'].includes(currentRole) && incident.status !== 'Закрыт';
  const canCloseIncident = currentRole === 'Support' && incident.status !== 'Закрыт';

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4 pb-16">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 transition-colors shadow-2xs"><ArrowLeft className="w-4 h-4" /><span>Вернуться к списку</span></button>
        <div className="flex items-center space-x-2"><span className="text-xs text-slate-500 font-medium">SLA:</span><span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">{incident.slaStatus}</span></div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-3 flex-wrap"><h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono">{incident.id}</h1><span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-xs">{incident.incidentType}</span><span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">Статус: <strong className="text-blue-600">{incident.status}</strong></span></div>
            <p className="text-xs text-slate-500">Создано: {new Date(incident.createdAt).toLocaleString('ru-RU')} • Автор: {incident.createdBy}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">{incident.fullDataOnFirstSubmit && <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200"><FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />Полный комплект данных сразу</span>}{incident.internalServiceDeskId && <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">SD ID: {incident.internalServiceDeskId}</span>}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1"><span className="text-slate-400 font-semibold uppercase tracking-wider block">Клиент и ЛПУ</span><div className="font-bold text-slate-900 text-sm flex items-center gap-1.5"><Building2 className="w-4 h-4 text-blue-600 shrink-0" /><span>{incident.client}</span></div><div className="text-slate-600">Код: <span className="font-mono font-semibold">{incident.clientCode}</span></div><div className="text-slate-500 truncate">{incident.lpu}</div></div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1"><span className="text-slate-400 font-semibold uppercase tracking-wider block">Технический вендор</span><div className="font-bold text-slate-900 text-sm flex items-center gap-1.5"><Server className="w-4 h-4 text-blue-600 shrink-0" /><span>{incident.vendor}</span></div><div className="text-slate-600">Тип: <span className="font-semibold">{incident.integrationType}</span></div><div className="text-slate-500">Масштаб: {incident.scope}</div></div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1"><span className="text-slate-400 font-semibold uppercase tracking-wider block">Заявка и дата</span><div className="font-bold text-slate-900 text-sm font-mono flex items-center gap-1.5"><FileText className="w-4 h-4 text-blue-600 shrink-0" /><span>ИНЗ {incident.inz}</span></div><div className="text-slate-600">Дата/время: {new Date(incident.eventDateTime).toLocaleString('ru-RU')}</div><div className="text-slate-500">Ответственные: <span className="font-semibold">{incident.responsibleTeam}</span></div></div>
        </div>

        <div className="p-4 rounded-xl bg-[#f3fbfb] border border-[#cfeaea] text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div><span className="font-bold text-[#17383d]">Синхронизация с Итилиумом</span><p className="text-slate-600 mt-0.5">Целевой двусторонний обмен статусами и комментариями. В этой версии только DEMO/TBD, без реального API.</p></div><span className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full bg-white text-[#007f89] border border-[#bce8e8]">DEMO · TBD</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
          <div><span className="font-bold text-slate-800 block mb-1">Описание проблемы:</span><p className="text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">{incident.description}</p></div>
          {incident.vendorContacted && incident.vendorAnswer && <div><span className="font-bold text-slate-800 block mb-1">Ответ вендора:</span><p className="text-slate-700 leading-relaxed bg-blue-50/50 p-3 rounded-lg border border-blue-100 text-[11px]">{incident.vendorAnswer}</p></div>}
          {incident.attachments.length > 0 && <div><span className="font-bold text-slate-800 block mb-1">Вложения ({incident.attachments.length}):</span><div className="flex flex-wrap gap-2">{incident.attachments.map((att) => <span key={att.id} className="inline-flex items-center gap-1 text-[11px] bg-white px-2.5 py-1 rounded border border-slate-200 font-mono text-slate-700">📎 {att.fileName} ({att.fileSize})</span>)}</div></div>}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div><h2 className="text-base font-bold text-slate-900 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-blue-600" /><span>Автоматическая диагностика интеграции</span></h2><p className="text-xs text-slate-500">Безопасный пользовательский результат проверки; глубокие действия остаются во внутреннем контуре.</p></div>
          {currentRole === 'Support' && <button onClick={() => onOpenConsole(incident.inz)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow-xs flex items-center space-x-2 shrink-0"><ExternalLink className="w-4 h-4 text-blue-200" /><span>Открыть внутреннюю консоль (DEMO)</span></button>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1"><div className="flex items-center justify-between font-bold text-emerald-900"><span>1. Заявка</span><span className="text-emerald-600">✓ Найдена</span></div><p className="text-[11px] text-emerald-800">Заявка найдена в платформе.</p></div>
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1"><div className="flex items-center justify-between font-bold text-emerald-900"><span>2. Платформа</span><span className="text-emerald-600">✓ Успешно</span></div><p className="text-[11px] text-emerald-800">Обработка успешна.</p></div>
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1"><div className="flex items-center justify-between font-bold text-emerald-900"><span>3. Результат</span><span className="text-emerald-600">✓ Сформирован</span></div><p className="text-[11px] text-emerald-800">Результат сформирован.</p></div>
          <div className={`p-3.5 rounded-xl border space-y-1 ${incident.status === 'Закрыт' || incident.status === 'Ожидает подтверждения ДКП' ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}><div className="flex items-center justify-between font-bold"><span>4. Доставка</span>{incident.status === 'Закрыт' || incident.status === 'Ожидает подтверждения ДКП' ? <span className="text-emerald-600">✓ Успешно</span> : <span className="text-amber-700">Ошибка · DEMO</span>}</div><p className="text-[11px] text-slate-600">{incident.status === 'Закрыт' || incident.status === 'Ожидает подтверждения ДКП' ? 'Результат доставлен клиенту.' : 'Подтверждение доставки не найдено в DEMO.'}</p></div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-blue-600" /><span>Единая переписка по обращению</span></h2>
        <div className="space-y-3">{incident.comments.map((comment) => <div key={comment.id} className={`p-4 rounded-xl border text-xs space-y-1.5 ${comment.role === 'Support' ? 'bg-blue-50/60 border-blue-100 ml-4' : 'bg-slate-50 border-slate-200'}`}><div className="flex items-center justify-between"><div className="flex items-center space-x-2"><span className="font-bold text-slate-900">{comment.author}</span><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">{comment.role}</span></div><span className="text-[11px] text-slate-400">{new Date(comment.createdAt).toLocaleString('ru-RU')}</span></div><p className="text-slate-800 leading-relaxed text-xs">{comment.content}</p></div>)}</div>
        {incident.status !== 'Закрыт' && <form onSubmit={handleCommentSubmit} className="pt-2 flex gap-2"><input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Добавить комментарий..." className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /><button type="submit" className="px-4 py-2.5 bg-blue-600 text-white rounded-xl"><Send className="w-4 h-4" /></button></form>}
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-2 text-xs text-slate-600"><Lock className="w-4 h-4 text-slate-400 mt-0.5" /><p>ПРИИЗ сопровождает обращение. Технические управляющие действия остаются во внутреннем инженерном контуре.</p></div>
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          {canConfirmReceipt && <button onClick={() => onConfirmReceipt(incident.id)} className="px-5 py-2.5 bg-[#0099a8] hover:bg-[#008590] text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center space-x-1.5"><CheckCircle2 className="w-4 h-4" /><span>Подтвердить получение</span></button>}
          {canCloseIncident && <button onClick={() => setShowCloseModal(true)} className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center space-x-1.5"><Tag className="w-4 h-4" /><span>Закрыть с причиной</span></button>}
        </div>
      </div>

      {showCloseModal && <div className="fixed inset-0 z-50 bg-slate-950/40 flex items-center justify-center p-4"><form onSubmit={handleConfirmClose} className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl space-y-4"><div><h3 className="font-bold text-lg text-slate-900">Закрытие обращения</h3><p className="text-xs text-slate-500">Зафиксируйте причину и решение для аналитики и будущей базы знаний.</p></div><div><label className="text-xs font-bold text-slate-700">Категория причины</label><input value={rootCause} onChange={(e) => setRootCause(e.target.value)} className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" /></div><div><label className="text-xs font-bold text-slate-700">Решение</label><textarea value={resolution} onChange={(e) => setResolution(e.target.value)} rows={4} className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" /></div><div className="flex justify-end gap-2"><button type="button" onClick={() => setShowCloseModal(false)} className="px-4 py-2 rounded-lg border border-slate-200 text-sm">Отмена</button><button type="submit" className="px-4 py-2 rounded-lg bg-[#0099a8] text-white font-bold text-sm">Закрыть</button></div></form></div>}
    </div>
  );
};
