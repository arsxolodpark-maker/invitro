/**
 * Main Application Component
 * INVITRO Unified DKP Portal Prototype v0.7 UX pass
 */

import React, { useEffect, useState } from 'react';
import { Incident, IncidentStatus, IncidentType, UserRole } from './types';
import { addIncidentComment, closeIncident, confirmResultReceipt, createIncident, getIncidentById, getIncidents, resetDemoData, updateIncidentStatus } from './services/incidents';
import { resetInitiators } from './services/users';
import { Header, AppView } from './components/Header';
import { MainDashboard } from './components/MainDashboard';
import { DirectionCheckView } from './components/DirectionCheckView';
import { DkpInitiatorsView } from './components/DkpInitiatorsView';
import { IncidentTypeSelect } from './components/IncidentTypeSelect';
import { IncidentFormV07 } from './components/IncidentFormV07';
import { IncidentDetailCard } from './components/IncidentDetailCard';
import { AnalyticsView } from './components/AnalyticsView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { AdminView } from './components/AdminView';
import { IntegrationConsoleModal } from './components/IntegrationConsoleModal';
import { InitiatorPortalView } from './components/InitiatorPortalView';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('ДКП');
  const [activeView, setActiveView] = useState<AppView>('home');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<IncidentType | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [consoleInz, setConsoleInz] = useState<string | null>(null);

  useEffect(() => { setIncidents(getIncidents()); }, []);
  const refreshIncidents = () => setIncidents(getIncidents());

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    setSelectedIncidentId(null);
    setConsoleInz(null);
    setActiveView(newRole === 'Администратор' ? 'admin' : 'home');
  };

  const handleNavigate = (view: 'home' | 'direction-check' | 'initiators' | 'analytics' | 'knowledge' | 'admin') => {
    setActiveView(view);
    setSelectedIncidentId(null);
  };

  const handleStartCreateIncident = () => { setActiveView('select-type'); setSelectedType(null); };
  const handleSelectType = (type: IncidentType) => { setSelectedType(type); if (type === 'INC-02') setActiveView('form'); };

  const handleCreateSubmit = (data: Omit<Incident, 'id' | 'createdAt' | 'comments' | 'status' | 'internalServiceDeskId'>) => {
    const created = createIncident(data);
    refreshIncidents();
    setSelectedIncidentId(created.id);
    setActiveView('detail');
  };

  const handleSelectIncident = (id: string) => { setSelectedIncidentId(id); setActiveView('detail'); };
  const handleAddComment = (id: string, text: string) => {
    addIncidentComment(id, currentRole === 'Инженер ГСТИ' ? 'Инженер ГСТИ · DEMO' : currentRole === 'Инициатор' ? 'Инициатор · DEMO' : `Пользователь (${currentRole})`, currentRole, text);
    refreshIncidents();
  };
  const handleConfirmReceipt = (id: string) => { confirmResultReceipt(id, currentRole === 'Инициатор' ? 'Инициатор · DEMO' : `Пользователь (${currentRole})`, currentRole); refreshIncidents(); };
  const handleCloseIncident = (id: string, rootCause: string, resolution: string) => { closeIncident(id, 'Инженер ГСТИ · DEMO', rootCause, resolution); refreshIncidents(); };
  const handleStatusChange = (id: string, status: IncidentStatus) => { updateIncidentStatus(id, status); refreshIncidents(); };

  const handleResetDemoData = () => {
    if (window.confirm('Сбросить обращения, пользователей и изменения контрольного сценария к исходным DEMO-данным?')) {
      resetDemoData();
      resetInitiators();
      refreshIncidents();
      setActiveView(currentRole === 'Администратор' ? 'admin' : 'home');
      setSelectedIncidentId(null);
      window.location.reload();
    }
  };

  const selectedIncident = selectedIncidentId ? getIncidentById(selectedIncidentId) : null;
  const isAdmin = currentRole === 'Администратор';
  const isInitiator = currentRole === 'Инициатор';
  const isEngineer = currentRole === 'Инженер ГСТИ';

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col">
      <Header currentRole={currentRole} onRoleChange={handleRoleChange} activeView={activeView} onNavigate={handleNavigate} onResetData={handleResetDemoData} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeView === 'home' && isInitiator && <InitiatorPortalView incidents={incidents} onCreateIncident={handleStartCreateIncident} onSelectIncident={handleSelectIncident} />}
        {activeView === 'home' && !isInitiator && !isAdmin && <MainDashboard incidents={incidents} currentRole={currentRole} onCreateIncident={handleStartCreateIncident} onSelectIncident={handleSelectIncident} />}
        {activeView === 'direction-check' && currentRole === 'ДКП' && <DirectionCheckView onCreateIncident={handleStartCreateIncident} />}
        {activeView === 'initiators' && currentRole === 'ДКП' && <DkpInitiatorsView />}
        {activeView === 'select-type' && !isAdmin && <IncidentTypeSelect onSelectType={handleSelectType} onBack={() => setActiveView('home')} />}
        {activeView === 'form' && !isAdmin && <IncidentFormV07 currentRole={currentRole} onBack={() => setActiveView('select-type')} onSubmit={handleCreateSubmit} />}
        {activeView === 'detail' && selectedIncident && !isAdmin && <IncidentDetailCard incident={selectedIncident} currentRole={currentRole} onBack={() => setActiveView('home')} onOpenConsole={(inz) => setConsoleInz(inz)} onAddComment={handleAddComment} onConfirmReceipt={handleConfirmReceipt} onCloseIncident={handleCloseIncident} onStatusChange={handleStatusChange} />}
        {activeView === 'analytics' && currentRole === 'Project' && <AnalyticsView />}
        {activeView === 'knowledge' && !isInitiator && !isAdmin && <KnowledgeBaseView />}
        {activeView === 'admin' && isAdmin && <AdminView />}
      </main>

      {consoleInz && isEngineer && <IntegrationConsoleModal inz={consoleInz} onClose={() => setConsoleInz(null)} />}

      <footer className="bg-white border-t border-[#dfeaea] py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center space-x-2"><span className="font-bold text-[#17383d]">ПРИИЗ v0.7 UX</span><span>•</span><span>контрольный end-to-end сценарий</span></div>
          <div className="text-slate-400 text-[11px]">Все данные вымышлены. Реальные API, медицинские данные и ПДн не используются.</div>
        </div>
      </footer>
    </div>
  );
}
