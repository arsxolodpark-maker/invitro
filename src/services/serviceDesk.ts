/**
 * Service Desk Adapter & Integration Contracts
 *
 * TODO: Confirm the real system of record, existing capabilities and bidirectional
 * synchronization with the internal Service Desk before implementing production adapters.
 * Reuse/integrate existing capabilities before proposing a replacement backend.
 */

import { Incident } from '../types';

export interface ServiceDeskAdapter {
  /** Synchronize a PRIIZ incident with the existing internal incident-management contour. */
  syncWithServiceDesk(incident: Incident): Promise<{
    internalTicketId: string;
    syncedAt: string;
    status: 'SYNCED' | 'PENDING' | 'ERROR';
  }>;

  /** Return a safe, high-level diagnostic summary from the engineering contour. */
  fetchConsoleDiagnostics(inz: string): Promise<{
    inz: string;
    traceId: string;
    processingStatus: string;
    deliveryStatus: string;
    diagnosticMessage: string;
  }>;
}

/** Mock implementation for the public UX prototype. No real INVITRO APIs are called. */
export class MockServiceDeskAdapter implements ServiceDeskAdapter {
  async syncWithServiceDesk(_incident: Incident) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      internalTicketId: `DEMO-SD-${Math.floor(100000 + Math.random() * 900000)}`,
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
      diagnosticMessage: 'Демонстрационный результат. Реальная диагностика будет подключена через подтвержденный внутренний адаптер.',
    };
  }
}

export const serviceDeskAdapter = new MockServiceDeskAdapter();
