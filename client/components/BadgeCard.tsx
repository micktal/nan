import { Card, CardContent } from '@/components/ui/card';
import { Shield, CheckCircle, QrCode } from 'lucide-react';

interface BadgeCardProps {
  firstName: string;
  lastName: string;
  profile: string;
  score: number;
  certificateId: string;
  issueDate: string;
  expiryDate: string;
}

export function BadgeCard({ 
  firstName, 
  lastName, 
  profile, 
  score, 
  certificateId, 
  issueDate,
  expiryDate 
}: BadgeCardProps) {
  return (
    <div className="badge-card" style={{ width: '85.6mm', height: '53.98mm' }}>
      <Card className="w-full h-full border-2 border-slate-300 bg-gradient-to-br from-white to-slate-50 shadow-lg overflow-hidden">
        <CardContent className="p-0 h-full relative">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-3 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span className="font-bold text-sm">CARTE SÉCURITÉ</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs">VALIDÉ</span>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="p-3 flex flex-col h-full justify-between">
            {/* User info */}
            <div className="flex-1">
              <div className="mb-2">
                <h3 className="font-bold text-slate-800 text-base leading-tight">
                  {firstName} {lastName}
                </h3>
                <p className="text-slate-600 text-xs uppercase tracking-wide">
                  {profile}
                </p>
              </div>

              {/* Score and validity */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <p className="text-xs text-slate-500">Score QCM</p>
                  <p className="font-bold text-emerald-600 text-sm">{score}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Validité</p>
                  <p className="font-bold text-slate-700 text-xs">{expiryDate}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2Fcf2c1680c78247c6bd78521e30a0f35c?format=webp&width=400"
                      alt="Gerflor"
                      className="h-3 object-contain"
                    />
                    <span className="text-slate-400">×</span>
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2Fca3c12dc38bf426eacbda6f86df51d73?format=webp&width=400"
                      alt="FPSG"
                      className="h-3 object-contain"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-slate-400" />
                  <div className="text-right">
                    <p className="text-xs text-slate-500">#{certificateId}</p>
                    <p className="text-xs text-slate-400">{issueDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security features */}
            <div className="absolute top-14 right-2 opacity-10">
              <Shield className="w-8 h-8 text-emerald-600" />
            </div>
            
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="w-full h-full" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2310B981' fill-opacity='1'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
              }} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Print styles for the badge
export const badgePrintStyles = `
@media print {
  @page {
    size: 85.6mm 53.98mm;
    margin: 0;
  }
  
  .badge-card {
    width: 85.6mm !important;
    height: 53.98mm !important;
  }
  
  body {
    margin: 0;
    padding: 0;
  }
  
  .print-only {
    display: block !important;
  }
  
  .no-print {
    display: none !important;
  }
}

.print-only {
  display: none;
}
`;
