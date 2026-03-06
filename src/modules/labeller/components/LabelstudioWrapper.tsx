import React, { useEffect, useRef, useState } from 'react';

interface WrapperProps {
  task: any;
  config: string;
  onSubmit: (annotation: any) => void;
}

export const LabelStudioWrapper: React.FC<WrapperProps> = ({ task, config, onSubmit }) => {
  const labelStudioContainer = useRef<HTMLDivElement>(null);
  const lsInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1) Inject CSS/JS once (avoid duplicates across navigations)
    const cssId = 'label-studio-css';
    const jsId = 'label-studio-js';

    let link = document.getElementById(cssId) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/@heartexlabs/label-studio@1.11.0/build/static/css/main.css';
      document.head.appendChild(link);
    }

    let script = document.getElementById(jsId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = jsId;
      script.src = 'https://unpkg.com/@heartexlabs/label-studio@1.11.0/build/static/js/main.js';
      script.async = true;
      document.body.appendChild(script);
    }

    const onLoad = () => setIsLoaded(true);
    if ((window as any).LabelStudio) {
      setIsLoaded(true);
    } else {
      script.addEventListener('load', onLoad);
    }

    return () => {
      script?.removeEventListener('load', onLoad);
    };
  }, []);

  useEffect(() => {
    // 3. Initialize LS once script is loaded and container is ready
    if (!isLoaded || !labelStudioContainer.current || !(window as any).LabelStudio) return;

    // Destroy any previous instance before creating a new one (task/config changes)
    try {
      lsInstanceRef.current?.destroy?.();
    } catch {
      // ignore teardown errors from third-party library
    } finally {
      lsInstanceRef.current = null;
    }

    if (isLoaded && labelStudioContainer.current && (window as any).LabelStudio) {
      const LabelStudio = (window as any).LabelStudio;

      lsInstanceRef.current = new LabelStudio(labelStudioContainer.current, {
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
        onLabelStudioLoad: (_LS: any) => {
          const c = _LS.annotationStore.addAnnotation({ userGenerate: true });
          _LS.annotationStore.selectAnnotation(c.id);
        },
        onSubmitAnnotation: (_LS: any, annotation: any) => {
          onSubmit(annotation.serializeAnnotation());
        },
      });
    }
    return () => {
      try {
        lsInstanceRef.current?.destroy?.();
      } catch {
        // ignore teardown errors from third-party library
      } finally {
        lsInstanceRef.current = null;
      }
    };
  }, [isLoaded, task?.id, config, onSubmit]); // Re-run if task/config changes

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