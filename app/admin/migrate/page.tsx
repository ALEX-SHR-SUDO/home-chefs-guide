'use client';

import { useState } from 'react';

interface MigrationStatus {
  phase: 'idle' | 'checking' | 'migrating' | 'completed' | 'error';
  message: string;
  imageCount?: number;
  progress?: {
    current: number;
    total: number;
  };
  result?: {
    total: number;
    successful: number;
    failed: number;
    urlsUpdated: number;
    backupPath: string;
    errors: { file: string; error: string }[];
  };
  migrationLog?: string;
  error?: string;
}

export default function MigratePage() {
  const [status, setStatus] = useState<MigrationStatus>({
    phase: 'idle',
    message: 'Click "Start Migration" to begin',
  });

  const checkStatus = async () => {
    setStatus({
      phase: 'checking',
      message: 'Checking migration readiness...',
    });

    try {
      const response = await fetch('/api/migrate-images');
      const data = await response.json();

      if (!response.ok) {
        setStatus({
          phase: 'error',
          message: data.message || 'Failed to check migration status',
          error: data.error,
        });
        return;
      }

      setStatus({
        phase: 'idle',
        message: `Ready to migrate ${data.imageCount} images`,
        imageCount: data.imageCount,
      });
    } catch (error: any) {
      setStatus({
        phase: 'error',
        message: 'Failed to connect to migration API',
        error: error.message,
      });
    }
  };

  const startMigration = async () => {
    setStatus({
      phase: 'migrating',
      message: 'Starting migration...',
    });

    try {
      const response = await fetch('/api/migrate-images', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setStatus({
          phase: 'error',
          message: data.message || 'Migration failed',
          error: data.error,
        });
        return;
      }

      setStatus({
        phase: 'completed',
        message: 'Migration completed successfully!',
        result: data.result,
        migrationLog: data.migrationLog,
      });
    } catch (error: any) {
      setStatus({
        phase: 'error',
        message: 'Failed to complete migration',
        error: error.message,
      });
    }
  };

  const downloadLog = () => {
    if (!status.migrationLog) return;

    const blob = new Blob([status.migrationLog], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `migration-log-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = () => {
    switch (status.phase) {
      case 'completed':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'migrating':
      case 'checking':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getButtonText = () => {
    switch (status.phase) {
      case 'checking':
        return 'Checking...';
      case 'migrating':
        return 'Migrating...';
      case 'completed':
        return 'Migration Complete';
      default:
        return 'Start Migration';
    }
  };

  const isButtonDisabled = () => {
    return status.phase === 'checking' || status.phase === 'migrating' || status.phase === 'completed';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Image Migration to Vercel Blob
          </h1>
          <p className="text-lg text-gray-600">
            Automatically upload all recipe images from the repository to Vercel Blob storage
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white shadow-lg rounded-lg p-8 mb-6">
          {/* Status Display */}
          <div className="mb-8">
            <div className={`text-center text-xl font-semibold ${getStatusColor()} mb-4`}>
              {status.message}
            </div>

            {status.imageCount !== undefined && status.phase === 'idle' && (
              <div className="text-center text-gray-600">
                <p className="text-lg">📁 Found {status.imageCount} images ready to migrate</p>
              </div>
            )}

            {status.phase === 'migrating' && (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
              </div>
            )}

            {status.phase === 'error' && status.error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 font-medium">Error: {status.error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={checkStatus}
              disabled={status.phase === 'checking' || status.phase === 'migrating'}
              className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Check Status
            </button>
            
            <button
              onClick={startMigration}
              disabled={isButtonDisabled()}
              className="px-8 py-3 bg-blue-600 text-white font-bold text-lg rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {getButtonText()}
            </button>
          </div>

          {/* Results Summary */}
          {status.result && (
            <div className="border-t pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Migration Results</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Total Images</div>
                  <div className="text-3xl font-bold text-blue-900">{status.result.total}</div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">Successful</div>
                  <div className="text-3xl font-bold text-green-900">{status.result.successful}</div>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-sm text-red-600 font-medium">Failed</div>
                  <div className="text-3xl font-bold text-red-900">{status.result.failed}</div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm text-purple-600 font-medium">URLs Updated</div>
                  <div className="text-3xl font-bold text-purple-900">{status.result.urlsUpdated}</div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-600">
                  <strong>Backup Location:</strong> {status.result.backupPath}
                </p>
              </div>

              {status.result.errors.length > 0 && (
                <div className="bg-red-50 p-4 rounded-lg mb-4">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">Errors:</h3>
                  <ul className="list-disc list-inside text-sm text-red-700">
                    {status.result.errors.map((err, index) => (
                      <li key={index}>
                        {err.file}: {err.error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {status.migrationLog && (
                <button
                  onClick={downloadLog}
                  className="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                >
                  📥 Download Migration Log
                </button>
              )}
            </div>
          )}
        </div>

        {/* Information Panel */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">What happens during migration?</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Creates a backup of <code className="bg-blue-100 px-2 py-1 rounded">recipesData.ts</code></li>
            <li>Reads all images from <code className="bg-blue-100 px-2 py-1 rounded">public/images/recipes/</code></li>
            <li>Uploads each image to Vercel Blob storage</li>
            <li>Updates <code className="bg-blue-100 px-2 py-1 rounded">recipesData.ts</code> with new Blob URLs</li>
            <li>Generates a detailed migration log</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
