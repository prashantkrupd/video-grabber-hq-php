
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, FileVideo, Download, CheckCircle } from 'lucide-react';
import { VideoFormat } from '@/utils/api';

interface VideoPreviewProps {
  videoInfo: {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    author: string;
    formats: VideoFormat[];
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
  // Use formats from the API if available, or fall back to default options
  const availableFormats = videoInfo.formats && videoInfo.formats.length > 0 
    ? videoInfo.formats 
    : [
        { quality: '1080p', extension: 'mp4', filesize: 'Best quality' },
        { quality: '720p', extension: 'mp4', filesize: 'High quality' },
        { quality: '480p', extension: 'mp4', filesize: 'Medium quality' },
        { quality: '360p', extension: 'mp4', filesize: 'Low quality' },
        { quality: 'mp3', extension: 'mp3', filesize: 'Audio only' },
      ];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
      <div className="md:flex">
        <div className="md:w-2/5">
          <div className="video-container h-full">
            <img
              src={videoInfo.thumbnail}
              alt={videoInfo.title}
              className="h-full w-full object-cover"
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
              {availableFormats.map((format) => (
                <div
                  key={format.quality}
                  className={`border rounded-md p-3 cursor-pointer transition-all ${
                    selectedQuality === format.quality
                      ? 'border-yt-accent bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedQuality(format.quality)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <FileVideo className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium">
                        {format.quality === 'mp3' 
                          ? 'Audio Only (MP3)' 
                          : `${format.quality} ${format.quality === '1080p' ? 'Full HD' : format.quality === '720p' ? 'HD' : ''}`}
                      </span>
                      {format.quality === '1080p' && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          Recommended
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {format.quality === 'mp3' ? 'Audio' : format.quality}
                      {format.filesize ? ` (${format.filesize})` : ''}
                    </span>
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
