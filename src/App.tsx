/**
 * Main Application Component
 * PRIIZ INVITRO UX Prototype v0.5 DEMO
 */

import React, { useState, useEffect } from 'react';
import { UserRole, IncidentType, Incident } from './types';
import {
  getIncidents,
  getIncidentById,
  createIncident,
  addIncidentComment,
  confirmResultReceipt,
  closeIncident,
  resetDemoData
} from './services/incidents';

import { Header, AppView } from './components/Header';
import { MainDashboard } from './components/MainDashboard';
import { IncidentTypeSelect } from './components/IncidentTypeSelect';
import { IncidentForm } from './components/IncidentForm';
import { IncidentDetailCard } from './components/IncidentDetailCard';
import { AnalyticsView } from './components/AnalyticsView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { AdminView } from './components/AdminView';
import { IntegrationConsoleModal } from './components/IntegrationConsoleModal';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('ДКП');
  const [activeView, setActiveView] = useState<AppView>('home');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<IncidentType | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [consoleInz, setConsoleInz] = useState<string | null>(null);

  useEffect(() => {
    setIncidents(getIncidents());
  }, []);

  const refreshIncidents = () => setIncidents(getIncidents());

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    setSelectedIncidentId(null);
    setActiveView(newRole === 'Администратор' ? 'admin' : 'home');
  };

  const handleNavigate = (view: 'home' | 'analytics' | 'knowledge' | 'admin') => {
    setActiveView(view);
    setSelectedIncidentId(null);
  };

  const handleStartCreateIncident = () => {
    setActiveView('select-type');
    setSelectedType(null);
  };

  const handleSelectType = (type: IncidentType) => {
    setSelectedType(type);
    if (type === 'INC-02') setActiveView('form');
  };

  const handleCreateSubmit = (data: Omit<Incident, 'id' | 'createdAt' | 'comments' | 'status' | 'internalServiceDeskId'>) => {
    const created = createIncident(data);
    refreshIncidents();
    setSelectedIncidentId(created.id);
    setActiveView('detail');
  };

  const handleSelectIncident = (id: string) => {
    setSelectedIncidentId(id);
    setActiveView('detail');
  };

  const handleAddComment = (id: string, text: string) => {
    addIncidentComment(id, `Пользователь (${currentRole})`, currentRole, text);
    refreshIncidents();
  };

  const handleConfirmReceipt = (id: string) => {
    confirmResultReceipt(id, `Пользователь (${currentRole})`, currentRole);
    refreshIncidents();
  };

  const handleCloseIncident = (id: string, rootCause: string, resolution: string) => {
    closeIncident(id, `Пользователь (${currentRole})`, rootCause, resolution);
    refreshIncidents();
  };

  const handleResetDemoData = () => {
    if (window.confirm('Сбросить все изменения к первоначальным демо-данным?')) {
      resetDemoData();
      refreshIncidents();
      setActiveView(currentRole === 'Администратор' ? 'admin' : 'home');
      setSelectedIncidentId(null);
    }
  };

  const selectedIncident = selectedIncidentId ? getIncidentById(selectedIncidentId) : null;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col">
      <Header currentRole={currentRole} onRoleChange={handleRoleChange} activeView={activeView} onNavigate={handleNavigate} onResetData={handleResetDemoData} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeView === 'home' && currentRole !== 'Администратор' && (
          <MainDashboard incidents={incidents} currentRole={currentRole} onCreateIncident={handleStartCreateIncident} onSelectIncident={handleSelectIncident} />
        )}
        {activeView === 'select-type' && currentRole !== 'Администратор' && <IncidentTypeSelect onSelectType={handleSelectType} onBack={() => setActiveView('home')} />}
        {activeView === 'form' && currentRole !== 'Администратор' && <IncidentForm currentRole={currentRole} onBack={() => setActiveView('select-type')} onSubmit={handleCreateSubmit} />}
        {activeView === 'detail' && selectedIncident && currentRole !== 'Администратор' && (
          <IncidentDetailCard incident={selectedIncident} currentRole={currentRole} onBack={() => setActiveView('home')} onOpenConsole={(inz) => setConsoleInz(inz)} onAddComment={handleAddComment} onConfirmReceipt={handleConfirmReceipt} onCloseIncident={handleCloseIncident} />
        )}
        {activeView === 'analytics' && currentRole === 'Project' && <AnalyticsView />}
        {activeView === 'knowledge' && currentRole !== 'Администратор' && <KnowledgeBaseView />}
        {activeView === 'admin' && currentRole === 'Администратор' && <AdminView />}
      </main>

      {consoleInz && currentRole === 'Support' && <IntegrationConsoleModal inz={consoleInz} onClose={() => setConsoleInz(null)} />}

      <footer className="bg-white border-t border-[#dfeaea] py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center space-x-2"><span className="font-bold text-[#17383d]">ПРИИЗ INVITRO UX Prototype v0.5 DEMO</span><span>•</span><span>Модуль единого рабочего портала</span></div>
          <div className="text-slate-400 text-[11px]">Все данные вымышлены (DEMO DATA). Реальные медицинские и ПДн данные не используются.</div>
        </div>
      </footer>
    </div>
  );
}
