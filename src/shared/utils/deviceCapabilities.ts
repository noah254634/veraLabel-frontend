import React from 'react';

interface NetworkInfo {
  connectionType: string;
  downlinkMbps: number;
  rtt: number;
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

const getScreenCategory = (width: number): 'MOBILE' | 'TABLET' | 'DESKTOP' => {
  if (width < 768) return 'MOBILE';
  if (width < 1024) return 'TABLET';
  return 'DESKTOP';
};

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

const getPerformanceHint = (
  memoryGB: number,
  cores: number,
  network: NetworkInfo,
  batteryPercent: number | null
): 'EXCELLENT' | 'GOOD' | 'ACCEPTABLE' | 'DEGRADED' => {
  let score = 0;

  if (memoryGB >= 8) score += 30;
  else if (memoryGB >= 4) score += 20;
  else if (memoryGB >= 2) score += 10;

  if (cores >= 6) score += 30;
  else if (cores >= 4) score += 20;
  else if (cores >= 2) score += 10;

  if (network.connectionType === '4g' && network.downlinkMbps > 5) score += 30;
  else if (network.connectionType === '4g' || network.downlinkMbps > 2) score += 20;
  else if (network.downlinkMbps > 0) score += 10;

  if (batteryPercent && batteryPercent > 50) score += 5;

  if (score >= 85) return 'EXCELLENT';
  if (score >= 65) return 'GOOD';
  if (score >= 45) return 'ACCEPTABLE';
  return 'DEGRADED';
};

const calculateSuitableTaskTypes = (caps: Omit<DeviceCapabilities, 'suitableTaskTypes'>): string[] => {
  const tasks: string[] = [];

  if (caps.screenSize === 'MOBILE') {
    return ['LINGUISTIC'];
  }

  if (caps.screenSize === 'TABLET') {
    tasks.push('LINGUISTIC');

    if (caps.network.connectionType === '4g' && caps.network.downlinkMbps > 2) {
      tasks.push('IMAGE');
    }

    if (!caps.network.isSaveDataEnabled && caps.network.downlinkMbps > 1) {
      tasks.push('AUDIO');
    }

    return tasks;
  }

  if (caps.screenSize === 'DESKTOP') {
    tasks.push('LINGUISTIC', 'IMAGE', 'AUDIO', 'MEDICAL');
  }

  return tasks.length > 0 ? tasks : ['LINGUISTIC'];
};

export const detectDeviceCapabilities = (): DeviceCapabilities => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const screenSize = getScreenCategory(screenWidth);

  const memoryGB = (navigator as any).deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;

  let batteryPercent: number | null = null;
  if ((navigator as any).getBattery) {
    (navigator as any).getBattery().then((battery: any) => {
      batteryPercent = Math.round(battery.level * 100);
    });
  }

  const network = getNetworkInfo();

  let availableStorageMB: number | null = null;
  if ((navigator as any).storage?.estimate) {
    (navigator as any).storage.estimate().then((estimate: any) => {
      availableStorageMB = Math.round(estimate.quota / (1024 * 1024));
    });
  }

  const performanceHint = getPerformanceHint(memoryGB, cores, network, batteryPercent);

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

  const suitableTaskTypes = calculateSuitableTaskTypes(capabilitiesWithoutTasks);

  const capabilities: DeviceCapabilities = {
    ...capabilitiesWithoutTasks,
    suitableTaskTypes
  };

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

export const useDeviceCapabilities = () => {
  const [capabilities, setCapabilities] = React.useState<DeviceCapabilities | null>(null);

  React.useEffect(() => {
    const caps = detectDeviceCapabilities();
    setCapabilities(caps);

    const handleResize = () => {
      const newCaps = detectDeviceCapabilities();
      setCapabilities(newCaps);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return capabilities;
};
