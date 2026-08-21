import React, { useMemo, useState } from 'react';
import { Incident, IncidentStatus, UserRole } from '../types';
import { AlertCircle, CheckCircle2, Clock, Filter, HelpCircle, PlusCircle, Search } from 'lucide-react';

interface MainDashboardProps {
  incidents: Incident[];
  currentRole: UserRole;
  onCreateIncident: () => void;
  onSelectIncident: (id: string) => void;
}

const STATUS_OPTIONS: IncidentStatus[] = ['Новое', 'В работе', 'Отложено', 'Ожидает ответа', 'Ожидает согласования', 'Выполнено', 'Закрыт'];

const statusClass = (status: IncidentStatus) => {
  if (status === 'Новое') return 'bg-[#e9f8f8] text-[#007f89] border-[#bce8e8]';
  if (status === 'В работе') return 'bg-blue-50 text-blue-800 border-blue-200';
  if (status === 'Отложено') return 'bg-slate-100 text-slate-700 border-slate-200';
  if (status === 'Ожидает ответа') return 'bg-amber-50 text-amber-800 border-amber-200';
  if (status === 'Ожидает согласования') return 'bg-violet-50 text-violet-800 border-violet-200';
  if (status === 'Выполнено') return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

export const MainDashboard: React.FC<MainDashboardProps> = ({ incidents, currentRole, onCreateIncident, onSelectIncident }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | IncidentStatus>('ALL');

  const filtered = useMemo(() => incidents.filter((inc) => {
    const q = searchTerm.toLowerCase();
    const matches = [inc.id, inc.client, inc.clientCode, inc.lpu, inc.vendor, inc.inz].some((v) => v.toLowerCase().includes(q));
    return matches && (statusFilter === 'ALL' || inc.status === statusFilter);
  }), [incidents, searchTerm, statusFilter]);

  const activeCount = incidents.filter((i) => ['Новое', 'В работе'].includes(i.status)).length;
  const waitingCount = incidents.filter((i) => ['Ожидает ответа', 'Ожидает согласования'].includes(i.status)).length;
  const completedCount = incidents.filter((i) => ['Выполнено', 'Закрыт'].includes(i.status)).length;
  const canCreate = currentRole === 'ДКП';
  const title = currentRole === 'Инженер ГСТИ' ? 'Очередь обращений' : currentRole === 'Project' ? 'Инциденты и динамика' : 'Обращения';
  const subtitle = currentRole === 'Инженер ГСТИ' ? 'Клиентский контекст и внешний статус обращения.' : 'Все обращения по интеграциям в одном месте.';

  return (
    <div className="space-y-6 pb-12 notranslate" translate="no">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div><h1 className="text-2xl font-extrabold tracking-tight text-[#17383d]">{title}</h1><p className="text-sm text-slate-500 mt-1">{subtitle}</p></div>
        {canCreate && <button onClick={onCreateIncident} className="inline-flex items-center justify-center gap-2 bg-[#0099a8] hover:bg-[#008590] text-white font-bold px-5 py-2.5 rounded-xl text-sm"><PlusCircle className="w-5 h-5" />Создать обращение</button>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Metric title="Активные" value={activeCount} note="Новое + В работе" icon={<AlertCircle className="w-5 h-5" />} />
        <Metric title="Ожидают действий" value={waitingCount} note="Ответ / согласование" icon={<HelpCircle className="w-5 h-5" />} />
        <Metric title="Завершены" value={completedCount} note="Выполнено + Закрыт" icon={<CheckCircle2 className="w-5 h-5" />} />
        <Metric title="MTTR" value="DEMO" note="Baseline ещё не получен" icon={<Clock className="w-5 h-5" />} />
      </div>

      <div className="bg-white p-4 rounded-2xl border border-[#dfeaea] shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1"><Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" /><input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Поиск по ИНЗ, клиенту, ЛПУ, вендору или номеру" className="w-full pl-10 pr-4 py-2.5 bg-[#f8fbfb] border border-[#dbe8e8] rounded-xl text-sm" /></div>
        <div className="flex items-center gap-2"><Filter className="w-4 h-4 text-slate-400" /><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'ALL' | IncidentStatus)} className="bg-[#f8fbfb] border border-[#dbe8e8] text-sm rounded-xl px-3 py-2.5"><option value="ALL">Все статусы</option>{STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
      </div>

      <div className="bg-white rounded-2xl border border-[#dfeaea] shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-[#dfeaea]"><h2 className="font-bold text-[#17383d]">Обращения по интеграциям</h2><p className="text-xs text-slate-500">Показано {filtered.length} из {incidents.length}</p></div>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="bg-[#f6fbfb] text-xs uppercase tracking-wider text-slate-500"><th className="p-4">Обращение</th><th className="p-4">Клиент</th><th className="p-4">ИНЗ</th><th className="p-4">Статус</th><th className="p-4">1C:ITILIUM</th></tr></thead><tbody className="divide-y divide-[#edf3f3]">{filtered.map((incident) => <tr key={incident.id} onClick={() => onSelectIncident(incident.id)} className="hover:bg-[#f5fbfb] cursor-pointer"><td className="p-4"><div className="font-bold text-[#17383d]">{incident.id}</div><div className="text-xs text-slate-500">INC-02 · Не получен результат</div></td><td className="p-4"><div className="font-semibold">{incident.client}</div><div className="text-xs text-slate-500">{incident.lpu}</div></td><td className="p-4 font-mono text-xs">{incident.inz}</td><td className="p-4"><span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border ${statusClass(incident.status)}`}>{incident.status}</span></td><td className="p-4 text-xs text-slate-500">{incident.internalServiceDeskId || 'Регистрация · DEMO'}</td></tr>)}</tbody></table></div>
      </div>
    </div>
  );
};

const Metric: React.FC<{ title: string; value: React.ReactNode; note: string; icon: React.ReactNode }> = ({ title, value, note, icon }) => (
  <div className="bg-white p-5 rounded-2xl border border-[#dfeaea] shadow-xs"><div className="flex justify-between gap-2"><span className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</span><span className="text-[#0099a8]">{icon}</span></div><div className="text-3xl font-extrabold text-[#17383d] mt-3">{value}</div><p className="text-xs text-slate-500 mt-1">{note}</p></div>
);
