/**
 * Screen 2: Incident Type Selection
 */

import React, { useState } from 'react';
import { IncidentType } from '../types';
import { FileSearch, MoreHorizontal, ArrowLeft, Info, Sparkles } from 'lucide-react';

interface IncidentTypeSelectProps {
  onSelectType: (type: IncidentType) => void;
  onBack: () => void;
}

const TYPES: {
  id: IncidentType;
  code: string;
  title: string;
  desc: string;
  active: boolean;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: 'INC-02',
    code: 'INC-02',
    title: 'Не получен результат',
    desc: 'Рабочий демонстрационный сценарий. Обязательный контекст собирается до передачи обращения в работу.',
    active: true,
    icon: FileSearch,
  },
  {
    id: 'OTHER',
    code: 'TBD',
    title: 'Другие типы обращений',
    desc: 'Каталог будет сформирован по фактической статистике поддержки. Конкретные категории здесь намеренно не придумываются.',
    active: false,
    icon: MoreHorizontal,
  },
];

export const IncidentTypeSelect: React.FC<IncidentTypeSelectProps> = ({ onSelectType, onBack }) => {
  const [notice, setNotice] = useState<string | null>(null);

  const handleCardClick = (item: (typeof TYPES)[0]) => {
    if (item.active) {
      setNotice(null);
      onSelectType(item.id);
    } else {
      setNotice('Другие типы будут добавлены после получения реальной статистики обращений и согласования каталога с владельцем продукта и поддержкой.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4 pb-12">
      <div className="flex items-center justify-between gap-4">
        <button onClick={onBack} className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-600 hover:text-[#007f8a] bg-white px-3 py-1.5 rounded-lg border border-slate-200 transition-colors shadow-2xs"><ArrowLeft className="w-4 h-4" /><span>Вернуться на главную</span></button>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Шаг 1 из 2: Выбор типа инцидента</span>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-[#0099a8] text-xs font-bold uppercase tracking-wider"><span className="w-2 h-2 rounded-full bg-[#0099a8]" />ПРИИЗ</div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Выберите тип обращения</h1>
        <p className="text-sm text-slate-600">Категория проблемы определяет обязательный контекст. В текущем DEMO подтвержден только сценарий INC-02.</p>
      </div>

      {notice && <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3 text-amber-900 shadow-2xs animate-fade-in"><Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" /><div className="text-sm"><p className="font-semibold">Каталог типов - TBD</p><p className="text-amber-800 text-xs mt-0.5">{notice}</p></div></div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TYPES.map((item) => {
          const Icon = item.icon;
          const isInc02 = item.id === 'INC-02';
          return (
            <div key={item.id} onClick={() => handleCardClick(item)} className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${isInc02 ? 'bg-white border-[#79cfd3] shadow-sm ring-4 ring-[#e9f8f8] hover:border-[#0099a8]' : 'bg-[#f8fbfb] border-slate-200 hover:border-[#b9dcde] hover:bg-white'}`}>
              {isInc02 && <div className="absolute top-4 right-4 inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#e9f8f8] text-[#007f8a] border border-[#b9e3e4]"><Sparkles className="w-3 h-3 text-[#0099a8]" />Рабочий сценарий</div>}
              <div className="space-y-3"><div className="flex items-center space-x-3 pr-28"><div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isInc02 ? 'bg-[#0099a8] text-white' : 'bg-[#e8f0f0] text-slate-600'}`}><Icon className="w-5 h-5" /></div><div><span className="text-xs font-bold text-slate-400 font-mono">{item.code}</span><h3 className="text-base font-bold text-slate-900 leading-tight">{item.title}</h3></div></div><p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p></div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold">{isInc02 ? <span className="text-[#008c98]">Заполнить форму →</span> : <span className="text-slate-400">После анализа статистики</span>}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
