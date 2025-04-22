
import React from "react";
import { Progress } from "@/components/ui/progress";

interface TranscriptionProgressProps {
  progress: number;
  estimatedTimeRemaining?: string;
  fileName: string;
}

const TranscriptionProgress: React.FC<TranscriptionProgressProps> = ({
  progress,
  estimatedTimeRemaining,
  fileName,
}) => {
  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-gray-800 truncate max-w-[70%]">{fileName}</h3>
        <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
      </div>
      
      <Progress value={progress} className="h-2 mb-2" />
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">Transcribing audio...</span>
        {estimatedTimeRemaining && (
          <span className="text-xs text-gray-500">
            Estimated time: {estimatedTimeRemaining}
          </span>
        )}
      </div>
    </div>
  );
};

export default TranscriptionProgress;
