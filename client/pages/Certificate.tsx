import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Download, Mail, CheckCircle, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useSound } from "@/hooks/use-sound";
import { useHaptic } from "@/hooks/use-haptic";

export default function Certificate() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const generateButtonRef = useRef<HTMLButtonElement>(null);
  const downloadButtonRef = useRef<HTMLButtonElement>(null);
  const dashboardButtonRef = useRef<HTMLButtonElement>(null);

  // UX/UI hooks
  const { playClickSound, playBeepSound, playSuccessSound, playConfirmSound } = useSound();
  const { triggerLight, triggerMedium, triggerSuccess } = useHaptic();

  useEffect(() => {
    setIsLoaded(true);
    playBeepSound(); // Entry sound
  }, [playBeepSound]);

  const handleGenerate = () => {
    if (firstName && lastName) {
      playSuccessSound();
      triggerSuccess(generateButtonRef.current || undefined);
      setTimeout(() => {
        setIsGenerated(true);
        playConfirmSound(); // Certificate generated sound
      }, 500);
    }
  };

  const handleDownload = () => {
    playClickSound();
    triggerMedium(downloadButtonRef.current || undefined);
  };

  const handleDashboard = () => {
    playConfirmSound();
    triggerSuccess(dashboardButtonRef.current || undefined);
    setTimeout(() => {
      navigate('/dashboard');
    }, 300);
  };

  const handleBack = () => {
    playClickSound();
    triggerLight();
  };

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const selectedProfile = sessionStorage.getItem('selectedProfile') || 'visiteur';

  if (isGenerated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
          
          {/* Certificate */}
          <Card className="bg-white shadow-2xl max-w-4xl w-full mx-auto border-8 border-emerald-500 relative">
            <CardContent className="p-12">
              
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-8 mb-6">
                  <div className="px-6 py-3">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2Fcf2c1680c78247c6bd78521e30a0f35c?format=webp&width=800"
                      alt="Gerflor Logo"
                      className="h-8 object-contain"
                    />
                  </div>
                  <div className="px-6 py-3">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2Fca3c12dc38bf426eacbda6f86df51d73?format=webp&width=800"
                      alt="FPSG Logo"
                      className="h-8 object-contain"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-center mb-4">
                  <Award className="w-16 h-16 text-emerald-600 mr-4" />
                  <h1 className="text-4xl font-bold text-slate-800">
                    CERTIFICAT DE FORMATION
                  </h1>
                </div>
                
                <p className="text-xl text-slate-600">
                  Sensibilisation Sécurité
                </p>
              </div>

              {/* Certificate content */}
              <div className="text-center mb-8">
                <p className="text-lg text-slate-700 mb-4">
                  Nous certifions que
                </p>
                
                <div className="bg-slate-100 p-6 rounded-lg mb-6">
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">
                    {firstName} {lastName}
                  </h2>
                  <p className="text-slate-600">
                    Profil : {selectedProfile}
                  </p>
                </div>
                
                <p className="text-lg text-slate-700 mb-6">
                  a suivi avec succès la formation de sensibilisation aux règles de sécurité 
                  et est autorisé(e) à accéder au site dans le cadre de ses fonctions.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <p className="text-slate-600">Date de formation</p>
                    <p className="font-semibold text-slate-800">{currentDate}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-600">Score obtenu</p>
                    <p className="font-semibold text-emerald-600 text-xl">85%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-600">Validité</p>
                    <p className="font-semibold text-slate-800">12 mois</p>
                  </div>
                </div>
              </div>

              {/* Validation stamp */}
              <div className="flex justify-end">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-500 rounded-full mb-2 animate-pulse">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-sm text-slate-600">Validé ✅</p>
                  <p className="text-xs text-slate-500">Certificat #2024-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4"
            >
              <Download className="w-5 h-5 mr-2" />
              Télécharger PDF
            </Button>
            
            {email && (
              <Button 
                size="lg"
                variant="outline"
                className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-8 py-4"
              >
                <Mail className="w-5 h-5 mr-2" />
                Envoyer par e-mail
              </Button>
            )}
            
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="border-slate-500 text-slate-600 hover:bg-slate-50 px-8 py-4"
            >
              Tableau de bord HSE
            </Button>
          </div>

          {/* Progress indicator */}
          <div className="mt-12 flex items-center justify-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            </div>
            <span className="text-slate-400 text-sm ml-4">Formation terminée !</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Back button */}
      <div className="absolute top-6 left-6 z-20">
        <Link to="/qcm">
          <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </Link>
      </div>

      {/* Main content */}
      <div className={`min-h-screen flex flex-col items-center justify-center px-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-600/50 shadow-2xl p-8 max-w-2xl w-full mx-auto">
          <CardContent className="p-0">
            
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full mb-6">
                <Award className="w-10 h-10 text-white" />
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-4">
                Génération du Certificat
              </h1>
              <p className="text-slate-300">
                Saisissez vos informations pour générer votre certificat de formation
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-white">Prénom *</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Votre prénom"
                  />
                </div>
                
                <div>
                  <Label htmlFor="lastName" className="text-white">Nom *</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Votre nom"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email" className="text-white">E-mail (optionnel)</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="votre.email@exemple.com"
                />
                <p className="text-slate-400 text-sm mt-1">
                  Pour recevoir le certificat par e-mail
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button 
                size="lg"
                onClick={handleGenerate}
                disabled={!firstName || !lastName}
                className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white px-8 py-4 text-lg font-semibold rounded-xl"
              >
                <Award className="w-5 h-5 mr-2" />
                Générer le certificat
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress indicator */}
        <div className="mt-12 flex items-center justify-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          </div>
          <span className="text-slate-400 text-sm ml-4">Étape 5 sur 5</span>
        </div>
      </div>
    </div>
  );
}
