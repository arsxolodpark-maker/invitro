import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Info, Send } from 'lucide-react';
import { Incident, UserRole } from '../types';

interface Props {
  currentRole: UserRole;
  onBack: () => void;
  onSubmit: (incidentData: Omit<Incident, 'id' | 'createdAt' | 'comments' | 'status' | 'internalServiceDeskId'>) => void;
}

export const IncidentFormV07: React.FC<Props> = ({ currentRole, onBack, onSubmit }) => {
  const [client, setClient] = useState('ООО «Демо-клиент»');
  const [clientCode, setClientCode] = useState('CLI-DEMO-01');
  const [lpu, setLpu] = useState('Подразделение клиента · DEMO');
  const [inz, setInz] = useState('998877665');
  const [vendor, setVendor] = useState('Вендор МИС · DEMO');
  const [description, setDescription] = useState('DEMO: результат исследования не отображается в системе клиента.');
  const [vendorContacted, setVendorContacted] = useState(false);
  const [vendorAnswer, setVendorAnswer] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client.trim() || !clientCode.trim() || !inz.trim() || !description.trim()) return;
    onSubmit({
      incidentType: 'INC-02',
      source: 'ПРИИЗ Portal',
      createdBy: currentRole === 'Инициатор' ? 'Внешний инициатор · DEMO' : `Пользователь (${currentRole})`,
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

  return (
    <div className="max-w-3xl mx-auto py-4 pb-16 space-y-5">
      <button onClick={onBack} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600"><ArrowLeft className="w-4 h-4" />К выбору типа</button>

      <div className="bg-white border border-[#dfeaea] rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2"><span className="text-xs font-bold px-2.5 py-1 rounded bg-[#e9f8f8] text-[#007f89]">INC-02</span><h1 className="text-xl font-extrabold text-[#17383d]">Не получен результат</h1></div>
        <p className="text-sm text-slate-500 mt-2">Оставляем один подтвержденный DEMO-сценарий до получения фактической статистики типов обращений.</p>
      </div>

      <form onSubmit={submit} className="bg-white border border-[#dfeaea] rounded-2xl p-6 shadow-xs space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Клиент *" value={client} setValue={setClient} />
          <Field label="Код клиента *" value={clientCode} setValue={setClientCode} />
          <Field label="ЛПУ / подразделение" value={lpu} setValue={setLpu} />
          <Field label="ИНЗ / номер заявки *" value={inz} setValue={setInz} />
          <div className="md:col-span-2"><Field label="Вендор / интеграция" value={vendor} setValue={setVendor} /></div>
          <div className="md:col-span-2"><label className="text-xs font-bold text-slate-700">Описание проблемы *</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full min-h-24 px-3 py-2.5 border border-[#d8e7e7] rounded-xl text-sm" /></div>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={vendorContacted} onChange={(e) => setVendorContacted(e.target.checked)} />Уже обращались к вендору</label>
        {vendorContacted && <textarea value={vendorAnswer} onChange={(e) => setVendorAnswer(e.target.value)} placeholder="Кратко укажите ответ вендора" className="w-full min-h-20 px-3 py-2.5 border border-[#d8e7e7] rounded-xl text-sm" />}

        <div className="rounded-xl border border-[#cfeaea] bg-[#f3fbfb] p-4 text-xs text-slate-600 flex gap-2"><Info className="w-4 h-4 text-[#0099a8] shrink-0" /><span>После создания ПРИИЗ должен зарегистрировать обращение в 1C:ITILIUM и показать его нормализованный статус. В прототипе используется только DEMO-адаптер.</span></div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">Express: после события создания обращения в production должна выполняться нотификация в настроенный чат. В v0.7 это демонстрационная логика без реального API.</div>

        <div className="flex justify-end"><button type="submit" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0099a8] text-white font-bold text-sm"><Send className="w-4 h-4" />Создать обращение</button></div>
      </form>

      <div className="flex items-center gap-2 text-xs text-emerald-700"><CheckCircle2 className="w-4 h-4" />Ответственный рабочий контур: Инженер ГСТИ / 1C:ITILIUM.</div>
    </div>
  );
};

const Field: React.FC<{ label: string; value: string; setValue: (v: string) => void }> = ({ label, value, setValue }) => <label className="block"><span className="text-xs font-bold text-slate-700">{label}</span><input value={value} onChange={(e) => setValue(e.target.value)} className="mt-1 w-full px-3 py-2.5 border border-[#d8e7e7] rounded-xl text-sm" /></label>;
