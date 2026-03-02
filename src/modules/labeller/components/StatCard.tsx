interface StatProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string; 
}

export const StatCard: React.FC<StatProps> = ({ label, value, icon, trend }) => (
  <div className="bg-[#161B22] border border-white/5 p-5 rounded-2xl shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">{icon}</div>
      {trend && <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">{trend}</span>}
    </div>
    <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{label}</p>
    <p className="text-2xl font-bold text-white mt-1 font-mono">{value}</p>
  </div>
);