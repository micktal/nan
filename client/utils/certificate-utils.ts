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

// Generate PDF certificate
export function generateCertificatePDF(data: CertificateData): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Set background
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, 297, 210, 'F');

  // Header with border
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(3);
  doc.rect(15, 15, 267, 180);

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(51, 65, 85);
  doc.text('CERTIFICAT DE FORMATION', 148.5, 40, { align: 'center' });

  doc.setFontSize(16);
  doc.setTextColor(100, 116, 139);
  doc.text('Sensibilisation Sécurité', 148.5, 50, { align: 'center' });

  // Main content
  doc.setFontSize(14);
  doc.setTextColor(51, 65, 85);
  doc.text('Nous certifions que', 148.5, 70, { align: 'center' });

  // Name box
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.rect(50, 80, 197, 25, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(51, 65, 85);
  doc.text(`${data.firstName} ${data.lastName}`, 148.5, 95, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139);
  doc.text(`Profil : ${data.profile}`, 148.5, 102, { align: 'center' });

  // Body text
  doc.setFontSize(12);
  doc.setTextColor(51, 65, 85);
  const bodyText = 'a suivi avec succès la formation de sensibilisation aux règles de sécurité\net est autorisé(e) à accéder au site dans le cadre de ses fonctions.';
  doc.text(bodyText, 148.5, 125, { align: 'center' });

  // Info grid
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  
  // Date
  doc.text('Date de formation', 70, 150);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(data.issueDate, 70, 158);

  // Score
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('Score obtenu', 148.5, 150, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(16, 185, 129);
  doc.text(`${data.score}%`, 148.5, 158, { align: 'center' });

  // Validity
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('Validité', 227, 150, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text('12 mois', 227, 158, { align: 'center' });

  // Validation stamp
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(16, 185, 129);
  doc.text('✓ VALIDÉ', 240, 175);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Certificat #${data.certificateId}`, 240, 182);

  // Logos (text placeholders - in production, you'd use actual images)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(16, 185, 129);
  doc.text('GERFLOR', 30, 35);
  doc.text('×', 148.5, 35, { align: 'center' });
  doc.text('FPSG', 267, 35, { align: 'right' });

  // Save the PDF
  const filename = `certificat-${data.firstName}-${data.lastName}-${data.certificateId}.pdf`;
  doc.save(filename);
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
