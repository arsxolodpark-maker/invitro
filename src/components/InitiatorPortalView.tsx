import React, { useMemo, useState } from 'react';
import { Incident } from '../types';
import { CheckCircle2, KeyRound, LockKeyhole, Mail, Plus, UserRoundCheck } from 'lucide-react';

interface InitiatorPortalViewProps {
  incidents: Incident[];
  onCreateIncident: () => void;
  onSelectIncident: (id: string) => void;
}

type AccessStep = 'activation' | 'login' | 'portal';

export const InitiatorPortalView: React.FC<InitiatorPortalViewProps> = ({ incidents, onCreateIncident, onSelectIncident }) => {
  const [step, setStep] = useState<AccessStep>('activation');
  const ownIncidents = useMemo(() => incidents.slice(0, 4), [incidents]);

  if (step === 'activation') {
    return (
      <div className="max-w-xl mx-auto py-10">
        <div className="bg-white border border-[#dfeaea] rounded-2xl p-7 shadow-sm space-y-5">
          <div className="w-11 h-11 rounded-xl bg-[#e9f8f8] text-[#008c98] flex items-center justify-center"><UserRoundCheck className="w-6 h-6" /></div>
          <div><div className="text-xs font-bold uppercase tracking-wider text-[#008c98]">Внешний контур ПРИИЗ</div><h1 className="text-2xl font-extrabold text-[#17383d] mt-1">Активация аккаунта Инициатора</h1><p className="text-sm text-slate-600 mt-2">Подтвержденный UC v9: сотрудник ДКП добавляет внешнего пользователя, после чего пользователь активирует аккаунт по ссылке из письма.</p></div>
          <div className="rounded-xl bg-[#f7fbfb] border border-[#dfeaea] p-4 text-sm space-y-2"><div className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#0099a8]" /><span className="font-semibold">demo.initiator@client.ru</span></div><div className="text-slate-500">ООО «Демо-клиент» · код клиента CLI-DEMO-01</div></div>
          <label className="block"><span className="text-xs font-bold text-slate-700">Создайте пароль</span><div className="mt-1 relative"><KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" /><input type="password" defaultValue="DemoPassword!1" className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#d8e7e7] bg-white text-sm" /></div></label>
          <button onClick={() => setStep('login')} className="w-full py-3 rounded-xl bg-[#0099a8] hover:bg-[#008891] text-white font-bold text-sm">Подтвердить регистрацию</button>
          <div className="text-[11px] text-slate-400">Self-registration остается TBD: в общих ФТ v9 есть самостоятельная регистрация, но детальный UC описывает регистрацию через ДКП.</div>
        </div>
      </div>
    );
  }

  if (step === 'login') {
    return (
      <div className="max-w-md mx-auto py-12">
        <div className="bg-white border border-[#dfeaea] rounded-2xl p-7 shadow-sm space-y-5">
          <div className="w-11 h-11 rounded-xl bg-[#e9f8f8] text-[#008c98] flex items-center justify-center"><LockKeyhole className="w-6 h-6" /></div>
          <div><h1 className="text-2xl font-extrabold text-[#17383d]">Вход в ПРИИЗ</h1><p className="text-sm text-slate-500 mt-1">DEMO внешнего портала.</p></div>
          <input defaultValue="demo.initiator@client.ru" className="w-full px-3 py-2.5 rounded-xl border border-[#d8e7e7] text-sm" />
          <input type="password" defaultValue="DemoPassword!1" className="w-full px-3 py-2.5 rounded-xl border border-[#d8e7e7] text-sm" />
          <button onClick={() => setStep('portal')} className="w-full py-3 rounded-xl bg-[#0099a8] hover:bg-[#008891] text-white font-bold text-sm">Войти</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5 py-4 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div><div className="text-xs font-bold uppercase tracking-wider text-[#008c98]">Внешний портал</div><h1 className="text-2xl font-extrabold text-[#17383d] mt-1">Мои обращения</h1><p className="text-sm text-slate-500 mt-1">Инициатор видит только свои обращения, статусы и общую переписку.</p></div>
        <button onClick={onCreateIncident} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0099a8] text-white font-bold text-sm"><Plus className="w-4 h-4" />Создать обращение</button>
      </div>

      <div className="bg-white border border-[#dfeaea] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="bg-[#f6fbfb] text-xs uppercase tracking-wider text-slate-500 border-b border-[#dfeaea]"><th className="p-4">Обращение</th><th className="p-4">Тип</th><th className="p-4">Статус</th><th className="p-4">1C:ITILIUM</th></tr></thead><tbody className="divide-y divide-[#edf3f3]">{ownIncidents.map((incident) => <tr key={incident.id} className="hover:bg-[#f8fcfc] cursor-pointer" onClick={() => onSelectIncident(incident.id)}><td className="p-4"><div className="font-bold text-[#17383d]">{incident.id}</div><div className="text-xs text-slate-500">ИНЗ {incident.inz}</div></td><td className="p-4">Не получен результат</td><td className="p-4"><span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#e9f8f8] text-[#007f89] border border-[#c8e9e9]">{incident.status}</span></td><td className="p-4 text-xs text-slate-500">{incident.internalServiceDeskId || 'Синхронизация DEMO'}</td></tr>)}</tbody></table></div>
      </div>

      <div className="flex items-start gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800"><CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" /><span>В production статусы обращения на портале должны формироваться по маппингу статусов 1C:ITILIUM из аналитики v9.</span></div>
    </div>
  );
};
