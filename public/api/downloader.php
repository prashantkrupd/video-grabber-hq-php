
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// For debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Check if this is a preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Return only the headers and not the content
    http_response_code(200);
    exit;
}

// Path to youtube-dl executable
$ytdl_path = '/usr/local/bin/youtube-dl';
// Check if youtube-dl is installed, if not use python based approach
if (!file_exists($ytdl_path)) {
    $ytdl_path = 'python3 -m youtube_dl';
}

// Directory to store downloaded videos
$download_dir = '../downloads/';
if (!file_exists($download_dir)) {
    mkdir($download_dir, 0755, true);
}

function getVideoInfo($url) {
    global $ytdl_path;
    
    // Extract video ID for security validation
    $videoId = extractVideoId($url);
    if (!$videoId) {
        return [
            'success' => false,
            'error' => 'Invalid YouTube URL'
        ];
    }
    
    // Get video info using youtube-dl
    $command = "$ytdl_path -j $url 2>&1";
    $output = shell_exec($command);
    
    if (!$output || strpos($output, 'ERROR') !== false) {
        return [
            'success' => false,
            'error' => 'Failed to fetch video info: ' . $output
        ];
    }
    
    try {
        $videoData = json_decode($output, true);
        if (!$videoData) {
            throw new Exception('Error parsing video data');
        }
        
        // Format the video info for our frontend
        $formats = [];
        if (isset($videoData['formats']) && is_array($videoData['formats'])) {
            $formatMap = [];
            
            // First pass: collect all formats
            foreach ($videoData['formats'] as $format) {
                $quality = isset($format['height']) ? $format['height'] . 'p' : 'audio';
                $extension = isset($format['ext']) ? $format['ext'] : 'mp4';
                $filesize = isset($format['filesize']) ? formatSize($format['filesize']) : 'Unknown';
                
                // For video formats with height
                if (isset($format['height'])) {
                    $formatKey = $format['height'] . 'p';
                    if (!isset($formatMap[$formatKey]) || 
                        (isset($format['filesize']) && isset($formatMap[$formatKey]['filesize']) && 
                         $format['filesize'] > $formatMap[$formatKey]['filesize'])) {
                        $formatMap[$formatKey] = [
                            'quality' => $formatKey,
                            'extension' => $extension,
                            'filesize' => $filesize,
                            'format_id' => $format['format_id']
                        ];
                    }
                }
                
                // For audio-only format
                if ($quality === 'audio' || (isset($format['acodec']) && $format['acodec'] !== 'none' && 
                    (!isset($format['vcodec']) || $format['vcodec'] === 'none'))) {
                    if (!isset($formatMap['mp3']) || 
                        (isset($format['filesize']) && isset($formatMap['mp3']['filesize']) && 
                         $format['filesize'] > $formatMap['mp3']['filesize'])) {
                        $formatMap['mp3'] = [
                            'quality' => 'mp3',
                            'extension' => 'mp3',
                            'filesize' => $filesize,
                            'format_id' => $format['format_id']
                        ];
                    }
                }
            }
            
            // Push the collected formats to the formats array
            foreach ($formatMap as $format) {
                $formats[] = $format;
            }
            
            // If no 1080p format was found, check if we can use the best format
            if (!isset($formatMap['1080p']) && isset($videoData['height']) && $videoData['height'] >= 1080) {
                $formats[] = [
                    'quality' => '1080p',
                    'extension' => 'mp4',
                    'filesize' => 'Best quality',
                    'format_id' => 'best[height<=1080]'
                ];
            }
            
            // Sort formats by quality (higher first)
            usort($formats, function($a, $b) {
                $qualityA = $a['quality'] === 'mp3' ? 0 : (int)$a['quality'];
                $qualityB = $b['quality'] === 'mp3' ? 0 : (int)$b['quality'];
                return $qualityB - $qualityA;
            });
        }
        
        // Prepare the response
        return [
            'success' => true,
            'data' => [
                'id' => $videoId,
                'title' => isset($videoData['title']) ? $videoData['title'] : 'Unknown Title',
                'thumbnail' => isset($videoData['thumbnail']) ? $videoData['thumbnail'] : '',
                'duration' => isset($videoData['duration']) ? formatDuration($videoData['duration']) : 'Unknown',
                'author' => isset($videoData['uploader']) ? $videoData['uploader'] : 'Unknown',
                'formats' => $formats
            ]
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'error' => 'Error processing video data: ' . $e->getMessage()
        ];
    }
}

function downloadVideo($url, $quality) {
    global $ytdl_path, $download_dir;
    
    // Extract video ID for security and as filename base
    $videoId = extractVideoId($url);
    if (!$videoId) {
        return [
            'success' => false,
            'error' => 'Invalid YouTube URL'
        ];
    }
    
    // Determine format based on quality
    $format = '';
    $extension = 'mp4';
    
    if ($quality === 'mp3') {
        $format = '-f bestaudio --extract-audio --audio-format mp3';
        $extension = 'mp3';
    } else {
        // Extract the numeric part of the quality (e.g., "1080p" -> 1080)
        $height = (int)str_replace('p', '', $quality);
        if ($height > 0) {
            // Select best video+audio format with height <= requested height
            $format = "-f 'bestvideo[height<=$height]+bestaudio/best[height<=$height]'";
        } else {
            $format = '-f best';
        }
    }
    
    // Generate a unique filename
    $filename = "youtube_" . $videoId . "_" . $quality . "_" . time() . "." . $extension;
    $filepath = $download_dir . $filename;
    
    // Download the video
    $command = "$ytdl_path $format -o '$filepath' $url 2>&1";
    $output = shell_exec($command);
    
    if (!file_exists($filepath)) {
        return [
            'success' => false,
            'error' => 'Download failed: ' . $output
        ];
    }
    
    // Return the download URL
    $base_url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
    $download_url = $base_url . "/downloads/" . $filename;
    
    return [
        'success' => true,
        'data' => [
            'download_url' => $download_url,
            'filename' => $filename,
            'quality' => $quality
        ]
    ];
}

function extractVideoId($url) {
    $pattern = '/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i';
    preg_match($pattern, $url, $matches);
    
    return isset($matches[1]) ? $matches[1] : false;
}

function formatSize($bytes) {
    if ($bytes < 1024) {
        return $bytes . ' B';
    } elseif ($bytes < 1048576) {
        return round($bytes / 1024, 2) . ' KB';
    } elseif ($bytes < 1073741824) {
        return round($bytes / 1048576, 2) . ' MB';
    } else {
        return round($bytes / 1073741824, 2) . ' GB';
    }
}

function formatDuration($seconds) {
    $hours = floor($seconds / 3600);
    $mins = floor($seconds / 60 % 60);
    $secs = floor($seconds % 60);
    
    if ($hours > 0) {
        return sprintf('%02d:%02d:%02d', $hours, $mins, $secs);
    } else {
        return sprintf('%02d:%02d', $mins, $secs);
    }
}

// Main API logic
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Decode the incoming JSON request
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    if (!isset($data['url'])) {
        echo json_encode(['success' => false, 'error' => 'No URL provided']);
        exit;
    }
    
    $url = $data['url'];
    
    // Info API endpoint
    if (isset($data['action']) && $data['action'] === 'info') {
        $result = getVideoInfo($url);
        echo json_encode($result);
        exit;
    }
    
    // Download API endpoint
    if (isset($data['action']) && $data['action'] === 'download') {
        if (!isset($data['quality'])) {
            echo json_encode(['success' => false, 'error' => 'No quality specified']);
            exit;
        }
        
        $quality = $data['quality'];
        $result = downloadVideo($url, $quality);
        echo json_encode($result);
        exit;
    }
    
    // Default to info if no action specified
    $result = getVideoInfo($url);
    echo json_encode($result);
    
} else {
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
}
?>
