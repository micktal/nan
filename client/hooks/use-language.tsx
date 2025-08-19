import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

export type Language = 'fr' | 'en' | 'de' | 'es' | 'it' | 'pt' | 'nl' | 'pl' | 'ar';

export interface LanguageConfig {
  code: Language;
  label: string;
  flag: string;
  rtl?: boolean;
}

export const AVAILABLE_LANGUAGES: LanguageConfig[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦', rtl: true },
];

interface LanguageContextType {
  language: Language;
  languageConfig: LanguageConfig;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('fr');

  // Load saved language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('safety-app-language') as Language;
    if (savedLanguage && AVAILABLE_LANGUAGES.find(l => l.code === savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Save language to localStorage when changed
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('safety-app-language', lang);
  };

  const languageConfig = AVAILABLE_LANGUAGES.find(l => l.code === language) || AVAILABLE_LANGUAGES[0];

  // Translation function (placeholder - will be expanded)
  const t = (key: string): string => {
    return translations[language]?.[key] || translations.fr[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, languageConfig, setLanguage, t }}>
      <div dir={languageConfig.rtl ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

// Comprehensive translations object
export const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Navigation
    'nav.back': 'Retour',
    'nav.next': 'Suivant',
    'nav.continue': 'Continuer',
    'nav.finish': 'Terminer',
    'nav.start': 'Commencer',
    
    // Home page
    'home.title': 'Centre de Formation Sécurité',
    'home.subtitle': 'Sensibilisation sécurité interactive',
    'home.description': 'Avant d\'accéder au site, vous devez suivre une courte formation aux règles de sécurité essentielles.',
    'home.startButton': 'Commencer la formation',
    'home.duration': 'Durée estimée : 5-10 minutes',
    
    // Profile selection
    'profile.title': 'Sélectionnez votre profil',
    'profile.subtitle': 'Choisissez le profil qui correspond le mieux à votre visite',
    'profile.instruction': 'Cliquez sur votre profil pour continuer',
    'profile.driver': 'Chauffeur-livreur',
    'profile.driver.desc': 'Livraisons, chargement/déchargement',
    'profile.technician': 'Sous-traitant technique',
    'profile.technician.desc': 'Maintenance, réparations, installations',
    'profile.cleaning': 'Agent de nettoyage',
    'profile.cleaning.desc': 'Entretien, nettoyage des espaces',
    'profile.administrative': 'Visiteur administratif',
    'profile.administrative.desc': 'Réunions, inspections, audits',
    'profile.selected': 'Sélectionné',
    'profile.step': 'Étape 1 sur 5',

    // QCM
    'qcm.question': 'Question',
    'qcm.of': 'sur',
    'qcm.correct': 'Bonne réponse !',
    'qcm.incorrect': 'Réponse incorrecte',
    'qcm.correctAnswer': 'La bonne réponse était :',
    'qcm.finished': 'QCM Terminé !',
    'qcm.score': 'Score :',
    'qcm.passed': 'Félicitations ! Vous avez réussi la formation.',
    'qcm.failed': 'Score insuffisant. Nous vous recommandons de revoir la formation.',
    'qcm.certificate': 'Générer le certificat',
  },
  
  en: {
    // Navigation
    'nav.back': 'Back',
    'nav.next': 'Next',
    'nav.continue': 'Continue',
    'nav.finish': 'Finish',
    'nav.start': 'Start',
    
    // Home page
    'home.title': 'Safety Training Center',
    'home.subtitle': 'Interactive safety awareness',
    'home.description': 'Before accessing the site, you must complete a short training on essential safety rules.',
    'home.startButton': 'Start Training',
    'home.duration': 'Estimated duration: 5-10 minutes',
    
    // Profile selection
    'profile.title': 'Select your profile',
    'profile.subtitle': 'Choose the profile that best matches your visit',
    'profile.instruction': 'Click on your profile to continue',
    'profile.driver': 'Driver-Delivery',
    'profile.driver.desc': 'Deliveries, loading/unloading',
    'profile.technician': 'Technical Contractor',
    'profile.technician.desc': 'Maintenance, repairs, installations',
    'profile.cleaning': 'Cleaning Agent',
    'profile.cleaning.desc': 'Maintenance, space cleaning',
    'profile.administrative': 'Administrative Visitor',
    'profile.administrative.desc': 'Meetings, inspections, audits',
    'profile.selected': 'Selected',
    'profile.step': 'Step 1 of 5',

    // QCM
    'qcm.question': 'Question',
    'qcm.of': 'of',
    'qcm.correct': 'Correct answer!',
    'qcm.incorrect': 'Incorrect answer',
    'qcm.correctAnswer': 'The correct answer was:',
    'qcm.finished': 'Quiz Completed!',
    'qcm.score': 'Score:',
    'qcm.passed': 'Congratulations! You have successfully completed the training.',
    'qcm.failed': 'Insufficient score. We recommend reviewing the training.',
    'qcm.certificate': 'Generate certificate',
  },
  
  de: {
    // Navigation
    'nav.back': 'Zurück',
    'nav.next': 'Weiter',
    'nav.continue': 'Fortfahren',
    'nav.finish': 'Beenden',
    'nav.start': 'Starten',
    
    // Home page
    'home.title': 'Sicherheitsschulungszentrum',
    'home.subtitle': 'Interaktive Sicherheitsschulung',
    'home.description': 'Bevor Sie das Gelände betreten, müssen Sie eine kurze Schulung zu den wichtigsten Sicherheitsregeln absolvieren.',
    'home.startButton': 'Schulung beginnen',
    'home.duration': 'Geschätzte Dauer: 5-10 Minuten',
    
    // Profile selection
    'profile.title': 'Wählen Sie Ihr Profil',
    'profile.subtitle': 'Wählen Sie das Profil, das am besten zu Ihrem Besuch passt',
    'profile.instruction': 'Klicken Sie auf Ihr Profil, um fortzufahren',
    'profile.driver': 'Fahrer-Lieferant',
    'profile.driver.desc': 'Lieferungen, Be-/Entladen',
    'profile.technician': 'Technischer Auftragnehmer',
    'profile.technician.desc': 'Wartung, Reparaturen, Installationen',
    'profile.cleaning': 'Reinigungskraft',
    'profile.cleaning.desc': 'Wartung, Raumreinigung',
    'profile.administrative': 'Verwaltungsbesucher',
    'profile.administrative.desc': 'Besprechungen, Inspektionen, Audits',
    'profile.selected': 'Ausgewählt',
    'profile.step': 'Schritt 1 von 5',

    // QCM
    'qcm.question': 'Frage',
    'qcm.of': 'von',
    'qcm.correct': 'Richtige Antwort!',
    'qcm.incorrect': 'Falsche Antwort',
    'qcm.correctAnswer': 'Die richtige Antwort war:',
    'qcm.finished': 'Quiz abgeschlossen!',
    'qcm.score': 'Punkte:',
    'qcm.passed': 'Herzlichen Glückwunsch! Sie haben die Schulung erfolgreich abgeschlossen.',
    'qcm.failed': 'Unzureichende Punktzahl. Wir empfehlen, die Schulung zu wiederholen.',
    'qcm.certificate': 'Zertifikat erstellen',
  },
  
  es: {
    // Navigation
    'nav.back': 'Atrás',
    'nav.next': 'Siguiente',
    'nav.continue': 'Continuar',
    'nav.finish': 'Finalizar',
    'nav.start': 'Empezar',
    
    // Home page
    'home.title': 'Centro de Formación en Seguridad',
    'home.subtitle': 'Sensibilización de seguridad interactiva',
    'home.description': 'Antes de acceder al sitio, debe completar una breve formación sobre las reglas de seguridad esenciales.',
    'home.startButton': 'Comenzar Formación',
    'home.duration': 'Duración estimada: 5-10 minutos',
    
    // Profile selection
    'profile.title': 'Seleccione su perfil',
    'profile.subtitle': 'Elija el perfil que mejor coincida con su visita',
    'profile.instruction': 'Haga clic en su perfil para continuar',
    'profile.driver': 'Conductor-Repartidor',
    'profile.driver.desc': 'Entregas, carga/descarga',
    'profile.technician': 'Contratista Técnico',
    'profile.technician.desc': 'Mantenimiento, reparaciones, instalaciones',
    'profile.cleaning': 'Agente de Limpieza',
    'profile.cleaning.desc': 'Mantenimiento, limpieza de espacios',
    'profile.administrative': 'Visitante Administrativo',
    'profile.administrative.desc': 'Reuniones, inspecciones, auditorías',
    'profile.selected': 'Seleccionado',
    'profile.step': 'Paso 1 de 5',

    // QCM
    'qcm.question': 'Pregunta',
    'qcm.of': 'de',
    'qcm.correct': '¡Respuesta correcta!',
    'qcm.incorrect': 'Respuesta incorrecta',
    'qcm.correctAnswer': 'La respuesta correcta era:',
    'qcm.finished': '¡Quiz Completado!',
    'qcm.score': 'Puntuación:',
    'qcm.passed': '¡Felicidades! Ha completado exitosamente la formación.',
    'qcm.failed': 'Puntuación insuficiente. Recomendamos revisar la formación.',
    'qcm.certificate': 'Generar certificado',
  },
  
  it: {
    // Navigation and basic terms - simplified for space
    'nav.back': 'Indietro',
    'nav.start': 'Inizia',
    'home.title': 'Centro di Formazione Sicurezza',
    'home.startButton': 'Inizia Formazione',
    'profile.driver': 'Autista-Consegnatario',
    'profile.technician': 'Appaltatore Tecnico',
    'profile.cleaning': 'Addetto alle Pulizie',
    'profile.administrative': 'Visitante Amministrativo',
  },
  
  pt: {
    // Navigation and basic terms - simplified for space
    'nav.back': 'Voltar',
    'nav.start': 'Começar',
    'home.title': 'Centro de Formação em Segurança',
    'home.startButton': 'Começar Treinamento',
    'profile.driver': 'Motorista-Entregador',
    'profile.technician': 'Contratado Técnico',
    'profile.cleaning': 'Agente de Limpeza',
    'profile.administrative': 'Visitante Administrativo',
  },
  
  nl: {
    // Navigation and basic terms - simplified for space
    'nav.back': 'Terug',
    'nav.start': 'Start',
    'home.title': 'Veiligheidstrainingscentrum',
    'home.startButton': 'Training Starten',
    'profile.driver': 'Chauffeur-Bezorger',
    'profile.technician': 'Technische Aannemer',
    'profile.cleaning': 'Schoonmaakmedewerker',
    'profile.administrative': 'Administratieve Bezoeker',
  },
  
  pl: {
    // Navigation and basic terms - simplified for space
    'nav.back': 'Wstecz',
    'nav.start': 'Start',
    'home.title': 'Centrum Szkolenia BHP',
    'home.startButton': 'Rozpocznij Szkolenie',
    'profile.driver': 'Kierowca-Dostawca',
    'profile.technician': 'Wykonawca Techniczny',
    'profile.cleaning': 'Pracownik Sprzątający',
    'profile.administrative': 'Gość Administracyjny',
  },
  
  ar: {
    // Navigation and basic terms - simplified for space
    'nav.back': 'رجوع',
    'nav.start': 'بدء',
    'home.title': 'مركز التدريب على السلامة',
    'home.startButton': 'بدء التدريب',
    'profile.driver': 'سائق-موصل',
    'profile.technician': 'متعاقد تقني',
    'profile.cleaning': 'عامل النظافة',
    'profile.administrative': 'زائر إداري',
  },
};
