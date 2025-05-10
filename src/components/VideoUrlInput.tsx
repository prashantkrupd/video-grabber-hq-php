
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Search, Loader2 } from 'lucide-react';

interface VideoUrlInputProps {
  onVideoSubmit: (url: string) => void;
  isLoading: boolean;
}

const VideoUrlInput: React.FC<VideoUrlInputProps> = ({ onVideoSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error('Please enter a YouTube URL');
      return;
    }
    
    // Basic YouTube URL validation
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (!youtubeRegex.test(url)) {
      toast.error('Please enter a valid YouTube URL');
      return;
    }
    
    toast.info('Fetching video information...');
    onVideoSubmit(url);
  };
  
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Paste YouTube video URL here (e.g., https://youtu.be/abcdefg or https://www.youtube.com/watch?v=abcdefg)"
            className="pl-10 py-6 text-lg"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <Button 
          type="submit" 
          className="bg-yt-accent hover:bg-blue-600 text-white py-6 px-8"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Download'
          )}
        </Button>
      </div>
    </form>
  );
};

export default VideoUrlInput;
