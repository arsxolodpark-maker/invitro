import React, { useMemo, useState } from 'react';
import { History, MessageCircle, Plus, Shield, Users } from 'lucide-react';
import { UserRole } from '../types';
import { getInitiators } from '../services/users';

type InternalUser = { id: number; name: string; email: string; role: UserRole; scope: string; active: boolean };
type ExpressChat = { id: number; name: string; purpose: string; active: boolean };

const INTERNAL_USERS: InternalUser[] = [
  { id: 1, name: 'Мария Иванова', email: 'm.ivanova@demo.ru', role: 'ДКП', scope: 'DEMO: клиенты ДКП', active: true },
  { id: 2, name: 'Анна Петрова', email: 'a.petrova@demo.ru', role: 'Project', scope: 'DEMO: аналитический view', active: true },
  { id: 3, name: 'Иван Смирнов', email: 'i.smirnov@demo.ru', role: 'Инженер ГСТИ', scope: 'DEMO: 1C:ITILIUM', active: true },
];

const INITIAL_CHATS: ExpressChat[] = [
  { id: 1, name: 'ПРИИЗ · новые обращения', purpose: 'Уведомления о новых обращениях', active: true },
  { id: 2, name: 'ПРИИЗ · эскалации', purpose: 'DEMO: критичные события / эскалации', active: true },
];

export const AdminView: React.FC = () => {
  const [internalUsers, setInternalUsers] = useState(INTERNAL_USERS);
  const [chats, setChats] = useState(INITIAL_CHATS);
  const initiators = useMemo(() => getInitiators(), []);
  const roles: UserRole[] = ['ДКП', 'Инженер ГСТИ', 'Администратор', 'Project'];

  const updateRole = (id: number, role: UserRole) => setInternalUsers((prev) => prev.map((u) => u.id === id ? { ...u, role } : u));
  const toggleChat = (id: number) => setChats((prev) => prev.map((c) => c.id === id ? { ...c, active: !c.active } : c));

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-4 pb-16">
      <div><div className="flex items-center gap-2"><Users className="w-6 h-6 text-[#0099a8]" /><h1 className="text-2xl font-extrabold text-[#17383d]">Администрирование ПРИИЗ</h1></div><p className="text-sm text-slate-500 mt-1">Роли, пользователи, аудит и чаты Express. Создание внешнего Инициатора находится в рабочем месте ДКП.</p></div>

      <section className="bg-white border border-[#dfeaea] rounded-2xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-[#dfeaea]"><h2 className="font-bold text-[#17383d]">Внутренние пользователи и роли</h2><p className="text-xs text-slate-500 mt-1">Администратор назначает роли. Project остается дополнительным аналитическим view прототипа.</p></div>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="bg-[#f6fbfb] text-xs uppercase tracking-wider text-slate-500"><th className="p-4">Пользователь</th><th className="p-4">Роль</th><th className="p-4">Область</th><th className="p-4">Статус</th></tr></thead><tbody className="divide-y divide-[#edf3f3]">{internalUsers.map((user) => <tr key={user.id}><td className="p-4"><div className="font-semibold text-[#17383d]">{user.name}</div><div className="text-xs text-slate-500">{user.email}</div></td><td className="p-4"><select value={user.role} onChange={(e) => updateRole(user.id, e.target.value as UserRole)} className="border border-[#d7e6e6] bg-[#f8fbfb] rounded-lg px-3 py-2 text-sm">{roles.map((role) => <option key={role}>{role}</option>)}</select></td><td className="p-4 text-slate-600">{user.scope}</td><td className="p-4"><span className="text-[11px] font-bold px-2 py-1 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">Активен</span></td></tr>)}</tbody></table></div>
      </section>

      <section className="bg-white border border-[#dfeaea] rounded-2xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-[#dfeaea]"><h2 className="font-bold text-[#17383d]">Внешние Инициаторы</h2><p className="text-xs text-slate-500 mt-1">Read-only контроль учетных записей, созданных ДКП.</p></div>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="bg-[#f6fbfb] text-xs uppercase tracking-wider text-slate-500"><th className="p-4">Инициатор</th><th className="p-4">Организация</th><th className="p-4">Код клиента</th><th className="p-4">Статус</th></tr></thead><tbody className="divide-y divide-[#edf3f3]">{initiators.map((user) => <tr key={user.id}><td className="p-4"><div className="font-semibold text-[#17383d]">{user.secondName} {user.firstName}</div><div className="text-xs text-slate-500">{user.email}</div></td><td className="p-4 text-slate-600">{user.organization}</td><td className="p-4 font-mono text-xs">{user.clientCode}</td><td className="p-4"><span className={`text-[11px] font-bold px-2 py-1 rounded-full border ${user.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>{user.active ? 'Активен' : 'Ожидает активации'}</span></td></tr>)}</tbody></table></div>
      </section>

      <section className="bg-white border border-[#dfeaea] rounded-2xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-[#dfeaea] flex items-center justify-between"><div><h2 className="font-bold text-[#17383d] flex items-center gap-2"><MessageCircle className="w-4 h-4 text-[#0099a8]" />Чаты Express</h2><p className="text-xs text-slate-500 mt-1">v9: Администратор добавляет, изменяет и удаляет чаты для нотификаций.</p></div><button onClick={() => setChats((prev) => [...prev, { id: Date.now(), name: 'Новый чат · DEMO', purpose: 'Назначение TBD', active: true }])} className="inline-flex items-center gap-1 text-xs font-bold text-[#008c98]"><Plus className="w-4 h-4" />Добавить</button></div>
        <div className="divide-y divide-[#edf3f3]">{chats.map((chat) => <div key={chat.id} className="p-4 flex items-center justify-between gap-4"><div><div className="font-semibold text-[#17383d]">{chat.name}</div><div className="text-xs text-slate-500">{chat.purpose}</div></div><button onClick={() => toggleChat(chat.id)} className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${chat.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>{chat.active ? 'Активен' : 'Выключен'}</button></div>)}</div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="bg-white border border-[#dfeaea] rounded-2xl p-5"><div className="flex items-center gap-2 font-bold text-[#17383d]"><Shield className="w-4 h-4 text-[#0099a8]" />RBAC</div><p className="text-xs text-slate-600 mt-2">Production IAM/SSO и точный scope ролей требуют отдельного согласования.</p></div><div className="bg-white border border-[#dfeaea] rounded-2xl p-5"><div className="flex items-center gap-2 font-bold text-[#17383d]"><History className="w-4 h-4 text-[#0099a8]" />Аудит</div><p className="text-xs text-slate-600 mt-2">v9 требует логирования действий пользователя: кто и когда изменил роль, чат или состояние учетной записи.</p></div></div>
    </div>
  );
};
