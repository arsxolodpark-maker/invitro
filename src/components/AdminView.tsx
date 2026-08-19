import React, { useState } from 'react';
import { History, MessageCircle, Plus, Shield, UserPlus, Users } from 'lucide-react';
import { UserRole } from '../types';

type DemoUser = { id: number; name: string; email: string; role: UserRole; scope: string; active: boolean };
type ExpressChat = { id: number; name: string; purpose: string; active: boolean };

const INITIAL_USERS: DemoUser[] = [
  { id: 1, name: 'Мария Иванова', email: 'm.ivanova@demo.ru', role: 'ДКП', scope: 'DEMO: клиенты ДКП', active: true },
  { id: 2, name: 'Анна Петрова', email: 'a.petrova@demo.ru', role: 'Project', scope: 'DEMO: аналитический view', active: true },
  { id: 3, name: 'Иван Смирнов', email: 'i.smirnov@demo.ru', role: 'Инженер ГСТИ', scope: 'DEMO: 1C:ITILIUM', active: true },
  { id: 4, name: 'Внешний инициатор', email: 'initiator@client.demo', role: 'Инициатор', scope: 'CLI-DEMO-01', active: false },
];

const INITIAL_CHATS: ExpressChat[] = [
  { id: 1, name: 'ПРИИЗ · новые обращения', purpose: 'Уведомления о новых обращениях', active: true },
  { id: 2, name: 'ПРИИЗ · эскалации', purpose: 'DEMO: критичные события / эскалации', active: true },
];

export const AdminView: React.FC = () => {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [chats, setChats] = useState(INITIAL_CHATS);
  const roles: UserRole[] = ['Инициатор', 'ДКП', 'Инженер ГСТИ', 'Администратор', 'Project'];

  const updateRole = (id: number, role: UserRole) => setUsers((prev) => prev.map((u) => u.id === id ? { ...u, role } : u));
  const toggleChat = (id: number) => setChats((prev) => prev.map((c) => c.id === id ? { ...c, active: !c.active } : c));

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-4 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div><div className="flex items-center gap-2"><Users className="w-6 h-6 text-[#0099a8]" /><h1 className="text-2xl font-extrabold text-[#17383d]">Администрирование ПРИИЗ</h1></div><p className="text-sm text-slate-500 mt-1">Пользователи, роли и чаты Express. Все действия ниже - DEMO.</p></div>
        <button onClick={() => setUsers((prev) => [...prev, { id: Date.now(), name: 'Новый инициатор · DEMO', email: 'new@client.demo', role: 'Инициатор', scope: 'CLI-DEMO-NEW', active: false }])} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0099a8] text-white font-bold text-sm"><UserPlus className="w-4 h-4" />Добавить инициатора</button>
      </div>

      <section className="bg-white border border-[#dfeaea] rounded-2xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-[#dfeaea]"><h2 className="font-bold text-[#17383d]">Пользователи и роли</h2><p className="text-xs text-slate-500 mt-1">В v9 ДКП участвует в регистрации внешнего пользователя; самостоятельная регистрация остается TBD из-за конфликта требований.</p></div>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="bg-[#f6fbfb] text-xs uppercase tracking-wider text-slate-500"><th className="p-4">Пользователь</th><th className="p-4">Роль</th><th className="p-4">Область</th><th className="p-4">Статус</th></tr></thead><tbody className="divide-y divide-[#edf3f3]">{users.map((user) => <tr key={user.id}><td className="p-4"><div className="font-semibold text-[#17383d]">{user.name}</div><div className="text-xs text-slate-500">{user.email}</div></td><td className="p-4"><select value={user.role} onChange={(e) => updateRole(user.id, e.target.value as UserRole)} className="border border-[#d7e6e6] bg-[#f8fbfb] rounded-lg px-3 py-2 text-sm">{roles.map((role) => <option key={role}>{role}</option>)}</select></td><td className="p-4 text-slate-600">{user.scope}</td><td className="p-4"><span className={`text-[11px] font-bold px-2 py-1 rounded-full border ${user.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>{user.active ? 'Активен' : 'Ожидает активации'}</span></td></tr>)}</tbody></table></div>
      </section>

      <section className="bg-white border border-[#dfeaea] rounded-2xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-[#dfeaea] flex items-center justify-between"><div><h2 className="font-bold text-[#17383d] flex items-center gap-2"><MessageCircle className="w-4 h-4 text-[#0099a8]" />Чаты Express</h2><p className="text-xs text-slate-500 mt-1">Требование v9: Администратор добавляет, изменяет и удаляет чаты для нотификаций.</p></div><button onClick={() => setChats((prev) => [...prev, { id: Date.now(), name: 'Новый чат · DEMO', purpose: 'Назначение TBD', active: true }])} className="inline-flex items-center gap-1 text-xs font-bold text-[#008c98]"><Plus className="w-4 h-4" />Добавить</button></div>
        <div className="divide-y divide-[#edf3f3]">{chats.map((chat) => <div key={chat.id} className="p-4 flex items-center justify-between gap-4"><div><div className="font-semibold text-[#17383d]">{chat.name}</div><div className="text-xs text-slate-500">{chat.purpose}</div></div><button onClick={() => toggleChat(chat.id)} className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${chat.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>{chat.active ? 'Активен' : 'Выключен'}</button></div>)}</div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-[#dfeaea] rounded-2xl p-5"><div className="flex items-center gap-2 font-bold text-[#17383d]"><Shield className="w-4 h-4 text-[#0099a8]" />RBAC</div><p className="text-xs text-slate-600 mt-2">Project остается дополнительным аналитическим view прототипа и не считается подтвержденной промышленной ролью v9.</p></div>
        <div className="bg-white border border-[#dfeaea] rounded-2xl p-5"><div className="flex items-center gap-2 font-bold text-[#17383d]"><History className="w-4 h-4 text-[#0099a8]" />Аудит</div><p className="text-xs text-slate-600 mt-2">v9 требует логирования действий пользователя. Production-аудит и корпоративная IAM/SSO-схема требуют отдельного согласования.</p></div>
      </div>
    </div>
  );
};
