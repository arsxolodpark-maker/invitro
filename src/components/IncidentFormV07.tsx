import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Info, Send } from 'lucide-react';
import { Incident, UserRole } from '../types';
import { getLatestInitiator } from '../services/users';
import { GovinPriizContext } from '../modules/govin/types';

interface Props {
  currentRole: UserRole;
  govinContext?: GovinPriizContext | null;
  onBack: () => void;
  onSubmit: (incidentData: Omit<Incident, 'id' | 'createdAt' | 'comments' | 'status' | 'internalServiceDeskId'>) => void;
}

function buildGovinDescription(context: GovinPriizContext): string {
  const diagnostic = context.checkinError || context.deliveryErrors.join('; ') || 'Диагностическая ошибка не зафиксирована';
  const delivered = context.deliveredTests.length ? context.deliveredTests.join(', ') : 'нет данных';
  const assigned = context.assignedTests.length ? context.assignedTests.join(', ') : 'нет данных';
  return `DEMO: обращение создано из GOVIN. Интеграция: ${context.integration}. Штрихкод: ${context.barcode}. Внешний ID: ${context.externalDirectionId}. Исходный статус: ${context.sourceStatus}. Назначенные тесты: ${assigned}. Доставленные тесты: ${delivered}. Диагностика: ${diagnostic}.`;
}

export const IncidentFormV07: React.FC<Props> = ({ currentRole, govinContext, onBack, onSubmit }) => {
  const initiator = getLatestInitiator();
  const isExternal = currentRole === 'Инициатор';
  const fromGovin = currentRole === 'ДКП' && Boolean(govinContext);

  const [client, setClient] = useState(fromGovin ? govinContext!.client : isExternal ? initiator.organization : 'ООО «Демо-клиент»');
  const [clientCode, setClientCode] = useState(fromGovin ? '' : isExternal ? initiator.clientCode : 'CLI-DEMO-01');
  const [lpu, setLpu] = useState(fromGovin ? '' : 'Подразделение клиента · DEMO');
  const [inz, setInz] = useState(fromGovin ? (govinContext!.inz.length ? govinContext!.inz.join(', ') : '') : '998877665');
  const [vendor, setVendor] = useState(fromGovin ? govinContext!.integration : 'Вендор МИС · DEMO');
  const [description, setDescription] = useState(fromGovin ? buildGovinDescription(govinContext!) : 'DEMO: результат исследования не отображается в системе клиента.');
  const [vendorContacted, setVendorContacted] = useState(false);
  const [vendorAnswer, setVendorAnswer] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client.trim() || !clientCode.trim() || !inz.trim() || !description.trim()) return;
    onSubmit({
      incidentType: 'INC-02',
      source: fromGovin ? 'GOVIN → ПРИИЗ DEMO' : 'ПРИИЗ Portal',
      createdBy: isExternal ? `${initiator.secondName} ${initiator.firstName}` : `Пользователь (${currentRole})`,
      initiatorEmail: isExternal ? initiator.email : undefined,
      authorRole: currentRole,
      priority: 'Высокий',
      responsibleTeam: 'Инженер ГСТИ',
      client,
      clientCode,
      lpu,
      vendor,
      integrationType: 'типовая',
      environment: 'Production',
      inz,
      eventDateTime: new Date().toISOString().slice(0,16),
      scope: 'единичная',
      workedBefore: 'да',
      description,
      vendorContacted,
      vendorAnswer: vendorContacted ? vendorAnswer : undefined,
      attachments: [],
      fullDataOnFirstSubmit: true,
      clarificationCount: 0,
      slaStatus: 'В норме (демо)',
    });
  };

  const common = 'mt-1 w-full px-3 py-2.5 border border-[#d8e7e7] rounded-xl text-sm';

  return (
    <div className="max-w-3xl mx-auto py-4 pb-16 space-y-5">
      <button onClick={onBack} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600"><ArrowLeft className="w-4 h-4" />{fromGovin ? 'К GOVIN' : 'Назад'}</button>
      <div className="bg-white border border-[#dfeaea] rounded-2xl p-6 shadow-xs"><div className="flex items-center gap-2"><span className="text-xs font-bold px-2.5 py-1 rounded bg-[#e9f8f8] text-[#007f89]">INC-02</span><h1 className="text-xl font-extrabold text-[#17383d]">Не получен результат</h1></div><p className="text-sm text-slate-500 mt-2">Один подтвержденный сценарий до получения статистики по типам обращений.</p></div>

      <form onSubmit={submit} className="bg-white border border-[#dfeaea] rounded-2xl p-6 shadow-xs space-y-5">
        {isExternal && <div className="rounded-xl border border-[#cfeaea] bg-[#f3fbfb] p-4 text-xs text-slate-600"><strong>Ваш профиль:</strong> {initiator.email} · {initiator.organization}. Организация и код клиента подставлены из учетной записи, чтобы не вводить их повторно.</div>}
        {fromGovin && <div className="rounded-xl border border-[#8bd2d6] bg-[#f3fbfb] p-4 text-xs text-slate-700"><strong className="text-[#007f89]">Контекст GOVIN передан.</strong> Клиент, интеграция, ИНЗ (если он уже присвоен) и диагностическое описание заполнены автоматически. Код клиента, ЛПУ и отсутствующий ИНЗ не выдумываются — их нужно дополнить вручную. Это DESIGN-модель DEMO, не промышленный API.</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label><span className="text-xs font-bold text-slate-700">Клиент *</span><input value={client} readOnly={isExternal} onChange={(e) => setClient(e.target.value)} className={`${common} ${isExternal ? 'bg-[#f6fafa] text-slate-600' : ''}`} /></label>
          <label><span className="text-xs font-bold text-slate-700">Код клиента *</span><input value={clientCode} readOnly={isExternal} onChange={(e) => setClientCode(e.target.value)} placeholder={fromGovin ? 'Дополните вручную' : undefined} className={`${common} ${isExternal ? 'bg-[#f6fafa] text-slate-600' : ''}`} /></label>
          <label><span className="text-xs font-bold text-slate-700">ЛПУ / подразделение</span><input value={lpu} onChange={(e) => setLpu(e.target.value)} placeholder={fromGovin ? 'Если требуется' : undefined} className={common} /></label>
          <label><span className="text-xs font-bold text-slate-700">ИНЗ / номер заявки *</span><input value={inz} onChange={(e) => setInz(e.target.value)} placeholder={fromGovin && !govinContext!.inz.length ? 'В GOVIN ИНЗ ещё не присвоен' : undefined} className={common} /></label>
          <label className="md:col-span-2"><span className="text-xs font-bold text-slate-700">Вендор / интеграция</span><input value={vendor} onChange={(e) => setVendor(e.target.value)} className={common} /></label>
          <label className="md:col-span-2"><span className="text-xs font-bold text-slate-700">Описание проблемы *</span><textarea value={description} onChange={(e) => setDescription(e.target.value)} className={`${common} min-h-28`} /></label>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={vendorContacted} onChange={(e) => setVendorContacted(e.target.checked)} />Уже обращались к вендору</label>
        {vendorContacted && <textarea value={vendorAnswer} onChange={(e) => setVendorAnswer(e.target.value)} placeholder="Кратко укажите ответ вендора" className={`${common} min-h-20`} />}
        <div className="rounded-xl border border-[#cfeaea] bg-[#f3fbfb] p-4 text-xs text-slate-600 flex gap-2"><Info className="w-4 h-4 text-[#0099a8] shrink-0" /><span>После создания обращение регистрируется в 1C:ITILIUM. ПРИИЗ показывает пользователю нормализованный статус из модели v9.</span></div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">Express: событие создания обращения формирует уведомление в настроенный чат. В DEMO реального API нет.</div>
        <div className="flex justify-end"><button type="submit" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0099a8] text-white font-bold text-sm"><Send className="w-4 h-4" />Создать обращение</button></div>
      </form>
      <div className="flex items-center gap-2 text-xs text-emerald-700"><CheckCircle2 className="w-4 h-4" />Рабочий инженерный контур: Инженер ГСТИ / 1C:ITILIUM.</div>
    </div>
  );
};
