
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface APIKeyFormProps {
  onApiKeySaved: (apiKey: string) => void;
  initialValue?: string;
}

const APIKeyForm: React.FC<APIKeyFormProps> = ({ onApiKeySaved, initialValue = "" }) => {
  const [apiKey, setApiKey] = useState<string>(initialValue);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handleSave = () => {
    if (apiKey.trim().startsWith("sk-")) {
      onApiKeySaved(apiKey.trim());
    } else {
      alert("Please enter a valid OpenAI API key starting with 'sk-'");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
      <h2 className="text-lg font-medium mb-4">Enter Your OpenAI API Key</h2>
      <div className="relative">
        <input
          type={isVisible ? "text" : "password"}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-..."
          className="w-full px-3 py-2 pr-24 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 mb-2"
        />
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className="absolute right-2 top-2 text-xs text-gray-500 hover:text-gray-700"
        >
          {isVisible ? "Hide" : "Show"}
        </button>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Key</Button>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 space-y-2">
        <p>
          Your API key is stored locally in your browser and never sent to our servers.
        </p>
        <p>
          You can get an API key from{" "}
          <a 
            href="https://platform.openai.com/api-keys" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            OpenAI's API Keys page
          </a>.
        </p>
      </div>
    </div>
  );
};

export default APIKeyForm;
