
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
}

export interface DownloadResult {
  download_url: string;
  filename: string;
  quality: string;
}

const API_URL = '/api';

/**
 * Fetch video information from a YouTube URL
 */
export async function fetchVideoInfo(url: string): Promise<VideoInfo> {
  try {
    const response = await fetch(`${API_URL}/downloader.php`, {
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

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
export async function downloadVideo(url: string, quality: string): Promise<DownloadResult> {
  try {
    const response = await fetch(`${API_URL}/downloader.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        quality,
        action: 'download',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to download video');
    }

    return result.data;
  } catch (error) {
    console.error('Error downloading video:', error);
    throw error;
  }
}
