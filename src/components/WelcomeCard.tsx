import React from "react";
const WelcomeCard: React.FC<{
  onDismiss: () => void;
}> = ({
  onDismiss
}) => {
  return <div className="bg-gradient-to-br from-primary/10 to-accent/30 rounded-lg shadow-sm border border-primary/10 p-6 mb-6 relative">
      <button onClick={onDismiss} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" aria-label="Dismiss welcome message">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <h2 className="text-xl font-bold text-gray-900 mb-3">Welcome to Send to Whisper</h2>
      
      <div className="space-y-3 text-gray-700">
        <p>
          This app turns your audio into accurate transcriptions using OpenAI's Whisper model.
        </p>
        
        <div className="bg-white bg-opacity-50 rounded p-3 space-y-2">
          <p className="font-medium">Getting started:</p>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Enter your OpenAI API key (required only once)</li>
            <li>Upload or drag-and-drop an audio file</li>
            <li>Wait for the transcription to complete</li>
            <li>Download your transcript in your preferred format</li>
          </ol>
        </div>
        
        <p className="text-sm">
          <strong>Privacy note:</strong> Your API key and audio files never leave your browser except to communicate directly with OpenAI.
        </p>
      </div>
    </div>;
};
export default WelcomeCard;