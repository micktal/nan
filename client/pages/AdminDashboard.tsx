import { useState, useEffect } from "react";
import {
  Users,
  TrendingUp,
  Download,
  Calendar,
  Clock,
  Award,
  AlertTriangle,
  BarChart3,
  PieChart,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAdmin } from "@/hooks/use-admin";
import { useNotifications } from "@/hooks/use-notifications";
import {
  exportToCSV,
  exportToPDF,
  exportToJSON,
  calculateAnalytics,
} from "@/utils/export-utils";
import type { TrainingSession } from "@/hooks/use-user-session";

// Mock data for demonstration (in production, this would come from an API)
const generateMockSessions = (): TrainingSession[] => {
  const profiles = [
    "driver",
    "technician",
    "cleaning",
    "administrative",
  ] as const;
  const companies = [
    "Transport ABC",
    "Maintenance Pro",
    "CleanCorp",
    "AdminServices",
    "TechSolutions",
  ];
  const languages = ["fr", "en", "de", "es"];

  return Array.from({ length: 50 }, (_, i) => {
    const startTime = new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
    ); // Last 30 days
    const sessionDuration = Math.floor(Math.random() * 1800) + 300; // 5-35 minutes
    const isCompleted = Math.random() > 0.3; // 70% completion rate
    const qcmScore = isCompleted
      ? Math.floor(Math.random() * 40) + 60
      : undefined; // 60-100%

    return {
      sessionId: `session_${i}_${Date.now()}`,
      isActive: false,
      user: {
        id: `user_${i}`,
        firstName: `Prénom${i}`,
        lastName: `Nom${i}`,
        email: `user${i}@example.com`,
        profileType: profiles[Math.floor(Math.random() * profiles.length)],
        company: companies[Math.floor(Math.random() * companies.length)],
        visitDate: startTime.toISOString(),
        language: languages[Math.floor(Math.random() * languages.length)],
      },
      progress: {
        userId: `user_${i}`,
        currentStep: isCompleted ? 6 : Math.floor(Math.random() * 6),
        completedSteps: isCompleted
          ? [0, 1, 2, 3, 4, 5]
          : Array.from(
              { length: Math.floor(Math.random() * 4) + 1 },
              (_, j) => j,
            ),
        profileSelected: true,
        safetyZonesCompleted: ["ppe", "restricted", "signage"].slice(
          0,
          Math.floor(Math.random() * 3) + 1,
        ),
        qcmStarted: isCompleted || Math.random() > 0.5,
        qcmCompleted: isCompleted,
        qcmAnswers: isCompleted
          ? Array.from({ length: 12 }, () => Math.floor(Math.random() * 4))
          : [],
        qcmScore,
        startTime: startTime.toISOString(),
        lastActivity: new Date(
          startTime.getTime() + sessionDuration * 1000,
        ).toISOString(),
        sessionDuration,
        certificateGenerated: isCompleted,
      },
    };
  });
};

export default function AdminDashboard() {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("30"); // days

  const { user, logout, hasPermission } = useAdmin();
  const { notifySuccess, notifyInfo } = useNotifications();

  useEffect(() => {
    loadData();
  }, [selectedPeriod]);

  const loadData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSessions(generateMockSessions());
    setIsLoading(false);
  };

  const analytics = calculateAnalytics(sessions);

  // Filter by period
  const filteredSessions = sessions.filter((session) => {
    if (!session.progress?.startTime) return false;
    const sessionDate = new Date(session.progress.startTime);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(selectedPeriod));
    return sessionDate >= cutoffDate;
  });

  const filteredAnalytics = calculateAnalytics(filteredSessions);

  // Profile distribution
  const profileStats = filteredSessions.reduce(
    (acc, session) => {
      const profile = session.user?.profileType || "unknown";
      acc[profile] = (acc[profile] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Daily completion trend (last 7 days)
  const completionTrend = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayStart = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

    const completions = filteredSessions.filter((session) => {
      if (
        !session.progress?.startTime ||
        !session.progress.certificateGenerated
      )
        return false;
      const sessionDate = new Date(session.progress.startTime);
      return sessionDate >= dayStart && sessionDate < dayEnd;
    }).length;

    return {
      date: dayStart.toLocaleDateString("fr-FR", { weekday: "short" }),
      completions,
    };
  }).reverse();

  const handleExport = (format: "csv" | "pdf" | "json") => {
    if (!hasPermission("export_data")) {
      notifyInfo(
        "Permission refusée",
        "Vous n'avez pas les droits pour exporter les données",
      );
      return;
    }

    const filename = `formation-securite-${selectedPeriod}j-${new Date().toISOString().split("T")[0]}`;

    switch (format) {
      case "csv":
        exportToCSV(filteredAnalytics, `${filename}.csv`);
        break;
      case "pdf":
        exportToPDF(filteredAnalytics, `${filename}.pdf`);
        break;
      case "json":
        exportToJSON(filteredAnalytics, `${filename}.json`);
        break;
    }

    notifySuccess(
      "Export réussi",
      `Données exportées au format ${format.toUpperCase()}`,
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Tableau de Bord Administrateur
              </h1>
              <p className="text-slate-300">
                Bienvenue, {user?.username} ({user?.role})
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Period Selector */}
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white rounded-lg px-3 py-2 text-sm"
              >
                <option value="7">7 derniers jours</option>
                <option value="30">30 derniers jours</option>
                <option value="90">90 derniers jours</option>
                <option value="365">Année complète</option>
              </select>

              {/* Export Buttons */}
              {hasPermission("export_data") && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleExport("csv")}
                    className="text-white border-slate-600 hover:bg-slate-700"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    CSV
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleExport("pdf")}
                    className="text-white border-slate-600 hover:bg-slate-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    PDF
                  </Button>
                </div>
              )}

              <Button
                size="sm"
                variant="outline"
                onClick={logout}
                className="text-white border-slate-600 hover:bg-slate-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Sessions totales</p>
                  <p className="text-3xl font-bold text-white">
                    {filteredAnalytics.totalSessions}
                  </p>
                  <p className="text-emerald-400 text-sm">
                    +{Math.round(Math.random() * 20)}% ce mois
                  </p>
                </div>
                <Users className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Taux de réussite</p>
                  <p className="text-3xl font-bold text-white">
                    {filteredAnalytics.averageScore.toFixed(1)}%
                  </p>
                  <p className="text-blue-400 text-sm">Moyenne générale</p>
                </div>
                <Award className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Durée moyenne</p>
                  <p className="text-3xl font-bold text-white">
                    {Math.round(filteredAnalytics.averageDuration)}
                  </p>
                  <p className="text-orange-400 text-sm">minutes</p>
                </div>
                <Clock className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Taux de completion</p>
                  <p className="text-3xl font-bold text-white">
                    {Math.round(
                      (filteredAnalytics.completedSessions /
                        filteredAnalytics.totalSessions) *
                        100,
                    )}
                    %
                  </p>
                  <p className="text-purple-400 text-sm">
                    {filteredAnalytics.completedSessions} terminées
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Completion Trend */}
          <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Tendance des formations (7 jours)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completionTrend.map((day, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-slate-300 text-sm w-12">
                      {day.date}
                    </span>
                    <div className="flex-1 mx-4">
                      <Progress
                        value={
                          (day.completions /
                            Math.max(
                              ...completionTrend.map((d) => d.completions),
                            )) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
                    <span className="text-white text-sm w-8 text-right">
                      {day.completions}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Profile Distribution */}
          <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <PieChart className="w-5 h-5 mr-2" />
                Répartition par profil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(profileStats).map(([profile, count]) => {
                  const percentage =
                    (count / filteredAnalytics.totalSessions) * 100;
                  const profileLabels = {
                    driver: "Chauffeurs",
                    technician: "Techniciens",
                    cleaning: "Nettoyage",
                    administrative: "Administratif",
                  };

                  return (
                    <div key={profile} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">
                          {profileLabels[
                            profile as keyof typeof profileLabels
                          ] || profile}
                        </span>
                        <span className="text-white">
                          {count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Sessions Table */}
        <Card className="glass-effect border-slate-600/50">
          <CardHeader>
            <CardTitle className="text-white">Sessions récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left text-slate-400 p-3">
                      Utilisateur
                    </th>
                    <th className="text-left text-slate-400 p-3">Profil</th>
                    <th className="text-left text-slate-400 p-3">Entreprise</th>
                    <th className="text-left text-slate-400 p-3">
                      Progression
                    </th>
                    <th className="text-left text-slate-400 p-3">Score</th>
                    <th className="text-left text-slate-400 p-3">Durée</th>
                    <th className="text-left text-slate-400 p-3">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.slice(0, 10).map((session) => {
                    const user = session.user;
                    const progress = session.progress;
                    const progressPercentage = progress
                      ? Math.round((progress.completedSteps.length / 6) * 100)
                      : 0;

                    return (
                      <tr
                        key={session.sessionId}
                        className="border-b border-slate-700/50"
                      >
                        <td className="text-white p-3">
                          {user ? `${user.firstName} ${user.lastName}` : "N/A"}
                        </td>
                        <td className="text-slate-300 p-3">
                          {user?.profileType || "N/A"}
                        </td>
                        <td className="text-slate-300 p-3">
                          {user?.company || "N/A"}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Progress
                              value={progressPercentage}
                              className="h-2 w-16"
                            />
                            <span className="text-xs text-slate-400">
                              {progressPercentage}%
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          {progress?.qcmScore ? (
                            <span
                              className={`px-2 py-1 rounded text-sm ${
                                progress.qcmScore >= 80
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : progress.qcmScore >= 60
                                    ? "bg-orange-500/20 text-orange-400"
                                    : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {progress.qcmScore}%
                            </span>
                          ) : (
                            <span className="text-slate-500 text-sm">-</span>
                          )}
                        </td>
                        <td className="text-slate-300 p-3">
                          {progress
                            ? Math.round(progress.sessionDuration / 60)
                            : 0}{" "}
                          min
                        </td>
                        <td className="p-3">
                          {progress?.certificateGenerated ? (
                            <span className="text-emerald-400 text-sm">
                              ✅ Terminé
                            </span>
                          ) : (
                            <span className="text-orange-400 text-sm">
                              🟡 En cours
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
