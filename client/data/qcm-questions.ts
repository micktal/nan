export interface QCMQuestion {
  id: number;
  question: {
    fr: string;
    en: string;
    de: string;
    es: string;
  };
  options: {
    fr: string[];
    en: string[];
    de: string[];
    es: string[];
  };
  correct: number;
  profiles?: string[]; // If specified, only show for these profiles
  explanation?: {
    fr: string;
    en: string;
    de: string;
    es: string;
  };
}

// Base questions for all profiles
export const baseQuestions: QCMQuestion[] = [
  {
    id: 1,
    question: {
      fr: "Quels équipements sont obligatoires en zone de chargement ?",
      en: "What equipment is mandatory in the loading area?",
      de: "Welche Ausrüstung ist im Ladebereich obligatorisch?",
      es: "¿Qué equipo es obligatorio en el área de carga?",
      it: "Quali attrezzature sono obbligatorie nell'area di carico?",
      pt: "Que equipamento é obrigatório na área de carregamento?",
      nl: "Welke uitrusting is verplicht in het laadgebied?",
      pl: "Jaki sprzęt jest obowiązkowy w strefie załadunku?",
      ar: "ما المعدات الإجبارية في منطقة التحميل؟"
    },
    options: {
      fr: [
        "Gilet haute visibilité, chaussures de sécurité",
        "Casque uniquement",
        "Gants de travail seulement",
        "Aucun équipement spécifique"
      ],
      en: [
        "High-visibility vest, safety shoes",
        "Helmet only",
        "Work gloves only",
        "No specific equipment"
      ],
      de: [
        "Warnweste, Sicherheitsschuhe",
        "Nur Helm",
        "Nur Arbeitshandschuhe",
        "Keine spezielle Ausrüstung"
      ],
      es: [
        "Chaleco de alta visibilidad, zapatos de seguridad",
        "Solo casco",
        "Solo guantes de trabajo",
        "Ningún equipo específico"
      ],
      it: [
        "Gilet ad alta visibilità, scarpe di sicurezza",
        "Solo casco",
        "Solo guanti da lavoro",
        "Nessun equipaggiamento specifico"
      ],
      pt: [
        "Colete de alta visibilidade, sapatos de segurança",
        "Apenas capacete",
        "Apenas luvas de trabalho",
        "Nenhum equipamento específico"
      ],
      nl: [
        "Hoge zichtbaarheidsvest, veiligheidsschoenen",
        "Alleen helm",
        "Alleen werkhandschoenen",
        "Geen specifieke uitrusting"
      ],
      pl: [
        "Kamizelka odblaskowa, buty robocze",
        "Tylko hełm",
        "Tylko rękawice robocze",
        "Brak specjalnego sprzętu"
      ],
      ar: [
        "سترة عالية الوضوح، أحذية أمان",
        "خوذة فقط",
        "قفازات عمل فقط",
        "لا توجد معدات محددة"
      ]
    },
    correct: 0,
    explanation: {
      fr: "Le gilet haute visibilité et les chaussures de sécurité sont obligatoires pour être visible et protégé.",
      en: "High-visibility vest and safety shoes are mandatory to be visible and protected.",
      de: "Warnweste und Sicherheitsschuhe sind obligatorisch für Sichtbarkeit und Schutz.",
      es: "El chaleco de alta visibilidad y los zapatos de seguridad son obligatorios para ser visible y protegido."
    }
  },
  {
    id: 2,
    question: {
      fr: "Que devez-vous faire en cas d'urgence ?",
      en: "What should you do in case of emergency?",
      de: "Was sollten Sie im Notfall tun?",
      es: "¿Qué debe hacer en caso de emergencia?",
      it: "Cosa dovresti fare in caso di emergenza?",
      pt: "O que você deve fazer em caso de emergência?",
      nl: "Wat moet je doen in geval van nood?",
      pl: "Co powinieneś zrobić w przypadku nagłej sytuacji?",
      ar: "ماذا يجب أن تفعل في حالة الطوارئ؟"
    },
    options: {
      fr: [
        "Continuer votre travail",
        "Suivre les consignes d'évacuation",
        "Attendre les instructions",
        "Quitter immédiatement sans prévenir"
      ],
      en: [
        "Continue your work",
        "Follow evacuation procedures",
        "Wait for instructions",
        "Leave immediately without notice"
      ],
      de: [
        "Ihre Arbeit fortsetzen",
        "Evakuierungsverfahren befolgen",
        "Auf Anweisungen warten",
        "Sofort ohne Benachrichtigung verlassen"
      ],
      es: [
        "Continuar su trabajo",
        "Seguir los procedimientos de evacuación",
        "Esperar instrucciones",
        "Salir inmediatamente sin avisar"
      ],
      it: [
        "Continuare il tuo lavoro",
        "Seguire le procedure di evacuazione",
        "Aspettare istruzioni",
        "Uscire immediatamente senza avvisare"
      ],
      pt: [
        "Continuar seu trabalho",
        "Seguir os procedimentos de evacuação",
        "Aguardar instruções",
        "Sair imediatamente sem avisar"
      ],
      nl: [
        "Je werk voortzetten",
        "Evacuatieprocedures volgen",
        "Wachten op instructies",
        "Onmiddellijk vertrekken zonder waarschuwing"
      ],
      pl: [
        "Kontynuować pracę",
        "Postępować zgodnie z procedurami ewakuacji",
        "Czekać na instrukcje",
        "Natychmiast wyjść bez powiadamiania"
      ],
      ar: [
        "م��اصلة عملك",
        "اتباع إجراءات الإخلاء",
        "انتظار التعليمات",
        "الخروج فوراً دون إشعار"
      ]
    },
    correct: 1,
    explanation: {
      fr: "En cas d'urgence, il faut toujours suivre les consignes d'évacuation établies.",
      en: "In case of emergency, always follow established evacuation procedures.",
      de: "Im Notfall immer die festgelegten Evakuierungsverfahren befolgen.",
      es: "En caso de emergencia, siempre seguir los procedimientos de evacuación establecidos."
    }
  },
  {
    id: 3,
    question: {
      fr: "Dans quelles zones la vitesse est-elle limitée ?",
      en: "In which areas is speed limited?",
      de: "In welchen Bereichen ist die Geschwindigkeit begrenzt?",
      es: "¿En qué áreas está limitada la velocidad?"
    },
    options: {
      fr: [
        "Uniquement dans les parkings",
        "Partout sur le site",
        "Seulement près des bâtiments",
        "Aucune limitation"
      ],
      en: [
        "Only in parking areas",
        "Everywhere on site",
        "Only near buildings",
        "No limitations"
      ],
      de: [
        "Nur in Parkbereichen",
        "Überall auf dem Gelände",
        "Nur in der Nähe von Gebäuden",
        "Keine Beschränkungen"
      ],
      es: [
        "Solo en áreas de estacionamiento",
        "En todo el sitio",
        "Solo cerca de edificios",
        "Sin limitaciones"
      ]
    },
    correct: 1
  },
  {
    id: 4,
    question: {
      fr: "Quelle est la première chose à faire en arrivant sur site ?",
      en: "What is the first thing to do when arriving on site?",
      de: "Was ist das erste, was Sie bei der Ankunft auf dem Gelände tun sollten?",
      es: "¿Cuál es lo primero que debe hacer al llegar al sitio?"
    },
    options: {
      fr: [
        "Commencer immédiatement le travail",
        "Se présenter à l'accueil et suivre la formation sécurité",
        "Chercher son responsable",
        "Installer son matériel"
      ],
      en: [
        "Start work immediately",
        "Report to reception and complete safety training",
        "Look for your supervisor",
        "Set up your equipment"
      ],
      de: [
        "Sofort mit der Arbeit beginnen",
        "Sich an der Rezeption melden und Sicherheitsschulung absolvieren",
        "Nach dem Vorgesetzten suchen",
        "Ausrüstung aufbauen"
      ],
      es: [
        "Comenzar el trabajo inmediatamente",
        "Reportarse en recepción y completar la formación de seguridad",
        "Buscar a su supervisor",
        "Instalar su equipo"
      ]
    },
    correct: 1
  },
  {
    id: 5,
    question: {
      fr: "Que signifie un panneau triangulaire rouge ?",
      en: "What does a red triangular sign mean?",
      de: "Was bedeutet ein rotes Dreiecksschild?",
      es: "¿Qué significa una señal triangular roja?"
    },
    options: {
      fr: [
        "Interdiction",
        "Danger",
        "Obligation",
        "Information"
      ],
      en: [
        "Prohibition",
        "Danger",
        "Obligation",
        "Information"
      ],
      de: [
        "Verbot",
        "Gefahr",
        "Pflicht",
        "Information"
      ],
      es: [
        "Prohibición",
        "Peligro",
        "Obligación",
        "Información"
      ]
    },
    correct: 1
  }
];

// Driver-specific questions
export const driverQuestions: QCMQuestion[] = [
  {
    id: 101,
    profiles: ['driver'],
    question: {
      fr: "Avant de commencer le déchargement, que devez-vous vérifier ?",
      en: "Before starting unloading, what should you check?",
      de: "Vor dem Entladen, was sollten Sie überprüfen?",
      es: "Antes de comenzar la descarga, ¿qué debe verificar?"
    },
    options: {
      fr: [
        "Que le véhicule soit bien positionné et freiné",
        "Seulement l'heure de livraison",
        "La météo",
        "Le nombre de colis"
      ],
      en: [
        "That the vehicle is properly positioned and braked",
        "Only the delivery time",
        "The weather",
        "The number of packages"
      ],
      de: [
        "Dass das Fahrzeug richtig positioniert und gebremst ist",
        "Nur die Lieferzeit",
        "Das Wetter",
        "Die Anzahl der Pakete"
      ],
      es: [
        "Que el vehículo esté bien posicionado y frenado",
        "Solo la hora de entrega",
        "El clima",
        "El número de paquetes"
      ]
    },
    correct: 0
  },
  {
    id: 102,
    profiles: ['driver'],
    question: {
      fr: "Quelle est la vitesse maximale autorisée sur le site ?",
      en: "What is the maximum speed allowed on site?",
      de: "Welche Höchstgeschwindigkeit ist auf dem Gelände erlaubt?",
      es: "¿Cuál es la velocidad máxima permitida en el sitio?"
    },
    options: {
      fr: [
        "50 km/h",
        "30 km/h",
        "20 km/h",
        "10 km/h"
      ],
      en: [
        "50 km/h",
        "30 km/h",
        "20 km/h",
        "10 km/h"
      ],
      de: [
        "50 km/h",
        "30 km/h",
        "20 km/h",
        "10 km/h"
      ],
      es: [
        "50 km/h",
        "30 km/h",
        "20 km/h",
        "10 km/h"
      ]
    },
    correct: 2
  },
  {
    id: 103,
    profiles: ['driver'],
    question: {
      fr: "En cas de produits dangereux, que devez-vous avoir ?",
      en: "In case of dangerous goods, what must you have?",
      de: "Bei Gefahrgut, was müssen Sie haben?",
      es: "En caso de mercancías peligrosas, ¿qué debe tener?"
    },
    options: {
      fr: [
        "Rien de spécial",
        "Les documents ADR et équipements de sécurité",
        "Seulement le bon de livraison",
        "Un téléphone portable"
      ],
      en: [
        "Nothing special",
        "ADR documents and safety equipment",
        "Only the delivery note",
        "A mobile phone"
      ],
      de: [
        "Nichts Besonderes",
        "ADR-Dokumente und Sicherheitsausrüstung",
        "Nur den Lieferschein",
        "Ein Mobiltelefon"
      ],
      es: [
        "Nada especial",
        "Documentos ADR y equipo de seguridad",
        "Solo la nota de entrega",
        "Un teléfono móvil"
      ]
    },
    correct: 1
  }
];

// Technician-specific questions
export const technicianQuestions: QCMQuestion[] = [
  {
    id: 201,
    profiles: ['technician'],
    question: {
      fr: "Avant toute intervention électrique, que devez-vous faire ?",
      en: "Before any electrical intervention, what must you do?",
      de: "Vor jeder elektrischen Intervention, was müssen Sie tun?",
      es: "Antes de cualquier intervención eléctrica, ¿qué debe hacer?"
    },
    options: {
      fr: [
        "Vérifier que l'installation soit hors tension",
        "Mettre ses gants",
        "Prévenir son chef",
        "Prendre ses outils"
      ],
      en: [
        "Check that the installation is de-energized",
        "Put on gloves",
        "Inform your supervisor",
        "Get your tools"
      ],
      de: [
        "Überprüfen, dass die Anlage spannungsfrei ist",
        "Handschuhe anziehen",
        "Den Vorgesetzten informieren",
        "Werkzeuge holen"
      ],
      es: [
        "Verificar que la instalación esté desenergizada",
        "Ponerse guantes",
        "Informar a su supervisor",
        "Tomar sus herramientas"
      ]
    },
    correct: 0
  },
  {
    id: 202,
    profiles: ['technician'],
    question: {
      fr: "Pour un travail en hauteur, à partir de quelle hauteur faut-il un harnais ?",
      en: "For work at height, from what height is a harness required?",
      de: "Für Arbeiten in der Höhe, ab welcher Höhe ist ein Gurt erforderlich?",
      es: "Para trabajo en altura, ¿a partir de qué altura se requiere arnés?"
    },
    options: {
      fr: [
        "1 mètre",
        "2 mètres",
        "3 mètres",
        "5 mètres"
      ],
      en: [
        "1 meter",
        "2 meters",
        "3 meters",
        "5 meters"
      ],
      de: [
        "1 Meter",
        "2 Meter",
        "3 Meter",
        "5 Meter"
      ],
      es: [
        "1 metro",
        "2 metros",
        "3 metros",
        "5 metros"
      ]
    },
    correct: 1
  },
  {
    id: 203,
    profiles: ['technician'],
    question: {
      fr: "Que devez-vous faire avant d'utiliser un outil électroportatif ?",
      en: "What should you do before using a power tool?",
      de: "Was sollten Sie tun, bevor Sie ein Elektrowerkzeug verwenden?",
      es: "¿Qué debe hacer antes de usar una herramienta eléctrica?"
    },
    options: {
      fr: [
        "Vérifier son état et ses protections",
        "Le brancher immédiatement",
        "Chercher la notice",
        "Demander l'autorisation"
      ],
      en: [
        "Check its condition and protections",
        "Plug it in immediately",
        "Look for the manual",
        "Ask for permission"
      ],
      de: [
        "Zustand und Schutzvorrichtungen überprüfen",
        "Sofort einstecken",
        "Nach der Anleitung suchen",
        "Um Erlaubnis fragen"
      ],
      es: [
        "Verificar su estado y protecciones",
        "Enchufarlo inmediatamente",
        "Buscar el manual",
        "Pedir permiso"
      ]
    },
    correct: 0
  }
];

// Cleaning-specific questions
export const cleaningQuestions: QCMQuestion[] = [
  {
    id: 301,
    profiles: ['cleaning'],
    question: {
      fr: "Lors du mélange de produits chimiques, que ne devez-vous jamais faire ?",
      en: "When mixing chemicals, what should you never do?",
      de: "Beim Mischen von Chemikalien, was sollten Sie niemals tun?",
      es: "Al mezclar químicos, ¿qué nunca debe hacer?"
    },
    options: {
      fr: [
        "Mélanger différents produits sans vérification",
        "Porter des gants",
        "Lire les étiquettes",
        "Aérer la zone"
      ],
      en: [
        "Mix different products without checking",
        "Wear gloves",
        "Read the labels",
        "Ventilate the area"
      ],
      de: [
        "Verschiedene Produkte ohne Überprüfung mischen",
        "Handschuhe tragen",
        "Etiketten lesen",
        "Den Bereich lüften"
      ],
      es: [
        "Mezclar diferentes productos sin verificar",
        "Usar guantes",
        "Leer las etiquetas",
        "Ventilar el área"
      ]
    },
    correct: 0
  },
  {
    id: 302,
    profiles: ['cleaning'],
    question: {
      fr: "Comment devez-vous signaler une zone humide après nettoyage ?",
      en: "How should you signal a wet area after cleaning?",
      de: "Wie sollten Sie einen nassen Bereich nach der Reinigung kennzeichnen?",
      es: "¿Cómo debe señalar un área húmeda después de la limpieza?"
    },
    options: {
      fr: [
        "Ne rien faire",
        "Placer des panneaux 'Sol glissant'",
        "Fermer la zone",
        "Attendre que ça sèche"
      ],
      en: [
        "Do nothing",
        "Place 'Slippery floor' signs",
        "Close the area",
        "Wait for it to dry"
      ],
      de: [
        "Nichts tun",
        "'Rutschiger Boden' Schilder aufstellen",
        "Den Bereich schließen",
        "Warten, bis es trocken ist"
      ],
      es: [
        "No hacer nada",
        "Colocar señales de 'Piso resbaladizo'",
        "Cerrar el área",
        "Esperar a que se seque"
      ]
    },
    correct: 1
  }
];

// Administrative-specific questions  
export const administrativeQuestions: QCMQuestion[] = [
  {
    id: 401,
    profiles: ['administrative'],
    question: {
      fr: "En cas d'inspection, qui devez-vous accompagner ?",
      en: "During an inspection, who should you accompany?",
      de: "Bei einer Inspektion, wen sollten Sie begleiten?",
      es: "Durante una inspección, ¿a quién debe acompañar?"
    },
    options: {
      fr: [
        "Personne",
        "Un responsable sécurité du site",
        "N'importe qui",
        "Seulement un ouvrier"
      ],
      en: [
        "No one",
        "A site safety manager",
        "Anyone",
        "Only a worker"
      ],
      de: [
        "Niemand",
        "Einen Sicherheitsverantwortlichen des Standorts",
        "Jeder",
        "Nur einen Arbeiter"
      ],
      es: [
        "Nadie",
        "Un gerente de seguridad del sitio",
        "Cualquiera",
        "Solo un trabajador"
      ]
    },
    correct: 1
  },
  {
    id: 402,
    profiles: ['administrative'],
    question: {
      fr: "Pour accéder aux bureaux, que devez-vous porter ?",
      en: "To access the offices, what must you wear?",
      de: "Um Zugang zu den Büros zu erhalten, was müssen Sie tragen?",
      es: "Para acceder a las oficinas, ¿qué debe usar?"
    },
    options: {
      fr: [
        "Vêtements de travail complets",
        "Badge visiteur et chaussures fermées minimum",
        "Casque obligatoire",
        "Combinaison intégrale"
      ],
      en: [
        "Complete work clothes",
        "Visitor badge and closed shoes minimum",
        "Mandatory helmet",
        "Full suit"
      ],
      de: [
        "Vollständige Arbeitskleidung",
        "Besucherausweis und geschlossene Schuhe mindestens",
        "Pflichthelm",
        "Vollanzug"
      ],
      es: [
        "Ropa de trabajo completa",
        "Tarjeta de visitante y zapatos cerrados mínimo",
        "Casco obligatorio",
        "Traje completo"
      ]
    },
    correct: 1
  }
];

// Utility function to ensure all questions have fallbacks for missing languages
function ensureAllLanguages(question: QCMQuestion): QCMQuestion {
  const allLanguages = ['fr', 'en', 'de', 'es', 'it', 'pt', 'nl', 'pl', 'ar'] as const;

  // Ensure question text has all languages (fallback to French)
  const questionText = { ...question.question };
  allLanguages.forEach(lang => {
    if (!questionText[lang]) {
      questionText[lang] = questionText.fr || Object.values(questionText)[0] || '';
    }
  });

  // Ensure options have all languages (fallback to French)
  const options = { ...question.options };
  allLanguages.forEach(lang => {
    if (!options[lang]) {
      options[lang] = options.fr || Object.values(options)[0] || [];
    }
  });

  // Ensure explanation has all languages if it exists (fallback to French)
  let explanation = question.explanation;
  if (explanation) {
    explanation = { ...explanation };
    allLanguages.forEach(lang => {
      if (!explanation![lang]) {
        explanation![lang] = explanation!.fr || Object.values(explanation!)[0] || '';
      }
    });
  }

  return {
    ...question,
    question: questionText,
    options,
    explanation
  };
}

// Function to get questions for a specific profile
export function getQuestionsForProfile(profile: string): QCMQuestion[] {
  let questions = [...baseQuestions];
  
  // Add profile-specific questions
  switch (profile) {
    case 'driver':
      questions = questions.concat(driverQuestions);
      break;
    case 'technician':
      questions = questions.concat(technicianQuestions);
      break;
    case 'cleaning':
      questions = questions.concat(cleaningQuestions);
      break;
    case 'administrative':
      questions = questions.concat(administrativeQuestions);
      break;
  }
  
  // Shuffle and take 12 questions (5 base + 7 profile-specific or random)
  const shuffled = questions.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 12);
}

// Get all available questions
export function getAllQuestions(): QCMQuestion[] {
  return [
    ...baseQuestions,
    ...driverQuestions,
    ...technicianQuestions,
    ...cleaningQuestions,
    ...administrativeQuestions
  ];
}
