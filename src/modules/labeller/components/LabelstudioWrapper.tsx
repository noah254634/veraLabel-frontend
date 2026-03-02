import React, { useEffect, useRef, useState } from 'react';

interface WrapperProps {
  task: any;
  config: string;
  onSubmit: (annotation: any) => void;
}

export const LabelStudioWrapper: React.FC<WrapperProps> = ({ task, config, onSubmit }) => {
  const labelStudioContainer = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. Inject CSS for Label Studio
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/@heartexlabs/label-studio@1.11.0/build/static/css/main.css';
    document.head.appendChild(link);

    // 2. Inject the JS script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@heartexlabs/label-studio@1.11.0/build/static/js/main.js';
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    // 3. Initialize LS once script is loaded and container is ready
    if (isLoaded && labelStudioContainer.current && (window as any).LabelStudio) {
      const LabelStudio = (window as any).LabelStudio;

      new LabelStudio(labelStudioContainer.current, {
        config: config,
        task: task,
        interfaces: [
          "panel",
          "update",
          "submit",
          "controls",
          "side-column",
          "annotations:menu",
          "predictions:menu",
        ],
        onLabelStudioLoad: (LS: any) => {
          const c = LS.annotationStore.addAnnotation({ userGenerate: true });
          LS.annotationStore.selectAnnotation(c.id);
        },
        onSubmitAnnotation: (LS: any, annotation: any) => {
          onSubmit(annotation.serializeAnnotation());
        },
      });
    }
  }, [isLoaded, task.id, config]); // Re-run if task or config changes

  return (
    <div className="w-full h-full relative">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0B0E14] z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Initializing Workbench...</p>
          </div>
        </div>
      )}
      <div 
        ref={labelStudioContainer} 
        className="ls-custom-theme h-full w-full rounded-xl overflow-hidden border border-white/5"
      />
    </div>
  );
};