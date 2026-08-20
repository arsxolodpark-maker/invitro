import { GOVIN_DEMO_DIRECTIONS } from './demoData';
import { GovinDirection, GovinIntegration } from './types';

const DEMO_DELAY_MS = 250;

export async function searchDirection(integration: GovinIntegration, barcode: string): Promise<GovinDirection | null> {
  await new Promise((resolve) => setTimeout(resolve, DEMO_DELAY_MS));
  const normalizedBarcode = barcode.trim();
  return GOVIN_DEMO_DIRECTIONS.find(
    (item) => item.integration === integration && item.barcode === normalizedBarcode,
  ) ?? null;
}
