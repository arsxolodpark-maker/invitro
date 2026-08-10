/**
 * ПРИИЗ INVITRO UX Prototype v0.2
 * Core TypeScript Data Models
 */

export type UserRole = 'ДКП' | 'Manager' | 'Project' | 'Product' | 'Support';

export type IncidentType = 'INC-01' | 'INC-02' | 'INC-03' | 'INC-05' | 'OTHER';

export type IncidentStatus = 
  | 'Новый' 
  | 'В работе' 
  | 'Требует уточнения' 
  | 'Ожидает подтверждения ДКП' 
  | 'Решен' 
  | 'Закрыт';

export type IntegrationType = 'типовая' | 'кастомная';

export type ProblemScope = 'единичная' | 'несколько' | 'массовая' | 'неизвестно';

export type WorkedBefore = 'да' | 'нет' | 'неизвестно';

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
  id: string; // e.g. PRIIZ-000245
  incidentType: IncidentType;
  source: string;
  createdAt: string;
  createdBy: string;
  authorRole: UserRole;
  status: IncidentStatus;
  priority: 'Низкий' | 'Средний' | 'Высокий' | 'Критический';
  responsibleTeam: string; // e.g. "Support"
  assignee?: string;
  internalServiceDeskId?: string; // TBD / existing capability
  
  // Client & Vendor Context
  client: string;
  clientCode: string;
  contract?: string;
  lpu: string;
  vendor: string;
  integrationType: IntegrationType;
  environment: 'Production' | 'Test';
  
  // Incident specific data
  inz: string;
  eventDateTime: string;
  scope: ProblemScope;
  workedBefore: WorkedBefore;
  description: string;
  
  // Vendor verification
  vendorContacted: boolean;
  vendorAnswer?: string;
  attachments: AttachmentMeta[];
  
  // Diagnostic and interaction
  diagnosticResult?: DiagnosticResult;
  comments: IncidentComment[];
  
  // Metrics & Process indicators
  fullDataOnFirstSubmit: boolean;
  clarificationCount: number;
  slaStatus: 'В норме (демо)' | 'Превышен (демо)' | 'Риск нарушения (демо)';
  
  // Resolution metadata
  rootCause?: string;
  resolution?: string;
  resolvedAt?: string;
  reusableKnowledge?: boolean;
}

export interface IncidentMetrics {
  firstTimeCompletenessRate: number; // e.g. 84.5
  avgClarificationCount: number; // e.g. 0.4
  avgTimeToFullDataMinutes: number; // e.g. 12
  selfServiceRate: number; // e.g. 38.2
  mttrMinutes: number; // e.g. 42
  repeatIncidentRate: number; // e.g. 4.1
  nonPriizIncidentShare: number; // e.g. 18
  typeBreakdown: {
    type: string;
    label: string;
    count: number;
    mttrMinutes: number;
    repeatRate: number;
    responsibleTeam: string;
  }[];
}
