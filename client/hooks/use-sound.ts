import { useCallback, useRef } from 'react';

// Types of sounds for better UX
export type SoundType = 'click' | 'success' | 'error' | 'notification' | 'beep' | 'confirm';

interface SoundConfig {
  enabled: boolean;
  volume: number;
}

// Sound frequencies and patterns for different interactions
const SOUND_PATTERNS: Record<SoundType, { frequency: number; duration: number; type: OscillatorType }> = {
  click: { frequency: 800, duration: 100, type: 'square' },
  success: { frequency: 523, duration: 200, type: 'sine' }, // C note
  error: { frequency: 200, duration: 300, type: 'square' },
  notification: { frequency: 440, duration: 150, type: 'sine' }, // A note
  beep: { frequency: 1000, duration: 80, type: 'sine' },
  confirm: { frequency: 659, duration: 250, type: 'sine' }, // E note
};

export function useSound() {
  const configRef = useRef<SoundConfig>({ enabled: true, volume: 0.3 });
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context lazily
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn('Audio context not supported:', error);
        return null;
      }
    }
    return audioContextRef.current;
  }, []);

  const playSound = useCallback((type: SoundType) => {
    if (!configRef.current.enabled) return;

    const audioContext = getAudioContext();
    if (!audioContext) return;

    try {
      const pattern = SOUND_PATTERNS[type];
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(pattern.frequency, audioContext.currentTime);
      oscillator.type = pattern.type;

      // Create envelope for smoother sound
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(configRef.current.volume, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + pattern.duration / 1000);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + pattern.duration / 1000);
    } catch (error) {
      console.warn('Failed to play sound:', error);
    }
  }, [getAudioContext]);

  const playClickSound = useCallback(() => playSound('click'), [playSound]);
  const playSuccessSound = useCallback(() => playSound('success'), [playSound]);
  const playErrorSound = useCallback(() => playSound('error'), [playSound]);
  const playNotificationSound = useCallback(() => playSound('notification'), [playSound]);
  const playBeepSound = useCallback(() => playSound('beep'), [playSound]);
  const playConfirmSound = useCallback(() => playSound('confirm'), [playSound]);

  const toggleSound = useCallback(() => {
    configRef.current.enabled = !configRef.current.enabled;
    return configRef.current.enabled;
  }, []);

  const setVolume = useCallback((volume: number) => {
    configRef.current.volume = Math.max(0, Math.min(1, volume));
  }, []);

  const isSoundEnabled = useCallback(() => configRef.current.enabled, []);

  return {
    playSound,
    playClickSound,
    playSuccessSound,
    playErrorSound,
    playNotificationSound,
    playBeepSound,
    playConfirmSound,
    toggleSound,
    setVolume,
    isSoundEnabled,
  };
}
