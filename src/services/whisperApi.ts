
import OpenAI from "openai";

let openai: OpenAI | null = null;

// Initialize the OpenAI client with API key
export const initOpenAI = (apiKey: string) => {
  openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true, // Note: In production, API requests should be made server-side
  });
};

// Check if OpenAI is initialized
export const isOpenAIInitialized = () => {
  return openai !== null;
};

// Transcribe audio using OpenAI's Whisper API
export const transcribeAudio = async (
  audioFile: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  if (!openai) {
    throw new Error("OpenAI client not initialized. Call initOpenAI first.");
  }

  try {
    let currentProgress = 0;
    let progressInterval: NodeJS.Timeout | null = null;
    
    // Mock progress updates (Whisper API doesn't provide real-time progress)
    if (onProgress) {
      progressInterval = setInterval(() => {
        const randomProgress = Math.random() * 15;
        onProgress(Math.min((currentProgress += randomProgress), 90));
      }, 1000);
    }

    // Convert audio file to FormData
    const formData = new FormData();
    formData.append("file", audioFile);
    formData.append("model", "whisper-1");

    // Make API request
    const response = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });

    // Set progress to 100% when done
    if (onProgress) onProgress(100);
    
    // Clear interval if it exists
    if (progressInterval) {
      clearInterval(progressInterval);
    }
    
    return response.text;
  } catch (error) {
    console.error("Error transcribing audio:", error);
    throw error;
  }
};

// Convert transcription to SRT format
export const convertToSRT = (text: string): string => {
  // This is a simplified conversion
  // In a real app, you'd want to use proper timestamp detection
  const lines = text.split(/[.!?]+/).filter(line => line.trim().length > 0);
  let srt = "";
  
  lines.forEach((line, index) => {
    const startTime = formatSRTTime(index * 5);
    const endTime = formatSRTTime((index + 1) * 5);
    
    srt += `${index + 1}\n`;
    srt += `${startTime} --> ${endTime}\n`;
    srt += `${line.trim()}\n\n`;
  });
  
  return srt;
};

// Convert transcription to VTT format
export const convertToVTT = (text: string): string => {
  // This is a simplified conversion
  // In a real app, you'd want to use proper timestamp detection
  const lines = text.split(/[.!?]+/).filter(line => line.trim().length > 0);
  let vtt = "WEBVTT\n\n";
  
  lines.forEach((line, index) => {
    const startTime = formatVTTTime(index * 5);
    const endTime = formatVTTTime((index + 1) * 5);
    
    vtt += `${startTime} --> ${endTime}\n`;
    vtt += `${line.trim()}\n\n`;
  });
  
  return vtt;
};

// Helper function to format time for SRT
const formatSRTTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
};

// Helper function to format time for VTT
const formatVTTTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
};
