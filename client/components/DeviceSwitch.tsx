import { useState, useEffect } from 'react';
import { Smartphone, Monitor, Tablet, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDeviceDetection, useAutoMobileRedirect } from '@/hooks/use-device-detection';

interface DeviceSwitchProps {
  showNotification?: boolean;
  onClose?: () => void;
}

export function DeviceSwitch({ showNotification = true, onClose }: DeviceSwitchProps) {
  const { deviceType, isMobile, isTablet, screenWidth, orientation } = useDeviceDetection();
  const { forceDesktopMode, forceMobileMode, clearPreference } = useAutoMobileRedirect();
  const [isVisible, setIsVisible] = useState(false);
  const [userPreference, setUserPreference] = useState<string | null>(null);

  useEffect(() => {
    const preference = localStorage.getItem('interface-preference');
    setUserPreference(preference);

    // Show notification for mobile/tablet users on desktop interface
    if ((isMobile || isTablet) && showNotification && !preference) {
      setIsVisible(true);
    }
  }, [isMobile, isTablet, showNotification]);

  const handleMobileSwitch = () => {
    forceMobileMode();
    setIsVisible(false);
    onClose?.();
  };

  const handleDesktopSwitch = () => {
    forceDesktopMode();
    setIsVisible(false);
    onClose?.();
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onClose?.();
  };

  const getDeviceIcon = () => {
    switch (deviceType) {
      case 'mobile': return <Smartphone className="w-5 h-5" />;
      case 'tablet': return <Tablet className="w-5 h-5" />;
      default: return <Monitor className="w-5 h-5" />;
    }
  };

  const getRecommendation = () => {
    if (isMobile) {
      return {
        title: "Interface Mobile Recommandée",
        description: "Votre appareil mobile bénéficierait d'une interface optimisée",
        action: "Basculer vers Mobile",
        color: "emerald"
      };
    }
    if (isTablet) {
      return {
        title: "Interface Tactile Disponible", 
        description: "Interface mobile optimisée pour les tablettes tactiles",
        action: "Essayer l'Interface Mobile",
        color: "blue"
      };
    }
    return null;
  };

  const recommendation = getRecommendation();

  if (!isVisible || !recommendation) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded-lg text-white">
          {getDeviceIcon()}
          <span className="text-sm">
            {deviceType} • {screenWidth}px • {orientation}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="bg-slate-800/95 border-slate-600/50 shadow-2xl max-w-md w-full mx-auto backdrop-blur-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-${recommendation.color}-500/20`}>
                {getDeviceIcon()}
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{recommendation.title}</h3>
                <p className="text-slate-300 text-sm">Détecté: {deviceType}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-slate-400 mb-6">
            {recommendation.description}
          </p>

          <div className="space-y-3">
            <Button
              onClick={handleMobileSwitch}
              className={`w-full bg-${recommendation.color}-600 hover:bg-${recommendation.color}-700 text-white`}
            >
              <Smartphone className="w-4 h-4 mr-2" />
              {recommendation.action}
            </Button>

            <Button
              onClick={handleDesktopSwitch}
              variant="outline"
              className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
            >
              <Monitor className="w-4 h-4 mr-2" />
              Rester sur Desktop
            </Button>
          </div>

          <div className="mt-4 p-3 bg-slate-700/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300 text-sm font-medium">Informations Appareil</span>
            </div>
            <div className="text-xs text-slate-400 space-y-1">
              <div>Résolution: {screenWidth} × {window.innerHeight}px</div>
              <div>Orientation: {orientation}</div>
              <div>Type: {deviceType}</div>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-4 text-center">
            Vous pouvez changer d'interface à tout moment via les boutons de navigation
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Component pour afficher le sélecteur d'interface
export function InterfaceSelector() {
  const { deviceType, isMobile, isTablet } = useDeviceDetection();
  const { forceDesktopMode, forceMobileMode, clearPreference } = useAutoMobileRedirect();
  const [userPreference, setUserPreference] = useState<string | null>(null);

  useEffect(() => {
    const preference = localStorage.getItem('interface-preference');
    setUserPreference(preference);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 px-2 py-1 bg-slate-700/50 rounded-lg">
        <span className="text-xs text-slate-400">Interface:</span>
        {deviceType === 'mobile' && <Smartphone className="w-3 h-3 text-blue-400" />}
        {deviceType === 'tablet' && <Tablet className="w-3 h-3 text-purple-400" />}
        {deviceType === 'desktop' && <Monitor className="w-3 h-3 text-green-400" />}
      </div>

      <Button
        size="sm"
        variant="outline"
        onClick={forceMobileMode}
        className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600 px-2 py-1"
      >
        <Smartphone className="w-3 h-3" />
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={forceDesktopMode}
        className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600 px-2 py-1"
      >
        <Monitor className="w-3 h-3" />
      </Button>

      {userPreference && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            clearPreference();
            setUserPreference(null);
            window.location.reload();
          }}
          className="text-slate-400 hover:text-white px-2 py-1"
        >
          <Settings className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
}
