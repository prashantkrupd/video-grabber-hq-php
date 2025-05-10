
/**
 * API client for interacting with the YouTube downloader backend
 */

export interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  author: string;
  formats: VideoFormat[];
}

export interface VideoFormat {
  quality: string;
  extension: string;
  filesize: string;
  format_id?: string;
}

export interface DownloadResult {
  download_url: string;
  filename: string;
  quality: string;
}

// Use absolute path to make sure requests go to the correct endpoint
const API_URL = window.location.origin + '/api';

/**
 * Fetch video information from a YouTube URL
 */
export async function fetchVideoInfo(url: string): Promise<VideoInfo> {
  try {
    console.log('Fetching video info from:', `${API_URL}/downloader`);
    
    const response = await fetch(`${API_URL}/downloader`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        action: 'info',
      }),
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('API Response:', result);

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch video info');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching video info:', error);
    throw error;
  }
}

/**
 * Download a YouTube video with specified quality
 */
export async function downloadVideo(videoId: string, quality: string): Promise<DownloadResult> {
  try {
    console.log('Downloading video:', videoId, 'with quality:', quality);
    
    const response = await fetch(`${API_URL}/downloader`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: `https://www.youtube.com/watch?v=${videoId}`,
        quality,
        action: 'download',
      }),
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Download result:', result);

    if (!result.success) {
      throw new Error(result.error || 'Failed to download video');
    }

    return result.data;
  } catch (error) {
    console.error('Error downloading video:', error);
    throw error;
  }
}
