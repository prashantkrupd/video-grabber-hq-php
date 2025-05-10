
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VideoUrlInput from '@/components/VideoUrlInput';
import VideoPreview from '@/components/VideoPreview';
import HowToUse from '@/components/HowToUse';
import Features from '@/components/Features';
import { toast } from 'sonner';
import { fetchVideoInfo, downloadVideo, VideoInfo as VideoInfoType } from '@/utils/api';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfoType | null>(null);
  const [selectedQuality, setSelectedQuality] = useState('1080p');

  const handleVideoSubmit = async (url: string) => {
    setIsLoading(true);
    try {
      // Temporary mock data for the React preview since PHP won't run in the preview
      const mockVideoInfo = {
        id: 'dQw4w9WgXcQ',
        title: 'Rick Astley - Never Gonna Give You Up (Official Music Video)',
        thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        duration: '3:33',
        author: 'Rick Astley',
        formats: [
          { quality: '1080p', extension: 'mp4', filesize: '120MB' },
          { quality: '720p', extension: 'mp4', filesize: '70MB' },
          { quality: '480p', extension: 'mp4', filesize: '40MB' },
          { quality: '360p', extension: 'mp4', filesize: '25MB' },
          { quality: 'mp3', extension: 'mp3', filesize: '10MB' }
        ]
      };
      
      // In a real environment, you would use:
      // const info = await fetchVideoInfo(url);
      // setVideoInfo(info);
      
      // For the preview, we'll use the mock data
      setVideoInfo(mockVideoInfo);
      toast.success('Video found successfully!');
    } catch (error) {
      console.error('Error fetching video info:', error);
      toast.error('Failed to find video. Please check the URL and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (quality: string) => {
    if (!videoInfo) return;
    
    setIsDownloading(true);
    try {
      // In a real environment, you would use:
      // const result = await downloadVideo(url, quality);
      // window.location.href = result.download_url;
      
      // For the preview, we'll simulate a download
      setTimeout(() => {
        toast.success(`Download started for ${quality}! (Simulated for preview)`);
        setIsDownloading(false);
      }, 2000);
    } catch (error) {
      console.error('Error downloading video:', error);
      toast.error('Failed to download video. Please try again.');
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-yt-blue to-blue-900 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Download YouTube Videos in High Quality
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-blue-100">
              Fast, free and easy YouTube downloader. Get videos in 1080p Full HD quality.
            </p>
            
            <div className="mb-8">
              <VideoUrlInput onVideoSubmit={handleVideoSubmit} isLoading={isLoading} />
            </div>
          </div>
        </section>
        
        {videoInfo && (
          <section className="py-10">
            <div className="container mx-auto px-4">
              <VideoPreview 
                videoInfo={videoInfo} 
                onDownload={handleDownload} 
                isDownloading={isDownloading}
                selectedQuality={selectedQuality}
                setSelectedQuality={setSelectedQuality}
              />
            </div>
          </section>
        )}
        
        <Features />
        <HowToUse />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
