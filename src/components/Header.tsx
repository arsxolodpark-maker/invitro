/**
 * Header Component with Role Switcher & Navigation
 * INVITRO-inspired visual layer for public demo.
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

  const navClass = (active: boolean) =>
    `px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center space-x-1.5 ${
      active
        ? 'bg-[#e8f8f8] text-[#008c98]'
        : 'text-slate-600 hover:text-[#008c98] hover:bg-[#f3fbfb]'
    }`;

  return (
    <header className="bg-white border-b border-[#dce9e9] sticky top-0 z-30 shadow-[0_2px_16px_rgba(24,74,79,0.05)]">
      <div className="h-1 bg-[#00a3ad]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3 cursor-pointer min-w-0" onClick={() => onNavigate('home')}>
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-[25px] leading-none font-black italic tracking-[-0.055em] text-[#0099a8]">
                INVITRO
              </span>
              <span className="h-7 w-px bg-[#d7e5e6] hidden sm:block" />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-[#16383d] tracking-tight text-lg">ПРИИЗ</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e9f8f8] text-[#007f89] border border-[#bce8e8] uppercase tracking-wide">
                    v0.4 demo
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-[#fff7ea] text-[#a86100] border border-[#f3d8a8]">
                    UX prototype
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">Сервис управления инцидентами интеграций</p>
              </div>
            </div>
          </div>

          <div className="flex items-center bg-[#f4f8f8] p-1 rounded-xl border border-[#ddeaea] overflow-x-auto">
            <span className="text-xs font-semibold text-slate-500 px-2 flex items-center gap-1 shrink-0">
              <Shield className="w-3.5 h-3.5 text-[#0099a8]" />
              Роль:
            </span>
            {(['ДКП', 'Manager', 'Project', 'Product', 'Support'] as UserRole[]).map((role) => {
              const isActive = currentRole === role;
              return (
                <button
                  key={role}
                  onClick={() => onRoleChange(role)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all duration-150 shrink-0 ${
                    isActive
                      ? 'bg-[#0099a8] text-white shadow-sm font-bold'
                      : 'text-slate-600 hover:text-[#007f89] hover:bg-white font-medium'
                  }`}
                >
                  {role}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#edf3f3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 text-slate-600 bg-[#f7fbfb] px-3 py-1.5 rounded-lg border border-[#e0eeee] w-full sm:w-auto min-w-0">
            <RoleIcon className="w-4 h-4 text-[#0099a8] shrink-0" />
            <span className="font-semibold text-[#183b40] shrink-0">{ROLES_INFO[currentRole].label}:</span>
            <span className="text-slate-600 truncate max-w-md">{ROLES_INFO[currentRole].desc}</span>
          </div>

          <div className="flex items-center space-x-1 self-end sm:self-auto shrink-0">
            <button onClick={() => onNavigate('home')} className={navClass(activeView === 'home')}>
              <Activity className="w-3.5 h-3.5" />
              <span>Главная</span>
            </button>

            <button onClick={() => onNavigate('analytics')} className={navClass(activeView === 'analytics')}>
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Аналитика</span>
              <span className="bg-[#e9f8f8] text-[#008c98] text-[9px] px-1.5 py-0.5 rounded font-bold">DEMO</span>
            </button>

            <button onClick={() => onNavigate('readme')} className={navClass(activeView === 'readme')}>
              <FileText className="w-3.5 h-3.5" />
              <span>Архитектура & TBD</span>
            </button>

            <button
              onClick={onResetData}
              title="Сбросить демо-данные к исходным"
              className="px-2 py-1.5 rounded-lg text-slate-400 hover:text-[#008c98] hover:bg-[#f0fafa] transition-colors ml-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
