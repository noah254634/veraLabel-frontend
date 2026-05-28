interface AudioStageProps {
  task: {
    r2_url?: string;
    data?: { url?: string };
    taskObject?: { url?: string; audioUrl?: string; data?: { url?: string } } | string;
  };
}

export const AudioStage = ({ task }: AudioStageProps) => {
  const audioUrl =
    task.data?.url ||
    (typeof task.taskObject === "object" && task.taskObject !== null
      ? task.taskObject.audioUrl || task.taskObject.url || task.taskObject.data?.url
      : undefined) ||
    task.r2_url;

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-[#050505] p-8">
      {!audioUrl ? (
        <p className="text-rose-500 font-mono text-xs">[ Error: NO_AUDIO_PROTOCOL_FOUND ]</p>
      ) : (
        <audio controls src={audioUrl} className="w-full max-w-xl" />
      )}
    </div>
  );
};
