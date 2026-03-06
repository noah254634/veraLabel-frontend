const StepIndicator = ({ label, active, completed }: any) => (
  <div className={`flex items-center gap-4 transition-all ${active || completed ? 'opacity-100' : 'opacity-30'}`}>
    <div className={`w-1.5 h-1.5 rounded-full ${completed ? 'bg-green-500' : active ? 'bg-blue-500 shadow-[0_0_8px_#3b82f6]' : 'bg-white/20'}`} />
    <span className={`text-[10px] font-bold uppercase tracking-widest ${active ? 'text-white' : 'text-gray-500'}`}>
      {label} {completed && "✓"}
    </span>
  </div>
);

export default StepIndicator;