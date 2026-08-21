import React from 'react';
import { UserRole } from '../types';
import { Activity, BarChart3, BookOpen, Headphones, Landmark, Layers, MapPinned, PlugZap, RotateCcw, SearchCheck, Shield, ShoppingBag, UserCheck, UserRound, Users } from 'lucide-react';

export type AppView = 'home' | 'direction-check' | 'initiators' | 'select-type' | 'form' | 'detail' | 'analytics' | 'knowledge' | 'admin';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeView: AppView;
  onNavigate: (view: 'home' | 'direction-check' | 'initiators' | 'analytics' | 'knowledge' | 'admin') => void;
  onResetData: () => void;
}

const ROLES_INFO: Record<UserRole, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  Инициатор: { label: 'Инициатор', icon: UserRound },
  ДКП: { label: 'Менеджер ДКП', icon: UserCheck },
  'Инженер ГСТИ': { label: 'Инженер ГСТИ', icon: Headphones },
  Администратор: { label: 'Администратор', icon: Users },
  Project: { label: 'Project', icon: Layers },
  Support: { label: 'Support (legacy)', icon: Headphones },
};

const PRODUCT_TABS = [
  { label: 'Проверка направления', view: 'direction-check' as const, icon: SearchCheck, active: true },
  { label: 'ПРИИЗ', view: 'home' as const, icon: Activity, active: true },
  { label: 'ОМС / лимиты', view: null, icon: Landmark, active: false },
  { label: 'Маркетплейс', view: null, icon: ShoppingBag, active: false },
  { label: 'Покрытие', view: null, icon: MapPinned, active: false },
  { label: 'Платформа', view: null, icon: PlugZap, active: false },
];

const VISIBLE_ROLES: UserRole[] = ['Инициатор', 'ДКП', 'Инженер ГСТИ', 'Project', 'Администратор'];

export const Header: React.FC<HeaderProps> = ({ currentRole, onRoleChange, activeView, onNavigate, onResetData }) => {
  const isExternal = currentRole === 'Инициатор';
  const isPriizView = activeView !== 'direction-check';
  const localClass = (active: boolean) => `px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${active ? 'bg-[#e9f8f8] text-[#007f89]' : 'text-slate-600 hover:bg-[#f3fbfb] hover:text-[#007f89]'}`;

  return (
    <header className="bg-white border-b border-[#dce9e9] sticky top-0 z-30 shadow-[0_2px_12px_rgba(24,74,79,0.04)] notranslate" translate="no">
      <div className="h-1 bg-[#00a3ad]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-2.5">
          <button className="flex items-center gap-3 text-left min-w-0" onClick={() => onNavigate('home')}>
            <span className="text-[24px] leading-none font-black italic tracking-[-0.055em] text-[#0099a8]">INVITRO</span>
            <span className="h-7 w-px bg-[#d7e5e6] hidden sm:block" />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-[#16383d] tracking-tight text-base">{isExternal ? 'ПРИИЗ' : 'Рабочий портал ДКП'}</span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#e9f8f8] text-[#007f89] border border-[#bce8e8] uppercase tracking-wide">v0.7.1</span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">{isExternal ? 'Мои обращения по интеграциям' : 'Единый фронт рабочих модулей'}</p>
            </div>
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <span className="hidden md:inline text-[9px] font-bold uppercase tracking-wider text-amber-700 whitespace-nowrap">DEMO роли</span>
            <div className="flex items-center bg-[#f4f8f8] p-0.5 rounded-lg border border-[#ddeaea] overflow-x-auto min-w-0">
              <Shield className="w-3.5 h-3.5 text-[#0099a8] mx-1.5 shrink-0" />
              {VISIBLE_ROLES.map((role) => <button key={role} onClick={() => onRoleChange(role)} title="Демо-переключатель. В production роль определяется правами доступа." className={`px-2.5 py-1.5 rounded-md text-[11px] transition-all shrink-0 ${currentRole === role ? 'bg-[#0099a8] text-white font-bold' : 'text-slate-600 hover:text-[#007f89] hover:bg-white font-medium'}`}>{role}</button>)}
            </div>
            <button onClick={onResetData} title="Сбросить DEMO-данные" className="p-1.5 rounded-lg text-slate-400 hover:text-[#008c98] hover:bg-[#f0fafa] shrink-0"><RotateCcw className="w-3.5 h-3.5" /></button>
          </div>
        </div>

        {!isExternal && currentRole === 'ДКП' && <div className="mt-2 pt-2 border-t border-[#edf3f3] flex items-center justify-between gap-3 overflow-x-auto">
          <nav className="flex items-center gap-1 shrink-0" aria-label="Продукты единого фронта">
            {PRODUCT_TABS.map(({ label, view, icon: Icon, active }) => <button key={label} disabled={!active} onClick={() => active && view && onNavigate(view)} title={active ? '' : 'Отдельный модуль — будет подключен позже'} className={`shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border ${active && ((view === 'home' && isPriizView) || activeView === view) ? 'bg-[#e9f8f8] text-[#007f89] border-[#bce8e8]' : active ? 'bg-white text-slate-600 border-[#dfeaea] hover:bg-[#f5fbfb]' : 'bg-[#fafcfc] text-slate-400 border-[#edf2f2] cursor-not-allowed'}`}><Icon className="w-3.5 h-3.5" />{label}{!active && <span className="text-[8px] uppercase">позже</span>}</button>)}
          </nav>

          {isPriizView && <nav className="flex items-center gap-1 shrink-0 pl-3 border-l border-[#e4eeee]" aria-label="Разделы ПРИИЗ">
            <button onClick={() => onNavigate('home')} className={localClass(activeView === 'home' || activeView === 'detail' || activeView === 'form')}><Activity className="w-3.5 h-3.5" />Обращения</button>
            <button onClick={() => onNavigate('initiators')} className={localClass(activeView === 'initiators')}><Users className="w-3.5 h-3.5" />Инициаторы</button>
            <button onClick={() => onNavigate('knowledge')} className={localClass(activeView === 'knowledge')}><BookOpen className="w-3.5 h-3.5" />База знаний</button>
          </nav>}
        </div>}

        {!isExternal && currentRole !== 'ДКП' && <div className="mt-2 pt-2 border-t border-[#edf3f3] flex items-center gap-1 text-xs">
          {currentRole === 'Project' && <button onClick={() => onNavigate('analytics')} className={localClass(activeView === 'analytics')}><BarChart3 className="w-3.5 h-3.5" />Аналитика <span className="text-[8px] font-bold">DEMO</span></button>}
          {currentRole === 'Инженер ГСТИ' && <button onClick={() => onNavigate('home')} className={localClass(activeView === 'home' || activeView === 'detail')}><Activity className="w-3.5 h-3.5" />Очередь обращений</button>}
          {(currentRole === 'Project' || currentRole === 'Инженер ГСТИ') && <button onClick={() => onNavigate('knowledge')} className={localClass(activeView === 'knowledge')}><BookOpen className="w-3.5 h-3.5" />База знаний</button>}
          {currentRole === 'Администратор' && <button onClick={() => onNavigate('admin')} className={localClass(activeView === 'admin')}><Users className="w-3.5 h-3.5" />Пользователи / Express</button>}
          <span className="ml-auto text-[10px] text-slate-400">{ROLES_INFO[currentRole].label}</span>
        </div>}
      </div>
    </header>
  );
};
