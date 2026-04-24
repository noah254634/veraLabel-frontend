/**
 * Device Capability Detector - Console Testing Mode
 * Detects device capabilities and logs to console
 * Does NOT filter tasks yet, just for testing/debugging
 */

import React from 'react';

interface NetworkInfo {
  connectionType: string;
  downlinkMbps: number;
  rtt: number; // round trip time in ms
  isSaveDataEnabled: boolean;
}

interface DeviceCapabilities {
  screenSize: 'MOBILE' | 'TABLET' | 'DESKTOP';
  screenWidth: number;
  screenHeight: number;
  devicePixelRatio: number;
  memoryGB: number;
  cores: number;
  batteryPercent: number | null;
  pointerType: string;
  network: NetworkInfo;
  availableStorageMB: number | null;
  performanceHint: 'EXCELLENT' | 'GOOD' | 'ACCEPTABLE' | 'DEGRADED';
  suitableTaskTypes: string[];
}

/**
 * Get screen size category based on viewport width
 */
const getScreenCategory = (width: number): 'MOBILE' | 'TABLET' | 'DESKTOP' => {
  if (width < 768) return 'MOBILE';
  if (width < 1024) return 'TABLET';
  return 'DESKTOP';
};

/**
 * Get network information
 */
const getNetworkInfo = (): NetworkInfo => {
  const connection = (navigator as any).connection || 
                     (navigator as any).mozConnection || 
                     (navigator as any).webkitConnection;

  return {
    connectionType: connection?.effectiveType || 'UNKNOWN',
    downlinkMbps: connection?.downlink || 0,
    rtt: connection?.rtt || 0,
    isSaveDataEnabled: connection?.saveData || false
  };
};

/**
 * Get device performance capabilities
 */
const getPerformanceHint = (
  memoryGB: number,
  cores: number,
  network: NetworkInfo,
  batteryPercent: number | null
): 'EXCELLENT' | 'GOOD' | 'ACCEPTABLE' | 'DEGRADED' => {
  let score = 0;

  // Memory score (0-30)
  if (memoryGB >= 8) score += 30;
  else if (memoryGB >= 4) score += 20;
  else if (memoryGB >= 2) score += 10;

  // CPU score (0-30)
  if (cores >= 6) score += 30;
  else if (cores >= 4) score += 20;
  else if (cores >= 2) score += 10;

  // Network score (0-30)
  if (network.connectionType === '4g' && network.downlinkMbps > 5) score += 30;
  else if (network.connectionType === '4g' || network.downlinkMbps > 2) score += 20;
  else if (network.downlinkMbps > 0) score += 10;

  // Battery score (0-10 bonus if good)
  if (batteryPercent && batteryPercent > 50) score += 5;

  if (score >= 85) return 'EXCELLENT';
  if (score >= 65) return 'GOOD';
  if (score >= 45) return 'ACCEPTABLE';
  return 'DEGRADED';
};

/**
 * Calculate suitable task types (FOR AFRICAN MARKET)
 */
const calculateSuitableTaskTypes = (caps: Omit<DeviceCapabilities, 'suitableTaskTypes'>): string[] => {
  const tasks: string[] = [];

  // RULE 1: Mobile = LINGUISTIC ONLY (NO COMPROMISE)
  if (caps.screenSize === 'MOBILE') {
    return ['LINGUISTIC'];
  }

  // RULE 2: Tablet checks
  if (caps.screenSize === 'TABLET') {
    tasks.push('LINGUISTIC');

    // IMAGE only if good connection
    if (caps.network.connectionType === '4g' && caps.network.downlinkMbps > 2) {
      tasks.push('IMAGE');
    }

    // AUDIO only if connection is reliable and no save-data mode
    if (!caps.network.isSaveDataEnabled && caps.network.downlinkMbps > 1) {
      tasks.push('AUDIO');
    }

    return tasks;
  }

  // RULE 3: Desktop = Everything
  if (caps.screenSize === 'DESKTOP') {
    tasks.push('LINGUISTIC', 'IMAGE', 'AUDIO', 'MEDICAL');
  }

  return tasks.length > 0 ? tasks : ['LINGUISTIC'];
};

/**
 * MAIN FUNCTION: Detect device capabilities and log to console
 */
export const detectDeviceCapabilities = (): DeviceCapabilities => {
  // Get screen info
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const screenSize = getScreenCategory(screenWidth);

  // Get device memory (not available in all browsers)
  const memoryGB = (navigator as any).deviceMemory || 4; // fallback

  // Get CPU cores
  const cores = navigator.hardwareConcurrency || 4; // fallback

  // Get battery status (async, but we'll try sync)
  let batteryPercent: number | null = null;
  if ((navigator as any).getBattery) {
    (navigator as any).getBattery().then((battery: any) => {
      batteryPercent = Math.round(battery.level * 100);
    });
  }

  // Get network info
  const network = getNetworkInfo();

  // Get storage info
  let availableStorageMB: number | null = null;
  if ((navigator as any).storage?.estimate) {
    (navigator as any).storage.estimate().then((estimate: any) => {
      availableStorageMB = Math.round(estimate.quota / (1024 * 1024));
    });
  }

  // Calculate capabilities
  const performanceHint = getPerformanceHint(memoryGB, cores, network, batteryPercent);

  // Build capabilities object (without suitableTaskTypes first)
  const capabilitiesWithoutTasks = {
    screenSize,
    screenWidth,
    screenHeight,
    devicePixelRatio: window.devicePixelRatio,
    memoryGB,
    cores,
    batteryPercent,
    pointerType: 'touch' in window ? 'touch' : 'mouse',
    network,
    availableStorageMB,
    performanceHint
  };

  // Calculate suitable tasks
  const suitableTaskTypes = calculateSuitableTaskTypes(capabilitiesWithoutTasks);

  const capabilities: DeviceCapabilities = {
    ...capabilitiesWithoutTasks,
    suitableTaskTypes
  };

  // ============================================================================
  // CONSOLE LOGGING (Testing Mode)
  // ============================================================================
  console.group('🔍 Device Capabilities Detection');

  console.group('📱 Screen Info');
  console.log(`Screen Size: ${screenSize} (${screenWidth}x${screenHeight})`);
  console.log(`Device Pixel Ratio: ${window.devicePixelRatio}x`);
  console.log(`Pointer Type: ${capabilities.pointerType}`);
  console.groupEnd();

  console.group('⚙️ Hardware Info');
  console.log(`Memory: ${memoryGB}GB`);
  console.log(`CPU Cores: ${cores}`);
  console.log(`Battery: ${batteryPercent ? batteryPercent + '%' : 'Not available'}`);
  console.groupEnd();

  console.group('🌐 Network Info');
  console.log(`Connection Type: ${network.connectionType}`);
  console.log(`Downlink Speed: ${network.downlinkMbps} Mbps`);
  console.log(`Round Trip Time: ${network.rtt}ms`);
  console.log(`Save-Data Mode: ${network.isSaveDataEnabled ? 'YES' : 'NO'}`);
  console.groupEnd();

  console.group('💾 Storage Info');
  console.log(`Available Storage: ${availableStorageMB ? availableStorageMB + ' MB' : 'Not available'}`);
  console.groupEnd();

  console.group('🎯 Performance & Capability Analysis');
  console.log(`Overall Performance: ${performanceHint}`);
  console.log(`Suitable Task Types: ${suitableTaskTypes.join(', ')}`);
  console.table({
    'LINGUISTIC': suitableTaskTypes.includes('LINGUISTIC') ? '✅' : '❌',
    'IMAGE': suitableTaskTypes.includes('IMAGE') ? '✅' : '❌',
    'AUDIO': suitableTaskTypes.includes('AUDIO') ? '✅' : '❌',
    'MEDICAL': suitableTaskTypes.includes('MEDICAL') ? '✅' : '❌'
  });
  console.groupEnd();

  console.log('📋 Full Capabilities Object:', capabilities);
  console.groupEnd();

  return capabilities;
};

/**
 * Hook for React components
 */
export const useDeviceCapabilities = () => {
  const [capabilities, setCapabilities] = React.useState<DeviceCapabilities | null>(null);

  React.useEffect(() => {
    const caps = detectDeviceCapabilities();
    setCapabilities(caps);

    // Also detect on resize
    const handleResize = () => {
      const newCaps = detectDeviceCapabilities();
      setCapabilities(newCaps);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return capabilities;
};
