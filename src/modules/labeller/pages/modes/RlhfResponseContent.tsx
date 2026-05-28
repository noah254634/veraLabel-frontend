import { FileText, Music, Film, Image as ImageIcon } from "lucide-react";
import type { ContentType } from "../../../../shared/utils/labellingProtocol";

const isUrl = (value: string) => /^https?:\/\//i.test(value) || value.startsWith("/") || value.startsWith("blob:");

type Props = {
  content: string;
  contentType: ContentType;
  label: string;
};

export const RlhfResponseContent = ({ content, contentType, label }: Props) => {
  const trimmed = (content || "").trim();

  if (!trimmed) {
    return <p className="text-zinc-600 text-sm italic">No content</p>;
  }

  if ((contentType === "image" || contentType === "video" || contentType === "audio") && isUrl(trimmed)) {
    if (contentType === "image") {
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-500 uppercase">
            <ImageIcon size={12} /> Visual_Response
          </div>
          <img src={trimmed} alt={label} className="max-h-64 w-full object-contain border border-zinc-800 bg-black" />
        </div>
      );
    }
    if (contentType === "audio") {
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-500 uppercase">
            <Music size={12} /> Audio_Response
          </div>
          <audio controls src={trimmed} className="w-full" />
        </div>
      );
    }
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-500 uppercase">
          <Film size={12} /> Video_Response
        </div>
        <video controls src={trimmed} className="max-h-64 w-full border border-zinc-800 bg-black" />
      </div>
    );
  }

  if (contentType === "code") {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-500 uppercase">
          <FileText size={12} /> Code_Response
        </div>
        <pre className="text-xs leading-relaxed text-zinc-300 font-mono bg-zinc-950 border border-zinc-900 p-4 overflow-x-auto whitespace-pre-wrap">
          {trimmed}
        </pre>
      </div>
    );
  }

  return (
    <p className="text-md leading-relaxed text-zinc-350 font-light italic whitespace-pre-wrap">{trimmed}</p>
  );
};
