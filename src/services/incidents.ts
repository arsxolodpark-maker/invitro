/**
 * Incident Management Service
 */

import { Incident, IncidentComment, IncidentMetrics, UserRole, IncidentStatus } from '../types';
import { incidentRepository } from '../repositories/incidentRepository';
import { serviceDeskAdapter } from './serviceDesk';

export function getIncidents(): Incident[] {
  return incidentRepository.getAll();
}

export function getIncidentById(id: string): Incident | undefined {
  return incidentRepository.getById(id);
}

export function createIncident(data: Omit<Incident, 'id' | 'createdAt' | 'comments' | 'status' | 'internalServiceDeskId'>): Incident {
  const newId = incidentRepository.generateNextId();
  
  const newIncident: Incident = {
    ...data,
    id: newId,
    createdAt: new Date().toISOString(),
    status: 'Новый',
    comments: [
      {
        id: `c-${Date.now()}`,
        author: data.createdBy,
        role: data.authorRole,
        content: `Обращение создано в ПРИИЗ. Тип: ${data.incidentType}, ИНЗ: ${data.inz}. Автоматическая диагностика запущена.`,
        createdAt: new Date().toISOString(),
      },
    ],
  };

  // Async sync with Service Desk mock
  serviceDeskAdapter.syncWithServiceDesk(newIncident).then((res) => {
    newIncident.internalServiceDeskId = res.internalTicketId;
    incidentRepository.save(newIncident);
  });

  return incidentRepository.save(newIncident);
}

export function addIncidentComment(
  incidentId: string,
  author: string,
  role: UserRole,
  content: string,
  isInternal?: boolean
): Incident {
  const incident = incidentRepository.getById(incidentId);
  if (!incident) {
    throw new Error(`Incident with ID ${incidentId} not found`);
  }

  const newComment: IncidentComment = {
    id: `c-${Date.now()}`,
    author,
    role,
    content,
    createdAt: new Date().toISOString(),
    isInternal,
  };

  // If Support leaves a comment asking for details, increment clarification count
  if (role === 'Support' && content.toLowerCase().includes('уточн')) {
    incident.clarificationCount = (incident.clarificationCount || 0) + 1;
    incident.status = 'Требует уточнения';
  }

  incident.comments.push(newComment);
  return incidentRepository.save(incident);
}

export function updateIncidentStatus(incidentId: string, status: IncidentStatus): Incident {
  const incident = incidentRepository.getById(incidentId);
  if (!incident) {
    throw new Error(`Incident with ID ${incidentId} not found`);
  }
  incident.status = status;
  return incidentRepository.save(incident);
}

export function confirmResultReceipt(incidentId: string, authorName: string, role: UserRole): Incident {
  const incident = incidentRepository.getById(incidentId);
  if (!incident) {
    throw new Error(`Incident with ID ${incidentId} not found`);
  }

  incident.status = 'Ожидает подтверждения ДКП';
  
  incident.comments.push({
    id: `c-${Date.now()}`,
    author: authorName,
    role: role,
    content: 'Получение результата официально подтверждено со стороны ДКП/Клиента. Ожидается закрытие инцидента поддержкой.',
    createdAt: new Date().toISOString(),
  });

  return incidentRepository.save(incident);
}

export function closeIncident(
  incidentId: string,
  authorName: string,
  rootCause: string,
  resolution: string
): Incident {
  const incident = incidentRepository.getById(incidentId);
  if (!incident) {
    throw new Error(`Incident with ID ${incidentId} not found`);
  }

  incident.status = 'Закрыт';
  incident.rootCause = rootCause || 'Delivery / Integration';
  incident.resolution = resolution || 'Результат доставлен после технического восстановления во внутренней консоли';
  incident.resolvedAt = new Date().toISOString();
  incident.reusableKnowledge = true;

  incident.comments.push({
    id: `c-${Date.now()}`,
    author: authorName,
    role: 'Support',
    content: `Инцидент официально закрыт. Категория причины: [${incident.rootCause}]. Решение: ${incident.resolution}`,
    createdAt: new Date().toISOString(),
  });

  return incidentRepository.save(incident);
}

export function resetDemoData(): Incident[] {
  return incidentRepository.resetToDefault();
}

export function getProductMetrics(): IncidentMetrics {
  const allIncidents = incidentRepository.getAll();
  const total = allIncidents.length;

  const fullDataCount = allIncidents.filter((i) => i.fullDataOnFirstSubmit).length;
  const firstTimeCompletenessRate = total > 0 ? Math.round((fullDataCount / total) * 1000) / 10 : 84.5;

  const totalClarifications = allIncidents.reduce((acc, i) => acc + (i.clarificationCount || 0), 0);
  const avgClarificationCount = total > 0 ? Math.round((totalClarifications / total) * 10) / 10 : 0.4;

  return {
    firstTimeCompletenessRate: firstTimeCompletenessRate || 84.5,
    avgClarificationCount: avgClarificationCount || 0.4,
    avgTimeToFullDataMinutes: 12,
    selfServiceRate: 38.2,
    mttrMinutes: 42,
    repeatIncidentRate: 4.1,
    nonPriizIncidentShare: 18,
    typeBreakdown: [
      {
        type: 'INC-01',
        label: 'Не поступила заявка / направление',
        count: 14,
        mttrMinutes: 55,
        repeatRate: 6.2,
        responsibleTeam: 'Support',
      },
      {
        type: 'INC-02',
        label: 'Не получен результат',
        count: 48,
        mttrMinutes: 38,
        repeatRate: 3.1,
        responsibleTeam: 'Support',
      },
      {
        type: 'INC-03',
        label: 'Невозможно создать заявку',
        count: 9,
        mttrMinutes: 62,
        repeatRate: 5.0,
        responsibleTeam: 'Support',
      },
      {
        type: 'INC-05',
        label: 'Ошибка справочника / НСИ',
        count: 6,
        mttrMinutes: 85,
        repeatRate: 2.0,
        responsibleTeam: 'НСИ',
      },
      {
        type: 'OTHER',
        label: 'Другое',
        count: 3,
        mttrMinutes: 90,
        repeatRate: 8.5,
        responsibleTeam: 'Support',
      },
    ],
  };
}
