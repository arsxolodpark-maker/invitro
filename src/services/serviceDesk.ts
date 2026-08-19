/**
 * 1C:ITILIUM adapter contract for the UX prototype.
 *
 * Confirmed by analytics v9:
 * - create incident;
 * - fetch incidents by parameters;
 * - fetch incident status;
 * - register/check/update organization;
 * - register initiator.
 *
 * The exact production contract for two-way comment synchronization remains TBD.
 */

import { Incident } from '../types';

export interface ServiceDeskAdapter {
  syncWithServiceDesk(incident: Incident): Promise<{
    internalTicketId: string;
    syncedAt: string;
    status: 'SYNCED' | 'PENDING' | 'ERROR';
  }>;

  fetchConsoleDiagnostics(inz: string): Promise<{
    inz: string;
    traceId: string;
    processingStatus: string;
    deliveryStatus: string;
    diagnosticMessage: string;
  }>;
}

/** DEMO only. No real 1C:ITILIUM or INVITRO API is called. */
export class MockServiceDeskAdapter implements ServiceDeskAdapter {
  async syncWithServiceDesk(_incident: Incident) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      internalTicketId: `DEMO-ITILIUM-${Math.floor(100000 + Math.random() * 900000)}`,
      syncedAt: new Date().toISOString(),
      status: 'SYNCED' as const,
    };
  }

  async fetchConsoleDiagnostics(inz: string) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      inz,
      traceId: `demo_${Math.random().toString(36).substring(2, 12)}`,
      processingStatus: 'Обработка выполнена',
      deliveryStatus: 'Требует проверки',
      diagnosticMessage: 'DEMO. Реальная диагностика остается во внутреннем инженерном контуре.',
    };
  }
}

export const serviceDeskAdapter = new MockServiceDeskAdapter();
