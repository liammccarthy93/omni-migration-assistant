'use client';

import { useState, useEffect } from 'react';
import { OmniAPI } from '@/lib/omni-api';
import { OMNI_CONFIG, validateOmniConfig } from '@/config/omni';

export default function DashboardMigration() {
  const [sourceDashboardId, setSourceDashboardId] = useState('');
  const [targetModelId, setTargetModelId] = useState('');
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [configError, setConfigError] = useState<string>('');

  useEffect(() => {
    try {
      validateOmniConfig();
    } catch (err) {
      setConfigError(err instanceof Error ? err.message : 'Configuration error');
    }
  }, []);

  const handleMigration = async () => {
    try {
      setStatus('Starting migration...');
      setError('');

      // Create API clients for both environments
      const sourceApi = new OmniAPI(OMNI_CONFIG.source.baseUrl, OMNI_CONFIG.source.token);
      const targetApi = new OmniAPI(OMNI_CONFIG.target.baseUrl, OMNI_CONFIG.target.token);

      // Step 1: Export the dashboard from source environment
      setStatus('Exporting dashboard from source environment...');
      const exportData = await sourceApi.exportDashboard(sourceDashboardId);

      // Step 2: Import the dashboard to target environment
      setStatus('Importing dashboard to target environment...');
      const importResult = await targetApi.importDashboard({
        baseModelId: targetModelId,
        dashboard: exportData.dashboard,
        document: exportData.document,
        workbookModel: exportData.workbookModel,
        exportVersion: '0.1',
      });

      setStatus(`Migration completed successfully! New dashboard ID: ${importResult.dashboard.dashboardId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setStatus('Migration failed');
    }
  };

  if (configError) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <div className="p-4 bg-red-100 text-red-700 rounded">
          <h2 className="text-xl font-bold mb-2">Configuration Error</h2>
          <p className="text-sm">{configError}</p>
          <p className="text-sm mt-2">Please check your environment variables in .env.local</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Dashboard Migration</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Source Dashboard ID
          </label>
          <input
            type="text"
            value={sourceDashboardId}
            onChange={(e) => setSourceDashboardId(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter source dashboard ID"
          />
          <p className="text-xs text-gray-500 mt-1">
            From: {OMNI_CONFIG.source.baseUrl}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Target Model ID
          </label>
          <input
            type="text"
            value={targetModelId}
            onChange={(e) => setTargetModelId(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter target model ID"
          />
          <p className="text-xs text-gray-500 mt-1">
            To: {OMNI_CONFIG.target.baseUrl}
          </p>
        </div>

        <button
          onClick={handleMigration}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={!sourceDashboardId || !targetModelId}
        >
          Start Migration
        </button>

        {status && (
          <div className="mt-4 p-2 bg-gray-100 rounded">
            <p className="text-sm">{status}</p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
} 