import React, { useState } from 'react';
import { History, MessageCircle, Pencil, Plus, Save, Shield, Trash2, Users, X } from 'lucide-react';
import { UserRole } from '../types';
import { getInitiators } from '../services/users';

type InternalUser = { id: number; name: string; email: string; role: UserRole; scope: string; active: boolean };
type ExpressChat = { id: number; name: string; purpose: string; active: boolean };

const USERS_KEY = 'priiz_admin_users_v072';
const CHATS_KEY = 'priiz_express_chats_v072';

const INITIAL_USERS: InternalUser[] = [
  { id: 1, name: 'Мария Иванова', email: 'm.ivanova@demo.ru', role: 'ДКП', scope: 'Клиенты ДКП · DEMO', active: true },
  { id: 2, name: 'Анна Петрова', email: 'a.petrova@demo.ru', role: 'Project', scope: 'Аналитика · DEMO', active: true },
  { id: 3, name: 'Иван Смирнов', email: 'i.smirnov@demo.ru', role: 'Инженер ГСТИ', scope: '1C:ITILIUM · DEMO', active: true },
];

const INITIAL_CHATS: ExpressChat[] = [
  { id: 1, name: 'ПРИИЗ · новые обращения', purpose: 'Новые обращения', active: true },
  { id: 2, name: 'ПРИИЗ · эскалации', purpose: 'Критичные события и эскалации', active: true },
];

function loadLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export const AdminView: React.FC = () => {
  const [internalUsers, setInternalUsers] = useState<InternalUser[]>(() => loadLocal(USERS_KEY, INITIAL_USERS));
  const [chats, setChats] = useState<ExpressChat[]>(() => loadLocal(CHATS_KEY, INITIAL_CHATS));
  const [showChatForm, setShowChatForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [chatForm, setChatForm] = useState({ name: '', purpose: '' });
  const initiators = getInitiators();
  const roles: UserRole[] = ['ДКП', 'Инженер ГСТИ', 'Администратор', 'Project'];

  const persistUsers = (next: InternalUser[]) => {
    setInternalUsers(next);
    localStorage.setItem(USERS_KEY, JSON.stringify(next));
  };
  const persistChats = (next: ExpressChat[]) => {
    setChats(next);
    localStorage.setItem(CHATS_KEY, JSON.stringify(next));
  };

  const updateRole = (id: number, role: UserRole) => persistUsers(internalUsers.map((u) => u.id === id ? { ...u, role } : u));
  const toggleChat = (id: number) => persistChats(chats.map((c) => c.id === id ? { ...c, active: !c.active } : c));

  const openAddChat = () => {
    setEditingId(null);
    setChatForm({ name: '', purpose: '' });
    setShowChatForm(true);
  };

  const openEditChat = (chat: ExpressChat) => {
    setEditingId(chat.id);
    setChatForm({ name: chat.name, purpose: chat.purpose });
    setShowChatForm(true);
  };

  const saveChat = (e: React.FormEvent) => {
    e.preventDefault();
    const name = chatForm.name.trim();
    const purpose = chatForm.purpose.trim();
    if (!name || !purpose) return;
    if (editingId) {
      persistChats(chats.map((chat) => chat.id === editingId ? { ...chat, name, purpose } : chat));
    } else {
      persistChats([...chats, { id: Date.now(), name, purpose, active: true }]);
    }
    setShowChatForm(false);
    setEditingId(null);
    setChatForm({ name: '', purpose: '' });
  };

  const deleteChat = (id: number) => {
    if (window.confirm('Удалить чат из списка уведомлений?')) persistChats(chats.filter((chat) => chat.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-4 pb-16 notranslate" translate="no">
      <div><div className="flex items-center gap-2"><Users className="w-6 h-6 text-[#0099a8]" /><h1 className="text-2xl font-extrabold text-[#17383d]">Администрирование ПРИИЗ</h1></div><p className="text-sm text-slate-500 mt-1">Роли пользователей, контроль учетных записей и чаты Express.</p></div>

      <section className="bg-white border border-[#dfeaea] rounded-2xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-[#dfeaea]"><h2 className="font-bold text-[#17383d]">Внутренние пользователи и роли</h2><p className="text-xs text-slate-500 mt-1">Изменения в DEMO сохраняются в браузере.</p></div>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="bg-[#f6fbfb] text-xs uppercase tracking-wider text-slate-500"><th className="p-4">Пользователь</th><th className="p-4">Роль</th><th className="p-4">Область</th><th className="p-4">Статус</th></tr></thead><tbody className="divide-y divide-[#edf3f3]">{internalUsers.map((user) => <tr key={user.id}><td className="p-4"><div className="font-semibold text-[#17383d]">{user.name}</div><div className="text-xs text-slate-500">{user.email}</div></td><td className="p-4"><select aria-label={`Роль ${user.name}`} value={user.role} onChange={(e) => updateRole(user.id, e.target.value as UserRole)} className="border border-[#d7e6e6] bg-[#f8fbfb] rounded-lg px-3 py-2 text-sm">{roles.map((role) => <option key={role}>{role}</option>)}</select></td><td className="p-4 text-slate-600">{user.scope}</td><td className="p-4"><span className="text-[11px] font-bold px-2 py-1 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">Активен</span></td></tr>)}</tbody></table></div>
      </section>

      <section className="bg-white border border-[#dfeaea] rounded-2xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-[#dfeaea]"><h2 className="font-bold text-[#17383d]">Внешние Инициаторы</h2><p className="text-xs text-slate-500 mt-1">Контроль учетных записей, созданных ДКП.</p></div>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="bg-[#f6fbfb] text-xs uppercase tracking-wider text-slate-500"><th className="p-4">Инициатор</th><th className="p-4">Организация</th><th className="p-4">Код клиента</th><th className="p-4">Статус</th></tr></thead><tbody className="divide-y divide-[#edf3f3]">{initiators.map((user) => <tr key={user.id}><td className="p-4"><div className="font-semibold text-[#17383d]">{user.secondName} {user.firstName}</div><div className="text-xs text-slate-500">{user.email}</div></td><td className="p-4 text-slate-600">{user.organization}</td><td className="p-4 font-mono text-xs">{user.clientCode}</td><td className="p-4"><span className={`text-[11px] font-bold px-2 py-1 rounded-full border ${user.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>{user.active ? 'Активен' : 'Ожидает активации'}</span></td></tr>)}</tbody></table></div>
      </section>

      <section className="bg-white border border-[#dfeaea] rounded-2xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-[#dfeaea] flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><h2 className="font-bold text-[#17383d] flex items-center gap-2"><MessageCircle className="w-4 h-4 text-[#0099a8]" />Чаты Express</h2><p className="text-xs text-slate-500 mt-1">Список чатов, куда будут направляться уведомления.</p></div><button type="button" onClick={openAddChat} className="inline-flex items-center gap-1 text-xs font-bold text-[#008c98]"><Plus className="w-4 h-4" />Добавить чат</button></div>
        {showChatForm && <form onSubmit={saveChat} className="p-4 bg-[#f7fbfb] border-b border-[#dfeaea] grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end"><label className="text-xs font-bold text-slate-700">Название<input required aria-label="Название чата" value={chatForm.name} onChange={(e) => setChatForm((prev) => ({ ...prev, name: e.target.value }))} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-[#d8e7e7] bg-white text-sm font-normal" /></label><label className="text-xs font-bold text-slate-700">Назначение<input required aria-label="Назначение чата" value={chatForm.purpose} onChange={(e) => setChatForm((prev) => ({ ...prev, purpose: e.target.value }))} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-[#d8e7e7] bg-white text-sm font-normal" /></label><div className="flex gap-2"><button type="submit" className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#0099a8] text-white text-xs font-bold"><Save className="w-4 h-4" />Сохранить</button><button type="button" onClick={() => setShowChatForm(false)} className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500" aria-label="Отменить"><X className="w-4 h-4" /></button></div></form>}
        <div className="divide-y divide-[#edf3f3]">{chats.map((chat) => <div key={chat.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><div className="font-semibold text-[#17383d]">{chat.name}</div><div className="text-xs text-slate-500">{chat.purpose}</div></div><div className="flex items-center gap-2"><button type="button" onClick={() => toggleChat(chat.id)} className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${chat.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>{chat.active ? 'Активен' : 'Выключен'}</button><button type="button" onClick={() => openEditChat(chat)} aria-label={`Изменить ${chat.name}`} className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-[#008c98]"><Pencil className="w-3.5 h-3.5" /></button><button type="button" onClick={() => deleteChat(chat.id)} aria-label={`Удалить ${chat.name}`} className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button></div></div>)}{chats.length === 0 && <div className="p-8 text-center text-sm text-slate-500">Чаты пока не настроены.</div>}</div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="bg-white border border-[#dfeaea] rounded-2xl p-5"><div className="flex items-center gap-2 font-bold text-[#17383d]"><Shield className="w-4 h-4 text-[#0099a8]" />Права доступа</div><p className="text-xs text-slate-600 mt-2">Промышленная схема IAM/SSO и точные области прав согласуются отдельно.</p></div><div className="bg-white border border-[#dfeaea] rounded-2xl p-5"><div className="flex items-center gap-2 font-bold text-[#17383d]"><History className="w-4 h-4 text-[#0099a8]" />Аудит</div><p className="text-xs text-slate-600 mt-2">Действия администратора должны фиксироваться: кто и когда изменил роль, чат или состояние учетной записи.</p></div></div>
    </div>
  );
};
