import React, { useMemo, useState } from 'react';
import { Incident, IncidentStatus, UserRole } from '../types';
import { ArrowLeft, Building2, CheckCircle2, ExternalLink, FileText, MessageSquare, Send, Server, Tag } from 'lucide-react';

interface IncidentDetailCardProps {
  incident: Incident;
  currentRole: UserRole;
  onBack: () => void;
  onOpenConsole: (inz: string) => void;
  onAddComment: (incidentId: string, content: string) => void;
  onConfirmReceipt: (incidentId: string) => void;
  onCloseIncident: (incidentId: string, rootCause: string, resolution: string) => void;
  onStatusChange: (incidentId: string, status: IncidentStatus) => void;
}

const ENGINEER_STATUSES: IncidentStatus[] = ['В работе', 'Отложено', 'Ожидает ответа', 'Ожидает согласования', 'Выполнено'];

export const IncidentDetailCard: React.FC<IncidentDetailCardProps> = ({ incident, currentRole, onBack, onOpenConsole, onAddComment, onConfirmReceipt, onCloseIncident, onStatusChange }) => {
  const [commentText, setCommentText] = useState('');
  const [showClose, setShowClose] = useState(false);
  const [rootCause, setRootCause] = useState('Причина уточняется');
  const [resolution, setResolution] = useState('Решение зафиксировано в рабочем контуре');

  const isEngineer = currentRole === 'Инженер ГСТИ' || currentRole === 'Support';
  const isInitiator = currentRole === 'Инициатор';
  const canConfirm = (currentRole === 'Инициатор' || currentRole === 'ДКП') && incident.status === 'Выполнено' && !incident.resultConfirmed;
  const canClose = isEngineer && incident.status === 'Выполнено' && incident.resultConfirmed === true;
  const visibleComments = useMemo(() => isInitiator ? incident.comments.filter((c) => !c.isInternal) : incident.comments, [incident.comments, isInitiator]);

  const submitComment = (e: React.FormEvent) => { e.preventDefault(); if (!commentText.trim()) return; onAddComment(incident.id, commentText); setCommentText(''); };
  const close = (e: React.FormEvent) => { e.preventDefault(); onCloseIncident(incident.id, rootCause, resolution); setShowClose(false); };

  return (
    <div className="max-w-5xl mx-auto space-y-5 py-4 pb-16 notranslate" translate="no">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200"><ArrowLeft className="w-4 h-4" />К списку</button>

      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-extrabold text-[#17383d] font-mono">{incident.id}</h1>
              <span className="text-xs font-bold px-2 py-1 rounded bg-[#eef8f8] text-[#007f89]">INC-02 · Не получен результат</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#e9f8f8] text-[#007f89] border border-[#bce8e8]">{incident.status}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Создано {new Date(incident.createdAt).toLocaleString('ru-RU')} · {incident.createdBy}</p>
          </div>
          {!isInitiator && <div className="text-left md:text-right"><div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Связано с 1C:ITILIUM</div><div className="font-mono text-xs font-semibold text-slate-700 mt-1">{incident.internalServiceDeskId || 'Регистрация выполняется · DEMO'}</div></div>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <Info icon={<Building2 className="w-4 h-4" />} title="Клиент" main={incident.client} details={`${incident.clientCode} · ${incident.lpu}`} />
          <Info icon={<Server className="w-4 h-4" />} title="Интеграция" main={incident.vendor} details={isInitiator ? 'Подключенная интеграция' : `${incident.integrationType} · ${incident.environment}`} />
          <Info icon={<FileText className="w-4 h-4" />} title="Заявка" main={`ИНЗ ${incident.inz}`} details={new Date(incident.eventDateTime).toLocaleString('ru-RU')} />
        </div>

        {isInitiator ? <div className="p-4 rounded-xl bg-[#f3fbfb] border border-[#cfeaea] text-xs"><div className="font-bold text-[#17383d]">Что происходит сейчас</div><p className="text-slate-600 mt-1">Статус и переписка по обращению отображаются здесь. Внутренние технические действия пользователю не показываются.</p>{incident.status === 'Выполнено' && !incident.resultConfirmed && <p className="mt-2 font-semibold text-[#007f89]">Работы завершены. Проверьте результат и подтвердите получение.</p>}{incident.resultConfirmed && incident.status !== 'Закрыт' && <p className="mt-2 font-semibold text-emerald-700">Получение подтверждено. Ожидается закрытие обращения.</p>}</div> : <div className="p-4 rounded-xl bg-[#f3fbfb] border border-[#cfeaea] text-xs flex items-center justify-between gap-3"><div><div className="font-bold text-[#17383d]">1C:ITILIUM</div><p className="text-slate-600 mt-1">Обращение связано с существующим Service Desk. ПРИИЗ показывает клиентский контекст и внешний статус.</p></div><span className="shrink-0 text-[10px] font-bold px-2 py-1 rounded-full bg-white border border-[#bce8e8] text-[#007f89]">Синхронизация · DEMO</span></div>}

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm"><div className="font-bold text-slate-800 mb-1">Описание проблемы</div><p className="text-slate-700">{incident.description}</p>{incident.vendorAnswer && !isInitiator && <><div className="font-bold text-slate-800 mt-3 mb-1">Ответ вендора</div><p className="text-slate-600 text-xs">{incident.vendorAnswer}</p></>}</div>
      </section>

      {!isInitiator && <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3"><div><h2 className="font-bold text-[#17383d]">Работа инженера</h2><p className="text-xs text-slate-500 mt-1">Основная обработка выполняется в 1C:ITILIUM. Здесь отражается состояние обращения для ДКП и клиента.</p></div>{isEngineer && <button onClick={() => onOpenConsole(incident.inz)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"><ExternalLink className="w-4 h-4" />Диагностика · DEMO</button>}</div>
        {isEngineer && incident.status !== 'Закрыт' && <div className="rounded-xl bg-[#f8fbfb] border border-[#dfeaea] p-4"><div className="text-xs font-bold text-slate-700 mb-2">Статус для пользователя</div><div className="flex flex-wrap gap-2">{ENGINEER_STATUSES.map((status) => <button key={status} disabled={status === incident.status} onClick={() => onStatusChange(incident.id, status)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${status === incident.status ? 'bg-[#e9f8f8] text-[#007f89] border-[#bce8e8] cursor-default' : 'bg-white text-slate-600 border-slate-200 hover:border-[#9fd8da] hover:text-[#007f89]'}`}>{status}</button>)}</div>{incident.status === 'Выполнено' && !incident.resultConfirmed && <div className="mt-3 text-xs text-amber-700">Ожидается подтверждение результата Инициатором или ДКП.</div>}{canClose && <div className="mt-3 text-xs text-emerald-700 font-semibold">Результат подтвержден. Обращение можно закрыть.</div>}</div>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs"><Stage label="Заявка" value="Найдена · DEMO" /><Stage label="Обработка" value="Выполнена · DEMO" /><Stage label="Результат" value="Сформирован · DEMO" /><Stage label="Доставка" value={incident.status === 'Выполнено' || incident.status === 'Закрыт' ? 'Ожидает подтверждения' : 'Требует проверки · DEMO'} /></div>
      </section>}

      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3"><MessageSquare className="w-5 h-5 text-[#0099a8]" /><h2 className="font-bold text-[#17383d]">Переписка по обращению</h2></div>
        <div className="space-y-3">{visibleComments.map((c) => <div key={c.id} className={`p-4 rounded-xl border text-xs ${c.role === 'Инженер ГСТИ' || c.role === 'Support' ? 'bg-[#f3fbfb] border-[#d3eeee]' : 'bg-slate-50 border-slate-200'}`}><div className="flex justify-between gap-2"><div className="font-bold text-slate-800">{c.author} {!isInitiator && <span className="ml-1 text-[10px] font-semibold text-slate-500">{c.role}</span>}</div><span className="text-[10px] text-slate-400">{new Date(c.createdAt).toLocaleString('ru-RU')}</span></div><p className="mt-1 text-slate-700">{c.content}</p></div>)}</div>
        {incident.status !== 'Закрыт' && <form onSubmit={submitComment} className="flex gap-2"><input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder={isEngineer ? 'Ответ пользователю или комментарий...' : 'Добавить комментарий...'} className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm" /><button aria-label="Отправить комментарий" className="px-4 rounded-xl bg-[#0099a8] text-white"><Send className="w-4 h-4" /></button></form>}
      </section>

      <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between gap-4"><div className="text-xs text-slate-600">{isInitiator ? 'После выполнения подтвердите, что результат получен.' : <><strong>Express:</strong> уведомление об изменении обращения · DEMO.</>}</div><div className="flex gap-2 justify-end">{canConfirm && <button onClick={() => onConfirmReceipt(incident.id)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0099a8] text-white text-xs font-bold"><CheckCircle2 className="w-4 h-4" />Подтвердить получение результата</button>}{canClose && <button onClick={() => setShowClose(true)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"><Tag className="w-4 h-4" />Закрыть обращение</button>}</div></section>

      {showClose && <div className="fixed inset-0 z-50 bg-slate-950/40 flex items-center justify-center p-4"><form onSubmit={close} className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl space-y-4"><div><h3 className="font-bold text-lg">Закрытие обращения</h3><p className="text-xs text-slate-500">Зафиксируйте причину и решение для последующего анализа.</p></div><label className="block text-xs font-bold text-slate-700">Причина<input value={rootCause} onChange={(e) => setRootCause(e.target.value)} className="mt-1 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-normal" /></label><label className="block text-xs font-bold text-slate-700">Решение<textarea value={resolution} onChange={(e) => setResolution(e.target.value)} className="mt-1 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm min-h-24 font-normal" /></label><div className="flex justify-end gap-2"><button type="button" onClick={() => setShowClose(false)} className="px-4 py-2 text-sm">Отмена</button><button className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-bold">Закрыть</button></div></form></div>}
    </div>
  );
};

const Info: React.FC<{ icon: React.ReactNode; title: string; main: string; details: string }> = ({ icon, title, main, details }) => <div className="p-3 rounded-xl bg-slate-50 border border-slate-200"><div className="flex items-center gap-2 text-[#0099a8]">{icon}<span className="uppercase tracking-wider text-[10px] font-bold text-slate-400">{title}</span></div><div className="font-bold text-slate-900 mt-2">{main}</div><div className="text-slate-500 mt-1">{details}</div></div>;
const Stage: React.FC<{ label: string; value: string }> = ({ label, value }) => <div className="p-3 rounded-xl border border-[#dfeaea] bg-[#f8fbfb]"><div className="font-bold text-[#17383d]">{label}</div><div className="text-slate-500 mt-1">{value}</div></div>;
