import { ProjectCard } from "../components/ProjectCard";

export const FindWorkPage = () => (
  <div className="max-w-6xl mx-auto space-y-8">
    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-2xl font-bold italic">Available Batches</h2>
        <p className="text-gray-500 text-sm">Select a project to start earning.</p>
      </div>
      <div className="flex gap-2">
        {/* Quick Filters */}
        <button className="px-4 py-1.5 bg-white/5 rounded-full text-xs hover:bg-white/10">Image</button>
        <button className="px-4 py-1.5 bg-white/5 rounded-full text-xs hover:bg-white/10">Audio</button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ProjectCard title="Street Scene Segmentation" type="Image" reward="$0.05" totalTasks={1200} difficulty="Medium" />
      <ProjectCard title="Swahili Audio Transcription" type="Audio" reward="$0.12" totalTasks={450} difficulty="Hard" />
      <ProjectCard title="Sentiment Analysis (Product Reviews)" type="Text" reward="$0.02" totalTasks={8900} difficulty="Easy" />
      {/* Locked Project */}
      <div className="opacity-50 grayscale pointer-events-none">
         <ProjectCard title="Tumor Cell Detection" type="Image" reward="$1.20" totalTasks={30} difficulty="Hard" />
      </div>
    </div>
  </div>
);