import { PrimaryButton } from "./PrimaryButton";

interface ProjectProps {
  title: string;
  type: 'Image' | 'Audio' | 'Text';
  reward: string;
  totalTasks: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export const ProjectCard: React.FC<ProjectProps> = ({ title, type, reward, totalTasks, difficulty }) => (
  <div className="group bg-[#161B22] border border-white/5 p-5 rounded-2xl hover:border-blue-500/50 transition-all cursor-pointer">
    <div className="flex justify-between items-start mb-4">
      <span className="text-[10px] font-bold bg-white/5 text-gray-400 px-2 py-1 rounded-md uppercase">{type}</span>
      <span className="text-lg font-bold text-green-400 font-mono">{reward}</span>
    </div>
    <h3 className="text-white font-bold group-hover:text-blue-400 transition-colors">{title}</h3>
    <div className="flex items-center gap-4 mt-4 text-[11px] text-gray-500">
      <span>{totalTasks} Tasks left</span>
      <span className={`w-2 h-2 rounded-full ${difficulty === 'Easy' ? 'bg-green-500' : 'bg-yellow-500'}`} />
      <span>{difficulty}</span>
    </div>
    <PrimaryButton className="w-full mt-6" variant="outline">Preview Project</PrimaryButton>
  </div>
);