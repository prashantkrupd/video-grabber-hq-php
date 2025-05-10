
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, FileVideo, Download, CheckCircle } from 'lucide-react';

interface VideoQuality {
  label: string;
  value: string;
  resolution: string;
  recommended?: boolean;
}

interface VideoPreviewProps {
  videoInfo: {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    author: string;
  };
  onDownload: (quality: string) => void;
  isDownloading: boolean;
  selectedQuality: string;
  setSelectedQuality: (quality: string) => void;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({
  videoInfo,
  onDownload,
  isDownloading,
  selectedQuality,
  setSelectedQuality,
}) => {
  const qualities: VideoQuality[] = [
    { label: '1080p Full HD', value: '1080p', resolution: '1920x1080', recommended: true },
    { label: '720p HD', value: '720p', resolution: '1280x720' },
    { label: '480p', value: '480p', resolution: '854x480' },
    { label: '360p', value: '360p', resolution: '640x360' },
    { label: 'Audio Only (MP3)', value: 'mp3', resolution: 'Audio' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
      <div className="md:flex">
        <div className="md:w-2/5">
          <div className="video-container h-full">
            <img
              src={videoInfo.thumbnail}
              alt={videoInfo.title}
              className="h-full object-cover"
            />
            <div className="play-button"></div>
          </div>
        </div>
        
        <div className="p-6 md:w-3/5">
          <h3 className="text-xl font-bold line-clamp-2 mb-2">{videoInfo.title}</h3>
          
          <div className="flex items-center text-gray-600 mb-4 text-sm">
            <Clock className="w-4 h-4 mr-1" />
            <span className="mr-4">{videoInfo.duration}</span>
            <span>By {videoInfo.author}</span>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium mb-2 text-gray-700">Select quality:</h4>
            <div className="space-y-2">
              {qualities.map((quality) => (
                <div
                  key={quality.value}
                  className={`border rounded-md p-3 cursor-pointer transition-all ${
                    selectedQuality === quality.value
                      ? 'border-yt-accent bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedQuality(quality.value)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <FileVideo className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium">{quality.label}</span>
                      {quality.recommended && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          Recommended
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{quality.resolution}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Button
            onClick={() => onDownload(selectedQuality)}
            disabled={isDownloading}
            className="w-full bg-yt-accent hover:bg-blue-600 flex items-center justify-center gap-2 py-6"
          >
            {isDownloading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Download {selectedQuality}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
