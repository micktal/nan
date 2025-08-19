import { useState, useEffect } from "react";
import { ArrowLeft, Truck, Wrench, Sparkles, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";

const profiles = [
  {
    id: 'driver',
    icon: Truck,
    title: {
      fr: 'Chauffeur-livreur',
      en: 'Driver-Delivery',
      de: 'Fahrer-Lieferant',
      es: 'Conductor-Repartidor'
    },
    description: {
      fr: 'Livraisons, chargement/déchargement',
      en: 'Deliveries, loading/unloading',
      de: 'Lieferungen, Be-/Entladen',
      es: 'Entregas, carga/descarga'
    },
    color: 'from-blue-500 to-blue-700',
    hoverColor: 'hover:from-blue-600 hover:to-blue-800'
  },
  {
    id: 'technician',
    icon: Wrench,
    title: {
      fr: 'Sous-traitant technique',
      en: 'Technical Contractor',
      de: 'Technischer Auftragnehmer',
      es: 'Contratista Técnico'
    },
    description: {
      fr: 'Maintenance, réparations, installations',
      en: 'Maintenance, repairs, installations',
      de: 'Wartung, Reparaturen, Installationen',
      es: 'Mantenimiento, reparaciones, instalaciones'
    },
    color: 'from-orange-500 to-orange-700',
    hoverColor: 'hover:from-orange-600 hover:to-orange-800'
  },
  {
    id: 'cleaning',
    icon: Sparkles,
    title: {
      fr: 'Agent de nettoyage',
      en: 'Cleaning Agent',
      de: 'Reinigungskraft',
      es: 'Agente de Limpieza'
    },
    description: {
      fr: 'Entretien, nettoyage des espaces',
      en: 'Maintenance, space cleaning',
      de: 'Wartung, Raumreinigung',
      es: 'Mantenimiento, limpieza de espacios'
    },
    color: 'from-green-500 to-green-700',
    hoverColor: 'hover:from-green-600 hover:to-green-800'
  },
  {
    id: 'administrative',
    icon: FileText,
    title: {
      fr: 'Visiteur administratif',
      en: 'Administrative Visitor',
      de: 'Verwaltungsbesucher',
      es: 'Visitante Administrativo'
    },
    description: {
      fr: 'Réunions, inspections, audits',
      en: 'Meetings, inspections, audits',
      de: 'Besprechungen, Inspektionen, Audits',
      es: 'Reuniones, inspecciones, auditorías'
    },
    color: 'from-purple-500 to-purple-700',
    hoverColor: 'hover:from-purple-600 hover:to-purple-800'
  }
];

export default function ProfileSelection() {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [language] = useState('fr'); // For now, defaulting to French
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleProfileSelect = (profileId: string) => {
    setSelectedProfile(profileId);
    // Store the selected profile for use in later components
    sessionStorage.setItem('selectedProfile', profileId);
    
    // Add a small delay for the selection animation, then navigate
    setTimeout(() => {
      navigate('/introduction');
    }, 500);
  };

  const content = {
    fr: {
      title: "Sélectionnez votre profil",
      subtitle: "Choisissez le profil qui correspond le mieux à votre visite",
      instruction: "Cliquez sur votre profil pour continuer"
    },
    en: {
      title: "Select your profile",
      subtitle: "Choose the profile that best matches your visit",
      instruction: "Click on your profile to continue"
    },
    de: {
      title: "Wählen Sie Ihr Profil",
      subtitle: "Wählen Sie das Profil, das am besten zu Ihrem Besuch passt",
      instruction: "Klicken Sie auf Ihr Profil, um fortzufahren"
    },
    es: {
      title: "Seleccione su perfil",
      subtitle: "Elija el perfil que mejor coincida con su visita",
      instruction: "Haga clic en su perfil para continuar"
    }
  };

  const currentContent = content[language as keyof typeof content];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Back button */}
      <div className="absolute top-6 left-6 z-20">
        <Link to="/">
          <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </Link>
      </div>

      {/* Main content */}
      <div className={`min-h-screen flex flex-col items-center justify-center px-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Header */}
        <div className="text-center mb-12 max-w-2xl">
          <h1 className="text-4xl font-bold text-white mb-4">
            {currentContent.title}
          </h1>
          <p className="text-slate-300 text-xl mb-2">
            {currentContent.subtitle}
          </p>
          <p className="text-emerald-400 text-sm">
            {currentContent.instruction}
          </p>
        </div>

        {/* Profile cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
          {profiles.map((profile, index) => {
            const IconComponent = profile.icon;
            const isSelected = selectedProfile === profile.id;
            
            return (
              <Card
                key={profile.id}
                className={`
                  bg-slate-800/50 border-slate-600/50 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl
                  ${isSelected ? 'ring-2 ring-emerald-400 scale-105' : ''}
                  ${isLoaded ? 'animate-in slide-in-from-bottom' : ''}
                `}
                style={{
                  animationDelay: `${index * 150}ms`,
                  animationDuration: '600ms',
                  animationFillMode: 'both'
                }}
                onClick={() => handleProfileSelect(profile.id)}
              >
                <CardContent className="p-8 text-center">
                  {/* Icon with gradient background */}
                  <div className={`
                    inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 shadow-lg transition-all duration-300
                    bg-gradient-to-br ${profile.color} ${profile.hoverColor}
                    ${isSelected ? 'animate-pulse' : ''}
                  `}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {profile.title[language as keyof typeof profile.title]}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {profile.description[language as keyof typeof profile.description]}
                  </p>
                  
                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="mt-4 flex items-center justify-center text-emerald-400">
                      <span className="text-sm font-medium mr-2">Sélectionné</span>
                      <ArrowRight className="w-4 h-4 animate-pulse" />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Progress indicator */}
        <div className="mt-12 flex items-center justify-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
            <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
            <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
            <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
          </div>
          <span className="text-slate-400 text-sm ml-4">Étape 1 sur 5</span>
        </div>
      </div>
    </div>
  );
}
