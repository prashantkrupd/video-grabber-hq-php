
import React from 'react';
import { Shield, Zap, Globe, Smartphone } from 'lucide-react';

const Features = () => {
  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose YTDownloady</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
            <Zap className="w-10 h-10 text-yt-accent mb-4" />
            <h3 className="text-xl font-semibold mb-2">Fast Downloads</h3>
            <p className="text-gray-600">
              Download videos quickly with our optimized servers and processing.
            </p>
          </div>
          
          <div className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
            <Shield className="w-10 h-10 text-yt-accent mb-4" />
            <h3 className="text-xl font-semibold mb-2">100% Safe</h3>
            <p className="text-gray-600">
              No registration required. No personal data collected. Safe downloads.
            </p>
          </div>
          
          <div className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
            <Globe className="w-10 h-10 text-yt-accent mb-4" />
            <h3 className="text-xl font-semibold mb-2">Browser Compatible</h3>
            <p className="text-gray-600">
              Works with all modern browsers including Chrome, Firefox, Safari and Edge.
            </p>
          </div>
          
          <div className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
            <Smartphone className="w-10 h-10 text-yt-accent mb-4" />
            <h3 className="text-xl font-semibold mb-2">Mobile Friendly</h3>
            <p className="text-gray-600">
              Fully responsive design works perfectly on mobile devices and tablets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
