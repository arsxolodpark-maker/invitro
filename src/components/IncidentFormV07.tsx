import React, { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, Info, Send, Waypoints } from 'lucide-react';
import { Incident, IncidentPrefill, UserRole } from '../types';
import { getInitiatorSession, getLatestInitiator } from '../services/users';

interface Props {
  currentRole: UserRole;
  prefill?: IncidentPrefill;
  onBack: () => void;
  onSubmit: (incidentData: Omit<Incident, 'id' | 'createdAt' | 'comments' | 'status' | 'internalServiceDeskId'>) => void;
}

export const IncidentFormV07: React.FC<Props> = ({ currentRole, prefill, onBack, onSubmit }) => {
  const initiator = useMemo(() => getInitiatorSession() || getLatestInitiator(), []);
  const isExternal = currentRole === 'Инициатор';
  const fromGovin = prefill?.source === 'GOVIN-303';
  const [client, setClient] = useState(prefill?.client ?? (isExternal ? initiator.organization : 'ООО «Демо-клиент»'));
  const [clientCode, setClientCode] = useState(prefill?.clientCode ?? (isExternal ? initiator.clientCode : 'CLI-DEMO-01'));
  const [lpu, setLpu] = useState(prefill?.lpu ?? (fromGovin ? '' : 'Подразделение клиента · DEMO'));
  const [inz, setInz] = useState(prefill?.inz ?? (fromGovin ? '' : '998877665'));
  const [vendor, setVendor] = useState(prefill?.vendor ?? 'Вендор МИС · DEMO');
  const [description, setDescription] = useState(prefill?.description ?? 'DEMO: результат исследования не отображается в системе клиента.');
  const [vendorContacted, setVendorContacted] = useState(false);
  const [vendorAnswer, setVendorAnswer] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client.trim() || !clientCode.trim() || !inz.trim() || !description.trim()) return;
    onSubmit({
      incidentType: 'INC-02',
      source: prefill?.source || 'ПРИИЗ Portal',
      createdBy: isExternal ? `${initiator.secondName} ${initiator.firstName}` : `Пользователь (${currentRole})`,
      initiatorEmail: isExternal ? initiator.email : undefined,
      authorRole: currentRole,
      priority: 'Высокий',
      responsibleTeam: 'Инженер ГСТИ',
      client: client.trim(),
      clientCode: clientCode.trim(),
      lpu: lpu.trim(),
      vendor: vendor.trim(),
      integrationType: 'типовая',
      environment: 'Production',
      inz: inz.trim(),
      eventDateTime: new Date().toISOString().slice(0,16),
      scope: 'единичная',
      workedBefore: 'да',
      description: description.trim(),
      vendorContacted,
      vendorAnswer: vendorContacted ? vendorAnswer.trim() : undefined,
      attachments: [],
      fullDataOnFirstSubmit: true,
      clarificationCount: 0,
      slaStatus: 'В норме (демо)',
    });
  };

  const common = 'mt-1 w-full px-3 py-2.5 border border-[#d8e7e7] rounded-xl text-sm';

  return (
    <div className="max-w-3xl mx-auto py-4 pb-16 space-y-5 notranslate" translate="no">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600"><ArrowLeft className="w-4 h-4" />Назад к обращениям</button>
      <div className="bg-white border border-[#dfeaea] rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap"><span className="text-xs font-bold px-2.5 py-1 rounded bg-[#e9f8f8] text-[#007f89]">INC-02</span><h1 className="text-xl font-extrabold text-[#17383d]">Не получен результат</h1></div>
        <p className="text-sm text-slate-500 mt-2">Заполните данные, которые нужны для начала обработки обращения.</p>
      </div>

      {fromGovin && <div className="rounded-xl border border-[#bce8e8] bg-[#eefafa] p-4 flex items-start gap-3 text-sm text-slate-700"><Waypoints className="w-5 h-5 text-[#0099a8] shrink-0 mt-0.5"/><div><strong className="text-[#17383d]">Данные перенесены из «Проверки направления».</strong><div className="text-xs mt-1 text-slate-600">{prefill?.contextLabel || 'Контекст направления'} · проверьте данные перед отправкой.</div></div></div>}

      <form onSubmit={submit} className="bg-white border border-[#dfeaea] rounded-2xl p-6 shadow-xs space-y-5">
        {isExternal && <div className="rounded-xl border border-[#cfeaea] bg-[#f3fbfb] p-4 text-xs text-slate-600"><strong>Профиль:</strong> {initiator.email} · {initiator.organization}. Организация и код клиента уже заполнены.</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label><span className="text-xs font-bold text-slate-700">Клиент *</span><input required value={client} readOnly={isExternal} onChange={(e) => setClient(e.target.value)} className={`${common} ${isExternal ? 'bg-[#f6fafa] text-slate-600' : ''}`} /></label>
          <label><span className="text-xs font-bold text-slate-700">Код клиента *</span><input required value={clientCode} readOnly={isExternal} onChange={(e) => setClientCode(e.target.value)} className={`${common} ${isExternal ? 'bg-[#f6fafa] text-slate-600' : ''}`} /></label>
          <label><span className="text-xs font-bold text-slate-700">ЛПУ / подразделение</span><input value={lpu} onChange={(e) => setLpu(e.target.value)} className={common} /></label>
          <label><span className="text-xs font-bold text-slate-700">ИНЗ / номер заявки *</span><input required value={inz} onChange={(e) => setInz(e.target.value)} className={common} /></label>
          <label className="md:col-span-2"><span className="text-xs font-bold text-slate-700">Вендор / интеграция</span><input value={vendor} onChange={(e) => setVendor(e.target.value)} className={common} /></label>
          <label className="md:col-span-2"><span className="text-xs font-bold text-slate-700">Описание проблемы *</span><textarea required value={description} onChange={(e) => setDescription(e.target.value)} className={`${common} min-h-24`} /></label>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={vendorContacted} onChange={(e) => setVendorContacted(e.target.checked)} />Уже обращались к вендору</label>
        {vendorContacted && <textarea value={vendorAnswer} onChange={(e) => setVendorAnswer(e.target.value)} placeholder="Кратко укажите ответ вендора" className={`${common} min-h-20`} />}
        <div className="rounded-xl border border-[#cfeaea] bg-[#f3fbfb] p-4 text-xs text-slate-600 flex gap-2"><Info className="w-4 h-4 text-[#0099a8] shrink-0" /><span>После создания обращение будет связано с 1C:ITILIUM, а его статус появится в ПРИИЗ.</span></div>
        <div className="flex justify-end"><button type="submit" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0099a8] text-white font-bold text-sm"><Send className="w-4 h-4" />Создать обращение</button></div>
      </form>
      {!isExternal && <div className="flex items-center gap-2 text-xs text-emerald-700"><CheckCircle2 className="w-4 h-4" />Инженерная обработка выполняется в контуре 1C:ITILIUM.</div>}
    </div>
  );
};