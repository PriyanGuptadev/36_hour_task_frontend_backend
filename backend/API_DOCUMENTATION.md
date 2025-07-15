# Anomaly Alert API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Currently, the API does not require authentication. In production, implement JWT or API key authentication.

## Response Format
All API responses follow this standard format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": { ... }
}
```

## Endpoints

### 1. Health Check
**GET** `/health`

Check if the server is running.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T11:45:00.000Z"
}
```

---

### 2. Get Alerts List
**GET** `/alerts`

Retrieve a paginated list of anomaly alerts with optional filtering.

**Query Parameters:**
- `startDate` (optional): Filter alerts from this date (ISO 8601 format)
- `endDate` (optional): Filter alerts until this date (ISO 8601 format)
- `alertType` (optional): Filter by alert type (`mild`, `moderate`, `severe`)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Example Requests:**
```bash
# Get all alerts
GET /api/alerts

# Get alerts with pagination
GET /api/alerts?page=2&limit=20

# Filter by date range
GET /api/alerts?startDate=2024-01-01&endDate=2024-01-31

# Filter by alert type
GET /api/alerts?alertType=severe

# Combined filters
GET /api/alerts?startDate=2024-01-01&endDate=2024-01-31&alertType=severe&page=1&limit=50
```

**Response:**
```json
{
  "success": true,
  "message": "Alerts retrieved successfully",
  "data": {
    "alerts": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "detectionTime": "2024-01-15T10:30:00.000Z",
        "alertType": "severe",
        "audioFilePath": "/uploads/1705312200000_sample_audio.wav",
        "waveformData": [0.1, 0.2, 0.15, ...],
        "spectrogramData": [[0.1, 0.2, ...], [0.15, 0.25, ...], ...],
        "suspectedReason": "Equipment malfunction",
        "action": "Maintenance scheduled",
        "comment": "High frequency anomaly detected"
      }
    ],
    "total": 150,
    "page": 1,
    "limit": 10
  }
}
```

---

### 3. Get Alert by ID
**GET** `/alerts/:id`

Retrieve details of a specific alert.

**Path Parameters:**
- `id`: Alert ID (MongoDB ObjectId)

**Example Request:**
```bash
GET /api/alerts/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "success": true,
  "message": "Alert retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "detectionTime": "2024-01-15T10:30:00.000Z",
    "alertType": "severe",
    "audioFilePath": "/uploads/1705312200000_sample_audio.wav",
    "waveformData": [0.1, 0.2, 0.15, ...],
    "spectrogramData": [[0.1, 0.2, ...], [0.15, 0.25, ...], ...],
    "suspectedReason": "Equipment malfunction",
    "action": "Maintenance scheduled",
    "comment": "High frequency anomaly detected"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Alert not found",
  "errors": null
}
```

---

### 4. Update Alert
**PUT** `/alerts/:id`

Update an existing alert's action, comment, or suspected reason.

**Path Parameters:**
- `id`: Alert ID (MongoDB ObjectId)

**Request Body:**
```json
{
  "action": "Updated action description",
  "comment": "Updated comment",
  "suspectedReason": "Updated suspected reason"
}
```

**Note:** All fields are optional. Only provided fields will be updated.

**Example Request:**
```bash
PUT /api/alerts/507f1f77bcf86cd799439011
Content-Type: application/json

{
  "action": "Emergency maintenance completed",
  "comment": "Issue resolved after maintenance"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Alert updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "detectionTime": "2024-01-15T10:30:00.000Z",
    "alertType": "severe",
    "audioFilePath": "/uploads/1705312200000_sample_audio.wav",
    "waveformData": [0.1, 0.2, 0.15, ...],
    "spectrogramData": [[0.1, 0.2, ...], [0.15, 0.25, ...], ...],
    "suspectedReason": "Equipment malfunction",
    "action": "Emergency maintenance completed",
    "comment": "Issue resolved after maintenance"
  }
}
```

---

### 5. Upload Alert
**POST** `/alerts/upload`

Upload an audio file and create a new anomaly alert.

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `audio` (required): Audio file (.wav format, max 50MB)
- `alertType` (required): Alert type (`mild`, `moderate`, `severe`)
- `suspectedReason` (required): Description of the suspected issue
- `action` (optional): Initial action to take
- `comment` (optional): Initial comment

**Example Request:**
```bash
POST /api/alerts/upload
Content-Type: multipart/form-data

Form Data:
- audio: [audio_file.wav]
- alertType: severe
- suspectedReason: Unusual vibration detected in motor assembly
- action: Schedule immediate inspection
- comment: High amplitude signals detected at 2.5kHz
```

**Response:**
```json
{
  "success": true,
  "message": "Alert created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "detectionTime": "2024-01-15T11:45:00.000Z",
    "alertType": "severe",
    "audioFilePath": "/uploads/1705312700000_audio_file.wav",
    "waveformData": [],
    "spectrogramData": [],
    "suspectedReason": "Unusual vibration detected in motor assembly",
    "action": "Schedule immediate inspection",
    "comment": "High amplitude signals detected at 2.5kHz"
  }
}
```

**Note:** Waveform and spectrogram data are generated asynchronously after the alert is created. Initially, these arrays will be empty.

---

## Data Models

### Alert Type
```typescript
type AlertType = 'mild' | 'moderate' | 'severe';
```

### Anomaly Alert
```typescript
interface AnomalyAlert {
  _id: ObjectId;
  detectionTime: Date;
  alertType: AlertType;
  audioFilePath: string;
  waveformData: number[];
  spectrogramData: number[][];
  suspectedReason: string;
  action: string;
  comment: string;
}
```

### Alert Filters
```typescript
interface AlertFilters {
  startDate?: string;  // ISO 8601 date string
  endDate?: string;    // ISO 8601 date string
  alertType?: AlertType;
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input data |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

---

## File Upload Guidelines

### Supported Formats
- **Audio Files:** `.wav` only
- **Maximum Size:** 50MB
- **Field Name:** `audio`

### File Storage
- Files are stored locally in the `uploads/` directory
- Filenames are prefixed with timestamps to ensure uniqueness
- Original filenames are preserved (spaces replaced with underscores)

### Audio Processing
- Waveform data: Array of amplitude values (1000 data points)
- Spectrogram data: 2D array representing frequency vs time (50 time bins × 64 frequency bins, max 8kHz)

---

## Rate Limiting
Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

## CORS
CORS is enabled for the configured `CLIENT_URL`. Update the environment variable to allow your frontend domain.

## Logging
All API requests are logged to:
- Console output
- `logs/access.log` (HTTP access logs)
- `logs/combined.log` (all logs)
- `logs/error.log` (error logs only) 