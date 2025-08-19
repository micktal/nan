import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  AlertTriangle,
  HardHat,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useSound } from "@/hooks/use-sound";
import { useHaptic } from "@/hooks/use-haptic";

const safetyZones = [
  {
    id: "ppe",
    icon: HardHat,
    title: "Port des EPI",
    description: "Équipements de protection individuelle obligatoires",
    position: { top: "30%", left: "20%" },
  },
  {
    id: "restricted",
    icon: AlertTriangle,
    title: "Zones interdites",
    description: "Zones d'accès restreint et de danger",
    position: { top: "45%", left: "60%" },
  },
  {
    id: "signage",
    icon: Eye,
    title: "Signalisation",
    description: "Panneaux et signalétique de sécurité",
    position: { top: "65%", left: "35%" },
  },
];

export default function SafetyCourse() {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [completedZones, setCompletedZones] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const continueButtonRef = useRef<HTMLButtonElement>(null);
  const zoneRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // UX/UI hooks
  const {
    playClickSound,
    playBeepSound,
    playSuccessSound,
    playNotificationSound,
  } = useSound();
  const { triggerLight, triggerMedium, triggerSuccess } = useHaptic();

  useEffect(() => {
    setIsLoaded(true);
    playBeepSound(); // Entry sound
  }, [playBeepSound]);

  const handleZoneClick = (zoneId: string) => {
    playClickSound();
    triggerMedium(zoneRefs.current[zoneId] || undefined);
    setSelectedZone(zoneId);

    if (!completedZones.includes(zoneId)) {
      setCompletedZones([...completedZones, zoneId]);
      playSuccessSound(); // Success sound for completion
    }
  };

  const handleContinue = () => {
    playNotificationSound();
    triggerSuccess(continueButtonRef.current || undefined);
    setTimeout(() => {
      navigate("/qcm");
    }, 300);
  };

  const handleBack = () => {
    playClickSound();
    triggerLight();
  };

  const canProceed = completedZones.length === safetyZones.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Back button */}
      <div className="absolute top-6 left-6 z-20">
        <Link to="/introduction" onClick={handleBack}>
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 interactive-element focus-ring"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </Link>
      </div>

      {/* Main content */}
      <div
        className={`min-h-screen flex flex-col items-center justify-center px-6 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0 animate-fade-in-up" : "opacity-0 translate-y-8"}`}
      >
        <div className="max-w-6xl w-full">
          <div className="text-center mb-8 animate-fade-in-up">
            <h1 className="text-3xl font-bold text-white mb-4">
              Parcours Sécurité Interactif
            </h1>
            <p
              className="text-slate-300 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Cliquez sur les zones ci-dessous pour découvrir les règles de
              sécurité
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Interactive site view */}
            <div
              className="lg:col-span-2 animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <Card className="glass-effect border-slate-600/50 h-96 relative overflow-hidden hover-lift smooth-transition">
                <CardContent className="p-0 h-full">
                  {/* Site background image placeholder */}
                  <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 relative flex items-center justify-center terminal-glow">
                    <span className="text-slate-400 text-lg">
                      Vue du site industriel
                    </span>

                    {/* Interactive zones */}
                    {safetyZones.map((zone) => {
                      const IconComponent = zone.icon;
                      const isCompleted = completedZones.includes(zone.id);
                      const isSelected = selectedZone === zone.id;

                      return (
                        <div
                          key={zone.id}
                          ref={(el) => (zoneRefs.current[zone.id] = el)}
                          className={`
                            absolute cursor-pointer transform smooth-transition hover:scale-110 interactive-element
                            ${isSelected ? "animate-pulse-glow" : ""}
                          `}
                          style={zone.position}
                          onClick={() => handleZoneClick(zone.id)}
                          tabIndex={0}
                          role="button"
                          aria-label={`Zone de sécurité: ${zone.title}`}
                        >
                          <div
                            className={`
                            w-12 h-12 rounded-full flex items-center justify-center shadow-lg smooth-transition
                            ${isCompleted ? "bg-emerald-500 animate-bounce-soft" : "bg-yellow-500"}
                            ${isSelected ? "ring-4 ring-white scale-110" : "hover:scale-105"}
                          `}
                          >
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Information panel */}
            <div
              className="space-y-4 animate-fade-in-up"
              style={{ animationDelay: "0.6s" }}
            >
              {selectedZone ? (
                <Card className="glass-effect border-slate-600/50 animate-scale-in">
                  <CardContent className="p-6">
                    {(() => {
                      const zone = safetyZones.find(
                        (z) => z.id === selectedZone,
                      );
                      const IconComponent = zone?.icon || Shield;
                      return (
                        <>
                          <div className="flex items-center mb-4">
                            <IconComponent className="w-8 h-8 text-emerald-400 mr-3" />
                            <h3 className="text-xl font-semibold text-white">
                              {zone?.title}
                            </h3>
                          </div>
                          <p className="text-slate-300 mb-4">
                            {zone?.description}
                          </p>
                          <div className="text-sm text-slate-400">
                            <p>• Information détaillée sur cette zone</p>
                            <p>• Règles spécifiques à respecter</p>
                            <p>• Consignes de sécurité</p>
                          </div>
                        </>
                      );
                    })()}
                  </CardContent>
                </Card>
              ) : (
                <Card className="glass-effect border-slate-600/50">
                  <CardContent className="p-6 text-center">
                    <Shield className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-300">
                      Cliquez sur une zone pour afficher les informations de
                      sécurité
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Progress */}
              <Card className="glass-effect border-slate-600/50">
                <CardContent className="p-6">
                  <h4 className="text-white font-semibold mb-4">Progression</h4>
                  <div className="space-y-2">
                    {safetyZones.map((zone) => (
                      <div key={zone.id} className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full mr-3 ${completedZones.includes(zone.id) ? "bg-emerald-500" : "bg-slate-600"}`}
                        />
                        <span
                          className={
                            completedZones.includes(zone.id)
                              ? "text-emerald-400"
                              : "text-slate-400"
                          }
                        >
                          {zone.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Continue button */}
          {canProceed && (
            <div className="text-center mt-8 animate-fade-in-up">
              <Button
                ref={continueButtonRef}
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white px-8 py-4 text-lg font-semibold rounded-xl pulse-button hover-lift interactive-element focus-ring"
                onClick={handleContinue}
              >
                Passer au QCM
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
        </div>

        {/* Progress indicator */}
        <div className="mt-12 flex items-center justify-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
            <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
          </div>
          <span className="text-slate-400 text-sm ml-4">Étape 3 sur 5</span>
        </div>
      </div>
    </div>
  );
}
