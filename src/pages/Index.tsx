
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
      const info = await fetchVideoInfo(url);
      setVideoInfo(info);
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
      const result = await downloadVideo(videoInfo.id, quality);
      window.location.href = result.download_url;
      toast.success(`Download started for ${quality}!`);
    } catch (error) {
      console.error('Error downloading video:', error);
      toast.error('Failed to download video. Please try again.');
    } finally {
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
