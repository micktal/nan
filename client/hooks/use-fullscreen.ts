import { useState, useEffect, useCallback } from 'react';

interface FullscreenAPI {
  requestFullscreen?: () => Promise<void>;
  exitFullscreen?: () => Promise<void>;
  fullscreenElement?: Element | null;
  fullscreenEnabled?: boolean;
  // Webkit prefixes
  webkitRequestFullscreen?: () => Promise<void>;
  webkitExitFullscreen?: () => Promise<void>;
  webkitFullscreenElement?: Element | null;
  webkitFullscreenEnabled?: boolean;
  // Mozilla prefixes
  mozRequestFullScreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  mozFullScreenElement?: Element | null;
  mozFullScreenEnabled?: boolean;
  // MS prefixes
  msRequestFullscreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
  msFullscreenElement?: Element | null;
  msFullscreenEnabled?: boolean;
}

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  // Check fullscreen API support
  useEffect(() => {
    const doc = document as Document & FullscreenAPI;
    const supported = !!(
      doc.fullscreenEnabled ||
      doc.webkitFullscreenEnabled ||
      doc.mozFullScreenEnabled ||
      doc.msFullscreenEnabled
    );
    setIsSupported(supported);
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const doc = document as Document & FullscreenAPI;
      const isCurrentlyFullscreen = !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    // Add event listeners for all browser prefixes
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const enterFullscreen = useCallback(async (element?: HTMLElement) => {
    if (!isSupported) return false;

    const targetElement = element || document.documentElement;
    const elem = targetElement as HTMLElement & FullscreenAPI;

    try {
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        await elem.mozRequestFullScreen();
      } else if (elem.msRequestFullscreen) {
        await elem.msRequestFullscreen();
      }
      return true;
    } catch (error) {
      console.warn('Failed to enter fullscreen:', error);
      return false;
    }
  }, [isSupported]);

  const exitFullscreen = useCallback(async () => {
    if (!isSupported) return false;

    const doc = document as Document & FullscreenAPI;

    try {
      if (doc.exitFullscreen) {
        await doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        await doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        await doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        await doc.msExitFullscreen();
      }
      return true;
    } catch (error) {
      console.warn('Failed to exit fullscreen:', error);
      return false;
    }
  }, [isSupported]);

  const toggleFullscreen = useCallback(async (element?: HTMLElement) => {
    if (isFullscreen) {
      return await exitFullscreen();
    } else {
      return await enterFullscreen(element);
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  // Detect if device is likely a tablet
  const isTablet = useCallback(() => {
    // Check screen dimensions and touch capability
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const minDimension = Math.min(screenWidth, screenHeight);
    const maxDimension = Math.max(screenWidth, screenHeight);
    
    // Typical tablet dimensions (7-13 inches)
    const isTabletSize = minDimension >= 768 && maxDimension >= 1024 && maxDimension <= 1366;
    
    return hasTouch && isTabletSize;
  }, []);

  // Auto-enter fullscreen on tablet devices (with user permission)
  const enableTabletMode = useCallback(async () => {
    if (isTablet() && !isFullscreen) {
      // Request permission first with a user gesture
      return await enterFullscreen();
    }
    return false;
  }, [isTablet, isFullscreen, enterFullscreen]);

  return {
    isFullscreen,
    isSupported,
    isTablet: isTablet(),
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
    enableTabletMode,
  };
}
