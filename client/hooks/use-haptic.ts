import { useCallback, useRef } from 'react';

export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

interface HapticConfig {
  enabled: boolean;
  intensity: number;
}

// Vibration patterns for different interactions (in milliseconds)
const HAPTIC_PATTERNS: Record<HapticType, number | number[]> = {
  light: 50,
  medium: 100,
  heavy: 200,
  success: [100, 50, 100], // Short-pause-short pattern
  warning: [150, 100, 150], // Medium-pause-medium pattern
  error: [200, 100, 200, 100, 200], // Heavy pattern for errors
};

export function useHaptic() {
  const configRef = useRef<HapticConfig>({ enabled: true, intensity: 1 });

  // Check if device supports vibration
  const isVibrationSupported = useCallback(() => {
    return 'vibrate' in navigator;
  }, []);

  // Simulate visual feedback when vibration is not available
  const simulateVisualFeedback = useCallback((element: HTMLElement, type: HapticType) => {
    if (!element) return;

    const originalTransform = element.style.transform;
    const originalBoxShadow = element.style.boxShadow;
    
    // Different visual effects based on haptic type
    switch (type) {
      case 'light':
        element.style.transform = 'scale(0.98)';
        break;
      case 'medium':
        element.style.transform = 'scale(0.95)';
        element.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.3)';
        break;
      case 'heavy':
        element.style.transform = 'scale(0.92)';
        element.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.5)';
        break;
      case 'success':
        element.style.transform = 'scale(1.02)';
        element.style.boxShadow = '0 0 15px rgba(34, 197, 94, 0.6)';
        break;
      case 'warning':
        element.style.transform = 'scale(0.96)';
        element.style.boxShadow = '0 0 15px rgba(245, 158, 11, 0.6)';
        break;
      case 'error':
        element.style.transform = 'scale(0.94)';
        element.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.6)';
        break;
    }

    // Reset after animation
    setTimeout(() => {
      element.style.transform = originalTransform;
      element.style.boxShadow = originalBoxShadow;
    }, 150);
  }, []);

  const triggerHaptic = useCallback((type: HapticType, element?: HTMLElement) => {
    if (!configRef.current.enabled) return;

    const pattern = HAPTIC_PATTERNS[type];
    
    // Try native vibration first
    if (isVibrationSupported()) {
      try {
        if (Array.isArray(pattern)) {
          // Adjust intensity for pattern
          const adjustedPattern = pattern.map(duration => 
            Math.round(duration * configRef.current.intensity)
          );
          navigator.vibrate(adjustedPattern);
        } else {
          navigator.vibrate(Math.round(pattern * configRef.current.intensity));
        }
      } catch (error) {
        console.warn('Vibration failed:', error);
      }
    }
    
    // Always provide visual feedback for better UX
    if (element) {
      simulateVisualFeedback(element, type);
    }
  }, [isVibrationSupported, simulateVisualFeedback]);

  // Convenience methods
  const triggerLight = useCallback((element?: HTMLElement) => 
    triggerHaptic('light', element), [triggerHaptic]);
  
  const triggerMedium = useCallback((element?: HTMLElement) => 
    triggerHaptic('medium', element), [triggerHaptic]);
  
  const triggerHeavy = useCallback((element?: HTMLElement) => 
    triggerHaptic('heavy', element), [triggerHaptic]);
  
  const triggerSuccess = useCallback((element?: HTMLElement) => 
    triggerHaptic('success', element), [triggerHaptic]);
  
  const triggerWarning = useCallback((element?: HTMLElement) => 
    triggerHaptic('warning', element), [triggerHaptic]);
  
  const triggerError = useCallback((element?: HTMLElement) => 
    triggerHaptic('error', element), [triggerHaptic]);

  const toggleHaptic = useCallback(() => {
    configRef.current.enabled = !configRef.current.enabled;
    return configRef.current.enabled;
  }, []);

  const setIntensity = useCallback((intensity: number) => {
    configRef.current.intensity = Math.max(0, Math.min(1, intensity));
  }, []);

  const isHapticEnabled = useCallback(() => configRef.current.enabled, []);

  return {
    triggerHaptic,
    triggerLight,
    triggerMedium,
    triggerHeavy,
    triggerSuccess,
    triggerWarning,
    triggerError,
    toggleHaptic,
    setIntensity,
    isHapticEnabled,
    isVibrationSupported,
  };
}
