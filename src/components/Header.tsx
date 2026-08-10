/**
 * Header Component with Role Switcher & Navigation
 */

import React from 'react';
import { UserRole } from '../types';
import { 
  Shield, 
  UserCheck, 
  Briefcase, 
  BarChart3, 
  Headphones, 
  RotateCcw, 
  FileText,
  Activity,
  Layers
} from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeView: 'home' | 'select-type' | 'form' | 'detail' | 'analytics' | 'readme';
  onNavigate: (view: 'home' | 'analytics' | 'readme') => void;
  onResetData: () => void;
  currentIncidentId?: string;
}

const ROLES_INFO: Record<UserRole, { label: string; desc: string; icon: React.ComponentType<{ className?: string }> }> = {
  ДКП: {
    label: 'ДКП (Продажи)',
    desc: 'Создание обращений, комментарии, подтверждение получения результатов',
    icon: UserCheck,
  },
  Manager: {
    label: 'Manager (Клиент)',
    desc: 'Права ДКП + обзор обращений по закрепленным клиентам',
    icon: Briefcase,
  },
  Project: {
    label: 'Project (Проект)',
    desc: 'Права ДКП + обзор обращений по проектам интеграций',
    icon: Layers,
  },
  Product: {
    label: 'Product (Продукт)',
    desc: 'Read-only продуктовая и процессная аналитика, KPI, повторимость',
    icon: BarChart3,
  },
  Support: {
    label: 'Support (Поддержка)',
    desc: 'Полный контекст, диагностика, переход в Консоль (демо), закрытие',
    icon: Headphones,
  },
};

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  activeView,
  onNavigate,
  onResetData,
}) => {
  const RoleIcon = ROLES_INFO[currentRole].icon;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Bar with Brand and Role Selection */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo / Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
              П
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">ПРИИЗ</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  v0.2 INVITRO
                </span>
                <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-xs bg-amber-100 text-amber-800 border border-amber-200">
                  UX prototype
                </span>
              </div>
              <p className="text-xs text-slate-500">Пользовательский слой управления инцидентами</p>
            </div>
          </div>

          {/* Role Switcher Bar */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto">
            <span className="text-xs font-semibold text-slate-500 px-2 flex items-center gap-1 shrink-0">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              Роль:
            </span>
            {(['ДКП', 'Manager', 'Project', 'Product', 'Support'] as UserRole[]).map((role) => {
              const isActive = currentRole === role;
              return (
                <button
                  key={role}
                  onClick={() => onRoleChange(role)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 shrink-0 flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <span>{role}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Role Capability Banner & Main Nav */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          
          <div className="flex items-center space-x-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200/80 w-full sm:w-auto">
            <RoleIcon className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-semibold text-slate-800">{ROLES_INFO[currentRole].label}:</span>
            <span className="text-slate-600 truncate max-w-md">{ROLES_INFO[currentRole].desc}</span>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center space-x-1 ${
                activeView === 'home'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Главная</span>
            </button>

            <button
              onClick={() => onNavigate('analytics')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center space-x-1 ${
                activeView === 'analytics'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Аналитика</span>
              <span className="bg-blue-100 text-blue-800 text-[10px] px-1 rounded font-bold">DEMO</span>
            </button>

            <button
              onClick={() => onNavigate('readme')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center space-x-1 ${
                activeView === 'readme'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Архитектура & TBD</span>
            </button>

            <button
              onClick={onResetData}
              title="Сбросить демо-данные к исходным"
              className="px-2 py-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
