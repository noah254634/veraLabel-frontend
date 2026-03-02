interface ProgressProps {
  progress: number; // 0 to 100
  label?: string;
}

export const ProgressBar: React.FC<ProgressProps> = ({ progress, label }) => (
  <div className="w-full">
    <div className="flex justify-between mb-2">
      <span className="text-xs text-gray-400 font-medium">{label}</span>
      <span className="text-xs text-blue-400 font-bold">{progress}%</span>
    </div>
    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
      <div 
        className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(37,99,235,0.6)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);