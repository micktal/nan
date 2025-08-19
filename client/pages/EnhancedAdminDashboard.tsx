import { useState, useEffect, useMemo } from "react";
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
  Monitor,
  Zap,
  Shield,
  Globe,
  Filter,
  RefreshCcw,
  Database,
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

// Enhanced mock data generator with more realistic patterns
const generateAdvancedMockSessions = (count: number): TrainingSession[] => {
  const profiles = ["driver", "technician", "cleaning", "administrative"] as const;
  const companies = [
    "Transport ABC", "Maintenance Pro", "CleanCorp", "AdminServices", 
    "TechSolutions", "SafetyFirst", "Industrial Corp", "GlobalLogistics",
    "SecureBuild", "EcoClean", "TechMaintenance", "AdminPro"
  ];
  const languages = ["fr", "en", "de", "es", "it", "pt"];
  const devices = ["tablet", "desktop", "mobile"];
  const locations = [
    "Site Paris", "Site Lyon", "Site Marseille", "Site Toulouse", 
    "Site Bordeaux", "Site Lille", "Site Strasbourg", "Site Nantes"
  ];

  return Array.from({ length: count }, (_, i) => {
    const startTime = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000); // Last 90 days
    const sessionDuration = Math.floor(Math.random() * 2700) + 300; // 5-50 minutes
    const isCompleted = Math.random() > 0.25; // 75% completion rate
    const qcmScore = isCompleted ? Math.floor(Math.random() * 40) + 60 : undefined; // 60-100%
    const profile = profiles[Math.floor(Math.random() * profiles.length)];
    
    // Simulate realistic patterns
    const hasDropout = Math.random() < 0.15; // 15% dropout rate
    const completedSteps = hasDropout 
      ? Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, j) => j)
      : isCompleted 
        ? [0, 1, 2, 3, 4, 5]
        : Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => j);

    return {
      sessionId: `session_${i}_${Date.now()}`,
      isActive: Math.random() < 0.05, // 5% active sessions
      user: {
        id: `user_${i}`,
        firstName: `Prénom${i}`,
        lastName: `Nom${i}`,
        email: `user${i}@${companies[Math.floor(Math.random() * companies.length)].toLowerCase().replace(/\s+/g, '')}.com`,
        profileType: profile,
        company: companies[Math.floor(Math.random() * companies.length)],
        visitDate: startTime.toISOString(),
        language: languages[Math.floor(Math.random() * languages.length)],
        device: devices[Math.floor(Math.random() * devices.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      },
      progress: {
        userId: `user_${i}`,
        currentStep: isCompleted ? 6 : Math.max(...completedSteps) + 1,
        completedSteps,
        profileSelected: true,
        safetyZonesCompleted: ["ppe", "restricted", "signage"].slice(0, Math.floor(Math.random() * 3) + 1),
        qcmStarted: isCompleted || Math.random() > 0.4,
        qcmCompleted: isCompleted,
        qcmAnswers: isCompleted ? Array.from({ length: 12 }, () => Math.floor(Math.random() * 4)) : [],
        qcmScore,
        startTime: startTime.toISOString(),
        lastActivity: new Date(startTime.getTime() + sessionDuration * 1000).toISOString(),
        sessionDuration,
        certificateGenerated: isCompleted,
        attemptsCount: Math.floor(Math.random() * 3) + 1,
        helpRequested: Math.random() < 0.1,
        timeSpentPerStep: Array.from({ length: 6 }, () => Math.floor(Math.random() * 300) + 60),
      },
      metadata: {
        userAgent: `Mozilla/5.0 (${devices[Math.floor(Math.random() * devices.length)]})`,
        referrer: Math.random() < 0.3 ? "direct" : "internal",
        sessionQuality: Math.random() < 0.8 ? "high" : Math.random() < 0.9 ? "medium" : "low",
      }
    };
  });
};

interface AdvancedAnalytics {
  totalSessions: number;
  activeSessions: number;
  completedSessions: number;
  averageScore: number;
  averageDuration: number;
  dropoutRate: number;
  conversionRate: number;
  peakHours: { hour: number; sessions: number }[];
  deviceStats: Record<string, number>;
  languageStats: Record<string, number>;
  locationStats: Record<string, number>;
  completionTrend: { date: string; completed: number; started: number }[];
  scoreDistribution: { range: string; count: number }[];
  helpRequestRate: number;
  retryRate: number;
}

export default function EnhancedAdminDashboard() {
  const [sessions, setSessions] = useState<(TrainingSession & { metadata?: any })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [selectedProfile, setSelectedProfile] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [realTimeMode, setRealTimeMode] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const { user, logout, hasPermission } = useAdmin();
  const { notifySuccess, notifyInfo, notifyError } = useNotifications();

  useEffect(() => {
    loadData();
  }, [selectedPeriod, selectedProfile, selectedLocation]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call with realistic delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSessions(generateAdvancedMockSessions(200));
    } catch (error) {
      notifyError("Erreur", "Impossible de charger les données");
    }
    setIsLoading(false);
  };

  // Advanced analytics calculations
  const analytics: AdvancedAnalytics = useMemo(() => {
    const filteredSessions = sessions.filter((session) => {
      if (!session.progress?.startTime) return false;
      
      const sessionDate = new Date(session.progress.startTime);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - parseInt(selectedPeriod));
      
      const periodMatch = sessionDate >= cutoffDate;
      const profileMatch = selectedProfile === "all" || session.user?.profileType === selectedProfile;
      const locationMatch = selectedLocation === "all" || session.user?.location === selectedLocation;
      
      return periodMatch && profileMatch && locationMatch;
    });

    const activeSessions = filteredSessions.filter(s => s.isActive).length;
    const completedSessions = filteredSessions.filter(s => s.progress?.certificateGenerated).length;
    const qcmScores = filteredSessions
      .filter(s => s.progress?.qcmScore !== undefined)
      .map(s => s.progress!.qcmScore!);
    
    const durations = filteredSessions
      .filter(s => s.progress?.sessionDuration)
      .map(s => s.progress!.sessionDuration / 60);

    // Peak hours analysis
    const hourlyStats = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      sessions: filteredSessions.filter(s => {
        if (!s.progress?.startTime) return false;
        return new Date(s.progress.startTime).getHours() === hour;
      }).length
    }));

    // Device statistics
    const deviceStats = filteredSessions.reduce((acc, session) => {
      const device = session.user?.device || "unknown";
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Language statistics
    const languageStats = filteredSessions.reduce((acc, session) => {
      const language = session.user?.language || "unknown";
      acc[language] = (acc[language] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Location statistics
    const locationStats = filteredSessions.reduce((acc, session) => {
      const location = session.user?.location || "unknown";
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Score distribution
    const scoreRanges = [
      { range: "90-100%", min: 90, max: 100 },
      { range: "80-89%", min: 80, max: 89 },
      { range: "70-79%", min: 70, max: 79 },
      { range: "60-69%", min: 60, max: 69 },
      { range: "<60%", min: 0, max: 59 },
    ];

    const scoreDistribution = scoreRanges.map(range => ({
      range: range.range,
      count: qcmScores.filter(score => score >= range.min && score <= range.max).length
    }));

    // Completion trend (last 14 days)
    const completionTrend = Array.from({ length: 14 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

      const dayStarted = filteredSessions.filter(session => {
        if (!session.progress?.startTime) return false;
        const sessionDate = new Date(session.progress.startTime);
        return sessionDate >= dayStart && sessionDate < dayEnd;
      }).length;

      const dayCompleted = filteredSessions.filter(session => {
        if (!session.progress?.startTime || !session.progress.certificateGenerated) return false;
        const sessionDate = new Date(session.progress.startTime);
        return sessionDate >= dayStart && sessionDate < dayEnd;
      }).length;

      return {
        date: dayStart.toLocaleDateString("fr-FR", { month: "short", day: "numeric" }),
        completed: dayCompleted,
        started: dayStarted
      };
    }).reverse();

    const helpRequests = filteredSessions.filter(s => s.progress?.helpRequested).length;
    const multipleAttempts = filteredSessions.filter(s => (s.progress?.attemptsCount || 1) > 1).length;

    return {
      totalSessions: filteredSessions.length,
      activeSessions,
      completedSessions,
      averageScore: qcmScores.length > 0 ? qcmScores.reduce((a, b) => a + b, 0) / qcmScores.length : 0,
      averageDuration: durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0,
      dropoutRate: filteredSessions.length > 0 ? (filteredSessions.length - completedSessions) / filteredSessions.length * 100 : 0,
      conversionRate: filteredSessions.length > 0 ? completedSessions / filteredSessions.length * 100 : 0,
      peakHours: hourlyStats.sort((a, b) => b.sessions - a.sessions).slice(0, 3),
      deviceStats,
      languageStats,
      locationStats,
      completionTrend,
      scoreDistribution,
      helpRequestRate: filteredSessions.length > 0 ? helpRequests / filteredSessions.length * 100 : 0,
      retryRate: filteredSessions.length > 0 ? multipleAttempts / filteredSessions.length * 100 : 0,
    };
  }, [sessions, selectedPeriod, selectedProfile, selectedLocation]);

  const handleAdvancedExport = async (format: "csv" | "pdf" | "json" | "excel") => {
    if (!hasPermission("export_data")) {
      notifyInfo("Permission refusée", "Vous n'avez pas les droits pour exporter les données");
      return;
    }

    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `formation-securite-advanced-${selectedPeriod}j-${timestamp}`;

    try {
      switch (format) {
        case "csv":
          exportToCSV({ ...analytics, sessions, exportDate: new Date().toISOString(), exportedBy: user?.username || "admin" }, `${filename}.csv`);
          break;
        case "pdf":
          exportToPDF({ ...analytics, sessions, exportDate: new Date().toISOString(), exportedBy: user?.username || "admin" }, `${filename}.pdf`);
          break;
        case "json":
          exportToJSON({ ...analytics, sessions, exportDate: new Date().toISOString(), exportedBy: user?.username || "admin" }, `${filename}.json`);
          break;
        case "excel":
          // Enhanced Excel export would be implemented here
          notifyInfo("Excel Export", "Fonctionnalité Excel en développement");
          break;
      }
      notifySuccess("Export réussi", `Données exportées au format ${format.toUpperCase()}`);
    } catch (error) {
      notifyError("Erreur d'export", "Impossible d'exporter les données");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-white/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg">Chargement des analytics avancées...</p>
          <p className="text-sm text-slate-400 mt-2">Analyse de {sessions.length} sessions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Enhanced Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Shield className="w-6 h-6 text-emerald-500" />
                  Dashboard Admin
                </h1>
                <p className="text-slate-300 text-sm">
                  {user?.username} ({user?.role}) • {analytics.totalSessions} sessions • {analytics.activeSessions} actives
                </p>
              </div>
              
              {realTimeMode && (
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/50 rounded-full">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-emerald-400 text-xs font-medium">Mode Temps Réel</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Advanced Filters */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white rounded-lg px-3 py-2 text-sm"
                >
                  <option value="7">7 jours</option>
                  <option value="30">30 jours</option>
                  <option value="90">90 jours</option>
                  <option value="365">1 an</option>
                </select>

                <select
                  value={selectedProfile}
                  onChange={(e) => setSelectedProfile(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">Tous profils</option>
                  <option value="driver">Chauffeurs</option>
                  <option value="technician">Techniciens</option>
                  <option value="cleaning">Nettoyage</option>
                  <option value="administrative">Administratif</option>
                </select>

                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">Tous sites</option>
                  {Object.keys(analytics.locationStats).map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Control Buttons */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`text-white border-slate-600 hover:bg-slate-700 ${autoRefresh ? 'bg-emerald-500/20 border-emerald-500' : ''}`}
                >
                  <RefreshCcw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                  Auto
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setRealTimeMode(!realTimeMode)}
                  className={`text-white border-slate-600 hover:bg-slate-700 ${realTimeMode ? 'bg-blue-500/20 border-blue-500' : ''}`}
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  Live
                </Button>
              </div>

              {/* Enhanced Export Options */}
              {hasPermission("export_data") && (
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => handleAdvancedExport("csv")} className="bg-slate-800/50 text-white border-slate-600 hover:bg-slate-700 backdrop-blur-md">
                    <FileText className="w-4 h-4 mr-1" />CSV
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAdvancedExport("pdf")} className="bg-slate-800/50 text-white border-slate-600 hover:bg-slate-700 backdrop-blur-md">
                    <Download className="w-4 h-4 mr-1" />PDF
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAdvancedExport("json")} className="bg-slate-800/50 text-white border-slate-600 hover:bg-slate-700 backdrop-blur-md">
                    <Database className="w-4 h-4 mr-1" />JSON
                  </Button>
                </div>
              )}

              <Button size="sm" variant="outline" onClick={logout} className="text-white border-slate-600 hover:bg-slate-700">
                <LogOut className="w-4 h-4 mr-2" />Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Enhanced Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs">Sessions totales</p>
                  <p className="text-2xl font-bold text-white">{analytics.totalSessions}</p>
                  <p className="text-emerald-400 text-xs">+{Math.round(analytics.conversionRate)}% conversion</p>
                </div>
                <Users className="w-6 h-6 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs">Sessions actives</p>
                  <p className="text-2xl font-bold text-white">{analytics.activeSessions}</p>
                  <p className="text-blue-400 text-xs">En temps réel</p>
                </div>
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs">Score moyen</p>
                  <p className="text-2xl font-bold text-white">{analytics.averageScore.toFixed(1)}%</p>
                  <p className="text-purple-400 text-xs">QCM réussis</p>
                </div>
                <Award className="w-6 h-6 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs">Durée moyenne</p>
                  <p className="text-2xl font-bold text-white">{Math.round(analytics.averageDuration)}</p>
                  <p className="text-orange-400 text-xs">minutes</p>
                </div>
                <Clock className="w-6 h-6 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs">Taux abandon</p>
                  <p className="text-2xl font-bold text-white">{analytics.dropoutRate.toFixed(1)}%</p>
                  <p className="text-red-400 text-xs">À améliorer</p>
                </div>
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs">Demandes d'aide</p>
                  <p className="text-2xl font-bold text-white">{analytics.helpRequestRate.toFixed(1)}%</p>
                  <p className="text-yellow-400 text-xs">Support</p>
                </div>
                <Settings className="w-6 h-6 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {/* Completion Trend */}
          <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-md lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Tendance de completion (14 jours)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.completionTrend.map((day, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300 w-16">{day.date}</span>
                      <div className="flex gap-4 text-xs">
                        <span className="text-blue-400">Démarrées: {day.started}</span>
                        <span className="text-emerald-400">Terminées: {day.completed}</span>
                        <span className="text-orange-400">
                          Taux: {day.started > 0 ? Math.round((day.completed / day.started) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 h-2">
                      <div className="flex-1 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500" 
                          style={{ width: `${Math.min((day.started / Math.max(...analytics.completionTrend.map(d => d.started))) * 100, 100)}%` }}
                        />
                      </div>
                      <div className="flex-1 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500" 
                          style={{ width: `${Math.min((day.completed / Math.max(...analytics.completionTrend.map(d => d.completed))) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Score Distribution */}
          <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Distribution des scores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.scoreDistribution.map((score, index) => {
                  const percentage = analytics.totalSessions > 0 ? (score.count / analytics.totalSessions) * 100 : 0;
                  const colors = ["text-emerald-400", "text-blue-400", "text-yellow-400", "text-orange-400", "text-red-400"];
                  
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className={`${colors[index]} font-medium`}>{score.range}</span>
                        <span className="text-white">{score.count} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Device & Language Stats */}
          <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Monitor className="w-5 h-5 mr-2" />
                Appareils utilisés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(analytics.deviceStats).map(([device, count]) => {
                  const percentage = (count / analytics.totalSessions) * 100;
                  const deviceIcons = { tablet: "📱", desktop: "💻", mobile: "📲" };
                  
                  return (
                    <div key={device} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300 capitalize flex items-center gap-1">
                          {deviceIcons[device as keyof typeof deviceIcons] || "🖥️"} {device}
                        </span>
                        <span className="text-white">{count} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Langues utilisées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(analytics.languageStats).map(([language, count]) => {
                  const percentage = (count / analytics.totalSessions) * 100;
                  const languageFlags = { fr: "🇫🇷", en: "🇬🇧", de: "🇩🇪", es: "🇪🇸", it: "🇮🇹", pt: "🇵🇹" };
                  
                  return (
                    <div key={language} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300 uppercase flex items-center gap-1">
                          {languageFlags[language as keyof typeof languageFlags] || "🌐"} {language}
                        </span>
                        <span className="text-white">{count} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Peak Hours */}
          <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Heures de pointe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.peakHours.map((peak, index) => {
                  const medals = ["🥇", "🥈", "🥉"];
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{medals[index]}</span>
                        <span className="text-white font-medium">{peak.hour}h00</span>
                      </div>
                      <span className="text-emerald-400 font-medium">{peak.sessions} sessions</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Real-time Session Monitor */}
        <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center">
                <Monitor className="w-5 h-5 mr-2" />
                Sessions en cours ({analytics.activeSessions})
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-emerald-400 text-sm">Temps réel</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left text-slate-400 p-3 font-medium">Utilisateur</th>
                    <th className="text-left text-slate-400 p-3 font-medium">Profil</th>
                    <th className="text-left text-slate-400 p-3 font-medium">Site</th>
                    <th className="text-left text-slate-400 p-3 font-medium">Étape</th>
                    <th className="text-left text-slate-400 p-3 font-medium">Progression</th>
                    <th className="text-left text-slate-400 p-3 font-medium">Durée</th>
                    <th className="text-left text-slate-400 p-3 font-medium">Appareil</th>
                    <th className="text-left text-slate-400 p-3 font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.filter(s => s.isActive).slice(0, 10).map((session) => {
                    const user = session.user;
                    const progress = session.progress;
                    const progressPercentage = progress ? Math.round((progress.completedSteps.length / 6) * 100) : 0;
                    const duration = progress ? Math.round(progress.sessionDuration / 60) : 0;
                    const stepNames = ["Accueil", "Profil", "Introduction", "Sécurité", "QCM", "Certificat"];

                    return (
                      <tr key={session.sessionId} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                        <td className="text-white p-3 font-medium">
                          {user ? `${user.firstName} ${user.lastName}` : "N/A"}
                        </td>
                        <td className="text-slate-300 p-3 capitalize">
                          {user?.profileType || "N/A"}
                        </td>
                        <td className="text-slate-300 p-3">
                          {user?.location || "N/A"}
                        </td>
                        <td className="text-slate-300 p-3">
                          {progress ? stepNames[progress.currentStep] || `Étape ${progress.currentStep}` : "N/A"}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Progress value={progressPercentage} className="h-2 w-20" />
                            <span className="text-xs text-slate-400">{progressPercentage}%</span>
                          </div>
                        </td>
                        <td className="text-slate-300 p-3">{duration} min</td>
                        <td className="text-slate-300 p-3 capitalize">
                          {user?.device || "N/A"}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-emerald-400 text-sm">Actif</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {sessions.filter(s => s.isActive).length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <Monitor className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Aucune session active en ce moment</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
