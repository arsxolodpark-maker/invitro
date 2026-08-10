/**
 * Service Desk Adapter & Integration Contracts
 * 
 * TODO: Confirm existing system of record, current capabilities and bidirectional synchronization with the real internal Service Desk. Reuse/integrate before proposing any replacement or new backend.
 */

import { Incident, DiagnosticResult } from '../types';

export interface ServiceDeskAdapter {
  /**
   * Synchronize PRIIZ incident with existing internal Service Desk (1С / Service Desk)
   */
  syncWithServiceDesk(incident: Incident): Promise<{
    internalTicketId: string;
    syncedAt: string;
    status: 'SYNCED' | 'PENDING' | 'ERROR';
  }>;

  /**
   * Query deep technical diagnostics from existing Integration Console
   */
  fetchConsoleDiagnostics(inz: string): Promise<{
    inz: string;
    traceId: string;
    integrationPlatformStatus: string;
    rawLogsUrl: string;
    lastHttpCode: number;
    lastErrorMessage: string;
  }>;
}

/**
 * Mock implementation of ServiceDeskAdapter for UX Prototype v0.2
 */
export class MockServiceDeskAdapter implements ServiceDeskAdapter {
  async syncWithServiceDesk(incident: Incident) {
    // Simulate adapter latency
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      internalTicketId: `SD-INV-${Math.floor(100000 + Math.random() * 900000)}`,
      syncedAt: new Date().toISOString(),
      status: 'SYNCED' as const,
    };
  }

  async fetchConsoleDiagnostics(inz: string) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      inz,
      traceId: `tr_${Math.random().toString(36).substring(2, 12)}`,
      integrationPlatformStatus: 'DEGRADE_PARTIAL',
      rawLogsUrl: `https://console.internal.invitro.local/trace/inz/${inz}`,
      lastHttpCode: 502,
      lastErrorMessage: 'HTTP 502 Bad Gateway: Partner LPU endpoint socket connection reset by peer',
    };
  }
}

export const serviceDeskAdapter = new MockServiceDeskAdapter();
