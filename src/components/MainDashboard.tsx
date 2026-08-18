/**
 * Screen 1: Main Dashboard (Главная ПРИИЗ)
 */

import React, { useState, useMemo } from 'react';
import { Incident, IncidentStatus, UserRole } from '../types';
import {
  PlusCircle,
  Search,
  Filter,
  Clock,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Building2,
  Server,
  FileCheck2
} from 'lucide-react';

interface MainDashboardProps {
  incidents: Incident[];
  currentRole: UserRole;
  onCreateIncident: () => void;
  onSelectIncident: (id: string) => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({ incidents, currentRole, onCreateIncident, onSelectIncident }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredIncidents = useMemo(() => incidents.filter((inc) => {
    const matchesSearch = inc.id.toLowerCase().includes(searchTerm.toLowerCase()) || inc.client.toLowerCase().includes(searchTerm.toLowerCase()) || inc.clientCode.toLowerCase().includes(searchTerm.toLowerCase()) || inc.lpu.toLowerCase().includes(searchTerm.toLowerCase()) || inc.vendor.toLowerCase().includes(searchTerm.toLowerCase()) || inc.inz.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || inc.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [incidents, searchTerm, statusFilter]);

  const openCount = incidents.filter((i) => ['Новый', 'В работе'].includes(i.status)).length;
  const needsInfoCount = incidents.filter((i) => i.status === 'Требует уточнения').length;
  const pendingConfirmCount = incidents.filter((i) => i.status === 'Ожидает подтверждения ДКП').length;

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'Новый': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#e9f8f8] text-[#007f89] border border-[#bce8e8]">Новый</span>;
      case 'В работе': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eef7f7] text-[#34666c] border border-[#cee4e4]">В работе</span>;
      case 'Требует уточнения': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">Требует уточнения</span>;
      case 'Ожидает подтверждения ДКП': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eef8ef] text-[#347643] border border-[#cfe7d3]">Ожидает ДКП</span>;
      case 'Решен': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">Решен</span>;
      case 'Закрыт': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">Закрыт</span>;
      default: return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#17383d]">Инциденты</h1>
          <p className="text-sm text-slate-500 mt-1">Регистрация, контроль и сопровождение обращений по интеграциям.</p>
        </div>
        {currentRole !== 'Администратор' && (
          <button onClick={onCreateIncident} className="inline-flex items-center justify-center space-x-2 bg-[#0099a8] hover:bg-[#008590] text-white font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all text-sm group">
            <PlusCircle className="w-5 h-5 transition-transform group-hover:rotate-90" /><span>Создать обращение</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#dfeaea] shadow-xs relative">
          <div className="flex items-center justify-between gap-2"><span className="text-xs font-bold text-[#607579] uppercase tracking-wider">Открытые обращения</span><span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#eef8f8] text-[#008590] border border-[#cbe8e8]">DEMO</span></div>
          <div className="mt-3 flex items-baseline justify-between"><span className="text-3xl font-extrabold text-[#17383d]">{openCount}</span><div className="w-9 h-9 rounded-full bg-[#e9f8f8] flex items-center justify-center"><AlertCircle className="w-5 h-5 text-[#0099a8]" /></div></div>
          <p className="mt-1 text-xs text-slate-500">В статусах «Новый» и «В работе»</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#dfeaea] shadow-xs relative">
          <div className="flex items-center justify-between gap-2"><span className="text-xs font-bold text-[#607579] uppercase tracking-wider">Требуют уточнения</span><span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">DEMO</span></div>
          <div className="mt-3 flex items-baseline justify-between"><span className="text-3xl font-extrabold text-[#17383d]">{needsInfoCount}</span><div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center"><HelpCircle className="w-5 h-5 text-amber-500" /></div></div>
          <p className="mt-1 text-xs text-slate-500">Запрошены данные у ДКП / вендора</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#dfeaea] shadow-xs relative">
          <div className="flex items-center justify-between gap-2"><span className="text-xs font-bold text-[#607579] uppercase tracking-wider">Ожидают ДКП</span><span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#eef8ef] text-[#347643] border border-[#cfe7d3]">DEMO</span></div>
          <div className="mt-3 flex items-baseline justify-between"><span className="text-3xl font-extrabold text-[#17383d]">{pendingConfirmCount}</span><div className="w-9 h-9 rounded-full bg-[#eef8ef] flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-[#4b8e59]" /></div></div>
          <p className="mt-1 text-xs text-slate-500">Технически решены, ждут подтверждения</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#dfeaea] shadow-xs relative">
          <div className="flex items-center justify-between gap-2"><span className="text-xs font-bold text-[#607579] uppercase tracking-wider">Среднее время (MTTR)</span><span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#eef8f8] text-[#008590] border border-[#cbe8e8]">DEMO</span></div>
          <div className="mt-3 flex items-baseline justify-between"><span className="text-3xl font-extrabold text-[#17383d]">38 мин</span><div className="w-9 h-9 rounded-full bg-[#e9f8f8] flex items-center justify-center"><Clock className="w-5 h-5 text-[#0099a8]" /></div></div>
          <p className="mt-1 text-[11px] text-slate-500">Демо-значение. Baseline AS-IS будет подтвержден владельцем продукта</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-[#dfeaea] shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1"><Search className="w-4 h-4 text-[#789093] absolute left-3.5 top-1/2 -translate-y-1/2" /><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Поиск по ИНЗ, клиенту, ЛПУ, вендору или номеру PRIIZ-000..." className="w-full pl-10 pr-4 py-2.5 bg-[#f8fbfb] border border-[#dbe8e8] rounded-xl text-sm text-[#26484d] placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0099a8]/20 focus:bg-white transition-all" /></div>
        <div className="flex items-center space-x-2 shrink-0"><Filter className="w-4 h-4 text-slate-400" /><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-[#f8fbfb] border border-[#dbe8e8] text-[#26484d] text-sm rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#0099a8]/20"><option value="ALL">Все статусы</option><option value="Новый">Новый</option><option value="В работе">В работе</option><option value="Требует уточнения">Требует уточнения</option><option value="Ожидает подтверждения ДКП">Ожидает подтверждения ДКП</option><option value="Закрыт">Закрыт</option></select></div>
      </div>

      <div className="bg-white rounded-2xl border border-[#dfeaea] shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-[#dfeaea] flex items-center justify-between"><div><h2 className="font-bold text-[#17383d] text-base">Обращения по интеграциям</h2><p className="text-xs text-slate-500">Показано {filteredIncidents.length} из {incidents.length} обращений</p></div>{currentRole !== 'Администратор' && <button onClick={onCreateIncident} className="text-xs font-semibold text-[#008c98] hover:underline flex items-center gap-1"><PlusCircle className="w-4 h-4" />Новое обращение</button>}</div>
        {filteredIncidents.length === 0 ? (
          <div className="p-12 text-center space-y-3"><div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400"><Search className="w-6 h-6" /></div><h3 className="text-slate-800 font-semibold text-sm">Обращений не найдено</h3><p className="text-xs text-slate-500">Попробуйте изменить параметры поиска.</p></div>
        ) : (
          <div className="overflow-x-auto"><table className="w-full text-left border-collapse text-sm"><thead><tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider"><th className="py-3 px-4">№ Обращения</th><th className="py-3 px-4">Тип</th><th className="py-3 px-4">Клиент / ЛПУ</th><th className="py-3 px-4">Вендор</th><th className="py-3 px-4">ИНЗ</th><th className="py-3 px-4">Статус</th><th className="py-3 px-4">Контекст</th><th className="py-3 px-4 text-right">Действие</th></tr></thead><tbody className="divide-y divide-slate-100 text-slate-800">
            {filteredIncidents.map((incident) => (
              <tr key={incident.id} onClick={() => onSelectIncident(incident.id)} className="hover:bg-[#eefafa] cursor-pointer transition-colors group">
                <td className="py-3.5 px-4 font-bold text-slate-900 group-hover:text-[#008c98]">{incident.id}<div className="text-[11px] font-normal text-slate-400">{new Date(incident.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</div></td>
                <td className="py-3.5 px-4 font-semibold text-slate-700"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-xs font-medium">{incident.incidentType}</span></td>
                <td className="py-3.5 px-4"><div className="font-semibold text-slate-900 flex items-center gap-1"><Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />{incident.client}</div><div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><span className="text-[11px] text-slate-400 font-mono">[{incident.clientCode}]</span><span className="truncate max-w-[180px]">{incident.lpu}</span></div></td>
                <td className="py-3.5 px-4 text-xs font-medium text-slate-700"><div className="flex items-center gap-1"><Server className="w-3.5 h-3.5 text-slate-400 shrink-0" />{incident.vendor}</div><div className="text-[11px] text-slate-400">{incident.integrationType}</div></td>
                <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-900">{incident.inz}</td>
                <td className="py-3.5 px-4">{getStatusBadge(incident.status)}</td>
                <td className="py-3.5 px-4">{incident.fullDataOnFirstSubmit ? <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200"><FileCheck2 className="w-3 h-3" />Полный 100%</span> : <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200"><HelpCircle className="w-3 h-3" />Уточнения ({incident.clarificationCount})</span>}</td>
                <td className="py-3.5 px-4 text-right"><span className="text-xs font-semibold text-[#008c98] group-hover:underline">Открыть →</span></td>
              </tr>
            ))}
          </tbody></table></div>
        )}
      </div>
    </div>
  );
};
