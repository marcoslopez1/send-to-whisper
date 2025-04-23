
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Copy } from "lucide-react";

interface TranscriptionResultProps {
  text: string;
  onDownload: (format: "txt" | "srt" | "vtt") => void;
}

const formatLabels: Record<"txt" | "srt" | "vtt", string> = {
  txt: "Plain Text",
  srt: "SRT",
  vtt: "VTT",
};

const TranscriptionResult: React.FC<TranscriptionResultProps> = ({
  text,
  onDownload,
}) => {
  const [activeFormat, setActiveFormat] = useState<"txt" | "srt" | "vtt">("txt");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      setCopied(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-medium text-lg text-gray-800">
          Transcription Result
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          aria-label="Copy transcription"
          className="ml-2"
        >
          <Copy size={18} />
          <span className="sr-only">Copy transcription</span>
          {copied && (
            <span className="ml-2 text-xs text-green-600 font-medium animate-fade-in">
              Copied!
            </span>
          )}
        </Button>
      </div>

      <div className="p-4 max-h-[400px] overflow-y-auto relative">
        <pre className="whitespace-pre-wrap font-sans text-gray-700 text-sm leading-relaxed">
          {text}
        </pre>
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          {/* Format selection + Download button side by side */}
          <div className="flex items-center gap-2">
            <select
              className="rounded-md border px-3 py-2 text-sm bg-white text-gray-700 focus:ring-2 focus:ring-primary focus:outline-none"
              value={activeFormat}
              onChange={e =>
                setActiveFormat(e.target.value as "txt" | "srt" | "vtt")
              }
              aria-label="Select download format"
            >
              <option value="txt">Plain Text (.txt)</option>
              <option value="srt">SRT (.srt)</option>
              <option value="vtt">VTT (.vtt)</option>
            </select>
            <Button
              onClick={() => onDownload(activeFormat)}
              className="gap-2"
            >
              <Download size={16} />
              Download {activeFormat.toUpperCase()}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptionResult;
