/**
 * Incident Management Service
 * DEMO orchestration for PРИИЗ v0.7.2.
 */

import { Incident, IncidentComment, IncidentMetrics, UserRole, IncidentStatus } from '../types';
import { incidentRepository } from '../repositories/incidentRepository';
import { serviceDeskAdapter } from './serviceDesk';

export function getIncidents(): Incident[] { return incidentRepository.getAll(); }
export function getIncidentById(id: string): Incident | undefined { return incidentRepository.getById(id); }

export function createIncident(data: Omit<Incident, 'id' | 'createdAt' | 'comments' | 'status' | 'internalServiceDeskId'>): Incident {
  const newId = incidentRepository.generateNextId();
  const createdAt = new Date().toISOString();
  const contextPart = data.source === 'GOVIN-303'
    ? ` Источник GOVIN-303${data.barcode ? `, идентификатор ${data.barcode}` : ''}${data.inz ? `, ИНЗ ${data.inz}` : ''}.`
    : ` ИНЗ: ${data.inz}.`;
  const newIncident: Incident = {
    ...data,
    id: newId,
    createdAt,
    status: 'Новое',
    resultConfirmed: false,
    comments: [{ id: `c-${Date.now()}`, author: data.createdBy, role: data.authorRole, content: `Обращение создано в ПРИИЗ.${contextPart}`, createdAt }],
  };

  incidentRepository.save(newIncident);
  serviceDeskAdapter.syncWithServiceDesk(newIncident).then((res) => {
    const latest = incidentRepository.getById(newIncident.id);
    if (!latest) return;
    latest.internalServiceDeskId = res.internalTicketId;
    latest.comments.push({ id: `c-${Date.now()}-itilium`, author: 'ПРИИЗ', role: 'Администратор', content: `DEMO: обращение зарегистрировано в 1C:ITILIUM, номер ${res.internalTicketId}.`, createdAt: res.syncedAt, isInternal: true });
    incidentRepository.save(latest);
  }).catch(() => {});
  return newIncident;
}

export function addIncidentComment(incidentId: string, author: string, role: UserRole, content: string, isInternal?: boolean): Incident {
  const incident = incidentRepository.getById(incidentId);
  if (!incident) throw new Error(`Incident with ID ${incidentId} not found`);
  if (incident.status === 'Закрыт') throw new Error('Closed incident cannot receive new comments');
  const trimmed = content.trim(); if (!trimmed) return incident;
  const newComment: IncidentComment = { id: `c-${Date.now()}`, author, role, content: trimmed, createdAt: new Date().toISOString(), isInternal };
  if (role === 'Инженер ГСТИ') {
    if (trimmed.toLowerCase().includes('уточн')) { incident.clarificationCount = (incident.clarificationCount || 0) + 1; incident.status = 'Ожидает ответа'; incident.resultConfirmed = false; }
    else if (incident.status === 'Новое' || incident.status === 'Ожидает ответа') { incident.status = 'В работе'; incident.resultConfirmed = false; }
  } else if ((role === 'Инициатор' || role === 'ДКП') && incident.status === 'Ожидает ответа') { incident.status = 'В работе'; incident.resultConfirmed = false; }
  incident.comments.push(newComment); return incidentRepository.save(incident);
}

export function updateIncidentStatus(incidentId: string, status: IncidentStatus): Incident {
  const incident = incidentRepository.getById(incidentId);
  if (!incident) throw new Error(`Incident with ID ${incidentId} not found`);
  if (incident.status === 'Закрыт') throw new Error('Closed incident status cannot be changed');
  if (incident.status === status) return incident;
  incident.status = status;
  if (status !== 'Выполнено') incident.resultConfirmed = false;
  incident.comments.push({ id: `c-${Date.now()}-status`, author: '1C:ITILIUM → ПРИИЗ', role: 'Инженер ГСТИ', content: `Статус обращения изменен на «${status}».`, createdAt: new Date().toISOString() });
  return incidentRepository.save(incident);
}

export function confirmResultReceipt(incidentId: string, authorName: string, role: UserRole): Incident {
  const incident = incidentRepository.getById(incidentId);
  if (!incident) throw new Error(`Incident with ID ${incidentId} not found`);
  if (incident.source === 'GOVIN-303') throw new Error('GOVIN incident does not require Initiator result confirmation');
  if (role !== 'Инициатор') throw new Error('Only Initiator can confirm result receipt in the current prototype');
  if (incident.status !== 'Выполнено') throw new Error('Result can be confirmed only for completed work');
  if (incident.resultConfirmed) return incident;
  incident.resultConfirmed = true;
  incident.comments.push({ id: `c-${Date.now()}`, author: authorName, role, content: 'Получение результата подтверждено. Обращение готово к финальному закрытию инженером.', createdAt: new Date().toISOString() });
  return incidentRepository.save(incident);
}

export function closeIncident(incidentId: string, authorName: string, rootCause: string, resolution: string): Incident {
  const incident = incidentRepository.getById(incidentId);
  if (!incident) throw new Error(`Incident with ID ${incidentId} not found`);
  const isGovin = incident.source === 'GOVIN-303';
  if (incident.status !== 'Выполнено' || (!isGovin && !incident.resultConfirmed)) {
    throw new Error(isGovin ? 'GOVIN incident can be closed only after work is completed' : 'Incident can be closed only after completed work is confirmed by Initiator');
  }
  incident.status = 'Закрыт'; incident.rootCause = rootCause.trim(); incident.resolution = resolution.trim(); incident.resolvedAt = new Date().toISOString(); incident.reusableKnowledge = true;
  incident.comments.push({ id: `c-${Date.now()}`, author: authorName, role: 'Инженер ГСТИ', content: `Обращение закрыто. Причина: ${incident.rootCause}. Решение: ${incident.resolution}.`, createdAt: new Date().toISOString() });
  return incidentRepository.save(incident);
}

export function resetDemoData(): Incident[] { return incidentRepository.resetToDefault(); }

export function getProductMetrics(): IncidentMetrics {
  const allIncidents = incidentRepository.getAll(); const total = allIncidents.length; const fullDataCount = allIncidents.filter((i) => i.fullDataOnFirstSubmit).length;
  const firstTimeCompletenessRate = total > 0 ? Math.round((fullDataCount / total) * 1000) / 10 : 0;
  const totalClarifications = allIncidents.reduce((acc, i) => acc + (i.clarificationCount || 0), 0);
  const avgClarificationCount = total > 0 ? Math.round((totalClarifications / total) * 10) / 10 : 0;
  return { firstTimeCompletenessRate, avgClarificationCount, avgTimeToFullDataMinutes: 12, selfServiceRate: 38.2, mttrMinutes: 42, repeatIncidentRate: 4.1, nonPriizIncidentShare: 18, typeBreakdown: [{ type: 'INC-02', label: 'Не получен результат', count: total, mttrMinutes: 42, repeatRate: 4.1, responsibleTeam: 'Инженер ГСТИ' }] };
}
