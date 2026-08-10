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
  ArrowRight,
  BarChart2,
  Building2,
  Server,
  FileCheck2,
  Sparkles
} from 'lucide-react';

interface MainDashboardProps {
  incidents: Incident[];
  currentRole: UserRole;
  onCreateIncident: () => void;
  onSelectIncident: (id: string) => void;
  onNavigateToAnalytics: () => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  incidents,
  currentRole,
  onCreateIncident,
  onSelectIncident,
  onNavigateToAnalytics,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Filter logic
  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      const matchesSearch =
        inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.clientCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.lpu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.inz.includes(searchTerm);

      const matchesStatus =
        statusFilter === 'ALL' || inc.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [incidents, searchTerm, statusFilter]);

  // Demo KPI statistics
  const openCount = incidents.filter((i) => ['Новый', 'В работе'].includes(i.status)).length;
  const needsInfoCount = incidents.filter((i) => i.status === 'Требует уточнения').length;
  const pendingConfirmCount = incidents.filter((i) => i.status === 'Ожидает подтверждения ДКП').length;

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'Новый':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">Новый</span>;
      case 'В работе':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">В работе</span>;
      case 'Требует уточнения':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">Требует уточнения</span>;
      case 'Ожидает подтверждения ДКП':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">Ожидает ДКП</span>;
      case 'Решен':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">Решен</span>;
      case 'Закрыт':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">Закрыт</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner & Main Heading */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Целевой пользовательский слой управления инцидентами
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              ПРИИЗ — Управление инцидентами интеграций
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Регистрация, сопровождение и сквозной контроль обращений по интеграциям МИС/ЛИС INVITRO с гарантией полноты контекста с первого раза.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {currentRole === 'Product' && (
              <button
                onClick={onNavigateToAnalytics}
                className="inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white font-medium px-4 py-3 rounded-xl border border-slate-700 transition-all text-sm shadow-xs"
              >
                <BarChart2 className="w-4 h-4 text-blue-400" />
                <span>Продуктовая аналитика</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            )}

            {currentRole !== 'Product' && (
              <button
                onClick={onCreateIncident}
                className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-3 rounded-xl shadow-md transition-all hover:shadow-lg text-sm group"
              >
                <PlusCircle className="w-5 h-5 transition-transform group-hover:rotate-90" />
                <span>Создать обращение</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Demo KPI Block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Открытые обращения</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              демо-данные
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{openCount}</span>
            <AlertCircle className="w-5 h-5 text-blue-600" />
          </div>
          <p className="mt-1 text-xs text-slate-500">В статусах "Новый" и "В работе"</p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Требуют уточнения</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
              демо-данные
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{needsInfoCount}</span>
            <HelpCircle className="w-5 h-5 text-amber-500" />
          </div>
          <p className="mt-1 text-xs text-slate-500">Запрошены данные у ДКП / Вендора</p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ожидают ДКП</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
              демо-данные
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{pendingConfirmCount}</span>
            <CheckCircle2 className="w-5 h-5 text-purple-600" />
          </div>
          <p className="mt-1 text-xs text-slate-500">Технически решены, ждут подтверждения</p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Среднее время (MTTR)</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              демо-данные
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">38 мин</span>
            <Clock className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Значение демонстрационное. Baseline AS-IS будет получен у владельца продукта</p>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Поиск по ИНЗ, клиенту, ЛПУ, вендору или номеру PRIIZ-000..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2 shrink-0">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Все статусы</option>
            <option value="Новый">Новый</option>
            <option value="В работе">В работе</option>
            <option value="Требует уточнения">Требует уточнения</option>
            <option value="Ожидает подтверждения ДКП">Ожидает подтверждения ДКП</option>
            <option value="Закрыт">Закрыт</option>
          </select>
        </div>

      </div>

      {/* Incidents Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 text-base">Обращения по интеграциям</h2>
            <p className="text-xs text-slate-500">
              Показано {filteredIncidents.length} из {incidents.length} обращений
            </p>
          </div>
          {currentRole !== 'Product' && (
            <button
              onClick={onCreateIncident}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
            >
              <PlusCircle className="w-4 h-4" />
              Новое обращение
            </button>
          )}
        </div>

        {filteredIncidents.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-slate-800 font-semibold text-sm">Обращений не найдено</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Попробуйте изменить параметры поиска или сбросьте фильтры.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }}
              className="text-xs font-medium text-blue-600 hover:underline"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">№ Обращения</th>
                  <th className="py-3 px-4">Тип</th>
                  <th className="py-3 px-4">Клиент / ЛПУ</th>
                  <th className="py-3 px-4">Вендор</th>
                  <th className="py-3 px-4">ИНЗ</th>
                  <th className="py-3 px-4">Статус</th>
                  <th className="py-3 px-4">Контекст</th>
                  <th className="py-3 px-4 text-right">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredIncidents.map((incident) => (
                  <tr
                    key={incident.id}
                    onClick={() => onSelectIncident(incident.id)}
                    className="hover:bg-blue-50/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {incident.id}
                      <div className="text-[11px] font-normal text-slate-400">
                        {new Date(incident.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-xs font-medium">
                        {incident.incidentType}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{incident.client}</span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <span className="text-[11px] text-slate-400 font-mono">[{incident.clientCode}]</span>
                        <span className="truncate max-w-[180px]">{incident.lpu}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                      <div className="flex items-center gap-1">
                        <Server className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{incident.vendor}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {incident.integrationType}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-900">
                      {incident.inz}
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(incident.status)}
                    </td>

                    <td className="py-3.5 px-4">
                      {incident.fullDataOnFirstSubmit ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <FileCheck2 className="w-3 h-3 text-emerald-600" />
                          Полный 100%
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <HelpCircle className="w-3 h-3 text-amber-600" />
                          Уточнения ({incident.clarificationCount})
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="text-xs font-semibold text-blue-600 group-hover:underline">
                        Открыть →
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
