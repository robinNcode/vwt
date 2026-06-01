<?php
/**
 * Lightweight PHP reverse proxy for api.voltwavebd.com → Go backend on :8083
 * Place this as index.php in api.voltwavebd.com/public_html/
 */

define('GO_BACKEND', 'http://127.0.0.1:8083');

$method  = $_SERVER['REQUEST_METHOD'];
$uri     = $_SERVER['REQUEST_URI'];
$body    = file_get_contents('php://input');

// Build forward headers (exclude Host to avoid redirect loops)
$headers = [];
foreach (getallheaders() as $name => $value) {
    if (strtolower($name) === 'host') continue;
    $headers[] = "$name: $value";
}

$ch = curl_init(GO_BACKEND . $uri);
curl_setopt_array($ch, [
    CURLOPT_CUSTOMREQUEST  => $method,
    CURLOPT_POSTFIELDS     => $body,
    CURLOPT_HTTPHEADER     => $headers,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER         => true,
    CURLOPT_FOLLOWLOCATION => false,
    CURLOPT_TIMEOUT        => 30,
    CURLOPT_CONNECTTIMEOUT => 5,
]);

$response   = curl_exec($ch);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$httpCode   = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError  = curl_error($ch);
curl_close($ch);

if ($curlError) {
    http_response_code(502);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'API backend unavailable. Please try again later.',
        'error_details' => $curlError
    ]);
    exit;
}

http_response_code($httpCode);

// Forward response headers from Go (CORS, Content-Type, etc.)
$responseHeaders = substr($response, 0, $headerSize);
foreach (explode("\r\n", $responseHeaders) as $header) {
    if (preg_match('/^(Content-Type|Access-Control-|X-|Cache-Control|Authorization)/i', $header)) {
        header($header, false);
    }
}

echo substr($response, $headerSize);
