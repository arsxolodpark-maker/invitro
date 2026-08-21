import React, { useMemo, useState } from 'react';
import { CheckCircle2, Copy, MailPlus, UserPlus, Users } from 'lucide-react';
import { createInitiator, getInitiators, InitiatorAccount } from '../services/users';

export const DkpInitiatorsView: React.FC = () => {
  const [items, setItems] = useState<InitiatorAccount[]>(() => getInitiators());
  const [showForm, setShowForm] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyError, setCopyError] = useState('');
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
    const created = createInitiator({
      ...form,
      firstName: form.firstName.trim(),
      secondName: form.secondName.trim(),
      patronymic: form.patronymic.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      clientCode: form.clientCode.trim(),
      organization: form.organization.trim(),
    });
    setItems(getInitiators());
    setCreatedId(created.id);
    setCopiedId(null);
    setCopyError('');
    setShowForm(false);
    setForm((prev) => ({ ...prev, email: `new.initiator.${Date.now().toString().slice(-4)}@client.demo` }));
  };

  const copyInvite = async (user: InitiatorAccount) => {
    setCopyError('');
    if (!navigator.clipboard?.writeText) {
      setCopiedId(null);
      setCopyError('Буфер обмена недоступен. Скопируйте DEMO-код вручную из строки пользователя.');
      return;
    }
    try {
      await navigator.clipboard.writeText(user.userToken);
      setCopiedId(user.id);
    } catch {
      setCopiedId(null);
      setCopyError('Не удалось скопировать DEMO-код. Выделите код вручную.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5 py-4 pb-16 notranslate" translate="no">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#008c98]">ДКП · ПРИИЗ</div>
          <h1 className="text-2xl font-extrabold text-[#17383d] mt-1">Инициаторы клиентов</h1>
          <p className="text-sm text-slate-500 mt-1">ДКП создает учетную запись внешнего пользователя и передает ему приглашение на активацию.</p>
        </div>
        <button type="button" onClick={() => setShowForm((v) => !v)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0099a8] text-white font-bold text-sm"><UserPlus className="w-4 h-4" />{showForm ? 'Скрыть форму' : 'Добавить инициатора'}</button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="bg-white border border-[#dfeaea] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 font-bold text-[#17383d]"><MailPlus className="w-4 h-4 text-[#0099a8]" />Новый внешний пользователь</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(form).map(([key, value]) => (
              <label key={key} className="block"><span className="text-xs font-bold text-slate-600">{({firstName:'Имя',secondName:'Фамилия',patronymic:'Отчество',email:'Email',phone:'Телефон',clientCode:'Код клиента',organization:'Организация'} as Record<string,string>)[key]}</span><input required={key !== 'patronymic'} type={key === 'email' ? 'email' : 'text'} value={value} onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-[#d8e7e7] text-sm" /></label>
            ))}
          </div>
          <div className="flex justify-end"><button type="submit" className="px-4 py-2.5 rounded-xl bg-[#0099a8] text-white font-bold text-sm">Создать приглашение</button></div>
        </form>
      )}

      {createdId && <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800 flex items-start gap-2"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5"/><div><strong>Приглашение создано.</strong> В публичном DEMO письмо не отправляется. Для продолжения переключитесь на роль «Инициатор».</div></div>}
      {copyError && <div role="alert" className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">{copyError}</div>}

      <div className="bg-white border border-[#dfeaea] rounded-2xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-[#dfeaea] flex items-center gap-2"><Users className="w-4 h-4 text-[#0099a8]" /><div><div className="font-bold text-[#17383d]">Пользователи клиента</div><div className="text-xs text-slate-500">ДКП видит статус активации и DEMO-код приглашения.</div></div></div>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="bg-[#f6fbfb] text-xs uppercase tracking-wider text-slate-500"><th className="p-4">Инициатор</th><th className="p-4">Организация</th><th className="p-4">Код клиента</th><th className="p-4">Статус</th><th className="p-4">Приглашение</th></tr></thead><tbody className="divide-y divide-[#edf3f3]">{items.map((user) => <tr key={user.id} className={createdId === user.id ? 'bg-emerald-50/40' : ''}><td className="p-4"><div className="font-semibold text-[#17383d]">{user.secondName} {user.firstName} {user.patronymic}</div><div className="text-xs text-slate-500">{user.email} · {user.phone}</div></td><td className="p-4 text-slate-700">{user.organization}</td><td className="p-4 font-mono text-xs">{user.clientCode}</td><td className="p-4"><span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${user.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>{user.active ? 'Активен' : 'Ожидает активации'}</span></td><td className="p-4"><div className="font-mono text-[10px] text-slate-400 mb-1 select-all">{user.userToken}</div><button type="button" onClick={() => copyInvite(user)} className="inline-flex items-center gap-1 text-xs font-bold text-[#008c98]"><Copy className="w-3.5 h-3.5" />{copiedId === user.id ? 'Скопировано' : 'Скопировать DEMO-код'}</button></td></tr>)}</tbody></table></div>
      </div>

      {latest && !latest.active && <div className="rounded-xl bg-[#f3fbfb] border border-[#cfeaea] p-4 text-xs text-slate-600">Следующий шаг DEMO: переключитесь на роль <strong>Инициатор</strong>. Экран активации откроет последнего созданного пользователя <strong>{latest.email}</strong>.</div>}
    </div>
  );
};
