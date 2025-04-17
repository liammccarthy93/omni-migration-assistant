import { z } from 'zod';

// Types for the API responses and requests
export const DashboardExportResponse = z.object({
  dashboard: z.any(), // We'll keep this as any since it's a complex object
  document: z.any(),
  exportVersion: z.string(),
  workbookModel: z.any(),
});

export const DashboardImportRequest = z.object({
  baseModelId: z.string().uuid(),
  dashboard: z.any(),
  identifier: z.string().optional(),
  folderPath: z.string().optional(),
  document: z.any(),
  workbookModel: z.any(),
  exportVersion: z.literal('0.1'),
});

export type DashboardExportResponse = z.infer<typeof DashboardExportResponse>;
export type DashboardImportRequest = z.infer<typeof DashboardImportRequest>;

export class OmniAPI {
  private baseUrl: string;
  private token: string;

  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Omni API Error: ${error.detail || response.statusText}`);
    }

    return response.json();
  }

  async exportDashboard(dashboardId: string): Promise<DashboardExportResponse> {
    return this.fetch<DashboardExportResponse>(`/api/unstable/documents/${dashboardId}/export`);
  }

  async importDashboard(data: DashboardImportRequest): Promise<{
    dashboard: { dashboardId: string };
    miniUuidMap: Record<string, string>;
    workbook: {
      id: string;
      identifier: string;
      name: string;
      // Add other fields as needed
    };
  }> {
    return this.fetch('/api/unstable/documents/import', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
} 