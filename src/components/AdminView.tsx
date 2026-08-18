import React, { useState } from 'react';
import { Users, UserPlus, Shield, History } from 'lucide-react';
import { UserRole } from '../types';

type DemoUser = { id: number; name: string; role: UserRole; scope: string };
const INITIAL: DemoUser[] = [
  { id: 1, name: 'Мария Иванова', role: 'ДКП', scope: 'DEMO: клиенты ДКП' },
  { id: 2, name: 'Анна Петрова', role: 'Project', scope: 'DEMO: проекты интеграций' },
  { id: 3, name: 'Иван Смирнов', role: 'Support', scope: 'DEMO: техническая поддержка' },
];

export const AdminView: React.FC = () => {
  const [users, setUsers] = useState(INITIAL);
  const roles: UserRole[] = ['Администратор', 'ДКП', 'Project', 'Support'];
  const updateRole = (id: number, role: UserRole) => setUsers((prev) => prev.map((u) => u.id === id ? { ...u, role } : u));

  return (
    <div className="max-w-6xl mx-auto space-y-5 py-4 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div><div className="flex items-center gap-2"><Users className="w-6 h-6 text-[#0099a8]" /><h1 className="text-2xl font-extrabold text-[#17383d]">Пользователи и роли</h1></div><p className="text-sm text-slate-500 mt-1">DEMO-макет администрирования. Production должен опираться на корпоративную авторизацию и RBAC.</p></div>
        <button disabled className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#e9f8f8] text-[#007f89] font-bold text-sm border border-[#c8e9e9] cursor-not-allowed"><UserPlus className="w-4 h-4" />Добавить пользователя · TBD</button>
      </div>

      <div className="bg-white border border-[#dfeaea] rounded-2xl overflow-hidden shadow-xs"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="bg-[#f6fbfb] text-xs uppercase tracking-wider text-slate-500 border-b border-[#dfeaea]"><th className="p-4">Пользователь</th><th className="p-4">Роль</th><th className="p-4">Область доступа</th><th className="p-4">Статус</th></tr></thead><tbody className="divide-y divide-[#edf3f3]">{users.map((user) => <tr key={user.id}><td className="p-4 font-semibold text-[#17383d]">{user.name}</td><td className="p-4"><select value={user.role} onChange={(e) => updateRole(user.id, e.target.value as UserRole)} className="border border-[#d7e6e6] bg-[#f8fbfb] rounded-lg px-3 py-2 text-sm">{roles.map((role) => <option key={role}>{role}</option>)}</select></td><td className="p-4 text-slate-600">{user.scope}</td><td className="p-4"><span className="text-[11px] font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Активен · DEMO</span></td></tr>)}</tbody></table></div></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-[#dfeaea] rounded-2xl p-5"><div className="flex items-center gap-2 font-bold text-[#17383d]"><Shield className="w-4 h-4 text-[#0099a8]" />Production RBAC</div><p className="text-xs text-slate-600 mt-2">Нужно подтвердить корпоративный IAM/SSO, scope ролей и возможность нескольких ролей на одного пользователя.</p></div>
        <div className="bg-white border border-[#dfeaea] rounded-2xl p-5"><div className="flex items-center gap-2 font-bold text-[#17383d]"><History className="w-4 h-4 text-[#0099a8]" />Аудит</div><p className="text-xs text-slate-600 mt-2">Изменения прав должны фиксировать кто, когда и какую роль назначил или отозвал.</p></div>
      </div>
    </div>
  );
};
