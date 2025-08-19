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
    
    // Introduction
    'intro.title': 'Introduction au Module Sécurité',
    'intro.welcome': 'Bienvenue.',
    'intro.description': 'Avant d\'accéder au site, vous devez suivre une courte sensibilisation aux règles de sécurité essentielles.',
    'intro.purpose': 'Cela ne prendra que quelques minutes et vous permettra de vous déplacer en toute sécurité sur notre site.',
    'intro.video.title': 'Vidéo de bienvenue sécurité',
    'intro.video.duration': '30 secondes',
    'intro.continue': 'Poursuivre la formation',
    
    // Safety course
    'safety.title': 'Parcours Sécurité Interactif',
    'safety.instruction': 'Cliquez sur les zones ci-dessous pour découvrir les règles de sécurité',
    'safety.ppe': 'Port des EPI',
    'safety.ppe.desc': 'Équipements de protection individuelle obligatoires',
    'safety.restricted': 'Zones interdites',
    'safety.restricted.desc': 'Zones d\'accès restreint et de danger',
    'safety.signage': 'Signalisation',
    'safety.signage.desc': 'Panneaux et signalétique de sécurité',
    'safety.progress': 'Progression',
    'safety.continue': 'Passer au QCM',
    'safety.site.view': 'Vue du site industriel',
    'safety.click.instruction': 'Cliquez sur une zone pour afficher les informations de sécurité',
    
    // QCM
    'qcm.title': 'QCM de Validation',
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
    
    // Certificate
    'cert.title': 'Génération du Certificat',
    'cert.subtitle': 'Saisissez vos informations pour générer votre certificat de formation',
    'cert.firstName': 'Prénom',
    'cert.lastName': 'Nom',
    'cert.email': 'E-mail (optionnel)',
    'cert.emailHelp': 'Pour recevoir le certificat par e-mail',
    'cert.generate': 'Générer le certificat',
    'cert.download': 'Télécharger PDF',
    'cert.send': 'Envoyer par e-mail',
    'cert.dashboard': 'Tableau de bord HSE',
    'cert.document.title': 'CERTIFICAT DE FORMATION',
    'cert.document.subtitle': 'Sensibilisation Sécurité',
    'cert.document.certify': 'Nous certifions que',
    'cert.document.success': 'a suivi avec succès la formation de sensibilisation aux règles de sécurité et est autorisé(e) à accéder au site dans le cadre de ses fonctions.',
    'cert.document.date': 'Date de formation',
    'cert.document.score': 'Score obtenu',
    'cert.document.validity': 'Validité',
    'cert.document.months': '12 mois',
    'cert.document.validated': 'Validé ✅',
    'cert.completed': 'Formation terminée !',
    
    // Dashboard
    'dashboard.title': 'Tableau de Bord HSE',
    'dashboard.subtitle': 'Gestion de la formation sécurité',
    'dashboard.visitors.trained': 'Visiteurs formés',
    'dashboard.today.trained': 'Formés aujourd\'hui',
    'dashboard.success.rate': 'Taux de réussite',
    'dashboard.certificates.expiring': 'Certificats à renouveler',
    'dashboard.month.increase': '+12% ce mois',
    'dashboard.daily.target': 'Objectif: 30/jour',
    'dashboard.vs.lastMonth': 'vs mois dernier',
    'dashboard.in.days': 'Dans 7 jours',
    'dashboard.training.chart': 'Formations par jour',
    'dashboard.recent.alerts': 'Alertes récentes',
    'dashboard.progress.profile': 'Progression par profil',
    'dashboard.recent.activity': 'Activité récente',
    'dashboard.name': 'Nom',
    'dashboard.profile': 'Profil',
    'dashboard.score': 'Score',
    'dashboard.time': 'Heure',
    
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.confirm': 'Confirmer',
    'common.cancel': 'Annuler',
    'common.close': 'Fermer',
    'common.save': 'Enregistrer',
    'common.required': 'Obligatoire',
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
    
    // Introduction
    'intro.title': 'Safety Module Introduction',
    'intro.welcome': 'Welcome.',
    'intro.description': 'Before accessing the site, you must complete a short safety awareness training on essential rules.',
    'intro.purpose': 'This will only take a few minutes and will allow you to move safely around our site.',
    'intro.video.title': 'Safety welcome video',
    'intro.video.duration': '30 seconds',
    'intro.continue': 'Continue Training',
    
    // Safety course
    'safety.title': 'Interactive Safety Course',
    'safety.instruction': 'Click on the areas below to discover safety rules',
    'safety.ppe': 'PPE Wearing',
    'safety.ppe.desc': 'Mandatory personal protective equipment',
    'safety.restricted': 'Restricted Areas',
    'safety.restricted.desc': 'Restricted access and danger zones',
    'safety.signage': 'Signage',
    'safety.signage.desc': 'Safety signs and signage',
    'safety.progress': 'Progress',
    'safety.continue': 'Proceed to Quiz',
    'safety.site.view': 'Industrial site view',
    'safety.click.instruction': 'Click on an area to display safety information',
    
    // QCM
    'qcm.title': 'Validation Quiz',
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
    
    // Certificate
    'cert.title': 'Certificate Generation',
    'cert.subtitle': 'Enter your information to generate your training certificate',
    'cert.firstName': 'First Name',
    'cert.lastName': 'Last Name',
    'cert.email': 'Email (optional)',
    'cert.emailHelp': 'To receive the certificate by email',
    'cert.generate': 'Generate certificate',
    'cert.download': 'Download PDF',
    'cert.send': 'Send by email',
    'cert.dashboard': 'HSE Dashboard',
    'cert.document.title': 'TRAINING CERTIFICATE',
    'cert.document.subtitle': 'Safety Awareness',
    'cert.document.certify': 'We certify that',
    'cert.document.success': 'has successfully completed safety awareness training and is authorized to access the site in their professional capacity.',
    'cert.document.date': 'Training date',
    'cert.document.score': 'Score obtained',
    'cert.document.validity': 'Validity',
    'cert.document.months': '12 months',
    'cert.document.validated': 'Validated ✅',
    'cert.completed': 'Training completed!',
    
    // Dashboard
    'dashboard.title': 'HSE Dashboard',
    'dashboard.subtitle': 'Safety training management',
    'dashboard.visitors.trained': 'Visitors trained',
    'dashboard.today.trained': 'Trained today',
    'dashboard.success.rate': 'Success rate',
    'dashboard.certificates.expiring': 'Certificates to renew',
    'dashboard.month.increase': '+12% this month',
    'dashboard.daily.target': 'Target: 30/day',
    'dashboard.vs.lastMonth': 'vs last month',
    'dashboard.in.days': 'In 7 days',
    'dashboard.training.chart': 'Training per day',
    'dashboard.recent.alerts': 'Recent alerts',
    'dashboard.progress.profile': 'Progress by profile',
    'dashboard.recent.activity': 'Recent activity',
    'dashboard.name': 'Name',
    'dashboard.profile': 'Profile',
    'dashboard.score': 'Score',
    'dashboard.time': 'Time',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.confirm': 'Confirm',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.required': 'Required',
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
    
    // Introduction
    'intro.title': 'Einführung in das Sicherheitsmodul',
    'intro.welcome': 'Willkommen.',
    'intro.description': 'Bevor Sie das Gelände betreten, müssen Sie eine kurze Sicherheitsschulung zu den wichtigsten Regeln absolvieren.',
    'intro.purpose': 'Dies dauert nur wenige Minuten und ermöglicht es Ihnen, sich sicher auf unserem Gelände zu bewegen.',
    'intro.video.title': 'Sicherheits-Willkommensvideo',
    'intro.video.duration': '30 Sekunden',
    'intro.continue': 'Schulung fortsetzen',
    
    // Safety course
    'safety.title': 'Interaktiver Sicherheitskurs',
    'safety.instruction': 'Klicken Sie auf die Bereiche unten, um Sicherheitsregeln zu entdecken',
    'safety.ppe': 'PSA-Tragen',
    'safety.ppe.desc': 'Obligatorische persönliche Schutzausrüstung',
    'safety.restricted': 'Sperrgebiete',
    'safety.restricted.desc': 'Bereiche mit eingeschränktem Zugang und Gefahrenzonen',
    'safety.signage': 'Beschilderung',
    'safety.signage.desc': 'Sicherheitsschilder und Beschilderung',
    'safety.progress': 'Fortschritt',
    'safety.continue': 'Zum Quiz',
    'safety.site.view': 'Industriegeländeansicht',
    'safety.click.instruction': 'Klicken Sie auf einen Bereich, um Sicherheitsinformationen anzuzeigen',
    
    // QCM
    'qcm.title': 'Validierungsquiz',
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
    
    // Certificate
    'cert.title': 'Zertifikatserstellung',
    'cert.subtitle': 'Geben Sie Ihre Informationen ein, um Ihr Schulungszertifikat zu erstellen',
    'cert.firstName': 'Vorname',
    'cert.lastName': 'Nachname',
    'cert.email': 'E-Mail (optional)',
    'cert.emailHelp': 'Um das Zertifikat per E-Mail zu erhalten',
    'cert.generate': 'Zertifikat erstellen',
    'cert.download': 'PDF herunterladen',
    'cert.send': 'Per E-Mail senden',
    'cert.dashboard': 'HSE-Dashboard',
    'cert.document.title': 'SCHULUNGSZERTIFIKAT',
    'cert.document.subtitle': 'Sicherheitsbewusstsein',
    'cert.document.certify': 'Wir bescheinigen, dass',
    'cert.document.success': 'hat erfolgreich die Sicherheitsschulung absolviert und ist berechtigt, das Gelände in beruflicher Eigenschaft zu betreten.',
    'cert.document.date': 'Schulungsdatum',
    'cert.document.score': 'Erreichte Punktzahl',
    'cert.document.validity': 'Gültigkeit',
    'cert.document.months': '12 Monate',
    'cert.document.validated': 'Validiert ✅',
    'cert.completed': 'Schulung abgeschlossen!',
    
    // Dashboard
    'dashboard.title': 'HSE-Dashboard',
    'dashboard.subtitle': 'Sicherheitsschulungsmanagement',
    'dashboard.visitors.trained': 'Geschulte Besucher',
    'dashboard.today.trained': 'Heute geschult',
    'dashboard.success.rate': 'Erfolgsquote',
    'dashboard.certificates.expiring': 'Zu erneuernde Zertifikate',
    'dashboard.month.increase': '+12% diesen Monat',
    'dashboard.daily.target': 'Ziel: 30/Tag',
    'dashboard.vs.lastMonth': 'vs letzten Monat',
    'dashboard.in.days': 'In 7 Tagen',
    'dashboard.training.chart': 'Schulungen pro Tag',
    'dashboard.recent.alerts': 'Aktuelle Warnungen',
    'dashboard.progress.profile': 'Fortschritt nach Profil',
    'dashboard.recent.activity': 'Letzte Aktivität',
    'dashboard.name': 'Name',
    'dashboard.profile': 'Profil',
    'dashboard.score': 'Punkte',
    'dashboard.time': 'Zeit',
    
    // Common
    'common.loading': 'Laden...',
    'common.error': 'Fehler',
    'common.success': 'Erfolg',
    'common.confirm': 'Bestätigen',
    'common.cancel': 'Abbrechen',
    'common.close': 'Schließen',
    'common.save': 'Speichern',
    'common.required': 'Erforderlich',
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
    
    // Introduction
    'intro.title': 'Introducción al Módulo de Seguridad',
    'intro.welcome': 'Bienvenido.',
    'intro.description': 'Antes de acceder al sitio, debe completar una breve formación de sensibilización sobre las reglas de seguridad esenciales.',
    'intro.purpose': 'Esto solo tomará unos minutos y le permitirá moverse de manera segura en nuestro sitio.',
    'intro.video.title': 'Video de bienvenida de seguridad',
    'intro.video.duration': '30 segundos',
    'intro.continue': 'Continuar Formación',
    
    // Safety course
    'safety.title': 'Curso de Seguridad Interactivo',
    'safety.instruction': 'Haga clic en las áreas a continuación para descubrir las reglas de seguridad',
    'safety.ppe': 'Uso de EPP',
    'safety.ppe.desc': 'Equipo de protección personal obligatorio',
    'safety.restricted': 'Áreas Restringidas',
    'safety.restricted.desc': 'Zonas de acceso restringido y peligro',
    'safety.signage': 'Señalización',
    'safety.signage.desc': 'Señales y señalización de seguridad',
    'safety.progress': 'Progreso',
    'safety.continue': 'Proceder al Quiz',
    'safety.site.view': 'Vista del sitio industrial',
    'safety.click.instruction': 'Haga clic en un área para mostrar información de seguridad',
    
    // QCM
    'qcm.title': 'Quiz de Validación',
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
    
    // Certificate
    'cert.title': 'Generación de Certificado',
    'cert.subtitle': 'Ingrese su información para generar su certificado de formación',
    'cert.firstName': 'Nombre',
    'cert.lastName': 'Apellido',
    'cert.email': 'Email (opcional)',
    'cert.emailHelp': 'Para recibir el certificado por email',
    'cert.generate': 'Generar certificado',
    'cert.download': 'Descargar PDF',
    'cert.send': 'Enviar por email',
    'cert.dashboard': 'Panel HSE',
    'cert.document.title': 'CERTIFICADO DE FORMACIÓN',
    'cert.document.subtitle': 'Sensibilización de Seguridad',
    'cert.document.certify': 'Certificamos que',
    'cert.document.success': 'ha completado exitosamente la formación de sensibilización de seguridad y está autorizado a acceder al sitio en su capacidad profesional.',
    'cert.document.date': 'Fecha de formación',
    'cert.document.score': 'Puntuación obtenida',
    'cert.document.validity': 'Validez',
    'cert.document.months': '12 meses',
    'cert.document.validated': 'Validado ✅',
    'cert.completed': '¡Formación completada!',
    
    // Dashboard
    'dashboard.title': 'Panel HSE',
    'dashboard.subtitle': 'Gestión de formación en seguridad',
    'dashboard.visitors.trained': 'Visitantes formados',
    'dashboard.today.trained': 'Formados hoy',
    'dashboard.success.rate': 'Tasa de éxito',
    'dashboard.certificates.expiring': 'Certificados a renovar',
    'dashboard.month.increase': '+12% este mes',
    'dashboard.daily.target': 'Objetivo: 30/día',
    'dashboard.vs.lastMonth': 'vs mes pasado',
    'dashboard.in.days': 'En 7 días',
    'dashboard.training.chart': 'Formaciones por día',
    'dashboard.recent.alerts': 'Alertas recientes',
    'dashboard.progress.profile': 'Progreso por perfil',
    'dashboard.recent.activity': 'Actividad reciente',
    'dashboard.name': 'Nombre',
    'dashboard.profile': 'Perfil',
    'dashboard.score': 'Puntuación',
    'dashboard.time': 'Hora',
    
    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.confirm': 'Confirmar',
    'common.cancel': 'Cancelar',
    'common.close': 'Cerrar',
    'common.save': 'Guardar',
    'common.required': 'Requerido',
  },
  
  it: {
    // Navigation
    'nav.back': 'Indietro',
    'nav.next': 'Avanti',
    'nav.continue': 'Continua',
    'nav.finish': 'Termina',
    'nav.start': 'Inizia',
    
    // Home page
    'home.title': 'Centro di Formazione Sicurezza',
    'home.subtitle': 'Sensibilizzazione interattiva alla sicurezza',
    'home.description': 'Prima di accedere al sito, devi completare una breve formazione sulle regole di sicurezza essenziali.',
    'home.startButton': 'Inizia Formazione',
    'home.duration': 'Durata stimata: 5-10 minuti',
    
    // Profile selection
    'profile.title': 'Seleziona il tuo profilo',
    'profile.subtitle': 'Scegli il profilo che meglio corrisponde alla tua visita',
    'profile.instruction': 'Clicca sul tuo profilo per continuare',
    'profile.driver': 'Autista-Consegnatario',
    'profile.driver.desc': 'Consegne, carico/scarico',
    'profile.technician': 'Appaltatore Tecnico',
    'profile.technician.desc': 'Manutenzione, riparazioni, installazioni',
    'profile.cleaning': 'Addetto alle Pulizie',
    'profile.cleaning.desc': 'Manutenzione, pulizia degli spazi',
    'profile.administrative': 'Visitatore Amministrativo',
    'profile.administrative.desc': 'Riunioni, ispezioni, audit',
    'profile.selected': 'Selezionato',
    'profile.step': 'Passaggio 1 di 5',
    
    // Introduction
    'intro.title': 'Introduzione al Modulo Sicurezza',
    'intro.welcome': 'Benvenuto.',
    'intro.description': 'Prima di accedere al sito, devi completare una breve formazione di sensibilizzazione sulle regole di sicurezza essenziali.',
    'intro.purpose': 'Ci vorranno solo pochi minuti e ti permetterà di muoverti in sicurezza nel nostro sito.',
    'intro.video.title': 'Video di benvenuto sicurezza',
    'intro.video.duration': '30 secondi',
    'intro.continue': 'Continua Formazione',
    
    // Safety course
    'safety.title': 'Corso di Sicurezza Interattivo',
    'safety.instruction': 'Clicca sulle aree sottostanti per scoprire le regole di sicurezza',
    'safety.ppe': 'Uso DPI',
    'safety.ppe.desc': 'Dispositivi di protezione individuale obbligatori',
    'safety.restricted': 'Aree Riservate',
    'safety.restricted.desc': 'Zone ad accesso limitato e pericolose',
    'safety.signage': 'Segnaletica',
    'safety.signage.desc': 'Cartelli e segnaletica di sicurezza',
    'safety.progress': 'Progresso',
    'safety.continue': 'Procedi al Quiz',
    'safety.site.view': 'Vista del sito industriale',
    'safety.click.instruction': 'Clicca su un\'area per visualizzare le informazioni di sicurezza',
    
    // QCM
    'qcm.title': 'Quiz di Validazione',
    'qcm.question': 'Domanda',
    'qcm.of': 'di',
    'qcm.correct': 'Risposta corretta!',
    'qcm.incorrect': 'Risposta incorretta',
    'qcm.correctAnswer': 'La risposta corretta era:',
    'qcm.finished': 'Quiz Completato!',
    'qcm.score': 'Punteggio:',
    'qcm.passed': 'Congratulazioni! Hai completato con successo la formazione.',
    'qcm.failed': 'Punteggio insufficiente. Raccomandiamo di rivedere la formazione.',
    'qcm.certificate': 'Genera certificato',
    
    // Certificate
    'cert.title': 'Generazione Certificato',
    'cert.subtitle': 'Inserisci le tue informazioni per generare il tuo certificato di formazione',
    'cert.firstName': 'Nome',
    'cert.lastName': 'Cognome',
    'cert.email': 'Email (opzionale)',
    'cert.emailHelp': 'Per ricevere il certificato via email',
    'cert.generate': 'Genera certificato',
    'cert.download': 'Scarica PDF',
    'cert.send': 'Invia via email',
    'cert.dashboard': 'Dashboard HSE',
    'cert.document.title': 'CERTIFICATO DI FORMAZIONE',
    'cert.document.subtitle': 'Sensibilizzazione alla Sicurezza',
    'cert.document.certify': 'Certifichiamo che',
    'cert.document.success': 'ha completato con successo la formazione di sensibilizzazione alla sicurezza ed è autorizzato ad accedere al sito nella sua capacità professionale.',
    'cert.document.date': 'Data di formazione',
    'cert.document.score': 'Punteggio ottenuto',
    'cert.document.validity': 'Validità',
    'cert.document.months': '12 mesi',
    'cert.document.validated': 'Validato ✅',
    'cert.completed': 'Formazione completata!',
    
    // Dashboard
    'dashboard.title': 'Dashboard HSE',
    'dashboard.subtitle': 'Gestione formazione sicurezza',
    'dashboard.visitors.trained': 'Visitatori formati',
    'dashboard.today.trained': 'Formati oggi',
    'dashboard.success.rate': 'Tasso di successo',
    'dashboard.certificates.expiring': 'Certificati da rinnovare',
    'dashboard.month.increase': '+12% questo mese',
    'dashboard.daily.target': 'Obiettivo: 30/giorno',
    'dashboard.vs.lastMonth': 'vs mese scorso',
    'dashboard.in.days': 'In 7 giorni',
    'dashboard.training.chart': 'Formazioni per giorno',
    'dashboard.recent.alerts': 'Avvisi recenti',
    'dashboard.progress.profile': 'Progresso per profilo',
    'dashboard.recent.activity': 'Attività recente',
    'dashboard.name': 'Nome',
    'dashboard.profile': 'Profilo',
    'dashboard.score': 'Punteggio',
    'dashboard.time': 'Ora',
    
    // Common
    'common.loading': 'Caricamento...',
    'common.error': 'Errore',
    'common.success': 'Successo',
    'common.confirm': 'Conferma',
    'common.cancel': 'Annulla',
    'common.close': 'Chiudi',
    'common.save': 'Salva',
    'common.required': 'Obbligatorio',
  },
  
  pt: {
    // Navigation
    'nav.back': 'Voltar',
    'nav.next': 'Próximo',
    'nav.continue': 'Continuar',
    'nav.finish': 'Finalizar',
    'nav.start': 'Começar',
    
    // Home page
    'home.title': 'Centro de Formação em Segurança',
    'home.subtitle': 'Sensibilização interativa para segurança',
    'home.description': 'Antes de acessar o local, você deve completar um breve treinamento sobre as regras essenciais de segurança.',
    'home.startButton': 'Começar Treinamento',
    'home.duration': 'Duração estimada: 5-10 minutos',
    
    // Profile selection
    'profile.title': 'Selecione seu perfil',
    'profile.subtitle': 'Escolha o perfil que melhor corresponde à sua visita',
    'profile.instruction': 'Clique no seu perfil para continuar',
    'profile.driver': 'Motorista-Entregador',
    'profile.driver.desc': 'Entregas, carregamento/descarregamento',
    'profile.technician': 'Contratado Técnico',
    'profile.technician.desc': 'Manutenção, reparos, instalações',
    'profile.cleaning': 'Agente de Limpeza',
    'profile.cleaning.desc': 'Manutenção, limpeza de espaços',
    'profile.administrative': 'Visitante Administrativo',
    'profile.administrative.desc': 'Reuniões, inspeções, auditorias',
    'profile.selected': 'Selecionado',
    'profile.step': 'Etapa 1 de 5',
    
    // Introduction
    'intro.title': 'Introdução ao Módulo de Segurança',
    'intro.welcome': 'Bem-vindo.',
    'intro.description': 'Antes de acessar o local, você deve completar um breve treinamento de conscientização sobre as regras essenciais de segurança.',
    'intro.purpose': 'Isso levará apenas alguns minutos e permitirá que você se mova com segurança em nosso local.',
    'intro.video.title': 'Vídeo de boas-vindas de segurança',
    'intro.video.duration': '30 segundos',
    'intro.continue': 'Continuar Treinamento',
    
    // Safety course
    'safety.title': 'Curso de Segurança Interativo',
    'safety.instruction': 'Clique nas áreas abaixo para descobrir as regras de segurança',
    'safety.ppe': 'Uso de EPI',
    'safety.ppe.desc': 'Equipamentos de proteção individual obrigatórios',
    'safety.restricted': 'Áreas Restritas',
    'safety.restricted.desc': 'Zonas de acesso restrito e perigo',
    'safety.signage': 'Sinalização',
    'safety.signage.desc': 'Placas e sinalização de segurança',
    'safety.progress': 'Progresso',
    'safety.continue': 'Prosseguir para o Quiz',
    'safety.site.view': 'Vista do local industrial',
    'safety.click.instruction': 'Clique em uma área para exibir informações de segurança',
    
    // QCM
    'qcm.title': 'Quiz de Validação',
    'qcm.question': 'Pergunta',
    'qcm.of': 'de',
    'qcm.correct': 'Resposta correta!',
    'qcm.incorrect': 'Resposta incorreta',
    'qcm.correctAnswer': 'A resposta correta era:',
    'qcm.finished': 'Quiz Concluído!',
    'qcm.score': 'Pontuação:',
    'qcm.passed': 'Parabéns! Você completou com sucesso o treinamento.',
    'qcm.failed': 'Pontuação insuficiente. Recomendamos revisar o treinamento.',
    'qcm.certificate': 'Gerar certificado',
    
    // Certificate
    'cert.title': 'Geração de Certificado',
    'cert.subtitle': 'Digite suas informações para gerar seu certificado de treinamento',
    'cert.firstName': 'Nome',
    'cert.lastName': 'Sobrenome',
    'cert.email': 'Email (opcional)',
    'cert.emailHelp': 'Para receber o certificado por email',
    'cert.generate': 'Gerar certificado',
    'cert.download': 'Baixar PDF',
    'cert.send': 'Enviar por email',
    'cert.dashboard': 'Painel HSE',
    'cert.document.title': 'CERTIFICADO DE TREINAMENTO',
    'cert.document.subtitle': 'Conscientização em Segurança',
    'cert.document.certify': 'Certificamos que',
    'cert.document.success': 'completou com sucesso o treinamento de conscientização em segurança e está autorizado a acessar o local em sua capacidade profissional.',
    'cert.document.date': 'Data do treinamento',
    'cert.document.score': 'Pontuação obtida',
    'cert.document.validity': 'Validade',
    'cert.document.months': '12 meses',
    'cert.document.validated': 'Validado ✅',
    'cert.completed': 'Treinamento concluído!',
    
    // Dashboard
    'dashboard.title': 'Painel HSE',
    'dashboard.subtitle': 'Gestão de treinamento em segurança',
    'dashboard.visitors.trained': 'Visitantes treinados',
    'dashboard.today.trained': 'Treinados hoje',
    'dashboard.success.rate': 'Taxa de sucesso',
    'dashboard.certificates.expiring': 'Certificados a renovar',
    'dashboard.month.increase': '+12% este mês',
    'dashboard.daily.target': 'Meta: 30/dia',
    'dashboard.vs.lastMonth': 'vs mês passado',
    'dashboard.in.days': 'Em 7 dias',
    'dashboard.training.chart': 'Treinamentos por dia',
    'dashboard.recent.alerts': 'Alertas recentes',
    'dashboard.progress.profile': 'Progresso por perfil',
    'dashboard.recent.activity': 'Atividade recente',
    'dashboard.name': 'Nome',
    'dashboard.profile': 'Perfil',
    'dashboard.score': 'Pontuação',
    'dashboard.time': 'Hora',
    
    // Common
    'common.loading': 'Carregando...',
    'common.error': 'Erro',
    'common.success': 'Sucesso',
    'common.confirm': 'Confirmar',
    'common.cancel': 'Cancelar',
    'common.close': 'Fechar',
    'common.save': 'Salvar',
    'common.required': 'Obrigatório',
  },
  
  nl: {
    // Navigation
    'nav.back': 'Terug',
    'nav.next': 'Volgende',
    'nav.continue': 'Doorgaan',
    'nav.finish': 'Voltooien',
    'nav.start': 'Start',
    
    // Home page
    'home.title': 'Veiligheidstrainingscentrum',
    'home.subtitle': 'Interactieve veiligheidsbewustwording',
    'home.description': 'Voordat u de locatie betreedt, moet u een korte training over essentiële veiligheidsregels voltooien.',
    'home.startButton': 'Training Starten',
    'home.duration': 'Geschatte duur: 5-10 minuten',
    
    // Profile selection
    'profile.title': 'Selecteer uw profiel',
    'profile.subtitle': 'Kies het profiel dat het beste past bij uw bezoek',
    'profile.instruction': 'Klik op uw profiel om door te gaan',
    'profile.driver': 'Chauffeur-Bezorger',
    'profile.driver.desc': 'Leveringen, laden/lossen',
    'profile.technician': 'Technische Aannemer',
    'profile.technician.desc': 'Onderhoud, reparaties, installaties',
    'profile.cleaning': 'Schoonmaakmedewerker',
    'profile.cleaning.desc': 'Onderhoud, ruimte schoonmaken',
    'profile.administrative': 'Administratieve Bezoeker',
    'profile.administrative.desc': 'Vergaderingen, inspecties, audits',
    'profile.selected': 'Geselecteerd',
    'profile.step': 'Stap 1 van 5',
    
    // Introduction
    'intro.title': 'Introductie Veiligheidsmodule',
    'intro.welcome': 'Welkom.',
    'intro.description': 'Voordat u de locatie betreedt, moet u een korte bewustwordingstraining over essentiële veiligheidsregels voltooien.',
    'intro.purpose': 'Dit duurt slechts enkele minuten en stelt u in staat veilig te bewegen op onze locatie.',
    'intro.video.title': 'Veiligheid welkomstvideo',
    'intro.video.duration': '30 seconden',
    'intro.continue': 'Training Voortzetten',
    
    // Safety course
    'safety.title': 'Interactieve Veiligheidscursus',
    'safety.instruction': 'Klik op de gebieden hieronder om veiligheidsregels te ontdekken',
    'safety.ppe': 'PBM Dragen',
    'safety.ppe.desc': 'Verplichte persoonlijke beschermingsmiddelen',
    'safety.restricted': 'Beperkte Gebieden',
    'safety.restricted.desc': 'Zones met beperkte toegang en gevaar',
    'safety.signage': 'Bewegwijzering',
    'safety.signage.desc': 'Veiligheidsborden en bewegwijzering',
    'safety.progress': 'Voortgang',
    'safety.continue': 'Doorgaan naar Quiz',
    'safety.site.view': 'Industriële locatie weergave',
    'safety.click.instruction': 'Klik op een gebied om veiligheidsinformatie weer te geven',
    
    // QCM
    'qcm.title': 'Validatie Quiz',
    'qcm.question': 'Vraag',
    'qcm.of': 'van',
    'qcm.correct': 'Correct antwoord!',
    'qcm.incorrect': 'Incorrect antwoord',
    'qcm.correctAnswer': 'Het juiste antwoord was:',
    'qcm.finished': 'Quiz Voltooid!',
    'qcm.score': 'Score:',
    'qcm.passed': 'Gefeliciteerd! U heeft de training succesvol voltooid.',
    'qcm.failed': 'Onvoldoende score. Wij raden aan de training te herhalen.',
    'qcm.certificate': 'Certificaat genereren',
    
    // Certificate
    'cert.title': 'Certificaat Generatie',
    'cert.subtitle': 'Voer uw informatie in om uw trainingscertificaat te genereren',
    'cert.firstName': 'Voornaam',
    'cert.lastName': 'Achternaam',
    'cert.email': 'Email (optioneel)',
    'cert.emailHelp': 'Om het certificaat per email te ontvangen',
    'cert.generate': 'Certificaat genereren',
    'cert.download': 'PDF downloaden',
    'cert.send': 'Versturen per email',
    'cert.dashboard': 'HSE Dashboard',
    'cert.document.title': 'TRAININGSCERTIFICAAT',
    'cert.document.subtitle': 'Veiligheidsbewustzijn',
    'cert.document.certify': 'Wij certificeren dat',
    'cert.document.success': 'heeft de veiligheidsbewustwordingstraining succesvol voltooid en is geautoriseerd om de locatie te betreden in hun professionele hoedanigheid.',
    'cert.document.date': 'Trainingsdatum',
    'cert.document.score': 'Behaalde score',
    'cert.document.validity': 'Geldigheid',
    'cert.document.months': '12 maanden',
    'cert.document.validated': 'Gevalideerd ✅',
    'cert.completed': 'Training voltooid!',
    
    // Dashboard
    'dashboard.title': 'HSE Dashboard',
    'dashboard.subtitle': 'Veiligheidstraining management',
    'dashboard.visitors.trained': 'Getrainde bezoekers',
    'dashboard.today.trained': 'Vandaag getraind',
    'dashboard.success.rate': 'Succespercentage',
    'dashboard.certificates.expiring': 'Te vernieuwen certificaten',
    'dashboard.month.increase': '+12% deze maand',
    'dashboard.daily.target': 'Doel: 30/dag',
    'dashboard.vs.lastMonth': 'vs vorige maand',
    'dashboard.in.days': 'In 7 dagen',
    'dashboard.training.chart': 'Trainingen per dag',
    'dashboard.recent.alerts': 'Recente waarschuwingen',
    'dashboard.progress.profile': 'Voortgang per profiel',
    'dashboard.recent.activity': 'Recente activiteit',
    'dashboard.name': 'Naam',
    'dashboard.profile': 'Profiel',
    'dashboard.score': 'Score',
    'dashboard.time': 'Tijd',
    
    // Common
    'common.loading': 'Laden...',
    'common.error': 'Fout',
    'common.success': 'Succes',
    'common.confirm': 'Bevestigen',
    'common.cancel': 'Annuleren',
    'common.close': 'Sluiten',
    'common.save': 'Opslaan',
    'common.required': 'Verplicht',
  },
  
  pl: {
    // Navigation
    'nav.back': 'Wstecz',
    'nav.next': 'Dalej',
    'nav.continue': 'Kontynuuj',
    'nav.finish': 'Zakończ',
    'nav.start': 'Start',
    
    // Home page
    'home.title': 'Centrum Szkolenia BHP',
    'home.subtitle': 'Interaktywne uświadamianie bezpieczeństwa',
    'home.description': 'Przed dostępem do miejsca, musisz ukończyć krótkie szkolenie z podstawowych zasad bezpieczeństwa.',
    'home.startButton': 'Rozpocznij Szkolenie',
    'home.duration': 'Szacowany czas: 5-10 minut',
    
    // Profile selection
    'profile.title': 'Wybierz swój profil',
    'profile.subtitle': 'Wybierz profil najlepiej odpowiadający Twojej wizycie',
    'profile.instruction': 'Kliknij na swój profil, aby kontynuować',
    'profile.driver': 'Kierowca-Dostawca',
    'profile.driver.desc': 'Dostawy, załadunek/rozładunek',
    'profile.technician': 'Wykonawca Techniczny',
    'profile.technician.desc': 'Konserwacja, naprawy, instalacje',
    'profile.cleaning': 'Pracownik Sprzątający',
    'profile.cleaning.desc': 'Konserwacja, sprzątanie pomieszczeń',
    'profile.administrative': 'Gość Administracyjny',
    'profile.administrative.desc': 'Spotkania, inspekcje, audyty',
    'profile.selected': 'Wybrano',
    'profile.step': 'Krok 1 z 5',
    
    // Introduction
    'intro.title': 'Wprowadzenie do Modułu Bezpieczeństwa',
    'intro.welcome': 'Witamy.',
    'intro.description': 'Przed dostępem do miejsca, musisz ukończyć krótkie szkolenie uświadamiające o podstawowych zasadach bezpieczeństwa.',
    'intro.purpose': 'To zajmie tylko kilka minut i pozwoli Ci bezpiecznie poruszać się po naszym terenie.',
    'intro.video.title': 'Film powitalny bezpieczeństwa',
    'intro.video.duration': '30 sekund',
    'intro.continue': 'Kontynuuj Szkolenie',
    
    // Safety course
    'safety.title': 'Interaktywny Kurs Bezpieczeństwa',
    'safety.instruction': 'Kliknij na obszary poniżej, aby poznać zasady bezpieczeństwa',
    'safety.ppe': 'Noszenie ŚOI',
    'safety.ppe.desc': 'Obowiązkowe środki ochrony indywidualnej',
    'safety.restricted': 'Obszary Ograniczone',
    'safety.restricted.desc': 'Strefy ograniczonego dostępu i niebezpieczeństwa',
    'safety.signage': 'Oznakowanie',
    'safety.signage.desc': 'Znaki i oznakowanie bezpieczeństwa',
    'safety.progress': 'Postęp',
    'safety.continue': 'Przejdź do Quizu',
    'safety.site.view': 'Widok miejsca przemysłowego',
    'safety.click.instruction': 'Kliknij na obszar, aby wyświetlić informacje o bezpieczeństwie',
    
    // QCM
    'qcm.title': 'Quiz Walidacyjny',
    'qcm.question': 'Pytanie',
    'qcm.of': 'z',
    'qcm.correct': 'Poprawna odpowiedź!',
    'qcm.incorrect': 'Niepoprawna odpowiedź',
    'qcm.correctAnswer': 'Poprawna odpowiedź to:',
    'qcm.finished': 'Quiz Ukończony!',
    'qcm.score': 'Wynik:',
    'qcm.passed': 'Gratulacje! Pomyślnie ukończyłeś szkolenie.',
    'qcm.failed': 'Niewystarczający wynik. Zalecamy ponowne przejrzenie szkolenia.',
    'qcm.certificate': 'Generuj certyfikat',
    
    // Certificate
    'cert.title': 'Generowanie Certyfikatu',
    'cert.subtitle': 'Wprowadź swoje dane, aby wygenerować certyfikat szkolenia',
    'cert.firstName': 'Imię',
    'cert.lastName': 'Nazwisko',
    'cert.email': 'Email (opcjonalnie)',
    'cert.emailHelp': 'Aby otrzymać certyfikat przez email',
    'cert.generate': 'Generuj certyfikat',
    'cert.download': 'Pobierz PDF',
    'cert.send': 'Wyślij przez email',
    'cert.dashboard': 'Panel BHP',
    'cert.document.title': 'CERTYFIKAT SZKOLENIA',
    'cert.document.subtitle': 'Uświadamianie Bezpieczeństwa',
    'cert.document.certify': 'Certyfikujemy, że',
    'cert.document.success': 'pomyślnie ukończył szkolenie uświadamiające bezpieczeństwa i jest upoważniony do dostępu do miejsca w swoim zawodowym charakterze.',
    'cert.document.date': 'Data szkolenia',
    'cert.document.score': 'Uzyskany wynik',
    'cert.document.validity': 'Ważność',
    'cert.document.months': '12 miesięcy',
    'cert.document.validated': 'Zwalidowano ✅',
    'cert.completed': 'Szkolenie ukończone!',
    
    // Dashboard
    'dashboard.title': 'Panel BHP',
    'dashboard.subtitle': 'Zarządzanie szkoleniem bezpieczeństwa',
    'dashboard.visitors.trained': 'Przeszkoleni goście',
    'dashboard.today.trained': 'Przeszkoleni dzisiaj',
    'dashboard.success.rate': 'Wskaźnik sukcesu',
    'dashboard.certificates.expiring': 'Certyfikaty do odnowienia',
    'dashboard.month.increase': '+12% w tym miesiącu',
    'dashboard.daily.target': 'Cel: 30/dzień',
    'dashboard.vs.lastMonth': 'vs poprzedni miesiąc',
    'dashboard.in.days': 'Za 7 dni',
    'dashboard.training.chart': 'Szkolenia dziennie',
    'dashboard.recent.alerts': 'Ostatnie alerty',
    'dashboard.progress.profile': 'Postęp według profilu',
    'dashboard.recent.activity': 'Ostatnia aktywność',
    'dashboard.name': 'Nazwa',
    'dashboard.profile': 'Profil',
    'dashboard.score': 'Wynik',
    'dashboard.time': 'Czas',
    
    // Common
    'common.loading': 'Ładowanie...',
    'common.error': 'Błąd',
    'common.success': 'Sukces',
    'common.confirm': 'Potwierdź',
    'common.cancel': 'Anuluj',
    'common.close': 'Zamknij',
    'common.save': 'Zapisz',
    'common.required': 'Wymagane',
  },
  
  ar: {
    // Navigation
    'nav.back': 'رجوع',
    'nav.next': 'التالي',
    'nav.continue': 'متابعة',
    'nav.finish': 'إنهاء',
    'nav.start': 'بدء',
    
    // Home page
    'home.title': 'مركز التدريب على السلامة',
    'home.subtitle': 'توعية السلامة التفاعلية',
    'home.description': 'قبل الوصول إلى الموقع، يجب عليك إكمال تدريب قصير على قواعد السلامة الأساسية.',
    'home.startButton': 'بدء التدريب',
    'home.duration': 'المدة المقدرة: 5-10 دقائق',
    
    // Profile selection
    'profile.title': 'اختر ملفك الشخصي',
    'profile.subtitle': 'اختر الملف الشخصي الذي يناسب زيارتك بشكل أفضل',
    'profile.instruction': 'انقر على ملفك الشخصي للمتابعة',
    'profile.driver': 'سائق-موصل',
    'profile.driver.desc': 'التوصيل، التحميل/التفريغ',
    'profile.technician': 'متعاقد تقني',
    'profile.technician.desc': 'الصيانة، الإصلاحات، التركيبات',
    'profile.cleaning': 'عامل النظافة',
    'profile.cleaning.desc': 'الصيانة، تنظيف المساحات',
    'profile.administrative': 'زائر إداري',
    'profile.administrative.desc': 'الاجتماعات، التفتيش، المراجعة',
    'profile.selected': 'محدد',
    'profile.step': 'الخطوة 1 من 5',
    
    // Introduction
    'intro.title': 'مقدمة لوحدة السلامة',
    'intro.welcome': 'مرحباً.',
    'intro.description': 'قبل الوصول إلى الموقع، يجب عليك إكمال تدريب قصير للتوعية حول قواعد السلامة الأساسية.',
    'intro.purpose': 'هذا سيستغرق بضع دقائق فقط وسيسمح لك بالتحرك بأمان في موقعنا.',
    'intro.video.title': 'فيديو ترحيب السلامة',
    'intro.video.duration': '30 ثانية',
    'intro.continue': 'متابعة التدريب',
    
    // Safety course
    'safety.title': 'دورة السلامة التفاعلية',
    'safety.instruction': 'انقر على المناطق أدناه لاكتشاف قواعد السلامة',
    'safety.ppe': 'ارتداء معدات الحماية الشخصية',
    'safety.ppe.desc': 'معدات الحماية الشخصية الإلزامية',
    'safety.restricted': 'المناطق المحظورة',
    'safety.restricted.desc': 'مناطق الوصول المقيد والخطر',
    'safety.signage': 'اللافتات',
    'safety.signage.desc': 'علامات ولافتات السلامة',
    'safety.progress': 'التقدم',
    'safety.continue': 'المتابعة إلى الاختبار',
    'safety.site.view': 'عرض الموقع الصناعي',
    'safety.click.instruction': 'انقر على منطقة لعرض معلومات السلامة',
    
    // QCM
    'qcm.title': 'اختبار التحقق',
    'qcm.question': 'سؤال',
    'qcm.of': 'من',
    'qcm.correct': 'إجابة صحيحة!',
    'qcm.incorrect': 'إجابة خاطئة',
    'qcm.correctAnswer': 'الإجابة الصحيحة كانت:',
    'qcm.finished': 'الاختبار مكتمل!',
    'qcm.score': 'النتيجة:',
    'qcm.passed': 'تهانينا! لقد أكملت التدريب بنجاح.',
    'qcm.failed': 'نتيجة غير كافية. نوصي بمراجعة التدريب.',
    'qcm.certificate': 'إنشاء الشهادة',
    
    // Certificate
    'cert.title': 'إنشاء الشهادة',
    'cert.subtitle': 'أدخل معلوماتك لإنشاء شهادة التدريب الخاصة بك',
    'cert.firstName': 'الاسم الأول',
    'cert.lastName': 'اسم العائلة',
    'cert.email': 'البريد الإلكتروني (اختياري)',
    'cert.emailHelp': 'لاستلام الشهادة عبر البريد الإلكتروني',
    'cert.generate': 'إنشاء الشهادة',
    'cert.download': 'تحميل PDF',
    'cert.send': 'إرسال عبر البريد الإلكتروني',
    'cert.dashboard': 'لوحة معلومات السلامة والصحة المهنية',
    'cert.document.title': 'شهادة التدريب',
    'cert.document.subtitle': 'توعية السلامة',
    'cert.document.certify': 'نشهد أن',
    'cert.document.success': 'قد أكمل بنجاح تدريب توعية السلامة ومخول للوصول إلى الموقع في صفته المهنية.',
    'cert.document.date': 'تاريخ التدريب',
    'cert.document.score': 'النتيجة المحققة',
    'cert.document.validity': 'الصالحية',
    'cert.document.months': '12 شهراً',
    'cert.document.validated': 'مصدق ✅',
    'cert.completed': 'التدريب مكتمل!',
    
    // Dashboard
    'dashboard.title': 'لوحة معلومات السلامة والصحة المهنية',
    'dashboard.subtitle': 'إدارة تدريب السلامة',
    'dashboard.visitors.trained': 'الزوار المدربون',
    'dashboard.today.trained': 'المدربون اليوم',
    'dashboard.success.rate': 'معدل النجاح',
    'dashboard.certificates.expiring': 'الشهادات المطلوب تجديدها',
    'dashboard.month.increase': '+12% هذا الشهر',
    'dashboard.daily.target': 'الهدف: 30/يوم',
    'dashboard.vs.lastMonth': 'مقابل الشهر الماضي',
    'dashboard.in.days': 'خلال 7 أيام',
    'dashboard.training.chart': 'التدريبات يومياً',
    'dashboard.recent.alerts': 'التنبيهات الأخيرة',
    'dashboard.progress.profile': 'التقدم حسب الملف الشخصي',
    'dashboard.recent.activity': 'النشاط الأخير',
    'dashboard.name': 'الاسم',
    'dashboard.profile': 'الملف الشخصي',
    'dashboard.score': 'النتيجة',
    'dashboard.time': 'الوقت',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.confirm': 'تأكيد',
    'common.cancel': 'إلغاء',
    'common.close': 'إغلاق',
    'common.save': 'حفظ',
    'common.required': 'مطلوب',
  },
};