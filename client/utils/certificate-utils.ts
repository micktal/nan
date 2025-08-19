// Alternative PDF generation without external dependencies

export interface CertificateData {
  firstName: string;
  lastName: string;
  profile: string;
  score: number;
  certificateId: string;
  issueDate: string;
  expiryDate: string;
  email?: string;
}

// Generate PDF certificate using HTML-to-PDF approach
export function generateCertificatePDF(data: CertificateData): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const certificateHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Certificat de Formation - ${data.firstName} ${data.lastName}</title>
      <style>
        @page {
          size: A4 landscape;
          margin: 15mm;
        }

        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background: #f8fafc;
        }

        .certificate {
          width: 100%;
          height: 100vh;
          border: 8px solid #10b981;
          background: white;
          padding: 40px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .header {
          text-align: center;
          margin-bottom: 30px;
        }

        .logos {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 40px;
          margin-bottom: 30px;
        }

        .logo {
          padding: 12px 24px;
          background: #f1f5f9;
          border-radius: 8px;
          font-weight: bold;
          color: #10b981;
          font-size: 18px;
        }

        .title {
          color: #334155;
          margin-bottom: 10px;
        }

        .title h1 {
          font-size: 36px;
          margin: 0;
          font-weight: bold;
        }

        .subtitle {
          font-size: 20px;
          color: #64748b;
          margin: 0;
        }

        .content {
          text-align: center;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .intro {
          font-size: 18px;
          color: #334155;
          margin-bottom: 30px;
        }

        .name-box {
          background: #f1f5f9;
          border: 2px solid #cbd5e1;
          border-radius: 12px;
          padding: 30px;
          margin: 30px auto;
          max-width: 600px;
        }

        .name {
          font-size: 32px;
          font-weight: bold;
          color: #334155;
          margin: 0 0 10px 0;
        }

        .profile {
          font-size: 16px;
          color: #64748b;
          margin: 0;
        }

        .body-text {
          font-size: 16px;
          color: #334155;
          line-height: 1.6;
          margin: 30px auto;
          max-width: 800px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 40px;
          margin: 40px 0;
        }

        .info-item {
          text-align: center;
        }

        .info-label {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 8px;
        }

        .info-value {
          font-size: 18px;
          font-weight: bold;
          color: #334155;
        }

        .info-value.score {
          font-size: 24px;
          color: #10b981;
        }

        .footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 40px;
        }

        .validation {
          text-align: center;
        }

        .stamp {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: #10b981;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: bold;
          margin: 0 auto 10px;
        }

        .valid-text {
          color: #10b981;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .cert-id {
          font-size: 12px;
          color: #64748b;
        }

        @media print {
          body { -webkit-print-color-adjust: exact; }
          .certificate { height: auto; min-height: 100vh; }
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="header">
          <div class="logos">
            <div class="logo">GERFLOR</div>
            <div class="logo">×</div>
            <div class="logo">FPSG</div>
          </div>

          <div class="title">
            <h1>🏆 CERTIFICAT DE FORMATION</h1>
            <p class="subtitle">Sensibilisation Sécurité</p>
          </div>
        </div>

        <div class="content">
          <p class="intro">Nous certifions que</p>

          <div class="name-box">
            <h2 class="name">${data.firstName} ${data.lastName}</h2>
            <p class="profile">Profil : ${data.profile}</p>
          </div>

          <p class="body-text">
            a suivi avec succès la formation de sensibilisation aux règles de sécurité
            et est autorisé(e) à accéder au site dans le cadre de ses fonctions.
          </p>

          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Date de formation</div>
              <div class="info-value">${data.issueDate}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Score obtenu</div>
              <div class="info-value score">${data.score}%</div>
            </div>
            <div class="info-item">
              <div class="info-label">Validité</div>
              <div class="info-value">12 mois</div>
            </div>
          </div>
        </div>

        <div class="footer">
          <div></div>
          <div class="validation">
            <div class="stamp">✓</div>
            <div class="valid-text">VALIDÉ</div>
            <div class="cert-id">Certificat #${data.certificateId}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(certificateHTML);
  printWindow.document.close();

  // Set title for download
  printWindow.document.title = `certificat-${data.firstName}-${data.lastName}-${data.certificateId}`;

  setTimeout(() => {
    printWindow.print();
  }, 500);
}

// Print badge function
export function printBadge(data: CertificateData): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const badgeHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Badge Sécurité - ${data.firstName} ${data.lastName}</title>
      <style>
        @page {
          size: 85.6mm 53.98mm;
          margin: 0;
        }
        
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background: white;
        }
        
        .badge {
          width: 85.6mm;
          height: 53.98mm;
          border: 2px solid #cbd5e1;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
        }
        
        .header {
          background: linear-gradient(90deg, #059669 0%, #047857 100%);
          color: white;
          padding: 8px 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          font-weight: bold;
        }
        
        .main-content {
          padding: 12px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        .user-info h3 {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: bold;
          color: #1e293b;
          line-height: 1.2;
        }
        
        .user-info .profile {
          margin: 0;
          font-size: 10px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin: 8px 0;
        }
        
        .stat {
          text-align: left;
        }
        
        .stat-label {
          font-size: 9px;
          color: #64748b;
          margin: 0;
        }
        
        .stat-value {
          font-size: 11px;
          font-weight: bold;
          color: #059669;
          margin: 0;
        }
        
        .stat-value.validity {
          color: #1e293b;
          font-size: 9px;
        }
        
        .footer {
          border-top: 1px solid #e2e8f0;
          padding-top: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .logos {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 8px;
          color: #64748b;
          font-weight: bold;
        }
        
        .cert-info {
          text-align: right;
          font-size: 8px;
          color: #64748b;
        }
        
        .watermark {
          position: absolute;
          top: 50%;
          right: 8px;
          transform: translateY(-50%);
          opacity: 0.1;
          font-size: 24px;
          color: #059669;
        }
        
        .pattern {
          position: absolute;
          inset: 0;
          opacity: 0.05;
          background-image: radial-gradient(circle at 1px 1px, #059669 1px, transparent 0);
          background-size: 8px 8px;
          pointer-events: none;
        }
        
        @media print {
          body { -webkit-print-color-adjust: exact; }
        }
      </style>
    </head>
    <body>
      <div class="badge">
        <div class="pattern"></div>
        <div class="watermark">🛡️</div>
        
        <div class="header">
          <span>🛡️ CARTE SÉCURITÉ</span>
          <span>✓ VALIDÉ</span>
        </div>
        
        <div class="main-content">
          <div class="user-info">
            <h3>${data.firstName} ${data.lastName}</h3>
            <p class="profile">${data.profile}</p>
          </div>
          
          <div class="stats">
            <div class="stat">
              <p class="stat-label">Score QCM</p>
              <p class="stat-value">${data.score}%</p>
            </div>
            <div class="stat">
              <p class="stat-label">Validité</p>
              <p class="stat-value validity">${data.expiryDate}</p>
            </div>
          </div>
          
          <div class="footer">
            <div class="logos">
              GERFLOR × FPSG
            </div>
            <div class="cert-info">
              #${data.certificateId}<br>
              ${data.issueDate}
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(badgeHTML);
  printWindow.document.close();
  
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
}

// Generate QR code data for the badge
export function generateQRCodeData(data: CertificateData): string {
  return JSON.stringify({
    id: data.certificateId,
    name: `${data.firstName} ${data.lastName}`,
    profile: data.profile,
    score: data.score,
    issued: data.issueDate,
    expires: data.expiryDate,
    valid: true
  });
}

// Email certificate function
export function emailCertificate(data: CertificateData): void {
  if (!data.email) return;
  
  const subject = encodeURIComponent(`Certificat de formation sécurité - ${data.firstName} ${data.lastName}`);
  const body = encodeURIComponent(`
Bonjour ${data.firstName},

Félicitations ! Vous avez terminé avec succès la formation de sensibilisation sécurité.

Détails du certificat :
- Nom : ${data.firstName} ${data.lastName}
- Profil : ${data.profile}
- Score obtenu : ${data.score}%
- Date d'émission : ${data.issueDate}
- Validité : 12 mois
- Numéro de certificat : ${data.certificateId}

Ce certificat vous autorise à accéder au site dans le cadre de vos fonctions.

Cordialement,
L'équipe GERFLOR × FPSG
  `);
  
  window.open(`mailto:${data.email}?subject=${subject}&body=${body}`);
}
