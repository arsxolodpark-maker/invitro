import React from 'react';
import { UserRole } from '../types';
import { Shield, UserCheck, BarChart3, Headphones, RotateCcw, Activity, Layers, BookOpen, Users, Grid3X3, Landmark, ShoppingBag, MapPinned, PlugZap, SearchCheck, UserRound } from 'lucide-react';

export type AppView = 'home' | 'direction-check' | 'initiators' | 'select-type' | 'form' | 'detail' | 'analytics' | 'knowledge' | 'admin';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeView: AppView;
  onNavigate: (view: 'home' | 'direction-check' | 'initiators' | 'analytics' | 'knowledge' | 'admin') => void;
  onResetData: () => void;
}

const ROLES_INFO: Record<UserRole, { label: string; desc: string; icon: React.ComponentType<{ className?: string }> }> = {
  Инициатор: { label: 'Инициатор', desc: 'Внешний пользователь: свои обращения, статусы и комментарии', icon: UserRound },
  ДКП: { label: 'Менеджер ДКП', desc: 'Единый фронт: обращения, внешние пользователи и рабочие модули', icon: UserCheck },
  'Инженер ГСТИ': { label: 'Инженер ГСТИ', desc: 'Обработка обращения в 1C:ITILIUM; ПРИИЗ отражает контекст и пользовательский статус', icon: Headphones },
  Администратор: { label: 'Администратор', desc: 'Роли, пользователи и чаты Express для уведомлений', icon: Users },
  Project: { label: 'Project', desc: 'Дополнительный внутренний аналитический view прототипа', icon: Layers },
  Support: { label: 'Support (legacy)', desc: 'Технический legacy-alias DEMO, не промышленная роль v9', icon: Headphones },
};

const PRODUCT_TABS = [
  { label: 'Проверка направления', view: 'direction-check' as const, icon: SearchCheck, active: true },
  { label: 'Инциденты', view: 'home' as const, icon: Activity, active: true },
  { label: 'Инициаторы', view: 'initiators' as const, icon: Users, active: true },
  { label: 'ОМС / лимиты', view: null, icon: Landmark, active: false },
  { label: 'Маркетплейс', view: null, icon: ShoppingBag, active: false },
  { label: 'Покрытие', view: null, icon: MapPinned, active: false },
  { label: 'Платформа', view: null, icon: PlugZap, active: false },
];

const VISIBLE_ROLES: UserRole[] = ['Инициатор', 'ДКП', 'Инженер ГСТИ', 'Project', 'Администратор'];

export const Header: React.FC<HeaderProps> = ({ currentRole, onRoleChange, activeView, onNavigate, onResetData }) => {
  const RoleIcon = ROLES_INFO[currentRole].icon;
  const navClass = (active: boolean) => `px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center space-x-1.5 ${active ? 'bg-[#e8f8f8] text-[#008c98]' : 'text-slate-600 hover:text-[#008c98] hover:bg-[#f3fbfb]'}`;
  const isExternal = currentRole === 'Инициатор';

  return (
    <header className="bg-white border-b border-[#dce9e9] sticky top-0 z-30 shadow-[0_2px_16px_rgba(24,74,79,0.05)]">
      <div className="h-1 bg-[#00a3ad]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <button className="flex items-center gap-3 text-left min-w-0" onClick={() => onNavigate('home')}>
            <span className="text-[25px] leading-none font-black italic tracking-[-0.055em] text-[#0099a8]">INVITRO</span><span className="h-7 w-px bg-[#d7e5e6] hidden sm:block" />
            <div className="min-w-0"><div className="flex items-center gap-2 flex-wrap"><span className="font-extrabold text-[#16383d] tracking-tight text-lg">{isExternal ? 'ПРИИЗ' : 'Рабочий портал'}</span><span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e9f8f8] text-[#007f89] border border-[#bce8e8] uppercase tracking-wide">v0.7 ux</span></div><p className="text-xs text-slate-500 truncate">{isExternal ? 'Портал для Регистрации Инцидентов в Интеграциях Здравоохранения' : 'ПРИИЗ - модуль «Инциденты» единого фронта ДКП'}</p></div>
          </button>
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 px-1">Демо-переключатель ролей · в production пользователю недоступен</div>
            <div className="flex items-center bg-[#f4f8f8] p-1 rounded-xl border border-[#ddeaea] overflow-x-auto"><span className="text-xs font-semibold text-slate-500 px-2 flex items-center gap-1 shrink-0"><Shield className="w-3.5 h-3.5 text-[#0099a8]" />Роль:</span>{VISIBLE_ROLES.map((role) => <button key={role} onClick={() => onRoleChange(role)} className={`px-3 py-1.5 rounded-lg text-xs transition-all shrink-0 ${currentRole === role ? 'bg-[#0099a8] text-white shadow-sm font-bold' : 'text-slate-600 hover:text-[#007f89] hover:bg-white font-medium'}`}>{role}</button>)}</div>
          </div>
        </div>

        {currentRole === 'ДКП' && <div className="mt-3 flex items-center gap-1 overflow-x-auto border-t border-[#edf3f3] pt-2.5"><Grid3X3 className="w-4 h-4 text-[#0099a8] mr-1 shrink-0" />{PRODUCT_TABS.map(({ label, view, icon: Icon, active }) => <button key={label} disabled={!active} onClick={() => active && view && onNavigate(view)} title={active ? '' : 'Отдельный продукт - будет подключен позже'} className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border ${active && ((view === 'home' && activeView === 'home') || activeView === view) ? 'bg-[#e9f8f8] text-[#007f89] border-[#bce8e8]' : active ? 'bg-white text-slate-600 border-[#dfeaea] hover:bg-[#f5fbfb]' : 'bg-[#fafcfc] text-slate-400 border-[#edf2f2] cursor-not-allowed'}`}><Icon className="w-3.5 h-3.5" />{label}{!active && <span className="text-[9px] uppercase">позже</span>}</button>)}</div>}

        <div className="mt-2.5 pt-2.5 border-t border-[#edf3f3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 text-slate-600 bg-[#f7fbfb] px-3 py-1.5 rounded-lg border border-[#e0eeee] w-full sm:w-auto min-w-0"><RoleIcon className="w-4 h-4 text-[#0099a8] shrink-0" /><span className="font-semibold text-[#183b40] shrink-0">{ROLES_INFO[currentRole].label}:</span><span className="text-slate-600 truncate max-w-lg">{ROLES_INFO[currentRole].desc}</span></div>
          <div className="flex items-center space-x-1 self-end sm:self-auto shrink-0">{!isExternal && currentRole !== 'Администратор' && <button onClick={() => onNavigate('home')} className={navClass(activeView === 'home')}><Activity className="w-3.5 h-3.5" /><span>Инциденты</span></button>}{currentRole === 'Project' && <button onClick={() => onNavigate('analytics')} className={navClass(activeView === 'analytics')}><BarChart3 className="w-3.5 h-3.5" /><span>Аналитика</span><span className="text-[9px] font-bold">DEMO</span></button>}{!isExternal && currentRole !== 'Администратор' && <button onClick={() => onNavigate('knowledge')} className={navClass(activeView === 'knowledge')}><BookOpen className="w-3.5 h-3.5" /><span>База знаний</span></button>}{currentRole === 'Администратор' && <button onClick={() => onNavigate('admin')} className={navClass(activeView === 'admin')}><Users className="w-3.5 h-3.5" /><span>Пользователи / Express</span></button>}<button onClick={onResetData} title="Сбросить DEMO-данные" className="px-2 py-1.5 rounded-lg text-slate-400 hover:text-[#008c98] hover:bg-[#f0fafa] transition-colors ml-1"><RotateCcw className="w-3.5 h-3.5" /></button></div>
        </div>
      </div>
    </header>
  );
};
