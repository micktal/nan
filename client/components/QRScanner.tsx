import { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle, XCircle, Smartphone, Users, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSound } from '@/hooks/use-sound';
import { useHaptic } from '@/hooks/use-haptic';

interface QRScanResult {
  id: string;
  name: string;
  profile: string;
  score: number;
  issued: string;
  expires: string;
  valid: boolean;
  company?: string;
  lastScan?: string;
}

interface QRScannerProps {
  onScanResult?: (result: QRScanResult) => void;
  mode?: 'mobile' | 'desktop';
}

export function QRScanner({ onScanResult, mode = 'desktop' }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<QRScanResult | null>(null);
  const [error, setError] = useState<string>('');
  const [recentScans, setRecentScans] = useState<QRScanResult[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { playClickSound, playSuccessSound, playErrorSound } = useSound();
  const { triggerSuccess, triggerError, triggerMedium } = useHaptic();

  // Mock QR validation - in production this would call a real API
  const validateQRCode = (qrData: string): QRScanResult | null => {
    try {
      // Simuler différents types de badges
      const mockResults = [
        {
          id: 'GFL-2024-A7B9C',
          name: 'Jean Dupont',
          profile: 'Chauffeur-livreur',
          score: 92,
          issued: '15/01/2024',
          expires: '15/01/2025',
          valid: true,
          company: 'Transport Express',
          lastScan: new Date().toLocaleTimeString('fr-FR')
        },
        {
          id: 'GFL-2024-X3M8K',
          name: 'Marie Martin',
          profile: 'Agent de nettoyage',
          score: 87,
          issued: '20/12/2023',
          expires: '20/12/2024',
          valid: true,
          company: 'CleanPro Services',
          lastScan: new Date().toLocaleTimeString('fr-FR')
        },
        {
          id: 'GFL-2023-E1R5T',
          name: 'Pierre Durand',
          profile: 'Sous-traitant technique',
          score: 78,
          issued: '05/03/2023',
          expires: '05/03/2024',
          valid: false, // Expiré
          company: 'TechMaintenance',
          lastScan: new Date().toLocaleTimeString('fr-FR')
        }
      ];

      // Simulation de scan - choisir aléatoirement un résultat
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      
      // Simuler un délai de validation réseau
      return {
        ...randomResult,
        lastScan: new Date().toLocaleTimeString('fr-FR')
      };
    } catch (error) {
      return null;
    }
  };

  const startCamera = async () => {
    try {
      setError('');
      setIsScanning(true);
      playClickSound();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Caméra arrière préférée
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      setError('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
      setIsScanning(false);
      playErrorSound();
      triggerError();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
    playClickSound();
  };

  // Simulation de scan automatique toutes les 3 secondes en mode démo
  useEffect(() => {
    let scanInterval: NodeJS.Timeout;
    
    if (isScanning) {
      scanInterval = setInterval(() => {
        simulateScan();
      }, 3000);
    }

    return () => {
      if (scanInterval) {
        clearInterval(scanInterval);
      }
    };
  }, [isScanning]);

  const simulateScan = () => {
    const result = validateQRCode('demo-qr-data');
    
    if (result) {
      setScanResult(result);
      setRecentScans(prev => [result, ...prev.slice(0, 4)]); // Garder les 5 derniers scans
      
      if (result.valid) {
        playSuccessSound();
        triggerSuccess();
      } else {
        playErrorSound();
        triggerError();
      }
      
      onScanResult?.(result);
      
      // Auto-clear après 5 secondes
      setTimeout(() => {
        setScanResult(null);
      }, 5000);
    }
  };

  const handleManualScan = () => {
    playClickSound();
    triggerMedium();
    simulateScan();
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const isMobile = mode === 'mobile' || /Mobi|Android/i.test(navigator.userAgent);

  return (
    <div className={`space-y-6 ${isMobile ? 'mobile-scanner' : ''}`}>
      {/* Scanner Interface */}
      <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Camera className="w-5 h-5 mr-2" />
            Scanner QR - Contrôle d'Accès
            {isMobile && (
              <div className="ml-auto flex items-center gap-1">
                <Smartphone className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 text-sm">Mobile</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Camera View */}
            <div className="relative">
              <div className="bg-slate-900 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                {isScanning ? (
                  <div className="relative w-full h-full">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      playsInline
                      muted
                    />
                    <canvas
                      ref={canvasRef}
                      className="absolute inset-0 w-full h-full"
                      style={{ display: 'none' }}
                    />
                    
                    {/* Overlay de scan */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-emerald-400 rounded-lg relative">
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-400"></div>
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-400"></div>
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-400"></div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-400"></div>
                        
                        {/* Ligne de scan animée */}
                        <div className="absolute inset-0 overflow-hidden">
                          <div className="h-0.5 bg-emerald-400 w-full animate-pulse opacity-75"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Instructions */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                      <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
                        <p className="text-white text-sm">Pointez vers un badge QR code</p>
                        <p className="text-emerald-400 text-xs">Scan automatique activé</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-400">
                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">Scanner QR de Badge</p>
                    <p className="text-sm">Activez la caméra pour scanner</p>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3 justify-center">
              {!isScanning ? (
                <Button 
                  onClick={startCamera}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Démarrer Scanner
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={stopCamera}
                    variant="outline"
                    className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                  >
                    Arrêter
                  </Button>
                  <Button 
                    onClick={handleManualScan}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Scan Manuel
                  </Button>
                </>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm flex items-center">
                  <XCircle className="w-4 h-4 mr-2" />
                  {error}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Scan Result */}
      {scanResult && (
        <Card className={`bg-slate-800/50 border-slate-600/50 backdrop-blur-md animate-fade-in-up ${scanResult.valid ? 'border-emerald-500/50' : 'border-red-500/50'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center ${scanResult.valid ? 'text-emerald-400' : 'text-red-400'}`}>
              {scanResult.valid ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <XCircle className="w-5 h-5 mr-2" />
              )}
              {scanResult.valid ? 'ACCÈS AUTORISÉ' : 'ACCÈS REFUSÉ'}
              <span className="ml-auto text-sm text-slate-400">
                {scanResult.lastScan}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="space-y-2">
                  <div>
                    <span className="text-slate-400 text-sm">Nom :</span>
                    <span className="text-white font-medium ml-2">{scanResult.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-sm">Profil :</span>
                    <span className="text-white font-medium ml-2">{scanResult.profile}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-sm">Entreprise :</span>
                    <span className="text-white font-medium ml-2">{scanResult.company}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="space-y-2">
                  <div>
                    <span className="text-slate-400 text-sm">Score QCM :</span>
                    <span className={`font-bold ml-2 ${scanResult.score >= 80 ? 'text-emerald-400' : 'text-orange-400'}`}>
                      {scanResult.score}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-sm">Émis le :</span>
                    <span className="text-white font-medium ml-2">{scanResult.issued}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-sm">Expire le :</span>
                    <span className={`font-medium ml-2 ${scanResult.valid ? 'text-emerald-400' : 'text-red-400'}`}>
                      {scanResult.expires}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-slate-700/50">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">ID Certificat</span>
                <span className="text-white font-mono text-sm">{scanResult.id}</span>
              </div>
            </div>

            {!scanResult.valid && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm font-medium">
                  ⚠️ Certificat expiré - Formation de mise à jour requise
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Scans */}
      {recentScans.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Scans Récents
              <div className="ml-auto flex items-center gap-1">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 text-sm">{recentScans.length}</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentScans.map((scan, index) => (
                <div 
                  key={`${scan.id}-${index}`}
                  className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {scan.valid ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    <div>
                      <div className="text-white font-medium text-sm">{scan.name}</div>
                      <div className="text-slate-400 text-xs">{scan.profile}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-slate-300 text-sm">{scan.lastScan}</div>
                    <div className={`text-xs ${scan.valid ? 'text-emerald-400' : 'text-red-400'}`}>
                      {scan.valid ? 'Autorisé' : 'Refusé'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mobile-specific features */}
      {isMobile && (
        <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Fonctionnalités Mobile Supervisor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="bg-slate-700/50 border-slate-600 text-white">
                <Users className="w-4 h-4 mr-2" />
                Équipes
              </Button>
              <Button variant="outline" className="bg-slate-700/50 border-slate-600 text-white">
                <Clock className="w-4 h-4 mr-2" />
                Historique
              </Button>
              <Button variant="outline" className="bg-slate-700/50 border-slate-600 text-white">
                <Shield className="w-4 h-4 mr-2" />
                Alertes
              </Button>
              <Button variant="outline" className="bg-slate-700/50 border-slate-600 text-white">
                <Camera className="w-4 h-4 mr-2" />
                Rapport
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// CSS pour le mode mobile
export const mobileStyles = `
@media (max-width: 768px) {
  .mobile-scanner .aspect-video {
    aspect-ratio: 4/3;
  }
  
  .mobile-scanner video {
    object-fit: cover;
  }
}

@media (max-width: 480px) {
  .mobile-scanner {
    padding: 0.5rem;
  }
}
`;
