
import React, { useCallback, useState, useRef } from "react";
import { FileAudio, Upload, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioUploaderProps {
  onFileSelected: (file: File) => void;
  isUploading: boolean;
}

const AudioUploader: React.FC<AudioUploaderProps> = ({ onFileSelected, isUploading }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragActive(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith("audio/")) {
          onFileSelected(file);
        } else {
          alert("Please upload an audio file");
        }
      }
    },
    [onFileSelected]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onFileSelected(e.target.files[0]);
      }
    },
    [onFileSelected]
  );

  const handleButtonClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }, []);

  return (
    <div
      className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg ${
        isDragActive ? "border-primary bg-primary/5" : "border-gray-300 bg-gray-50"
      } transition-all p-6 cursor-pointer`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleButtonClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      <div className="flex flex-col items-center justify-center text-center">
        {isUploading ? (
          <Loader className="w-12 h-12 text-primary animate-spin mb-4" />
        ) : (
          <FileAudio className="w-12 h-12 text-gray-400 mb-4" />
        )}

        <h2 className="text-xl font-medium text-gray-700 mb-1">
          {isUploading 
            ? "Processing audio..." 
            : "Drag & drop your audio file here"}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          {isUploading 
            ? "Please wait while we upload your file" 
            : "Supports MP3, WAV, M4A, FLAC and more"}
        </p>
        
        {!isUploading && (
          <Button
            variant="outline"
            className="gap-2 bg-white hover:bg-gray-50"
            onClick={(e) => {
              e.stopPropagation();
              handleButtonClick();
            }}
          >
            <Upload size={16} />
            Choose a file
          </Button>
        )}
      </div>
    </div>
  );
};

export default AudioUploader;
