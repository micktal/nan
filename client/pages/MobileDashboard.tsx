import { useState, useEffect } from 'react';
import { 
  Users, 
  Shield, 
  Camera, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  TrendingUp,
  Map,
  Settings,
  Bell
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { QRScanner } from '@/components/QRScanner';
import { useSound } from '@/hooks/use-sound';
import { useHaptic } from '@/hooks/use-haptic';

interface AccessEvent {
  id: string;
  timestamp: string;
  user: string;
  profile: string;
  status: 'authorized' | 'denied' | 'expired';
  location: string;
  supervisor: string;
}

interface LiveStats {
  onSite: number;
  authorized: number;
  denied: number;
  alerts: number;
}

export default function MobileDashboard() {
  const [activeTab, setActiveTab] = useState<'scanner' | 'monitor' | 'team' | 'alerts'>('scanner');
  const [liveStats, setLiveStats] = useState<LiveStats>({
    onSite: 23,
    authorized: 156,
    denied: 7,
    alerts: 3
  });
  const [recentAccess, setRecentAccess] = useState<AccessEvent[]>([]);
  const [isOnline, setIsOnline] = useState(true);

  const { playClickSound, playNotificationSound } = useSound();
  const { triggerLight, triggerMedium } = useHaptic();

  // Simuler des événements d'accès en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      const newEvent: AccessEvent = {
        id: `evt_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('fr-FR'),
        user: ['Jean Dupont', 'Marie Martin', 'Pierre Durand', 'Sophie Bernard'][Math.floor(Math.random() * 4)],
        profile: ['Chauffeur', 'Nettoyage', 'Technique', 'Administratif'][Math.floor(Math.random() * 4)],
        status: Math.random() > 0.1 ? 'authorized' : Math.random() > 0.5 ? 'denied' : 'expired',
        location: ['Entrée Principale', 'Zone Production', 'Bureaux', 'Entrepôt'][Math.floor(Math.random() * 4)],
        supervisor: 'Supervisor Mobile'
      };

      setRecentAccess(prev => [newEvent, ...prev.slice(0, 9)]);
      
      // Mettre à jour les stats
      setLiveStats(prev => ({
        ...prev,
        authorized: newEvent.status === 'authorized' ? prev.authorized + 1 : prev.authorized,
        denied: newEvent.status !== 'authorized' ? prev.denied + 1 : prev.denied,
        onSite: newEvent.status === 'authorized' ? prev.onSite + 1 : prev.onSite
      }));

      if (newEvent.status !== 'authorized') {
        playNotificationSound();
      }
    }, 8000); // Nouvel événement toutes les 8 secondes

    return () => clearInterval(interval);
  }, [playNotificationSound]);

  const handleTabChange = (tab: typeof activeTab) => {
    playClickSound();
    triggerLight();
    setActiveTab(tab);
  };

  const handleScanResult = (result: any) => {
    const newEvent: AccessEvent = {
      id: `scan_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('fr-FR'),
      user: result.name,
      profile: result.profile,
      status: result.valid ? 'authorized' : 'denied',
      location: 'Scanner Mobile',
      supervisor: 'Mobile App'
    };

    setRecentAccess(prev => [newEvent, ...prev.slice(0, 9)]);
    triggerMedium();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'authorized': return 'text-emerald-400 bg-emerald-500/10';
      case 'denied': return 'text-red-400 bg-red-500/10';
      case 'expired': return 'text-orange-400 bg-orange-500/10';
      default: return 'text-slate-400 bg-slate-500/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'authorized': return <CheckCircle className="w-4 h-4" />;
      case 'denied': return <XCircle className="w-4 h-4" />;
      case 'expired': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Mobile Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-500" />
                Supervisor Mobile
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                <span className="text-xs text-slate-400">
                  {isOnline ? 'En ligne' : 'Hors ligne'} • {new Date().toLocaleTimeString('fr-FR')}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Bell className="w-5 h-5 text-slate-400" />
                {liveStats.alerts > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{liveStats.alerts}</span>
                  </div>
                )}
              </div>
              <Settings className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Live Stats Banner */}
      <div className="px-4 py-3 bg-slate-800/30">
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-400">{liveStats.onSite}</div>
            <div className="text-xs text-slate-400">Sur site</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-400">{liveStats.authorized}</div>
            <div className="text-xs text-slate-400">Autorisés</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-400">{liveStats.denied}</div>
            <div className="text-xs text-slate-400">Refusés</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-400">{liveStats.alerts}</div>
            <div className="text-xs text-slate-400">Alertes</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4">
        {activeTab === 'scanner' && (
          <QRScanner 
            mode="mobile" 
            onScanResult={handleScanResult}
          />
        )}

        {activeTab === 'monitor' && (
          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Activité Temps Réel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentAccess.slice(0, 8).map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-1 rounded ${getStatusColor(event.status)}`}>
                          {getStatusIcon(event.status)}
                        </div>
                        <div>
                          <div className="text-white text-sm font-medium">{event.user}</div>
                          <div className="text-slate-400 text-xs">{event.profile} • {event.location}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-slate-300 text-xs">{event.timestamp}</div>
                        <div className={`text-xs capitalize ${getStatusColor(event.status)}`}>
                          {event.status === 'authorized' ? 'Autorisé' : 
                           event.status === 'denied' ? 'Refusé' : 'Expiré'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Équipes sur Site
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { team: 'Transport', members: 8, location: 'Zone Livraison', status: 'active' },
                    { team: 'Maintenance', members: 5, location: 'Atelier', status: 'active' },
                    { team: 'Nettoyage', members: 3, location: 'Bureaux', status: 'break' },
                    { team: 'Administration', members: 7, location: 'Salle Réunion', status: 'meeting' }
                  ].map((team, index) => (
                    <div key={index} className="p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-white font-medium">{team.team}</div>
                        <div className="text-emerald-400 font-bold">{team.members}</div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">{team.location}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          team.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                          team.status === 'break' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {team.status === 'active' ? 'Actif' :
                           team.status === 'break' ? 'Pause' : 'Réunion'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Alertes Sécurité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { 
                      type: 'expired', 
                      message: 'Certificat Pierre Durand expiré', 
                      time: 'Il y a 5 min',
                      priority: 'high'
                    },
                    { 
                      type: 'unauthorized', 
                      message: 'Tentative d\'accès non autorisée - Zone Production', 
                      time: 'Il y a 12 min',
                      priority: 'critical'
                    },
                    { 
                      type: 'warning', 
                      message: '3 certificats expirent dans 7 jours', 
                      time: 'Il y a 1h',
                      priority: 'medium'
                    }
                  ].map((alert, index) => (
                    <div key={index} className={`p-3 rounded-lg border-l-4 ${
                      alert.priority === 'critical' ? 'bg-red-500/10 border-red-500' :
                      alert.priority === 'high' ? 'bg-orange-500/10 border-orange-500' :
                      'bg-yellow-500/10 border-yellow-500'
                    }`}>
                      <div className="flex items-start gap-3">
                        <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                          alert.priority === 'critical' ? 'text-red-400' :
                          alert.priority === 'high' ? 'text-orange-400' :
                          'text-yellow-400'
                        }`} />
                        <div className="flex-1">
                          <div className="text-white text-sm">{alert.message}</div>
                          <div className="text-slate-400 text-xs mt-1">{alert.time}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800/50 backdrop-blur-sm border-t border-slate-700">
        <div className="grid grid-cols-4 gap-1 p-2">
          {[
            { id: 'scanner', icon: Camera, label: 'Scanner' },
            { id: 'monitor', icon: TrendingUp, label: 'Monitor' },
            { id: 'team', icon: Users, label: 'Équipes' },
            { id: 'alerts', icon: AlertTriangle, label: 'Alertes' }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => handleTabChange(tab.id as any)}
              className={`flex flex-col items-center gap-1 py-3 px-2 rounded-lg ${
                activeTab === tab.id 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-xs">{tab.label}</span>
              {tab.id === 'alerts' && liveStats.alerts > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Spacer for bottom nav */}
      <div className="h-20"></div>
    </div>
  );
}
