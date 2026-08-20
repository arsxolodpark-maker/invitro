import React, { useMemo, useState } from 'react';
import { Copy, MailPlus, UserPlus, Users } from 'lucide-react';
import { createInitiator, getInitiators, InitiatorAccount } from '../services/users';

export const DkpInitiatorsView: React.FC = () => {
  const [items, setItems] = useState<InitiatorAccount[]>(() => getInitiators());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    firstName: 'Алексей',
    secondName: 'Соколов',
    patronymic: 'Игоревич',
    email: `new.initiator.${Date.now().toString().slice(-4)}@client.demo`,
    phone: '+79990000002',
    clientCode: 'CLI-DEMO-01',
    organization: 'ООО «Демо-клиент»',
  });
  const latest = useMemo(() => items[items.length - 1], [items]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = createInitiator(form);
    setItems(getInitiators());
    setShowForm(false);
    setForm((prev) => ({ ...prev, email: `new.initiator.${Date.now().toString().slice(-4)}@client.demo` }));
    navigator.clipboard?.writeText(`DEMO activation token: ${created.userToken}`).catch(() => undefined);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5 py-4 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#008c98]">ДКП · ПРИИЗ</div>
          <h1 className="text-2xl font-extrabold text-[#17383d] mt-1">Инициаторы клиентов</h1>
          <p className="text-sm text-slate-500 mt-1">Поток из UC-01 v9: ДКП создает внешнего пользователя, пользователь активирует аккаунт по ссылке.</p>
        </div>
        <button onClick={() => setShowForm((v) => !v)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0099a8] text-white font-bold text-sm"><UserPlus className="w-4 h-4" />Добавить инициатора</button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="bg-white border border-[#dfeaea] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 font-bold text-[#17383d]"><MailPlus className="w-4 h-4 text-[#0099a8]" />Новый внешний пользователь</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(form).map(([key, value]) => (
              <label key={key} className="block"><span className="text-xs font-bold text-slate-600">{({firstName:'Имя',secondName:'Фамилия',patronymic:'Отчество',email:'Email',phone:'Телефон',clientCode:'Код клиента',organization:'Организация'} as Record<string,string>)[key]}</span><input value={value} onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-[#d8e7e7] text-sm" /></label>
            ))}
          </div>
          <div className="flex justify-end"><button type="submit" className="px-4 py-2.5 rounded-xl bg-[#0099a8] text-white font-bold text-sm">Создать и отправить приглашение · DEMO</button></div>
        </form>
      )}

      <div className="bg-white border border-[#dfeaea] rounded-2xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-[#dfeaea] flex items-center gap-2"><Users className="w-4 h-4 text-[#0099a8]" /><div><div className="font-bold text-[#17383d]">Пользователи клиента</div><div className="text-xs text-slate-500">Статус активации виден ДКП, чтобы не выяснять его по почте/телефону.</div></div></div>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="bg-[#f6fbfb] text-xs uppercase tracking-wider text-slate-500"><th className="p-4">Инициатор</th><th className="p-4">Организация</th><th className="p-4">Код клиента</th><th className="p-4">Статус</th><th className="p-4">Приглашение</th></tr></thead><tbody className="divide-y divide-[#edf3f3]">{items.map((user) => <tr key={user.id}><td className="p-4"><div className="font-semibold text-[#17383d]">{user.secondName} {user.firstName} {user.patronymic}</div><div className="text-xs text-slate-500">{user.email} · {user.phone}</div></td><td className="p-4 text-slate-700">{user.organization}</td><td className="p-4 font-mono text-xs">{user.clientCode}</td><td className="p-4"><span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${user.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>{user.active ? 'Активен' : 'Ожидает активации'}</span></td><td className="p-4"><button onClick={() => navigator.clipboard?.writeText(`DEMO activation token: ${user.userToken}`).catch(() => undefined)} className="inline-flex items-center gap-1 text-xs font-bold text-[#008c98]"><Copy className="w-3.5 h-3.5" />Скопировать DEMO-ссылку</button></td></tr>)}</tbody></table></div>
      </div>

      {latest && !latest.active && <div className="rounded-xl bg-[#f3fbfb] border border-[#cfeaea] p-4 text-xs text-slate-600">Для контрольного сценария переключись на роль <strong>Инициатор</strong>: экран активации подтянет последнего созданного пользователя <strong>{latest.email}</strong>.</div>}
    </div>
  );
};
