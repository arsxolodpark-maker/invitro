export type GovinIntegration = 'Нетрика' | 'Адыгея' | 'Брегис';
export type GovinServiceKey = 'netrika' | 'adygea' | 'bregis';

export type GovinStage = 'RECEIVED' | 'CHECKIN' | 'IN_PROGRESS' | 'DELIVERY';

export type GovinDiagnosticProblem = 'CHECKIN_ERROR' | 'DELIVERY_ERROR' | null;
export type GovinSearchState = 'idle' | 'loading' | 'success' | 'not_found' | 'error';

export interface GovinDirection {
  id: string;
  integration: GovinIntegration;
  serviceKey: GovinServiceKey;
  externalId: string;
  externalOrderDate: string;
  client: string;
  barcode: string;
  sourceStatus: string;
  uiStage: GovinStage;
  diagnosticProblem: GovinDiagnosticProblem;
  inz: number[];
  assignedTests: string[];
  deliveredTests: string[];
  checkinError?: string | null;
  deliveryErrors?: string[];
  lastDeliveryDate?: string | null;
}

/**
 * Кандидатный диагностический контекст для публичной демонстрации перехода GOVIN → ПРИИЗ.
 * Это DESIGN-модель прототипа, а не подтвержденный промышленный API-контракт.
 */
export interface GovinPriizContext {
  integration: GovinIntegration;
  serviceKey: GovinServiceKey;
  externalDirectionId: string;
  barcode: string;
  externalOrderDate: string;
  client: string;
  sourceStatus: string;
  uiStage: GovinStage;
  inz: number[];
  assignedTests: string[];
  deliveredTests: string[];
  checkinError: string | null;
  deliveryErrors: string[];
  lastDeliveryDate: string | null;
}
