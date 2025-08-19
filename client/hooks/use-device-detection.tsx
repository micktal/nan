import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  userAgent: string;
  deviceType: "mobile" | "tablet" | "desktop";
  orientation: "portrait" | "landscape";
}

export function useDeviceDetection() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    userAgent: navigator.userAgent,
    deviceType: "desktop",
    orientation:
      window.innerWidth > window.innerHeight ? "landscape" : "portrait",
  });

  const [shouldAutoRedirect, setShouldAutoRedirect] = useState(true);

  useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const userAgent = navigator.userAgent;

      // Detection patterns
      const mobileRegex =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const tabletRegex = /iPad|Android(?=.*Tablet)|Surface/i;

      // Size-based detection
      const isMobileSize = width <= 768;
      const isTabletSize = width > 768 && width <= 1024;
      const isDesktopSize = width > 1024;

      // User agent-based detection
      const isMobileUA =
        mobileRegex.test(userAgent) && !tabletRegex.test(userAgent);
      const isTabletUA = tabletRegex.test(userAgent);

      // Combine both methods
      const isMobile = isMobileUA || (isMobileSize && !isTabletUA);
      const isTablet = isTabletUA || (isTabletSize && !isMobileUA);
      const isDesktop = !isMobile && !isTablet;

      let deviceType: "mobile" | "tablet" | "desktop" = "desktop";
      if (isMobile) deviceType = "mobile";
      else if (isTablet) deviceType = "tablet";

      const orientation = width > height ? "landscape" : "portrait";

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        screenWidth: width,
        screenHeight: height,
        userAgent,
        deviceType,
        orientation,
      });
    };

    // Initial detection
    detectDevice();

    // Listen for resize events
    const handleResize = () => {
      detectDevice();
    };

    // Listen for orientation change
    const handleOrientationChange = () => {
      setTimeout(detectDevice, 100); // Small delay for orientation change
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  return {
    ...deviceInfo,
    shouldAutoRedirect,
    setShouldAutoRedirect,
  };
}

// Hook for automatic redirection
export function useAutoMobileRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile, isTablet } = useDeviceDetection();

  useEffect(() => {
    // Don't redirect if user is already on mobile dashboard
    if (location.pathname === "/mobile") return;

    // Don't redirect if user specifically went to admin
    if (location.pathname === "/admin") return;

    // Check if user preference is stored
    const userPreference = localStorage.getItem("interface-preference");
    if (userPreference === "desktop") return;

    // Auto-redirect mobile users to mobile interface
    if (isMobile) {
      // Add a small delay to avoid jarring redirects
      const timer = setTimeout(() => {
        navigate("/mobile", { replace: true });
      }, 500);

      return () => clearTimeout(timer);
    }

    // Auto-redirect tablet users to mobile interface for better touch experience
    if (isTablet && location.pathname === "/") {
      const timer = setTimeout(() => {
        navigate("/mobile", { replace: true });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isMobile, isTablet, location.pathname, navigate]);

  const forceDesktopMode = () => {
    localStorage.setItem("interface-preference", "desktop");
    navigate("/dashboard");
  };

  const forceMobileMode = () => {
    localStorage.setItem("interface-preference", "mobile");
    navigate("/mobile");
  };

  const clearPreference = () => {
    localStorage.removeItem("interface-preference");
  };

  return {
    forceDesktopMode,
    forceMobileMode,
    clearPreference,
  };
}

// Component for device-specific styling
export function DeviceAdaptiveContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { deviceType, orientation, screenWidth } = useDeviceDetection();

  const containerClasses = [
    "device-adaptive-container",
    `device-${deviceType}`,
    `orientation-${orientation}`,
    screenWidth <= 480 ? "screen-xs" : "",
    screenWidth <= 768 ? "screen-sm" : "",
    screenWidth <= 1024 ? "screen-md" : "",
    screenWidth <= 1280 ? "screen-lg" : "screen-xl",
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={containerClasses}>{children}</div>;
}
