import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Users,
  TrendingUp,
  AlertCircle,
  Calendar,
  Award,
  Bell,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { useSound } from "@/hooks/use-sound";
import { useHaptic } from "@/hooks/use-haptic";
import { ROICalculator } from "@/components/ROICalculator";
import { BusinessCase } from "@/components/BusinessCase";

export default function Dashboard() {
  const [isLoaded, setIsLoaded] = useState(false);
  const backButtonRef = useRef<HTMLButtonElement>(null);

  // UX/UI hooks
  const { playClickSound, playBeepSound, playNotificationSound } = useSound();
  const { triggerLight, triggerMedium } = useHaptic();

  useEffect(() => {
    setIsLoaded(true);
    playNotificationSound(); // Entry sound for dashboard
  }, [playNotificationSound]);

  const handleBack = () => {
    playClickSound();
    triggerLight(backButtonRef.current || undefined);
  };

  const handleCardClick = () => {
    playClickSound();
    triggerMedium();
  };

  const stats = {
    totalVisitors: 1247,
    trainedToday: 23,
    successRate: 89,
    expiringCertificates: 15,
  };

  const recentActivity = [
    {
      id: 1,
      name: "Jean Dupont",
      profile: "Chauffeur-livreur",
      score: 95,
      time: "Il y a 15 min",
    },
    {
      id: 2,
      name: "Marie Martin",
      profile: "Agent de nettoyage",
      score: 78,
      time: "Il y a 32 min",
    },
    {
      id: 3,
      name: "Pierre Durand",
      profile: "Sous-traitant technique",
      score: 92,
      time: "Il y a 1h",
    },
    {
      id: 4,
      name: "Sophie Bernard",
      profile: "Visiteur administratif",
      score: 88,
      time: "Il y a 2h",
    },
  ];

  const alerts = [
    {
      id: 1,
      message: "Certificat visiteur #453 expiré - relance envoyée",
      type: "warning",
      time: "Il y a 5 min",
    },
    {
      id: 2,
      message: "15 certificats expirent dans les 7 prochains jours",
      type: "info",
      time: "Il y a 1h",
    },
    {
      id: 3,
      message: "Taux de réussite en baisse de 3% ce mois",
      type: "warning",
      time: "Il y a 3h",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/certificate">
                <Button
                  variant="ghost"
                  className="text-white hover:bg-slate-700 mr-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
              </Link>

              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Award className="w-6 h-6 text-emerald-500" />
                  Tableau de Bord HSE - Gerflor
                </h1>
                <p className="text-slate-300">
                  Formation sécurité intelligente • ROI mesurable • Conformité garantie
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/50 rounded-full">
                    <span className="text-emerald-400 text-sm font-medium">ROI: +{Math.round(((700000 - 131000) / 131000) * 100)}%</span>
                  </div>
                  <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full">
                    <span className="text-blue-400 text-sm font-medium">Payback: 4 mois</span>
                  </div>
                  <div className="px-3 py-1 bg-orange-500/20 border border-orange-500/50 rounded-full">
                    <span className="text-orange-400 text-sm font-medium">Accidents: -67%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="px-4 py-2">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2Fcf2c1680c78247c6bd78521e30a0f35c?format=webp&width=800"
                  alt="Gerflor Logo"
                  className="h-6 object-contain"
                />
              </div>
              <div className="px-4 py-2">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2Fca3c12dc38bf426eacbda6f86df51d73?format=webp&width=800"
                  alt="FPSG Logo"
                  className="h-6 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`max-w-7xl mx-auto px-6 py-8 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        {/* ROI Calculator - Section principale pour Gerflor */}
        <div className="mb-12 animate-fade-in-up">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">
              Impact Financier & ROI de la Formation Sécurité
            </h2>
            <p className="text-slate-300 text-lg">
              Démonstration de la valeur business générée par votre investissement
            </p>
          </div>
          <ROICalculator />
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-600/50 hover-lift backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Visiteurs formés</p>
                  <p className="text-3xl font-bold text-white">
                    {stats.totalVisitors}
                  </p>
                  <p className="text-emerald-400 text-sm">+12% ce mois</p>
                </div>
                <Users className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-600/50 hover-lift backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Formés aujourd'hui</p>
                  <p className="text-3xl font-bold text-white">
                    {stats.trainedToday}
                  </p>
                  <p className="text-blue-400 text-sm">Objectif: 30/jour</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-600/50 hover-lift backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Taux de réussite</p>
                  <p className="text-3xl font-bold text-white">
                    {stats.successRate}%
                  </p>
                  <p className="text-orange-400 text-sm">-2% vs mois dernier</p>
                </div>
                <Award className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-600/50 hover-lift backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">
                    Certificats à renouveler
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {stats.expiringCertificates}
                  </p>
                  <p className="text-red-400 text-sm">Dans 7 jours</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity chart placeholder */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-600/50 hover-lift backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Formations par jour
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-slate-700/50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Graphique des formations par jour</p>
                    <p className="text-sm">(Données simulées)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts */}
          <div>
            <Card className="bg-slate-800/50 border-slate-600/50 hover-lift mb-6 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Alertes récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg border-l-4 ${
                        alert.type === "warning"
                          ? "bg-orange-500/10 border-orange-500"
                          : "bg-blue-500/10 border-blue-500"
                      }`}
                    >
                      <p className="text-white text-sm">{alert.message}</p>
                      <p className="text-slate-400 text-xs mt-1">
                        {alert.time}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Progress by profile */}
            <Card className="bg-slate-800/50 border-slate-600/50 hover-lift backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white">
                  Progression par profil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-300 text-sm">Chauffeurs</span>
                      <span className="text-slate-300 text-sm">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-300 text-sm">
                        Techniciens
                      </span>
                      <span className="text-slate-300 text-sm">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-300 text-sm">Nettoyage</span>
                      <span className="text-slate-300 text-sm">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-300 text-sm">
                        Administratif
                      </span>
                      <span className="text-slate-300 text-sm">96%</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent activity */}
        <Card className="bg-slate-800/50 border-slate-600/50 hover-lift mt-8 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white">Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left text-slate-400 p-3">Nom</th>
                    <th className="text-left text-slate-400 p-3">Profil</th>
                    <th className="text-left text-slate-400 p-3">Score</th>
                    <th className="text-left text-slate-400 p-3">Heure</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((activity) => (
                    <tr
                      key={activity.id}
                      className="border-b border-slate-700/50"
                    >
                      <td className="text-white p-3">{activity.name}</td>
                      <td className="text-slate-300 p-3">{activity.profile}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            activity.score >= 90
                              ? "bg-emerald-500/20 text-emerald-400"
                              : activity.score >= 70
                                ? "bg-orange-500/20 text-orange-400"
                                : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {activity.score}%
                        </span>
                      </td>
                      <td className="text-slate-400 p-3">{activity.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
