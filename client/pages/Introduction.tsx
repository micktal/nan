import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Play, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

export default function Introduction() {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

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
        <Link to="/profile-selection">
          <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </Link>
      </div>

      {/* Main content */}
      <div className={`min-h-screen flex flex-col items-center justify-center px-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-slate-600/50 shadow-2xl p-8 max-w-3xl w-full mx-auto text-center">
          
          {/* Video placeholder */}
          <div className="bg-slate-700 rounded-xl mb-8 aspect-video flex items-center justify-center">
            <div className="text-center">
              <Play className="w-16 h-16 text-white mx-auto mb-4 opacity-50" />
              <p className="text-slate-300">Vidéo de bienvenue sécurité</p>
              <p className="text-slate-400 text-sm">30 secondes</p>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-6">
            Introduction au Module Sécurité
          </h1>

          <div className="text-left space-y-4 mb-8 text-slate-300">
            <p className="text-lg">
              <strong className="text-white">Bienvenue.</strong> Avant d'accéder au site, vous devez suivre une courte sensibilisation aux règles de sécurité essentielles.
            </p>
            <p>
              Cela ne prendra que quelques minutes et vous permettra de vous déplacer en toute sécurité sur notre site.
            </p>
            <div className="flex items-center justify-center mt-6 p-4 bg-slate-700/50 rounded-lg">
              <Clock className="w-5 h-5 text-emerald-400 mr-2" />
              <span className="text-emerald-400">Durée estimée : 5-10 minutes</span>
            </div>
          </div>

          <Button 
            size="lg"
            className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white px-8 py-4 text-lg font-semibold rounded-xl"
            onClick={() => navigate('/safety-course')}
          >
            Poursuivre la formation
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Progress indicator */}
        <div className="mt-12 flex items-center justify-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
            <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
            <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
          </div>
          <span className="text-slate-400 text-sm ml-4">Étape 2 sur 5</span>
        </div>
      </div>
    </div>
  );
}
