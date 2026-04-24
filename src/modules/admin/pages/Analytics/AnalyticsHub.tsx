import { useState } from 'react';
import { BarChart3, Users, Database, TrendingUp, DollarSign, Terminal } from 'lucide-react';
import LabellerAnalytics from './LabellerAnalytics';
import DatasetAnalytics from './DatasetAnalytics';
import BuyerAnalytics from './BuyerAnalytics';
import RevenueAnalytics from './RevenueAnalytics';

type TabType = 'labellers' | 'datasets' | 'buyers' | 'revenue';

interface Tab {
  id: TabType;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

const AnalyticsHub = () => {
  const [activeTab, setActiveTab] = useState<TabType>('labellers');

  const tabs: Tab[] = [
    {
      id: 'labellers',
      label: 'Labellers',
      icon: <Users className="w-5 h-5" />,
      component: <LabellerAnalytics />
    },
    {
      id: 'datasets',
      label: 'Datasets',
      icon: <Database className="w-5 h-5" />,
      component: <DatasetAnalytics />
    },
    {
      id: 'buyers',
      label: 'Buyers',
      icon: <BarChart3 className="w-5 h-5" />,
      component: <BuyerAnalytics />
    },
    {
      id: 'revenue',
      label: 'Revenue',
      icon: <DollarSign className="w-5 h-5" />,
      component: <RevenueAnalytics />
    }
  ];

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Terminal size={14} className="text-indigo-500" />
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] font-bold text-indigo-500">Analytics_Dashboard</span>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-8 h-8 text-indigo-500" />
          <h1 className="text-3xl font-bold text-white italic">Analytics</h1>
        </div>
        <p className="text-zinc-500 text-sm">Comprehensive platform analytics and insights</p>
      </div>

      <div className="bg-[#050505] rounded-sm border border-zinc-900 mb-6 overflow-hidden">
        <div className="flex border-b border-zinc-900">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 font-medium transition-all text-sm ${
                activeTab === tab.id
                  ? 'text-indigo-500 bg-zinc-900/50 border-b-2 border-indigo-500'
                  : 'text-zinc-600 hover:text-zinc-400'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="animate-in fade-in duration-300">
        {tabs.find(tab => tab.id === activeTab)?.component}
      </div>
    </div>
  );
};

export default AnalyticsHub;
