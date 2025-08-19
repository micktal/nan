import type { TrainingSession } from '@/hooks/use-user-session';

export interface ExportData {
  sessions: TrainingSession[];
  exportDate: string;
  exportedBy: string;
  totalSessions: number;
  completedSessions: number;
  averageScore: number;
  averageDuration: number;
}

// CSV Export Functions
export function exportToCSV(data: ExportData, filename?: string): void {
  const csvContent = generateCSVContent(data);
  downloadFile(csvContent, filename || `safety-training-export-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
}

function generateCSVContent(data: ExportData): string {
  const headers = [
    'Session ID',
    'Utilisateur',
    'Email',
    'Profil',
    'Entreprise',
    'Date de visite',
    'Langue',
    'Étape actuelle',
    'Progression (%)',
    'QCM commencé',
    'QCM terminé',
    'Score QCM',
    'Zones de sécurité vues',
    'Durée session (min)',
    'Certificat généré',
    'Date de début',
    'Dernière activité'
  ];

  const rows = data.sessions.map(session => {
    const user = session.user;
    const progress = session.progress;
    
    return [
      session.sessionId,
      user ? `${user.firstName} ${user.lastName}` : '',
      user?.email || '',
      user?.profileType || '',
      user?.company || '',
      user?.visitDate ? new Date(user.visitDate).toLocaleDateString('fr-FR') : '',
      user?.language || '',
      progress?.currentStep || 0,
      progress ? Math.round((progress.completedSteps.length / 6) * 100) : 0,
      progress?.qcmStarted ? 'Oui' : 'Non',
      progress?.qcmCompleted ? 'Oui' : 'Non',
      progress?.qcmScore || '',
      progress?.safetyZonesCompleted.join('; ') || '',
      progress ? Math.round(progress.sessionDuration / 60) : 0,
      progress?.certificateGenerated ? 'Oui' : 'Non',
      progress?.startTime ? new Date(progress.startTime).toLocaleString('fr-FR') : '',
      progress?.lastActivity ? new Date(progress.lastActivity).toLocaleString('fr-FR') : ''
    ];
  });

  const csvRows = [headers, ...rows];
  return csvRows.map(row => 
    row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
  ).join('\n');
}

// JSON Export Functions
export function exportToJSON(data: ExportData, filename?: string): void {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, filename || `safety-training-export-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
}

// PDF Export Functions (using HTML-to-PDF approach)
export function exportToPDF(data: ExportData, filename?: string): void {
  const htmlContent = generatePDFContent(data);
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Set filename for download
    printWindow.document.title = filename || `safety-training-report-${new Date().toISOString().split('T')[0]}`;
    
    // Trigger print dialog
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
}

function generatePDFContent(data: ExportData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Rapport de Formation Sécurité</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #e11d48;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo {
          color: #e11d48;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .stat-card {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 15px;
          text-align: center;
        }
        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #e11d48;
        }
        .stat-label {
          color: #6b7280;
          font-size: 14px;
        }
        .sessions-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        .sessions-table th,
        .sessions-table td {
          border: 1px solid #d1d5db;
          padding: 8px;
          text-align: left;
          font-size: 12px;
        }
        .sessions-table th {
          background-color: #f3f4f6;
          font-weight: bold;
        }
        .sessions-table tr:nth-child(even) {
          background-color: #f9fafb;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 12px;
        }
        @media print {
          body { margin: 0; }
          .header { page-break-after: avoid; }
          .sessions-table { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">🛡️ GERFLOR × FPSG</div>
        <h1>Rapport de Formation Sécurité</h1>
        <p>Généré le ${new Date().toLocaleDateString('fr-FR')} par ${data.exportedBy}</p>
      </div>

      <div class="stats">
        <div class="stat-card">
          <div class="stat-value">${data.totalSessions}</div>
          <div class="stat-label">Sessions totales</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${data.completedSessions}</div>
          <div class="stat-label">Sessions terminées</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${data.averageScore.toFixed(1)}%</div>
          <div class="stat-label">Score moyen</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${Math.round(data.averageDuration)}</div>
          <div class="stat-label">Durée moyenne (min)</div>
        </div>
      </div>

      <h2>Détail des Sessions</h2>
      <table class="sessions-table">
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th>Profil</th>
            <th>Date</th>
            <th>Progression</th>
            <th>Score QCM</th>
            <th>Durée</th>
            <th>Certificat</th>
          </tr>
        </thead>
        <tbody>
          ${data.sessions.map(session => {
            const user = session.user;
            const progress = session.progress;
            const progressPercentage = progress ? Math.round((progress.completedSteps.length / 6) * 100) : 0;
            
            return `
              <tr>
                <td>${user ? `${user.firstName} ${user.lastName}` : 'N/A'}</td>
                <td>${user?.profileType || 'N/A'}</td>
                <td>${user?.visitDate ? new Date(user.visitDate).toLocaleDateString('fr-FR') : 'N/A'}</td>
                <td>${progressPercentage}%</td>
                <td>${progress?.qcmScore ? `${progress.qcmScore}%` : 'N/A'}</td>
                <td>${progress ? Math.round(progress.sessionDuration / 60) : 0} min</td>
                <td>${progress?.certificateGenerated ? '✅' : '❌'}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <div class="footer">
        <p>Rapport généré automatiquement par le système de formation sécurité GERFLOR × FPSG</p>
        <p>Export effectué le ${new Date().toLocaleString('fr-FR')}</p>
      </div>
    </body>
    </html>
  `;
}

// Utility function to download files
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

// Analytics calculation utilities
export function calculateAnalytics(sessions: TrainingSession[]): ExportData {
  const completedSessions = sessions.filter(s => s.progress?.certificateGenerated);
  const qcmScores = sessions
    .filter(s => s.progress?.qcmScore !== undefined)
    .map(s => s.progress!.qcmScore!);
  
  const durations = sessions
    .filter(s => s.progress?.sessionDuration)
    .map(s => s.progress!.sessionDuration / 60); // Convert to minutes

  return {
    sessions,
    exportDate: new Date().toISOString(),
    exportedBy: 'Administrator',
    totalSessions: sessions.length,
    completedSessions: completedSessions.length,
    averageScore: qcmScores.length > 0 ? qcmScores.reduce((a, b) => a + b, 0) / qcmScores.length : 0,
    averageDuration: durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0
  };
}
