import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Calculator,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface ROIMetrics {
  accidentsAvoided: number;
  accidentCostPerIncident: number;
  complianceFines: number;
  timeEfficiencyGains: number;
  trainingCostPerPerson: number;
  totalEmployeesTrained: number;
  implementationCost: number;
  annualSavings: number;
  roi: number;
  paybackPeriod: number;
}

export function ROICalculator() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentYear, setCurrentYear] = useState(1);

  // Données simulées réalistes pour Gerflor
  const baseMetrics: ROIMetrics = {
    accidentsAvoided: 12, // accidents évités par an
    accidentCostPerIncident: 45000, // coût moyen par accident (€)
    complianceFines: 180000, // amendes de conformité évitées
    timeEfficiencyGains: 320, // heures économisées par mois
    trainingCostPerPerson: 85, // coût par personne formée
    totalEmployeesTrained: 1247, // total formés
    implementationCost: 25000, // coût implémentation
    annualSavings: 0, // calculé
    roi: 0, // calculé
    paybackPeriod: 0 // calculé en mois
  };

  const [metrics, setMetrics] = useState<ROIMetrics>(baseMetrics);

  // Calculs automatiques
  useEffect(() => {
    const accidentSavings = metrics.accidentsAvoided * metrics.accidentCostPerIncident;
    const timeSavings = metrics.timeEfficiencyGains * 12 * 35; // 35€/heure moyenne
    const totalAnnualSavings = accidentSavings + metrics.complianceFines + timeSavings;
    const totalCosts = metrics.implementationCost + (metrics.totalEmployeesTrained * metrics.trainingCostPerPerson);
    const roi = ((totalAnnualSavings - totalCosts) / totalCosts) * 100;
    const paybackMonths = totalCosts / (totalAnnualSavings / 12);

    setMetrics(prev => ({
      ...prev,
      annualSavings: totalAnnualSavings,
      roi: roi,
      paybackPeriod: paybackMonths
    }));
  }, [metrics.accidentsAvoided, metrics.accidentCostPerIncident, metrics.complianceFines, metrics.timeEfficiencyGains]);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const projectedYears = [
    { year: 1, savings: metrics.annualSavings, cumulative: metrics.annualSavings - (metrics.implementationCost + metrics.totalEmployeesTrained * metrics.trainingCostPerPerson) },
    { year: 2, savings: metrics.annualSavings * 1.15, cumulative: 0 },
    { year: 3, savings: metrics.annualSavings * 1.32, cumulative: 0 }
  ];

  // Calcul cumulatif
  projectedYears[1].cumulative = projectedYears[0].cumulative + projectedYears[1].savings;
  projectedYears[2].cumulative = projectedYears[1].cumulative + projectedYears[2].savings;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(Math.round(num));
  };

  return (
    <div className="space-y-6">
      {/* Header avec impact principal */}
      <Card className="bg-gradient-to-r from-emerald-900/50 to-green-900/50 border-emerald-500/50 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-white flex items-center text-2xl">
            <DollarSign className="w-6 h-6 mr-3 text-emerald-400" />
            Calculateur de ROI - Impact Financier
            <div className="ml-auto text-right">
              <div className="text-3xl font-bold text-emerald-400">
                {formatNumber(metrics.roi)}%
              </div>
              <div className="text-sm text-emerald-300">ROI Annuel</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white">{formatCurrency(metrics.annualSavings)}</div>
              <div className="text-sm text-emerald-300">Économies Annuelles</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white">{Math.round(metrics.paybackPeriod)} mois</div>
              <div className="text-sm text-blue-300">Retour sur Investissement</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white">{metrics.accidentsAvoided}</div>
              <div className="text-sm text-orange-300">Accidents Évités/An</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white">{formatNumber(metrics.timeEfficiencyGains * 12)}h</div>
              <div className="text-sm text-purple-300">Temps Économisé/An</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition des économies */}
        <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Répartition des Économies Annuelles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-300 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 text-red-400" />
                    Accidents évités
                  </span>
                  <span className="text-white font-bold">
                    {formatCurrency(metrics.accidentsAvoided * metrics.accidentCostPerIncident)}
                  </span>
                </div>
                <Progress 
                  value={(metrics.accidentsAvoided * metrics.accidentCostPerIncident / metrics.annualSavings) * 100} 
                  className="h-3"
                />
                <div className="text-xs text-slate-400 mt-1">
                  {metrics.accidentsAvoided} accidents × {formatCurrency(metrics.accidentCostPerIncident)}
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-300 flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-blue-400" />
                    Conformité légale
                  </span>
                  <span className="text-white font-bold">
                    {formatCurrency(metrics.complianceFines)}
                  </span>
                </div>
                <Progress 
                  value={(metrics.complianceFines / metrics.annualSavings) * 100} 
                  className="h-3"
                />
                <div className="text-xs text-slate-400 mt-1">
                  Amendes et sanctions évitées
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-300 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-green-400" />
                    Efficacité temps
                  </span>
                  <span className="text-white font-bold">
                    {formatCurrency(metrics.timeEfficiencyGains * 12 * 35)}
                  </span>
                </div>
                <Progress 
                  value={(metrics.timeEfficiencyGains * 12 * 35 / metrics.annualSavings) * 100} 
                  className="h-3"
                />
                <div className="text-xs text-slate-400 mt-1">
                  {formatNumber(metrics.timeEfficiencyGains * 12)}h × 35€/heure
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projection sur 3 ans */}
        <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Projection ROI sur 3 ans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectedYears.map((yearData, index) => (
                <div key={index} className="relative">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-300 font-medium">Année {yearData.year}</span>
                    <div className="text-right">
                      <div className="text-white font-bold">{formatCurrency(yearData.savings)}</div>
                      <div className={`text-xs ${yearData.cumulative > 0 ? 'text-emerald-400' : 'text-orange-400'}`}>
                        Cumul: {formatCurrency(yearData.cumulative)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={Math.min((yearData.savings / projectedYears[2].savings) * 100, 100)} 
                      className="h-2 flex-1"
                    />
                    <CheckCircle className={`w-4 h-4 ${yearData.cumulative > 0 ? 'text-emerald-400' : 'text-orange-400'}`} />
                  </div>
                  {index === 0 && (
                    <div className="text-xs text-slate-400 mt-1">
                      Seuil de rentabilité atteint en {Math.round(metrics.paybackPeriod)} mois
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-emerald-400 font-bold">ROI Total 3 ans</div>
                  <div className="text-slate-300 text-sm">Bénéfice cumulé</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-400">
                    {formatNumber(((projectedYears[2].cumulative) / (metrics.implementationCost + metrics.totalEmployeesTrained * metrics.trainingCostPerPerson)) * 100)}%
                  </div>
                  <div className="text-emerald-300 text-sm">
                    {formatCurrency(projectedYears[2].cumulative)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparaison Avant/Après */}
      <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Comparaison Impact - Avant vs Après Formation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-red-400 text-lg font-bold mb-2">AVANT</div>
              <div className="space-y-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div>
                  <div className="text-2xl font-bold text-red-400">18</div>
                  <div className="text-sm text-slate-300">Accidents/an</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-400">67%</div>
                  <div className="text-sm text-slate-300">Conformité</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-400">{formatCurrency(810000)}</div>
                  <div className="text-sm text-slate-300">Coûts annuels</div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-emerald-400 text-lg font-bold mb-2">APRÈS</div>
              <div className="space-y-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <div>
                  <div className="text-2xl font-bold text-emerald-400">6</div>
                  <div className="text-sm text-slate-300">Accidents/an</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-400">96%</div>
                  <div className="text-sm text-slate-300">Conformité</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-400">{formatCurrency(810000 - metrics.annualSavings)}</div>
                  <div className="text-sm text-slate-300">Coûts annuels</div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-blue-400 text-lg font-bold mb-2">IMPACT</div>
              <div className="space-y-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div>
                  <div className="text-2xl font-bold text-blue-400">-67%</div>
                  <div className="text-sm text-slate-300">Accidents</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">+43%</div>
                  <div className="text-sm text-slate-300">Conformité</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">{formatCurrency(metrics.annualSavings)}</div>
                  <div className="text-sm text-slate-300">Économies</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-3 text-lg font-semibold">
              <DollarSign className="w-5 h-5 mr-2" />
              Télécharger l'Analyse ROI Complète
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
