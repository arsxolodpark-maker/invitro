import React, { useMemo, useState } from 'react';
import { BookOpen, Search, FileText, Link2, Sparkles, ShieldCheck, Wrench } from 'lucide-react';

const ITEMS = [
  { id: 'KB-001', title: 'Runbook: не получен результат', type: 'Runbook', project: 'Типовая интеграция', tags: ['INC-02', 'результат'], updated: 'DEMO', source: 'Демо-источник' },
  { id: 'KB-002', title: 'Памятка по сбору контекста обращения', type: 'Инструкция', project: 'ПРИИЗ', tags: ['ДКП', 'контекст'], updated: 'DEMO', source: 'Демо-источник' },
  { id: 'KB-003', title: 'Проектная документация интеграции', type: 'Документация', project: 'Проект DEMO', tags: ['интеграция', 'проект'], updated: 'DEMO', source: 'Демо-источник' },
];

export const KnowledgeBaseView: React.FC = () => {
  const [query, setQuery] = useState('');
  const visible = useMemo(() => ITEMS.filter((item) => `${item.title} ${item.type} ${item.project} ${item.tags.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase())), [query]);

  return (
    <div className="max-w-6xl mx-auto space-y-5 py-4 pb-16 notranslate" translate="no">
      <div><div className="flex items-center gap-2"><BookOpen className="w-6 h-6 text-[#0099a8]" /><h1 className="text-2xl font-extrabold text-[#17383d]">База знаний</h1></div><p className="text-sm text-slate-500 mt-1">Проектная документация, runbook и инструкции в одном поисковом контуре.</p></div>

      <div className="bg-white border border-[#dfeaea] rounded-2xl p-4 shadow-xs"><div className="relative"><Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" /><input aria-label="Поиск в базе знаний" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск по проекту, типу обращения или тегу..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f8fbfb] border border-[#dbe8e8] text-sm focus:outline-none focus:ring-2 focus:ring-[#0099a8]/20" /></div></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          {visible.map((item) => <div key={item.id} className="bg-white border border-[#dfeaea] rounded-2xl p-5 shadow-xs"><div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2 text-xs text-[#008c98] font-bold"><FileText className="w-4 h-4" />{item.type}</div><h2 className="text-base font-bold text-[#17383d] mt-1">{item.title}</h2><p className="text-xs text-slate-500 mt-1">Проект: {item.project} · Обновлено: {item.updated}</p></div><span className="text-[10px] px-2 py-1 rounded-full bg-[#eef8f8] text-[#007f89] border border-[#cbe8e8] font-bold">DEMO</span></div><div className="flex flex-wrap gap-1.5 mt-3">{item.tags.map((tag) => <span key={tag} className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600">#{tag}</span>)}</div><div className="mt-4 pt-3 border-t border-[#edf3f3] flex items-center gap-2 text-xs text-slate-500"><Link2 className="w-3.5 h-3.5" />{item.source}</div></div>)}
          {visible.length === 0 && <div className="bg-white border border-[#dfeaea] rounded-2xl p-8 text-center text-sm text-slate-500"><strong className="block text-[#17383d]">Ничего не найдено</strong><span className="text-xs">Измените поисковый запрос.</span></div>}
        </div>

        <div className="space-y-4">
          <div className="bg-[#f3fbfb] border border-[#cfeaea] rounded-2xl p-5"><div className="flex items-center gap-2 text-[#007f89] font-bold text-sm"><Sparkles className="w-4 h-4" />AI-поиск - следующий этап</div><p className="text-xs text-slate-600 mt-2 leading-relaxed">После подключения подтвержденных источников пользователь сможет задавать вопросы по проектной документации.</p></div>
          <div className="bg-white border border-[#dfeaea] rounded-2xl p-5"><div className="flex items-center gap-2 font-bold text-[#17383d] text-sm"><ShieldCheck className="w-4 h-4 text-[#0099a8]" />Принцип</div><p className="text-xs text-slate-600 mt-2">Показывать ссылку на первоисточник и учитывать права пользователя.</p></div>
          <div className="bg-white border border-[#dfeaea] rounded-2xl p-5"><div className="flex items-center gap-2 font-bold text-[#17383d] text-sm"><Wrench className="w-4 h-4 text-[#0099a8]" />Источники для подключения</div><p className="text-xs text-slate-600 mt-2">Перед внедрением нужно подтвердить набор внутренних документов и правила доступа к ним.</p></div>
        </div>
      </div>
    </div>
  );
};
