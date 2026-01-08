<?php
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
} else {
    header('Access-Control-Allow-Origin: *');
}

header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

final class ErrorCode
{
    public const INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR';
    public const MISSING_ARGUMENTS = 'MISSING_ARGUMENTS';
    public const VALIDATION_ERROR = 'VALIDATION_ERROR';
    public const NOT_FOUND = 'NOT_FOUND';
    public const UNAUTHORIZED = 'UNAUTHORIZED';
    public const FORBIDDEN = 'FORBIDDEN';
    public const INVALID_CREDENTIALS = 'INVALID_CREDENTIALS';
    public const INVALID_TOKEN = 'INVALID_TOKEN';
    public const TOKEN_EXPIRED = 'TOKEN_EXPIRED';
    public const USER_NOT_FOUND = 'USER_NOT_FOUND';
    public const EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS';
}

function sendSuccess(array $data = [], int $statusCode = 200)
{
    http_response_code($statusCode);
    header('Content-Type: application/json');

    echo json_encode([
        'success' => true,
        'data' => $data
    ]);

    exit;
}

function sendError(string $message, ?string $code = ErrorCode::INTERNAL_SERVER_ERROR, int $statusCode = 200)
{
    http_response_code($statusCode);
    header('Content-Type: application/json');

    echo json_encode([
        'success' => false,
        'error' => [
            'code' => $code,
            'message' => $message
        ],
    ]);

    exit;
}
