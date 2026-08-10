/**
 * Screen 3: Dynamic Form INC-02 "Не получен результат"
 */

import React, { useState } from 'react';
import { 
  Incident, 
  IncidentType, 
  IntegrationType, 
  ProblemScope, 
  WorkedBefore, 
  DiagnosticResult,
  UserRole
} from '../types';
import { runPrecheck } from '../services/diagnostics';
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  FileCheck, 
  Upload, 
  ShieldAlert, 
  HelpCircle,
  Building2,
  Server,
  FileText,
  Sparkles
} from 'lucide-react';

interface IncidentFormProps {
  currentRole: UserRole;
  onBack: () => void;
  onSubmit: (incidentData: Omit<Incident, 'id' | 'createdAt' | 'comments' | 'status' | 'internalServiceDeskId'>) => void;
}

export const IncidentForm: React.FC<IncidentFormProps> = ({
  currentRole,
  onBack,
  onSubmit,
}) => {
  // Form State
  const [client, setClient] = useState('ООО "МедТехЦентр"');
  const [clientCode, setClientCode] = useState('CLI-88231');
  const [lpu, setLpu] = useState('Филиал Юго-Западный (ЛПУ-104)');
  const [inz, setInz] = useState('998877665');
  const [eventDate, setEventDate] = useState(new Date().toISOString().slice(0, 10));
  const [eventTime, setEventTime] = useState('11:30');
  const [vendor, setVendor] = useState('1С:Медицина');
  const [integrationType, setIntegrationType] = useState<IntegrationType>('типовая');
  const [scope, setScope] = useState<ProblemScope>('единичная');
  const [workedBefore, setWorkedBefore] = useState<WorkedBefore>('да');
  const [description, setDescription] = useState('Пациент прошел исследование в 09:30. В ЛИС статус «Выполнено», но результат не отобразился в МИС 1С клиента.');
  
  // Vendor verification state
  const [vendorContacted, setVendorContacted] = useState(true);
  const [vendorAnswer, setVendorAnswer] = useState('Вендор сообщил, что служба интеграции 1С затормозила из-за таймаута входного подключения.');
  const [mockFiles, setMockFiles] = useState<{ name: string; size: string }[]>([
    { name: 'screen_mis_error.png', size: '340 KB' },
    { name: 'vendor_email_response.msg', size: '18 KB' },
  ]);

  // Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-check State
  const [isPrechecking, setIsPrechecking] = useState(false);
  const [precheckResult, setPrecheckResult] = useState<DiagnosticResult | null>(null);

  // Validate form fields inline
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!client.trim()) newErrors.client = 'Заполните название клиента';
    if (!clientCode.trim()) newErrors.clientCode = 'Заполните код клиента';
    if (!lpu.trim()) newErrors.lpu = 'Заполните ЛПУ';
    if (!inz.trim()) newErrors.inz = 'Заполните ИНЗ / номер заявки';
    if (!eventDate) newErrors.eventDate = 'Укажите дату события';
    if (!eventTime) newErrors.eventTime = 'Укажите примерное время';
    if (!vendor.trim()) newErrors.vendor = 'Укажите вендора МИС';
    if (!description.trim()) newErrors.description = 'Заполните краткое описание проблемы';

    if (vendorContacted && !vendorAnswer.trim()) {
      newErrors.vendorAnswer = 'Так как отмечен чекбокс «Уже обращались к вендору», заполните ответ вендора';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Run precheck handler
  const handlePrecheck = async () => {
    if (!validateForm()) {
      return;
    }

    setIsPrechecking(true);
    setPrecheckResult(null);

    try {
      const result = await runPrecheck(inz);
      setPrecheckResult(result);
    } catch (err) {
      console.error('Precheck error:', err);
    } finally {
      setIsPrechecking(false);
    }
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit({
      incidentType: 'INC-02',
      source: 'ПРИИЗ Portal',
      createdBy: `Иванова Мария (${currentRole})`,
      authorRole: currentRole,
      priority: 'Высокий',
      responsibleTeam: 'Support',
      client,
      clientCode,
      lpu,
      vendor,
      integrationType,
      environment: 'Production',
      inz,
      eventDateTime: `${eventDate}T${eventTime}`,
      scope,
      workedBefore,
      description,
      vendorContacted,
      vendorAnswer: vendorContacted ? vendorAnswer : undefined,
      attachments: mockFiles.map((f, idx) => ({
        id: `att-${idx}`,
        fileName: f.name,
        fileSize: f.size,
        fileType: f.name.endsWith('.png') ? 'image/png' : 'application/octet-stream',
        uploadedAt: new Date().toISOString(),
      })),
      diagnosticResult: precheckResult || undefined,
      fullDataOnFirstSubmit: true,
      clarificationCount: 0,
      slaStatus: 'В норме (демо)',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4 pb-16">
      
      {/* Top Breadcrumb & Step Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>К выбору типа инцидента</span>
        </button>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Шаг 2 из 2: Заполнение обязательного контекста
        </span>
      </div>

      {/* Form Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-800 text-xs font-bold font-mono">
              INC-02
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              Форма обращения: «Не получен результат»
            </h1>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            * Обязательные поля
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Цель - сократить количество уточнений за счет полного контекста с первого обращения.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Block 1: Client & Integration Context */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>1. Данные клиента и ЛПУ</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Client Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Клиент <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="Например, ООО Медицина"
                className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                  errors.client ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                }`}
              />
              {errors.client && <p className="text-xs text-red-600 mt-1">{errors.client}</p>}
            </div>

            {/* Client Code */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Код клиента <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={clientCode}
                onChange={(e) => setClientCode(e.target.value)}
                placeholder="CLI-XXXXX"
                className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm text-slate-900 font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                  errors.clientCode ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                }`}
              />
              {errors.clientCode && <p className="text-xs text-red-600 mt-1">{errors.clientCode}</p>}
            </div>

            {/* LPU */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ЛПУ / Филиал <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={lpu}
                onChange={(e) => setLpu(e.target.value)}
                placeholder="Укажите филиал или подразделение ЛПУ"
                className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                  errors.lpu ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                }`}
              />
              {errors.lpu && <p className="text-xs text-red-600 mt-1">{errors.lpu}</p>}
            </div>

          </div>
        </div>

        {/* Block 2: Order & Technical Context */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-600" />
            <span>2. Параметры заявки и интеграции</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* INZ */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ИНЗ / Номер заявки <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={inz}
                onChange={(e) => setInz(e.target.value)}
                placeholder="998877665"
                className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm font-mono font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                  errors.inz ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                }`}
              />
              {errors.inz && <p className="text-xs text-red-600 mt-1">{errors.inz}</p>}
            </div>

            {/* Event Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Дата события <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                  errors.eventDate ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                }`}
              />
              {errors.eventDate && <p className="text-xs text-red-600 mt-1">{errors.eventDate}</p>}
            </div>

            {/* Event Time */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Примерное время события <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                  errors.eventTime ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                }`}
              />
              {errors.eventTime && <p className="text-xs text-red-600 mt-1">{errors.eventTime}</p>}
            </div>

            {/* Vendor */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Вендор МИС <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                placeholder="например, 1С:Медицина, БАРС"
                className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                  errors.vendor ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                }`}
              />
              {errors.vendor && <p className="text-xs text-red-600 mt-1">{errors.vendor}</p>}
            </div>

            {/* Integration Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Тип интеграции <span className="text-red-500">*</span>
              </label>
              <select
                value={integrationType}
                onChange={(e) => setIntegrationType(e.target.value as IntegrationType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="типовая">Типовая</option>
                <option value="кастомная">Кастомная</option>
              </select>
            </div>

            {/* Scope */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Масштаб проблемы <span className="text-red-500">*</span>
              </label>
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value as ProblemScope)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="единичная">Единичная (1 пациент/ИНЗ)</option>
                <option value="несколько">Несколько (группа ИНЗ)</option>
                <option value="массовая">Массовая (все заказы филиала)</option>
                <option value="неизвестно">Неизвестно</option>
              </select>
            </div>

            {/* Worked before */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Работало ли раньше? <span className="text-red-500">*</span>
              </label>
              <select
                value={workedBefore}
                onChange={(e) => setWorkedBefore(e.target.value as WorkedBefore)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="да">Да, раньше работало без сбоев</option>
                <option value="нет">Нет, новый запуск/настройка</option>
                <option value="неизвестно">Неизвестно</option>
              </select>
            </div>

            {/* Short description */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Краткое описание проблемы <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Опишите, что видит пользователь в МИС, есть ли сообщения об ошибках..."
                className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                }`}
              ></textarea>
              {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
            </div>

          </div>
        </div>

        {/* Block 3: Dynamic Section "Что уже проверили" */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>3. Блок «Что уже проверили»</span>
          </h2>

          <div className="space-y-4">
            
            {/* Vendor Contacted Checkbox */}
            <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100/80 transition-colors">
              <input
                type="checkbox"
                checked={vendorContacted}
                onChange={(e) => setVendorContacted(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span className="text-sm font-semibold text-slate-800">
                Уже обращались к вендору МИС / разработчикам интеграции
              </span>
            </label>

            {/* Dynamic Vendor Fields */}
            {vendorContacted && (
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-4 animate-fade-in">
                
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Что ответил вендор? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={vendorAnswer}
                    onChange={(e) => setVendorAnswer(e.target.value)}
                    placeholder="Приведите цитату или суть ответа технической поддержки вендора..."
                    className={`w-full px-3 py-2 bg-white border rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                      errors.vendorAnswer ? 'border-red-500' : 'border-slate-200'
                    }`}
                  ></textarea>
                  {errors.vendorAnswer && <p className="text-xs text-red-600 mt-1">{errors.vendorAnswer}</p>}
                </div>

                {/* Upload Zone Demo */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Переписка / скриншоты (демо-загрузка)
                  </label>
                  <div className="border-2 border-dashed border-blue-200 rounded-xl p-4 text-center bg-white hover:border-blue-400 transition-colors cursor-pointer">
                    <Upload className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-slate-700">Перетащите файлы сюда или нажмите для выбора</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, MSG, TXT, PDF до 10MB</p>
                  </div>

                  {/* Attachment List */}
                  {mockFiles.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {mockFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                          <span className="font-mono text-slate-700">{file.name}</span>
                          <span className="text-slate-400 font-sans">{file.size}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Security Compliance Disclaimer */}
                  <div className="mt-3 flex items-start space-x-2 text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Требование ИБ ИНВИТРО:</strong> В промышленном контуре запрещена неконтролируемая передача реальных персональных данных пациентов и скриншотов медицинских карточек. Используйте только обезличенные данные!
                    </span>
                  </div>

                </div>

              </div>
            )}

          </div>
        </div>

        {/* Precheck Button & Action */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                Автоматическая предварительная проверка
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Запустите экспресс-диагностику ИНЗ {inz || '...'} в интеграционной платформе ИНВИТРО до отправки заявки.
              </p>
            </div>

            <button
              type="button"
              onClick={handlePrecheck}
              disabled={isPrechecking}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shrink-0 flex items-center justify-center space-x-2"
            >
              {isPrechecking ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Выполняется pre-check...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-blue-200" />
                  <span>Предварительно проверить</span>
                </>
              )}
            </button>
          </div>

          {/* Precheck Results Display */}
          {precheckResult && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-4 animate-fade-in text-xs">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <span className="font-bold text-white text-sm flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  Результат экспресс-диагностики ИНЗ {inz}
                </span>
                <span className="text-slate-400 font-mono text-[11px]">
                  trace_id: {precheckResult.traceId}
                </span>
              </div>

              {/* Steps list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {precheckResult.stages.map((stg) => (
                  <div key={stg.id} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-700/80 flex items-start space-x-2">
                    {stg.status === 'ok' ? (
                      <span className="text-emerald-400 font-bold">✓</span>
                    ) : (
                      <span className="text-amber-400 font-bold">⚠️</span>
                    )}
                    <div>
                      <div className="font-bold text-slate-200">{stg.name}</div>
                      {stg.details && <div className="text-slate-400 text-[11px] mt-0.5">{stg.details}</div>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommendation tip box */}
              {precheckResult.recommendedAction && (
                <div className="bg-blue-950/60 border border-blue-800 p-3 rounded-lg text-blue-200 space-y-1">
                  <div className="font-bold text-blue-300 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-blue-400" />
                    <span>Совет / Рекомендация ПРИИЗ</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {precheckResult.recommendedAction}
                  </p>
                </div>
              )}

              {/* Notice that problem needs support ticket creation */}
              <p className="text-[11px] text-amber-300 italic">
                Внимание: в данном сценарии автоматическое решение не выполнено. Нажмите «Создать инцидент» для передачи тикета в единую очередь Support.
              </p>

              {/* Final Submit Ticket Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-sm transition-all shadow-lg flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-100" />
                  <span>Создать инцидент</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </form>

    </div>
  );
};
