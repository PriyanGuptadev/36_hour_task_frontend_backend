import express from "express";
import cors from "cors";
import path from "path";
import { globalErrorHandler } from "./middlewares/errorHandler";
import { httpLogger } from "./config/logger";
import { ENV } from "./config/env";
import createAlertsRouter from "./routes/alerts";

const { CLIENT_URL } = ENV;

const app = express();
app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

// Serve uploaded audio files
app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

app.use(httpLogger);

// API Routes
app.use("/api/alerts", createAlertsRouter());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use(globalErrorHandler);

export default app;