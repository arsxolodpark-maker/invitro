/**
 * ПРИИЗ INVITRO UX Prototype v0.7.2
 * Core TypeScript Data Models
 */

export type UserRole = 'Инициатор' | 'ДКП' | 'Инженер ГСТИ' | 'Администратор' | 'Project';
export type IncidentType = 'INC-02' | 'OTHER';
export type IncidentStatus = 'Новое' | 'В работе' | 'Отложено' | 'Ожидает ответа' | 'Ожидает согласования' | 'Выполнено' | 'Закрыт';
export type IntegrationType = 'типовая' | 'кастомная';
export type ProblemScope = 'единичная' | 'несколько' | 'массовая' | 'неизвестно';
export type WorkedBefore = 'да' | 'нет' | 'неизвестно';
export type GovinIssueClass = 'SERVICE_MAPPING' | 'TEST_MAPPING' | 'DATABASE_NOT_FOUND';

export interface IncidentPrefill {
  source: 'GOVIN-303';
  client?: string;
  clientCode?: string;
  lpu?: string;
  vendor?: string;
  inz?: string;
  description?: string;
  contextLabel?: string;
  incidentTitle?: string;
  issueClass?: GovinIssueClass;
  processStage?: string;
  externalDirectionId?: string;
  barcode?: string;
  recommendedRoute?: string;
}

export interface DiagnosticStage {
  id: string;
  name: string;
  status: 'ok' | 'error' | 'warning' | 'pending';
  details?: string;
  timestamp?: string;
}

export interface DiagnosticResult {
  inzFound: boolean;
  labExecutionPassed: boolean;
  resultGenerated: boolean;
  deliveryConfirmed: boolean;
  stages: DiagnosticStage[];
  recommendedAction?: string;
  traceId?: string;
  checkedAt?: string;
}

export interface IncidentComment {
  id: string;
  author: string;
  role: UserRole;
  content: string;
  createdAt: string;
  isInternal?: boolean;
}

export interface AttachmentMeta {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  uploadedAt: string;
}

export interface Incident {
  id: string;
  incidentType: IncidentType;
  title?: string;
  source: string;
  govinIssueClass?: GovinIssueClass;
  processStage?: string;
  externalDirectionId?: string;
  barcode?: string;
  recommendedRoute?: string;
  createdAt: string;
  createdBy: string;
  initiatorEmail?: string;
  authorRole: UserRole;
  status: IncidentStatus;
  priority: 'Низкий' | 'Средний' | 'Высокий' | 'Критический';
  responsibleTeam: string;
  assignee?: string;
  internalServiceDeskId?: string;
  client: string;
  clientCode: string;
  contract?: string;
  lpu: string;
  vendor: string;
  integrationType: IntegrationType;
  environment: 'Production' | 'Test';
  inz: string;
  eventDateTime: string;
  scope: ProblemScope;
  workedBefore: WorkedBefore;
  description: string;
  vendorContacted: boolean;
  vendorAnswer?: string;
  attachments: AttachmentMeta[];
  diagnosticResult?: DiagnosticResult;
  comments: IncidentComment[];
  fullDataOnFirstSubmit: boolean;
  clarificationCount: number;
  slaStatus: 'В норме (демо)' | 'Превышен (демо)' | 'Риск нарушения (демо)';
  resultConfirmed?: boolean;
  rootCause?: string;
  resolution?: string;
  resolvedAt?: string;
  reusableKnowledge?: boolean;
}

export interface IncidentMetrics {
  firstTimeCompletenessRate: number;
  avgClarificationCount: number;
  avgTimeToFullDataMinutes: number;
  selfServiceRate: number;
  mttrMinutes: number;
  repeatIncidentRate: number;
  nonPriizIncidentShare: number;
  typeBreakdown: {
    type: string;
    label: string;
    count: number;
    mttrMinutes: number;
    repeatRate: number;
    responsibleTeam: string;
  }[];
}
