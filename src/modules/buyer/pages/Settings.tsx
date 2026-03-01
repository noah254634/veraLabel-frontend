/**
 * 7️⃣ Settings.tsx
 * Account and preference management for the buyer.
 */

import React from 'react';
import { useAuthStore } from '../../auth/useAuthstore';


const Settings: React.FC = () => {
  const { user } = useAuthStore();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Settings saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-indigo-900 mb-10">Account Settings</h1>

      <form onSubmit={handleSave} className="space-y-10">
        {/* Profile Section */}
        <section className="bg-white p-8 border border-gray-200 rounded-xl">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input disabled type="text" defaultValue={user?.name} className="w-full border-gray-300 text-gray-900 rounded-lg p-2.5 border" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input type="email"disabled defaultValue={user?.email} className="w-full border-gray-300 text-gray-900 rounded-lg p-2.5 border" />
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="bg-white p-8 border border-gray-200 rounded-xl">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Security</h2>
          <div className="max-w-md space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Current Password</label>
              <input type="password" placeholder="••••••••" className="w-full border-gray-300 rounded-lg p-2.5 border" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">New Password</label>
              <input type="password" placeholder="••••••••" className="w-full border-gray-300 rounded-lg p-2.5 border" />
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="bg-white p-8 border border-gray-200 rounded-xl">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 border-gray-300 rounded" />
              <span className="text-sm text-gray-700">Notify me about updates to purchased datasets</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-blue-600 border-gray-300 rounded" />
              <span className="text-sm text-gray-700">Weekly marketplace recommendations newsletter</span>
            </label>
          </div>
        </section>

        <div className="flex justify-end gap-4 pt-4">
          <button type="button" className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Discard Changes
          </button>
          <button type="submit" className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-shadow shadow-md">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;