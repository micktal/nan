import { useState } from 'react';
import { X, Smartphone, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MobileDashboard from '@/pages/MobileDashboard';

interface MobileSupervisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSupervisorModal({ isOpen, onClose }: MobileSupervisorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-sm mx-auto bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
        {/* Modal Header */}
        <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Smartphone className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-white font-bold">Supervisor Mobile</h2>
                <p className="text-slate-400 text-sm">Interface mobile de supervision</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Dashboard Content */}
        <div className="h-[600px] overflow-hidden">
          <div className="transform scale-100 origin-top">
            <MobileDashboard />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-800/50 border-t border-slate-700 p-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Shield className="w-3 h-3" />
              <span>Mode Simulation</span>
            </div>
            <span>Appuyez ESC pour fermer</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook pour gérer la fermeture avec ESC
export function useMobileSupervisorModal() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // Fermeture avec ESC
  useState(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  });

  return {
    isOpen,
    openModal,
    closeModal
  };
}
