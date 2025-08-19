import { useState } from "react";
import { Eye, EyeOff, Shield, Lock, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdmin, getCurrentAccessCodes } from "@/hooks/use-admin";
import { useSound } from "@/hooks/use-sound";
import { useHaptic } from "@/hooks/use-haptic";

interface AdminLoginProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AdminLogin({ onSuccess, onCancel }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [showCodes, setShowCodes] = useState(false);

  const dailyCodes = getCurrentAccessCodes();

  const { login } = useAdmin();
  const { playClickSound, playSuccessSound, playErrorSound } = useSound();
  const { triggerLight, triggerSuccess, triggerError } = useHaptic();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Veuillez remplir tous les champs");
      playErrorSound();
      triggerError();
      return;
    }

    setIsLoading(true);
    setError("");
    playClickSound();

    try {
      const success = await login(username, password);

      if (success) {
        playSuccessSound();
        triggerSuccess();
        onSuccess?.();
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= 3) {
          setError(
            "Trop de tentatives échouées. Veuillez réessayer plus tard.",
          );
        } else {
          setError("Nom d'utilisateur ou mot de passe incorrect");
        }

        playErrorSound();
        triggerError();

        // Reset form on error
        setPassword("");
      }
    } catch (error) {
      setError("Erreur de connexion. Veuillez réessayer.");
      playErrorSound();
      triggerError();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    playClickSound();
    triggerLight();
    onCancel?.();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-600/50 shadow-2xl terminal-glow backdrop-blur-md">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-white text-xl">
            Accès Administrateur
          </CardTitle>
          <p className="text-slate-400 text-sm">
            Connexion requise pour accéder aux fonctionnalités d'administration
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">
                Nom d'utilisateur
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white focus-ring"
                  placeholder="admin, supervisor, hse"
                  disabled={isLoading || attempts >= 3}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-slate-700/50 border-slate-600 text-white focus-ring"
                  placeholder="•••���••••"
                  disabled={isLoading || attempts >= 3}
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0 hover:bg-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-slate-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-400" />
                  )}
                </Button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}

            {/* Demo Credentials Info */}
            <div className="space-y-3">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-emerald-400 text-xs font-medium">
                    Comptes de démonstration :
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCodes(!showCodes)}
                    className="text-emerald-400 hover:text-emerald-300 h-auto p-1 text-xs"
                  >
                    {showCodes ? "Masquer codes" : "Voir codes d'accès"}
                  </Button>
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="font-mono text-emerald-300">admin</span>
                    <span>- Accès complet</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="font-mono text-orange-300">
                      supervisor
                    </span>
                    <span>- Gestion et exports</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="font-mono text-blue-300">hse</span>
                    <span>- Consultation uniquement</span>
                  </div>
                </div>
              </div>

              {showCodes && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg animate-fade-in-up">
                  <p className="text-blue-400 text-xs mb-2 font-medium flex items-center gap-1">
                    🔐 Codes d'accès du jour (
                    {new Date().toLocaleDateString("fr-FR")}) :
                  </p>
                  <div className="text-xs text-slate-300 space-y-2">
                    <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                      <span className="text-emerald-300">admin</span>
                      <code className="text-white bg-slate-800 px-2 py-1 rounded text-xs font-mono">
                        {dailyCodes.admin}
                      </code>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                      <span className="text-orange-300">supervisor</span>
                      <code className="text-white bg-slate-800 px-2 py-1 rounded text-xs font-mono">
                        {dailyCodes.supervisor}
                      </code>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                      <span className="text-blue-300">hse</span>
                      <code className="text-white bg-slate-800 px-2 py-1 rounded text-xs font-mono">
                        {dailyCodes.hse}
                      </code>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 italic">
                      💡 Codes régénérés quotidiennement pour la sécurité
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Annuler
                </Button>
              )}
              <Button
                type="submit"
                disabled={isLoading || attempts >= 3 || !username || !password}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white interactive-element"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Connexion...
                  </div>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
