import { useState, useEffect, useRef } from "react";
import { ChevronDown, Play, Shield, Globe, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useSound } from "@/hooks/use-sound";
import { useHaptic } from "@/hooks/use-haptic";
import { useFullscreen } from "@/hooks/use-fullscreen";

const languages = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

export default function Index() {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [isLoaded, setIsLoaded] = useState(false);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // UX/UI hooks
  const { playClickSound, playBeepSound, playNotificationSound } = useSound();
  const { triggerLight, triggerMedium, triggerSuccess } = useHaptic();
  const { isFullscreen, toggleFullscreen, isTablet, enableTabletMode } = useFullscreen();

  useEffect(() => {
    setIsLoaded(true);

    // Auto-enable tablet mode if on tablet
    if (isTablet) {
      // Add a slight delay to let the page load
      setTimeout(() => {
        playNotificationSound();
      }, 1000);
    }
  }, [isTablet, playNotificationSound]);

  const content = {
    fr: {
      title: "Centre de Formation Sécurité",
      subtitle: "Sensibilisation sécurité interactive",
      description: "Avant d'accéder au site, vous devez suivre une courte formation aux règles de sécurité essentielles.",
      startButton: "Commencer la formation",
      poweredBy: "Alimenté par"
    },
    en: {
      title: "Safety Training Center", 
      subtitle: "Interactive safety awareness",
      description: "Before accessing the site, you must complete a short training on essential safety rules.",
      startButton: "Start Training",
      poweredBy: "Powered by"
    },
    de: {
      title: "Sicherheitsschulungszentrum",
      subtitle: "Interaktive Sicherheitsschulung", 
      description: "Bevor Sie das Gelände betreten, müssen Sie eine kurze Schulung zu den wichtigsten Sicherheitsregeln absolvieren.",
      startButton: "Schulung beginnen",
      poweredBy: "Unterstützt von"
    },
    es: {
      title: "Centro de Formación en Seguridad",
      subtitle: "Sensibilización de seguridad interactiva",
      description: "Antes de acceder al sitio, debe completar una breve formación sobre las reglas de seguridad esenciales.",
      startButton: "Comenzar Formación", 
      poweredBy: "Desarrollado por"
    }
  };

  const currentContent = content[selectedLanguage.code as keyof typeof content];

  const handleLanguageChange = (lang: typeof languages[0]) => {
    playClickSound();
    triggerLight();
    setSelectedLanguage(lang);
  };

  const handleStartTraining = () => {
    playBeepSound();
    triggerSuccess(startButtonRef.current || undefined);
  };

  const handleFullscreenToggle = async () => {
    playClickSound();
    triggerMedium();
    await toggleFullscreen(containerRef.current || undefined);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden"
    >
      {/* Background pattern to simulate terminal/kiosk environment */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Controls - top right */}
      <div className="absolute top-6 right-6 z-20 flex gap-3">
        {/* Fullscreen toggle for tablets */}
        {isTablet && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleFullscreenToggle}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 interactive-element focus-ring"
          >
            <Maximize className="w-4 h-4" />
          </Button>
        )}

        {/* Language selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 interactive-element focus-ring">
              <Globe className="w-4 h-4 mr-2" />
              {selectedLanguage.flag} {selectedLanguage.label}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => handleLanguageChange(lang)}
                className="text-white hover:bg-slate-700 cursor-pointer interactive-element"
              >
                {lang.flag} {lang.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main content */}
      <div className={`min-h-screen flex flex-col items-center justify-center px-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0 animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
        
        {/* Logo section */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-8 mb-6">
            {/* Gerflor logo */}
            <div>
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2Fcf2c1680c78247c6bd78521e30a0f35c?format=webp&width=800"
                alt="Gerflor Logo"
                className="w-24 h-12 object-contain"
              />
            </div>
            
            {/* FPSG logo */}
            <div>
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2Fca3c12dc38bf426eacbda6f86df51d73?format=webp&width=800"
                alt="FPSG Logo"
                className="w-24 h-12 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Terminal-style interface */}
        <div className="glass-effect rounded-2xl border border-slate-600/50 shadow-2xl p-8 max-w-2xl w-full mx-auto terminal-glow animate-scale-in">

          {/* Header with safety icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full mb-6 shadow-lg animate-bounce-soft">
              <Shield className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-white mb-2 animate-fade-in-up">
              {currentContent.title}
            </h1>
            <p className="text-emerald-400 text-lg font-medium animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {currentContent.subtitle}
            </p>
          </div>

          {/* Description */}
          <div className="text-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <p className="text-slate-300 text-lg leading-relaxed">
              {currentContent.description}
            </p>
            <p className="text-slate-400 text-sm mt-2">
              ⏱️ Durée estimée : 5-10 minutes
            </p>
          </div>

          {/* Start button */}
          <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Link to="/profile-selection" onClick={handleStartTraining}>
              <Button
                ref={startButtonRef}
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white px-12 py-6 text-xl font-semibold rounded-xl shadow-lg pulse-button hover-lift interactive-element focus-ring"
              >
                <Play className="w-6 h-6 mr-3" />
                {currentContent.startButton}
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
