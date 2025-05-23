import React from "react";
const Footer: React.FC = () => {
  return <footer className="w-full py-4 mt-12 border-t border-gray-200 text-center">
      <div className="container mx-auto px-4">
        <p className="text-sm text-gray-500">Powered by OpenAI Whisper API</p>
        <p className="text-xs text-gray-400 mt-1">Made with ❤️ by <a href="https://github.com/marcoslopez1">@marcoslopez1</a></p>
      </div>
    </footer>;
};
export default Footer;
