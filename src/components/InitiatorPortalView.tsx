import React, { useMemo, useState } from 'react';
import { Incident } from '../types';
import { CheckCircle2, KeyRound, LockKeyhole, Mail, Plus, UserRoundCheck } from 'lucide-react';
import { activateInitiator, getInitiatorSession, getLatestInitiator, InitiatorAccount, startInitiatorSession } from '../services/users';

interface InitiatorPortalViewProps {
  incidents: Incident[];
  onCreateIncident: () => void;
  onSelectIncident: (id: string) => void;
}

type AccessStep = 'activation' | 'login' | 'portal';

export const InitiatorPortalView: React.FC<InitiatorPortalViewProps> = ({ incidents, onCreateIncident, onSelectIncident }) => {
  const session = getInitiatorSession();
  const [account, setAccount] = useState<InitiatorAccount>(() => session || getLatestInitiator());
  const [step, setStep] = useState<AccessStep>(() => session ? 'portal' : account.active ? 'login' : 'activation');
  const ownIncidents = useMemo(() => incidents.filter((x) => x.initiatorEmail === account.email), [incidents, account.email]);

  if (step === 'activation') {
    return (
      <div className="max-w-xl mx-auto py-10 notranslate" translate="no">
        <div className="bg-white border border-[#dfeaea] rounded-2xl p-7 shadow-sm space-y-5">
          <div className="w-11 h-11 rounded-xl bg-[#e9f8f8] text-[#008c98] flex items-center justify-center"><UserRoundCheck className="w-6 h-6" /></div>
          <div><div className="text-xs font-bold uppercase tracking-wider text-[#008c98]">ПРИИЗ</div><h1 className="text-2xl font-extrabold text-[#17383d] mt-1">Активация аккаунта</h1><p className="text-sm text-slate-600 mt-2">Проверьте данные и создайте пароль для входа.</p></div>
          <div className="rounded-xl bg-[#f7fbfb] border border-[#dfeaea] p-4 text-sm space-y-2"><div className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#0099a8]" /><span className="font-semibold">{account.email}</span></div><div className="text-slate-500">{account.organization} · код клиента {account.clientCode}</div><div className="text-slate-500">{account.secondName} {account.firstName} {account.patronymic} · {account.phone}</div></div>
          <label className="block"><span className="text-xs font-bold text-slate-700">Создайте пароль</span><div className="mt-1 relative"><KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" /><input type="password" defaultValue="DemoPassword!1" className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#d8e7e7] bg-white text-sm" /></div></label>
          <button onClick={() => { const updated = activateInitiator(account.id); setAccount(updated); setStep('login'); }} className="w-full py-3 rounded-xl bg-[#0099a8] hover:bg-[#008891] text-white font-bold text-sm">Активировать аккаунт</button>
          <div className="text-[11px] text-slate-400">DEMO: приглашение создано сотрудником ДКП.</div>
        </div>
      </div>
    );
  }

  if (step === 'login') {
    return (
      <div className="max-w-md mx-auto py-12 notranslate" translate="no">
        <div className="bg-white border border-[#dfeaea] rounded-2xl p-7 shadow-sm space-y-5">
          <div className="w-11 h-11 rounded-xl bg-[#e9f8f8] text-[#008c98] flex items-center justify-center"><LockKeyhole className="w-6 h-6" /></div>
          <div><h1 className="text-2xl font-extrabold text-[#17383d]">Вход в ПРИИЗ</h1><p className="text-sm text-slate-500 mt-1">Портал обращений по интеграциям.</p></div>
          <label className="block"><span className="text-xs font-bold text-slate-700">Email</span><input value={account.email} readOnly className="mt-1 w-full px-3 py-2.5 rounded-xl border border-[#d8e7e7] bg-[#f8fbfb] text-sm" /></label>
          <label className="block"><span className="text-xs font-bold text-slate-700">Пароль</span><input type="password" defaultValue="DemoPassword!1" className="mt-1 w-full px-3 py-2.5 rounded-xl border border-[#d8e7e7] text-sm" /></label>
          <button onClick={() => { startInitiatorSession(account.id); setStep('portal'); }} className="w-full py-3 rounded-xl bg-[#0099a8] hover:bg-[#008891] text-white font-bold text-sm">Войти</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5 py-4 pb-16 notranslate" translate="no">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div><div className="text-xs font-bold uppercase tracking-wider text-[#008c98]">{account.organization}</div><h1 className="text-2xl font-extrabold text-[#17383d] mt-1">Мои обращения</h1><p className="text-sm text-slate-500 mt-1">Вы вошли как {account.secondName} {account.firstName}. Здесь доступны только ваши обращения.</p></div>
        <button onClick={onCreateIncident} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0099a8] text-white font-bold text-sm"><Plus className="w-4 h-4" />Создать обращение</button>
      </div>

      <div className="bg-white border border-[#dfeaea] rounded-2xl overflow-hidden shadow-xs">
        {ownIncidents.length === 0 ? <div className="p-10 text-center"><div className="font-bold text-[#17383d]">Обращений пока нет</div><div className="text-sm text-slate-500 mt-1">Создайте первое обращение - оно появится здесь сразу после регистрации.</div><button onClick={onCreateIncident} className="mt-4 px-4 py-2.5 rounded-xl bg-[#0099a8] text-white font-bold text-sm">Создать обращение</button></div> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="bg-[#f6fbfb] text-xs uppercase tracking-wider text-slate-500 border-b border-[#dfeaea]"><th className="p-4">Обращение</th><th className="p-4">Тип</th><th className="p-4">Статус</th><th className="p-4">Последнее событие</th></tr></thead><tbody className="divide-y divide-[#edf3f3]">{ownIncidents.map((incident) => { const lastEvent = incident.comments[incident.comments.length - 1]?.createdAt || incident.createdAt; return <tr key={incident.id} className="hover:bg-[#f8fcfc] cursor-pointer" onClick={() => onSelectIncident(incident.id)}><td className="p-4"><div className="font-bold text-[#17383d]">{incident.id}</div><div className="text-xs text-slate-500">ИНЗ {incident.inz}</div></td><td className="p-4">Не получен результат</td><td className="p-4"><span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#e9f8f8] text-[#007f89] border border-[#c8e9e9]">{incident.status}</span></td><td className="p-4 text-xs text-slate-500">{new Date(lastEvent).toLocaleString('ru-RU')}</td></tr>; })}</tbody></table></div>}
      </div>

      <div className="flex items-start gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800"><CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" /><span>Здесь отображаются статус обращения и переписка с командой поддержки.</span></div>
    </div>
  );
};
