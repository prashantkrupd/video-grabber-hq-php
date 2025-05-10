
import React from 'react';
import { ClipboardCopy, Search, Download } from 'lucide-react';

const HowToUse = () => {
  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How to Download YouTube Videos</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClipboardCopy className="w-8 h-8 text-yt-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Copy the link</h3>
            <p className="text-gray-600">
              Find the video you want to download on YouTube and copy its URL from the address bar.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-yt-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Paste the URL</h3>
            <p className="text-gray-600">
              Paste the copied YouTube URL into the input field on our website and click "Download".
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-yt-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Choose quality & download</h3>
            <p className="text-gray-600">
              Select your preferred video quality, click the download button, and save the file.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToUse;
