import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { AnomalyAlertController } from "../controllers/anomalyAlertController";

export default function createAlertsRouter() {
  const router = Router();
  const controller = new AnomalyAlertController();

  // Configure multer for file uploads
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, "../../uploads");
      
      // Create uploads directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      // Generate unique filename with timestamp
      const timestamp = Date.now();
      const originalName = file.originalname.replace(/\s+/g, '_');
      const filename = `${timestamp}_${originalName}`;
      cb(null, filename);
    }
  });

  const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Only allow .wav files
    if (file.mimetype === 'audio/wav' || path.extname(file.originalname).toLowerCase() === '.wav') {
      cb(null, true);
    } else {
      cb(new Error('Only .wav files are allowed'));
    }
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB limit
    }
  });

  // GET /alerts - Fetch list of anomaly records with optional filters
  router.get("/", controller.getAlerts.bind(controller));

  // GET /alerts/:id - Get specific alert details
  router.get("/:id", controller.getAlertById.bind(controller));

  // PUT /alerts/:id - Update alert details
  router.put("/:id", controller.updateAlert.bind(controller));

  // POST /alerts/upload - Upload audio file and create alert
  router.post("/upload", upload.single("audio"), controller.uploadAlert.bind(controller));

  return router;
} 