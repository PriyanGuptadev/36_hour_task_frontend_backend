# Anomaly Alert Backend API

A Node.js + MongoDB backend for managing anomaly alerts with audio file processing capabilities.

## Features

- **Anomaly Alert Management**: CRUD operations for anomaly alerts
- **Audio File Processing**: Upload and process .wav files with waveform and spectrogram generation
- **Filtering & Pagination**: Filter alerts by date range and alert type
- **File Upload**: Secure file upload with validation and size limits
- **Logging**: Comprehensive logging with Winston
- **Error Handling**: Global error handling middleware

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or accessible via connection string)
- npm or yarn

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file in the backend directory with the following variables:
   ```env
   PORT=5000
   CLIENT_URL=http://localhost:3000
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DB_NAME=visit_tracker
   ```

3. **Start MongoDB**:
   Make sure MongoDB is running on your system or update the `MONGODB_URI` to point to your MongoDB instance.

4. **Build and run**:
   ```bash
   # Development mode
   npm run dev
   
   # Production build
   npm run build
   npm start
   ```

## API Endpoints

### 1. GET /api/alerts
Fetch a list of anomaly records with optional filters.

**Query Parameters**:
- `startDate` (optional): Start date for filtering (ISO string)
- `endDate` (optional): End date for filtering (ISO string)
- `alertType` (optional): Filter by alert type ('mild', 'moderate', 'severe')
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of records per page (default: 10)

**Example**:
```bash
GET /api/alerts?startDate=2024-01-01&endDate=2024-01-31&alertType=severe&page=1&limit=20
```

**Response**:
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
        "audioFilePath": "/path/to/audio.wav",
        "waveformData": [...],
        "spectrogramData": [...],
        "suspectedReason": "Equipment malfunction",
        "action": "Maintenance scheduled",
        "comment": "High frequency anomaly detected"
      }
    ],
    "total": 150,
    "page": 1,
    "limit": 20
  }
}
```

### 2. GET /api/alerts/:id
Get details of a specific alert.

**Example**:
```bash
GET /api/alerts/507f1f77bcf86cd799439011
```

**Response**:
```json
{
  "success": true,
  "message": "Alert retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "detectionTime": "2024-01-15T10:30:00.000Z",
    "alertType": "severe",
    "audioFilePath": "/path/to/audio.wav",
    "waveformData": [...],
    "spectrogramData": [...],
    "suspectedReason": "Equipment malfunction",
    "action": "Maintenance scheduled",
    "comment": "High frequency anomaly detected"
  }
}
```

### 3. PUT /api/alerts/:id
Update an alert with new action, comment, or suspected reason.

**Request Body**:
```json
{
  "action": "Updated action",
  "comment": "Updated comment",
  "suspectedReason": "Updated reason"
}
```

**Example**:
```bash
PUT /api/alerts/507f1f77bcf86cd799439011
Content-Type: application/json

{
  "action": "Emergency maintenance completed",
  "comment": "Issue resolved after maintenance"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Alert updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "detectionTime": "2024-01-15T10:30:00.000Z",
    "alertType": "severe",
    "audioFilePath": "/path/to/audio.wav",
    "waveformData": [...],
    "spectrogramData": [...],
    "suspectedReason": "Equipment malfunction",
    "action": "Emergency maintenance completed",
    "comment": "Issue resolved after maintenance"
  }
}
```

### 4. POST /api/alerts/upload
Upload an audio file and create a new alert.

**Request**:
- Content-Type: `multipart/form-data`
- File field: `audio` (must be .wav format, max 50MB)
- Form fields:
  - `alertType`: 'mild', 'moderate', or 'severe'
  - `suspectedReason`: String describing the suspected reason
  - `action` (optional): Initial action to take
  - `comment` (optional): Initial comment

**Example**:
```bash
POST /api/alerts/upload
Content-Type: multipart/form-data

Form Data:
- audio: [audio_file.wav]
- alertType: severe
- suspectedReason: Unusual vibration detected
- action: Schedule inspection
- comment: High amplitude signals detected
```

**Response**:
```json
{
  "success": true,
  "message": "Alert created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "detectionTime": "2024-01-15T11:45:00.000Z",
    "alertType": "severe",
    "audioFilePath": "/path/to/uploaded/audio.wav",
    "waveformData": [],
    "spectrogramData": [],
    "suspectedReason": "Unusual vibration detected",
    "action": "Schedule inspection",
    "comment": "High amplitude signals detected"
  }
}
```

**Note**: Waveform and spectrogram data are generated asynchronously after the alert is created.

### 5. GET /health
Health check endpoint.

**Response**:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T11:45:00.000Z"
}
```

## Data Models

### AnomalyAlert
```typescript
{
  _id: ObjectId,
  detectionTime: Date,
  alertType: 'mild' | 'moderate' | 'severe',
  audioFilePath: String,
  waveformData: Array<number>,
  spectrogramData: Array<Array<number>>,
  suspectedReason: String,
  action: String,
  comment: String
}
```

## File Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts      # MongoDB connection
│   │   ├── env.ts          # Environment variables
│   │   └── logger.ts       # Winston logger configuration
│   ├── controllers/
│   │   └── anomalyAlertController.ts  # HTTP request handlers
│   ├── middlewares/
│   │   └── errorHandler.ts # Global error handling
│   ├── routes/
│   │   └── alerts.ts       # API route definitions
│   ├── services/
│   │   ├── anomalyAlertService.ts    # Database operations
│   │   └── audioProcessingService.ts # Audio file processing
│   ├── types/
│   │   └── anomalyAlert.ts # TypeScript interfaces
│   ├── utils/
│   │   └── responseHandler.ts # Response formatting
│   ├── app.ts              # Express app configuration
│   └── server.ts           # Server entry point
├── uploads/                # Uploaded audio files (created automatically)
├── logs/                   # Application logs (created automatically)
└── package.json
```

## Development

### Available Scripts
- `npm run dev`: Start development server with hot reload
- `npm run build`: Build TypeScript to JavaScript
- `npm start`: Start production server
- `npm test`: Run tests
- `npm run test:watch`: Run tests in watch mode

### Logging
The application uses Winston for logging with the following levels:
- Console output for all levels
- File logging for errors (`logs/error.log`)
- Combined log file (`logs/combined.log`)
- HTTP access logs (`logs/access.log`)

### Error Handling
All errors are caught and formatted consistently using the `ResponseHandler` utility. The global error handler ensures proper error responses and logging.

## Notes

- Audio processing (waveform and spectrogram generation) is currently implemented with mock data for demonstration purposes
- In production, you would integrate with proper audio processing libraries
- File uploads are stored locally in the `uploads/` directory
- Consider implementing cloud storage (S3, GCS) for production use
- The application includes graceful shutdown handling for database connections 