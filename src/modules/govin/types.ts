export type GovinIntegration = 'Нетрика' | 'Адыгея' | 'Брегис';

export type GovinStage = 'RECEIVED' | 'CHECKIN' | 'IN_PROGRESS' | 'DELIVERY';

export type GovinDiagnosticProblem = 'CHECKIN_ERROR' | 'DELIVERY_ERROR' | null;

export interface GovinDirection {
  id: string;
  integration: GovinIntegration;
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
