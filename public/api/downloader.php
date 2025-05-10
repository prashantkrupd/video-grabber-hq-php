
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

// Include the YouTube download library (you would need to install youtube-dl or similar)
// Here we're simulating the functionality without actually installing youtube-dl

function getVideoInfo($url) {
    // In a real implementation, you would use youtube-dl or a similar library
    // Example command: $output = shell_exec("youtube-dl --dump-json $url");
    
    // For demo purposes, we'll return mock data
    $videoId = extractVideoId($url);
    
    if (!$videoId) {
        return [
            'success' => false,
            'error' => 'Invalid YouTube URL'
        ];
    }
    
    return [
        'success' => true,
        'data' => [
            'id' => $videoId,
            'title' => 'Sample YouTube Video Title',
            'thumbnail' => "https://i.ytimg.com/vi/{$videoId}/maxresdefault.jpg",
            'duration' => '10:30',
            'author' => 'Sample Channel',
            'formats' => [
                [
                    'quality' => '1080p',
                    'extension' => 'mp4',
                    'filesize' => '120MB'
                ],
                [
                    'quality' => '720p',
                    'extension' => 'mp4',
                    'filesize' => '70MB'
                ],
                [
                    'quality' => '480p',
                    'extension' => 'mp4',
                    'filesize' => '40MB'
                ],
                [
                    'quality' => '360p',
                    'extension' => 'mp4',
                    'filesize' => '25MB'
                ],
                [
                    'quality' => 'mp3',
                    'extension' => 'mp3',
                    'filesize' => '10MB'
                ]
            ]
        ]
    ];
}

function downloadVideo($url, $quality) {
    // In a real implementation, this would use youtube-dl to download the video
    // Example: $output = shell_exec("youtube-dl -f 'bestvideo[height<=1080]+bestaudio/best[height<=1080]' $url -o video.mp4");
    
    $videoId = extractVideoId($url);
    
    if (!$videoId) {
        return [
            'success' => false,
            'error' => 'Invalid YouTube URL'
        ];
    }
    
    // Simulate a delay for processing
    sleep(1);
    
    // Return a mock download URL
    // In a real implementation, this would be the path to the downloaded file
    return [
        'success' => true,
        'data' => [
            'download_url' => "/downloads/{$videoId}_{$quality}.mp4",
            'filename' => "youtube_video_{$quality}.mp4",
            'quality' => $quality
        ]
    ];
}

function extractVideoId($url) {
    $pattern = '/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i';
    preg_match($pattern, $url, $matches);
    
    return isset($matches[1]) ? $matches[1] : false;
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
