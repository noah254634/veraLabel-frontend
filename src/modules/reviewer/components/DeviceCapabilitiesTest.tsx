import React from 'react';
import { detectDeviceCapabilities } from '../../../shared/utils/deviceCapabilities';

const DeviceCapabilitiesTest = () => {
  const handleDetect = () => {
    console.clear();
    console.log(' RUNNING DEVICE DETECTION...\n');
    detectDeviceCapabilities();
  };

  return (
    <div className="p-6 bg-black border border-zinc-900 rounded-sm space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest">
          🔬 Device Capabilities Tester
        </h3>
        <p className="text-[9px] text-zinc-500">
          Click button below and check browser DevTools console (F12 → Console tab)
        </p>
      </div>

      <button
        onClick={handleDetect}
        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all"
      >
        Run Detection & Log to Console
      </button>

      <div className="text-[8px] text-zinc-600 p-3 bg-zinc-950 border border-zinc-900 rounded-sm">
        <p>The console will show:</p>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>📱 Your screen size (MOBILE/TABLET/DESKTOP)</li>
          <li>⚙️ Hardware specs (Memory, CPU cores, Battery)</li>
          <li>🌐 Network speed & type</li>
          <li>💾 Available storage</li>
          <li>✅ Which tasks you can review</li>
        </ul>
      </div>
    </div>
  );
};

export default DeviceCapabilitiesTest;
