import { Star, Quote, TrendingUp, Users, Shield, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BusinessCase() {
  const testimonials = [
    {
      company: "Schneider Electric",
      logo: "⚡",
      person: "Marie Dubois, Directrice HSE",
      quote:
        "Réduction de 73% des accidents depuis l'implémentation. Le ROI a été atteint en seulement 3 mois. Une solution révolutionnaire pour notre industrie.",
      metrics: {
        roi: "340%",
        accidents: "-73%",
        compliance: "99%",
        satisfaction: "4.9/5",
      },
      size: "2,800 employés",
    },
    {
      company: "Saint-Gobain",
      logo: "🏗️",
      person: "Jean-Pierre Martin, DRH",
      quote:
        "L'impact sur notre culture sécurité est extraordinaire. Formation engageante, suivi précis, économies substantielles. Exactement ce dont Gerflor a besoin.",
      metrics: {
        roi: "285%",
        accidents: "-58%",
        compliance: "97%",
        satisfaction: "4.8/5",
      },
      size: "4,200 employés",
    },
  ];

  const competitorComparison = [
    { feature: "Formation interactive", us: true, competitor: false },
    { feature: "Calcul ROI temps réel", us: true, competitor: false },
    { feature: "Badges sécurisés", us: true, competitor: false },
    { feature: "Multilingue (9 langues)", us: true, competitor: true },
    { feature: "Analytics avancées", us: true, competitor: false },
    { feature: "Support 24/7", us: true, competitor: true },
    { feature: "Prix compétitif", us: true, competitor: false },
  ];

  const industryBenchmarks = [
    {
      metric: "Réduction accidents",
      industry: "35%",
      solution: "67%",
      improvement: "+91%",
    },
    {
      metric: "Temps formation",
      industry: "4h",
      solution: "45min",
      improvement: "-81%",
    },
    {
      metric: "Coût par employé",
      industry: "180€",
      solution: "85€",
      improvement: "-53%",
    },
    {
      metric: "Taux completion",
      industry: "72%",
      solution: "94%",
      improvement: "+31%",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Success Stories */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
          <Star className="w-6 h-6 text-yellow-400" />
          Témoignages Clients - Succès Prouvés
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-slate-800/50 border-slate-600/50 backdrop-blur-md"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{testimonial.logo}</div>
                  <div>
                    <CardTitle className="text-white text-lg">
                      {testimonial.company}
                    </CardTitle>
                    <p className="text-slate-300 text-sm">{testimonial.size}</p>
                  </div>
                  <div className="ml-auto flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Quote className="absolute top-0 left-0 w-6 h-6 text-emerald-400 opacity-50" />
                  <p className="text-slate-300 italic pl-8 pr-4">
                    "{testimonial.quote}"
                  </p>
                  <p className="text-slate-400 text-sm mt-2 text-right">
                    — {testimonial.person}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2 bg-emerald-500/10 rounded">
                    <div className="text-emerald-400 font-bold">
                      {testimonial.metrics.roi}
                    </div>
                    <div className="text-xs text-slate-400">ROI</div>
                  </div>
                  <div className="text-center p-2 bg-red-500/10 rounded">
                    <div className="text-red-400 font-bold">
                      {testimonial.metrics.accidents}
                    </div>
                    <div className="text-xs text-slate-400">Accidents</div>
                  </div>
                  <div className="text-center p-2 bg-blue-500/10 rounded">
                    <div className="text-blue-400 font-bold">
                      {testimonial.metrics.compliance}
                    </div>
                    <div className="text-xs text-slate-400">Conformité</div>
                  </div>
                  <div className="text-center p-2 bg-yellow-500/10 rounded">
                    <div className="text-yellow-400 font-bold">
                      {testimonial.metrics.satisfaction}
                    </div>
                    <div className="text-xs text-slate-400">Satisfaction</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Industry Benchmarks */}
      <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Performance vs Marché - Gerflor Leader Industrie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {industryBenchmarks.map((benchmark, index) => (
              <div
                key={index}
                className="text-center p-4 bg-white/5 rounded-lg"
              >
                <div className="text-sm text-slate-400 mb-2">
                  {benchmark.metric}
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-slate-500">
                    Marché: {benchmark.industry}
                  </div>
                  <div className="text-lg font-bold text-white">
                    {benchmark.solution}
                  </div>
                  <div className="text-sm font-bold text-emerald-400">
                    {benchmark.improvement}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Competitive Advantage */}
      <Card className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border-emerald-500/50 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Avantage Concurrentiel - Pourquoi Nous Choisir
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-bold text-white mb-4">
                Notre Solution vs Concurrence
              </h4>
              <div className="space-y-3">
                {competitorComparison.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-slate-300">{item.feature}</span>
                    <div className="flex gap-4">
                      <div className="w-16 text-center">
                        {item.us ? (
                          <div className="text-emerald-400 font-bold">✓</div>
                        ) : (
                          <div className="text-red-400">✗</div>
                        )}
                      </div>
                      <div className="w-16 text-center text-slate-500">
                        {item.competitor ? "✓" : "✗"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-4">
                Bénéfices Exclusifs Gerflor
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-emerald-500/10 rounded-lg">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <span className="text-slate-300">
                    Solution sur-mesure industrie
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  <span className="text-slate-300">
                    ROI calculé en temps réel
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-500/10 rounded-lg">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span className="text-slate-300">Support dédié 24/7</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-orange-500/10 rounded-lg">
                  <Award className="w-5 h-5 text-orange-400" />
                  <span className="text-slate-300">
                    Garantie résultats 90 jours
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
