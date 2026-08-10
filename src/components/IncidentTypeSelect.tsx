/**
 * Screen 2: Incident Type Selection (Выбор типа обращения)
 */

import React, { useState } from 'react';
import { IncidentType } from '../types';
import { 
  FileSearch, 
  FileQuestion, 
  AlertOctagon, 
  BookOpen, 
  MoreHorizontal, 
  ArrowLeft, 
  CheckCircle, 
  Info,
  Sparkles
} from 'lucide-react';

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
    desc: 'Исследование выполнено в ЛИС, но готовый результат не поступил в МИС клиента или не отображается во внешнем контуре.',
    active: true,
    icon: FileSearch,
  },
  {
    id: 'INC-01',
    code: 'INC-01',
    title: 'Не поступила заявка / направление',
    desc: 'Направление отправлено из МИС/ЛПУ клиента, но не появилось в интеграционной платформе или ЛИС ИНВИТРО.',
    active: false,
    icon: FileQuestion,
  },
  {
    id: 'INC-03',
    code: 'INC-03',
    title: 'Невозможно создать заявку',
    desc: 'Ошибка валидации XML/JSON шлюзом при попытке регистрации нового заказа клиентом.',
    active: false,
    icon: AlertOctagon,
  },
  {
    id: 'INC-05',
    code: 'INC-05',
    title: 'Ошибка справочника / НСИ',
    desc: 'Расхождение кодов услуг, биоматериалов или справочников тестов между МИС клиента и ЛИС ИНВИТРО.',
    active: false,
    icon: BookOpen,
  },
  {
    id: 'OTHER',
    code: 'ОТД',
    title: 'Другое',
    desc: 'Нетиповой инцидент или технический вопрос по интеграции.',
    active: false,
    icon: MoreHorizontal,
  },
];

export const IncidentTypeSelect: React.FC<IncidentTypeSelectProps> = ({
  onSelectType,
  onBack,
}) => {
  const [notice, setNotice] = useState<string | null>(null);

  const handleCardClick = (item: (typeof TYPES)[0]) => {
    if (item.active) {
      setNotice(null);
      onSelectType(item.id);
    } else {
      setNotice(`Сценарий ${item.code} «${item.title}» будет добавлен в следующей версии. Пожалуйста, выберите INC-02 «Не получен результат» для демонстрации основного сценария ПРИИЗ v0.1.`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4 pb-12">
      
      {/* Top Breadcrumb & Action */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Вернуться на главную</span>
        </button>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Шаг 1 из 2: Выбор типа инцидента
        </span>
      </div>

      {/* Main Title Block */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Выберите тип обращения
        </h1>
        <p className="text-sm text-slate-600">
          Укажите категорию возникшей интеграционной проблемы для загрузки точной динамической формы сборок данных.
        </p>
      </div>

      {/* Non-intrusive Version Notice Banner */}
      {notice && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3 text-amber-900 shadow-2xs animate-fade-in">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold">Информация о сценарии</p>
            <p className="text-amber-800 text-xs mt-0.5">{notice}</p>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TYPES.map((item) => {
          const Icon = item.icon;
          const isInc02 = item.id === 'INC-02';

          return (
            <div
              key={item.id}
              onClick={() => handleCardClick(item)}
              className={`p-5 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                isInc02
                  ? 'bg-white border-blue-600 shadow-md hover:shadow-lg ring-2 ring-blue-100'
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-white'
              }`}
            >
              {isInc02 && (
                <div className="absolute top-4 right-4 inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  Основной сценарий v0.1
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isInc02
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 font-mono">
                      {item.code}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                {isInc02 ? (
                  <span className="text-blue-600 flex items-center gap-1">
                    Заполнить форму →
                  </span>
                ) : (
                  <span className="text-slate-400">
                    Будет добавлено в след. версии
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
