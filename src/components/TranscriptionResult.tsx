
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface TranscriptionResultProps {
  text: string;
  onDownload: (format: "txt" | "srt" | "vtt") => void;
}

const TranscriptionResult: React.FC<TranscriptionResultProps> = ({
  text,
  onDownload,
}) => {
  const [activeFormat, setActiveFormat] = useState<"txt" | "srt" | "vtt">("txt");

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-medium text-lg text-gray-800">Transcription Result</h3>
      </div>

      <div className="p-4 max-h-[400px] overflow-y-auto">
        <pre className="whitespace-pre-wrap font-sans text-gray-700 text-sm leading-relaxed">
          {text}
        </pre>
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="flex flex-wrap gap-2 justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant={activeFormat === "txt" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFormat("txt")}
            >
              Plain Text
            </Button>
            <Button
              variant={activeFormat === "srt" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFormat("srt")}
            >
              SRT
            </Button>
            <Button
              variant={activeFormat === "vtt" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFormat("vtt")}
            >
              VTT
            </Button>
          </div>
          
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
  );
};

export default TranscriptionResult;
