import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // Here you would log to Sentry, LogRocket, etc.
      console.error('Production error:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      });
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback component
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
          <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-md max-w-2xl w-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-xl">
                <AlertTriangle className="w-6 h-6 mr-3 text-red-400" />
                Une erreur s'est produite
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 font-medium mb-2">
                  Erreur détectée dans l'application
                </p>
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="text-red-300 text-sm">
                    <summary className="cursor-pointer">Détails techniques</summary>
                    <div className="mt-2 p-2 bg-slate-900/50 rounded font-mono text-xs overflow-auto">
                      <div className="mb-2">
                        <strong>Message:</strong> {this.state.error.message}
                      </div>
                      {this.state.error.stack && (
                        <div className="mb-2">
                          <strong>Stack:</strong>
                          <pre className="whitespace-pre-wrap">{this.state.error.stack}</pre>
                        </div>
                      )}
                      {this.state.errorInfo?.componentStack && (
                        <div>
                          <strong>Component Stack:</strong>
                          <pre className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}
              </div>

              <div className="text-slate-300">
                <p className="mb-4">
                  L'application a rencontré une erreur inattendue. Vous pouvez essayer de :
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Rafraîchir la page</li>
                  <li>Vider le cache du navigateur</li>
                  <li>Revenir à l'accueil</li>
                  <li>Contacter le support si le problème persiste</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={this.resetError}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Réessayer
                </Button>
                
                <Button
                  onClick={() => window.location.href = '/'}
                  variant="outline"
                  className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Accueil
                </Button>
                
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Rafraîchir
                </Button>
              </div>

              <div className="text-xs text-slate-500 pt-4 border-t border-slate-700">
                <p>
                  Si cette erreur persiste, veuillez contacter le support technique avec l'ID d'erreur :{' '}
                  <code className="bg-slate-900/50 px-1 py-0.5 rounded">
                    {Date.now().toString(36).toUpperCase()}
                  </code>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: React.ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    
    // In a real app, you'd send this to your error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Send to Sentry, LogRocket, etc.
    }
  };
}

// Simple fallback component
export function SimpleErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="text-center text-white max-w-md">
        <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Oops! Une erreur s'est produite</h2>
        <p className="text-slate-300 mb-6">
          L'application a rencontré un problème inattendu.
        </p>
        <div className="space-y-2">
          <Button onClick={resetError} className="w-full">
            Réessayer
          </Button>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            className="w-full"
          >
            Rafraîchir la page
          </Button>
        </div>
      </div>
    </div>
  );
}
