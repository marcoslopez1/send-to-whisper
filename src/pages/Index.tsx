import React, { useState, useEffect } from "react";
import AudioUploader from "@/components/AudioUploader";
import TranscriptionProgress from "@/components/TranscriptionProgress";
import TranscriptionResult from "@/components/TranscriptionResult";
import APIKeyForm from "@/components/APIKeyForm";
import ErrorMessage from "@/components/ErrorMessage";
import WelcomeCard from "@/components/WelcomeCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { FileAudio } from "lucide-react";
import { initOpenAI, isOpenAIInitialized, transcribeAudio, convertToSRT, convertToVTT } from "@/services/whisperApi";
const Index = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [isApiKeySet, setIsApiKeySet] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [transcriptionProgress, setTranscriptionProgress] = useState<number>(0);
  const [transcriptionResult, setTranscriptionResult] = useState<string>("");
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<string>("");
  const [startTime, setStartTime] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [fileSize, setFileSize] = useState<string>("");
  const [showWelcome, setShowWelcome] = useState<boolean>(true);

  // Initialize API key and welcome status from localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem("openai_api_key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
      initOpenAI(savedApiKey);
      setIsApiKeySet(true);
    }
    const hasSeenWelcome = localStorage.getItem("seen_welcome");
    if (hasSeenWelcome === "true") {
      setShowWelcome(false);
    }
  }, []);

  // Handle file selection
  const handleFileSelected = async (file: File) => {
    // Clear any previous errors
    setError("");
    setSelectedFile(file);

    // Calculate and format file size
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    setFileSize(`${fileSizeMB} MB`);

    // Check file size (OpenAI has a 25MB limit)
    if (file.size > 25 * 1024 * 1024) {
      setError("File is too large. Maximum size is 25MB.");
      return;
    }
    if (isApiKeySet) {
      startTranscription(file);
    }
  };

  // Handle API key removal
  const removeApiKey = () => {
    localStorage.removeItem("openai_api_key");
    setApiKey("");
    setIsApiKeySet(false);
  };

  // Start transcription process
  const startTranscription = async (file: File) => {
    try {
      setError("");
      setIsTranscribing(true);
      setTranscriptionProgress(0);
      setTranscriptionResult("");
      setStartTime(Date.now());

      // Start estimating time
      const estimateInterval = setInterval(() => {
        const elapsedSeconds = (Date.now() - startTime) / 1000;
        const remainingSeconds = elapsedSeconds / transcriptionProgress * (100 - transcriptionProgress);
        if (transcriptionProgress > 0 && transcriptionProgress < 100) {
          if (remainingSeconds > 60) {
            setEstimatedTimeRemaining(`~${Math.ceil(remainingSeconds / 60)} min`);
          } else {
            setEstimatedTimeRemaining(`~${Math.ceil(remainingSeconds)} sec`);
          }
        }
      }, 1000);

      // Transcribe audio with progress updates
      const result = await transcribeAudio(file, progress => {
        setTranscriptionProgress(progress);
        if (progress === 100) {
          clearInterval(estimateInterval);
          setEstimatedTimeRemaining("");
        }
      });
      setTranscriptionResult(result);
    } catch (error: any) {
      console.error("Transcription error:", error);
      setError(error.message || "Error transcribing audio. Please check your API key and try again.");
    } finally {
      setIsTranscribing(false);
      setTranscriptionProgress(100);
    }
  };

  // Reset the entire process
  const handleReset = () => {
    setSelectedFile(null);
    setTranscriptionProgress(0);
    setTranscriptionResult("");
    setEstimatedTimeRemaining("");
    setError("");
    setFileSize("");
  };

  // Handle downloading results in different formats
  const handleDownload = (format: "txt" | "srt" | "vtt") => {
    if (!transcriptionResult) return;
    let content = transcriptionResult;
    let mimeType = "text/plain";
    let extension = "txt";
    if (format === "srt") {
      content = convertToSRT(transcriptionResult);
      extension = "srt";
    } else if (format === "vtt") {
      content = convertToVTT(transcriptionResult);
      mimeType = "text/vtt";
      extension = "vtt";
    }
    const blob = new Blob([content], {
      type: mimeType
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcription.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto p-6 pt-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🔉 Send to Whisper 🔉</h1>
          <p className="text-gray-600">Upload audio files for instant, accurate transcription.</p>
        </div>
        
        {error && <ErrorMessage message={error} onDismiss={() => setError("")} />}
        
        {showWelcome && <WelcomeCard onDismiss={() => {
        setShowWelcome(false);
        localStorage.setItem("seen_welcome", "true");
      }} />}

        {!isApiKeySet ? <APIKeyForm onApiKeySaved={key => {
        setApiKey(key);
        localStorage.setItem("openai_api_key", key);
        initOpenAI(key);
        setIsApiKeySet(true);
        if (selectedFile) {
          startTranscription(selectedFile);
        }
      }} initialValue={apiKey} /> : null}

        {!transcriptionResult && !selectedFile && <AudioUploader onFileSelected={handleFileSelected} isUploading={isTranscribing} />}

        {selectedFile && !transcriptionResult && !isTranscribing && <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileAudio className="w-4 h-4 text-primary" />
                </div>
                <div className="overflow-hidden">
                  <p className="font-medium truncate">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">{fileSize}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  Cancel
                </Button>
                <Button size="sm" onClick={() => startTranscription(selectedFile)}>
                  Transcribe
                </Button>
              </div>
            </div>
          </div>}
        
        {isTranscribing && selectedFile && <div className="my-6">
            <TranscriptionProgress progress={transcriptionProgress} estimatedTimeRemaining={estimatedTimeRemaining} fileName={selectedFile.name} />
          </div>}

        {transcriptionResult && <div className="mt-6">
            <TranscriptionResult text={transcriptionResult} onDownload={handleDownload} />
            
            <div className="mt-4 text-center">
              <Button variant="outline" onClick={handleReset} className="mt-4">
                Transcribe another file
              </Button>
            </div>
          </div>}
        
        {isApiKeySet && <div className="mt-8 text-center text-sm">
            <button onClick={removeApiKey} className="text-gray-500 hover:text-gray-700 underline">
              Remove API Key
            </button>
          </div>}
      </div>
      
      <Footer />
    </div>;
};
export default Index;